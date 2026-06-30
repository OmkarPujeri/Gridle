// Real-time 1v1 room API over Firebase Realtime Database.
// Pure functions, no React. The DB is the source of truth for the match result;
// each client computes its own tile colors and pushes only the color arrays.
import {
  ref,
  set,
  get,
  update,
  onValue,
  runTransaction,
  onDisconnect,
  serverTimestamp,
} from 'firebase/database';
import { db } from './firebase';
import { drivers } from '../data/drivers';

export const MAX_GUESSES = 6;

// Unambiguous alphabet — no 0/O/1/I to avoid copy/read mistakes.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateRoomCode = () => {
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
};

const pickTargetDriverId = () => drivers[Math.floor(Math.random() * drivers.length)].id;

const roomRef = (code) => ref(db, `rooms/${code}`);

const freshPlayer = (joined) => ({
  joined,
  finished: false,
  guessCount: 0,
  rows: [],
});

// Host creates a room and becomes p1. Returns { code, slot } or throws on collision.
export const createRoom = async () => {
  const code = generateRoomCode();
  const snap = await get(roomRef(code));
  if (snap.exists()) {
    // Astronomically unlikely with a 32^5 space; retry once.
    return createRoom();
  }
  await set(roomRef(code), {
    status: 'waiting',
    targetDriverId: pickTargetDriverId(),
    createdAt: serverTimestamp(),
    winner: '',
    players: {
      p1: freshPlayer(true),
      p2: freshPlayer(false),
    },
  });
  return { code, slot: 'p1' };
};

// Joiner becomes p2 and flips the room to racing. Returns { ok, slot } | { ok:false, error }.
export const joinRoom = async (code) => {
  const snap = await get(roomRef(code));
  if (!snap.exists()) return { ok: false, error: 'not-found' };
  const room = snap.val();
  if (room.players?.p2?.joined) return { ok: false, error: 'full' };
  if (room.status === 'finished') return { ok: false, error: 'finished' };

  await update(roomRef(code), {
    status: 'racing',
    'players/p2/joined': true,
  });
  return { ok: true, slot: 'p2' };
};

// Append a guess's 5-status color row and bump the player's guess count.
export const pushGuessRow = async (code, slot, rowStatuses, guessCount) => {
  await update(ref(db, `rooms/${code}/players/${slot}`), {
    rows: rowStatuses, // caller passes the full updated rows array
    guessCount,
  });
};

// First correct guess locks the winner; a concurrent second correct guess sees
// a non-empty winner and aborts (transaction guarantees a single winner).
export const declareWinner = async (code, slot) => {
  await runTransaction(ref(db, `rooms/${code}/winner`), (current) =>
    current ? current : slot
  );
  await update(roomRef(code), { status: 'finished' });
};

// Mark a player out of guesses. If both are finished and nobody won, it's a draw.
export const markFinished = async (code, slot) => {
  await update(ref(db, `rooms/${code}/players/${slot}`), { finished: true });
  const snap = await get(roomRef(code));
  if (!snap.exists()) return;
  const room = snap.val();
  const bothDone = room.players?.p1?.finished && room.players?.p2?.finished;
  if (bothDone) {
    await runTransaction(ref(db, `rooms/${code}/winner`), (current) =>
      current ? current : 'draw'
    );
    await update(roomRef(code), { status: 'finished' });
  }
};

// Live room subscription. Returns an unsubscribe function.
export const subscribeRoom = (code, cb) => {
  const r = roomRef(code);
  return onValue(r, (snap) => cb(snap.exists() ? snap.val() : null));
};

// Presence: flag this slot as disconnected if the tab closes / network drops.
export const setupDisconnect = (code, slot) => {
  const connectedRef = ref(db, `rooms/${code}/players/${slot}/connected`);
  set(connectedRef, true);
  onDisconnect(connectedRef).set(false);
};

export const leaveRoom = async (code, slot) => {
  if (!code || !slot) return;
  await update(ref(db, `rooms/${code}/players/${slot}`), { connected: false });
};

// Reset the room for another round with a new driver; keeps both players in place.
export const requestRematch = async (code, slot) => {
  await update(roomRef(code), {
    rematchRequest: { status: 'pending', by: slot },
  });
};

// The other player accepts — actually reset the round.
export const acceptRematch = async (code) => {
  await update(roomRef(code), {
    status: 'racing',
    targetDriverId: pickTargetDriverId(),
    winner: '',
    rematchRequest: null,
    'players/p1/finished': false,
    'players/p1/guessCount': 0,
    'players/p1/rows': [],
    'players/p2/finished': false,
    'players/p2/guessCount': 0,
    'players/p2/rows': [],
  });
};

// The other player declines — clear the request.
export const declineRematch = async (code) => {
  await update(roomRef(code), { rematchRequest: null });
};
