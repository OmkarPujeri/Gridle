import { useState, useEffect, useRef, useCallback } from 'react';
import { drivers } from '../data/drivers';
import { computeRowStatuses } from '../data/driverCompare';
import {
  MAX_GUESSES,
  createRoom,
  joinRoom,
  pushGuessRow,
  declareWinner,
  markFinished,
  subscribeRoom,
  setupDisconnect,
  leaveRoom,
  requestRematch,
  acceptRematch,
  declineRematch,
} from '../services/multiplayer';

// Multiplayer counterpart to useGameEngine. Deliberately separate so it never
// writes to the daily/infinite localStorage stats — competitive games must not
// pollute solo stats. The Firebase room is the source of truth for the result.

const SESSION_KEY = 'gridle_mp_session';
const GUESSES_KEY = 'gridle_mp_guesses'; // suffixed with :<roomCode> per room

export const useMultiplayerEngine = () => {
  const [roomCode, setRoomCode] = useState(null);
  const [slot, setSlot] = useState(null); // 'p1' | 'p2'
  const [room, setRoom] = useState(null); // latest synced room snapshot
  const [guesses, setGuesses] = useState([]); // MY full driver objects
  const [error, setError] = useState(null);

  const unsubRef = useRef(null);

  // ---- derived values -------------------------------------------------------
  const opponentSlot = slot === 'p1' ? 'p2' : 'p1';
  const targetDriver = room
    ? drivers.find((d) => d.id === room.targetDriverId) || null
    : null;
  const phase = room?.status || (roomCode ? 'waiting' : 'lobby'); // lobby|waiting|racing|finished
  const winner = room?.winner || '';

  const myGuessedCorrectly =
    !!targetDriver && guesses.some((g) => g.id === targetDriver.id);
  const myOutOfGuesses = guesses.length >= MAX_GUESSES;
  const inputDisabled =
    phase !== 'racing' || myGuessedCorrectly || myOutOfGuesses || !!winner;

  let gameStatus = 'playing';
  if (winner === slot) gameStatus = 'won';
  else if (winner === 'draw') gameStatus = 'draw';
  else if (winner) gameStatus = 'lost';

  const opp = room?.players?.[opponentSlot] || {};
  const opponent = {
    rows: opp.rows || [],
    guessCount: opp.guessCount || 0,
    finished: !!opp.finished,
    joined: !!opp.joined,
    connected: opp.connected !== false,
  };

  // Rematch negotiation state
  const rematchPending = room?.rematchRequest?.status === 'pending';
  const iRequestedRematch = rematchPending && room?.rematchRequest?.by === slot;
  // 'opponentLeft' = opponent was once joined but is now disconnected (after the game ended)
  const opponentLeft =
    phase === 'finished' && opp.joined && opp.connected === false;

  // ---- subscription helper --------------------------------------------------
  const startSession = useCallback((code, mySlot) => {
    setRoomCode(code);
    setSlot(mySlot);
    setError(null);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ code, slot: mySlot }));
    setupDisconnect(code, mySlot);
    if (unsubRef.current) unsubRef.current();
    unsubRef.current = subscribeRoom(code, (data) => setRoom(data));
  }, []);

  // Restore an in-progress session on refresh (re-subscribe to the same room).
  // Note: my own guessed driver names aren't stored remotely, so my grid resets
  // on refresh — the race state itself (target, winner, opponent) is recovered.
  const sessionRestoredRef = useRef(false);
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const { code, slot: mySlot } = JSON.parse(saved);
        if (code && mySlot) {
          sessionRestoredRef.current = true;
          startSession(code, mySlot);
        }
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [startSession]);

  // After restoring a session, check if the room is stale on first snapshot.
  // A stale room is: already finished, OR still 'waiting' with no opponent ever
  // joined (host left). In both cases, silently drop the session.
  const staleCheckDoneRef = useRef(false);
  useEffect(() => {
    if (!sessionRestoredRef.current) return; // only applies to restored sessions
    if (!room || staleCheckDoneRef.current) return;
    staleCheckDoneRef.current = true;

    const opSlot = slot === 'p1' ? 'p2' : 'p1';
    const opponentConnected = room.players?.[opSlot]?.connected !== false;
    const opponentJoined = room.players?.[opSlot]?.joined;
    const isFinished = room.status === 'finished';
    // Stale if finished (game over), or still waiting with opponent not connected
    const isStale = isFinished || (room.status === 'waiting' && !opponentConnected);

    if (isStale) {
      // Clear everything and drop back to lobby without alerting the user
      if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
      sessionStorage.removeItem(SESSION_KEY);
      setRoomCode(null);
      setSlot(null);
      setRoom(null);
      setGuesses([]);
      setError(null);
      prevTargetRef.current = null;
      restoredRef.current = false;
      sessionRestoredRef.current = false;
      staleCheckDoneRef.current = false;
    }
  }, [room, slot]);

  // My own guesses live only in React state, so they vanish when this view
  // unmounts (switching to Daily/Infinite) or the page refreshes. Persist the
  // guessed driver ids per round (room + target) to sessionStorage so the grid
  // — and the "game over" disabled input — is restored exactly as it was.
  const guessesKey = roomCode ? `${GUESSES_KEY}:${roomCode}` : null;
  const prevTargetRef = useRef(null);
  const restoredRef = useRef(false); // gates the persist effect until restore runs

  // Restore on load and reset on a genuine round change (rematch = new target).
  useEffect(() => {
    if (room?.targetDriverId == null || !guessesKey) return;
    const target = room.targetDriverId;
    if (prevTargetRef.current === target) return; // same round, nothing to do
    prevTargetRef.current = target;

    let restored = [];
    try {
      const saved = JSON.parse(sessionStorage.getItem(guessesKey) || 'null');
      if (saved && saved.targetDriverId === target) {
        restored = saved.guessIds
          .map((id) => drivers.find((d) => d.id === id))
          .filter(Boolean);
      }
    } catch {
      /* ignore malformed cache */
    }
    restoredRef.current = true;
    setGuesses(restored);
  }, [room?.targetDriverId, guessesKey]);

  // Persist my guesses for the current round whenever they change.
  // The restoredRef gate prevents writing an empty [] before the restore effect
  // has had a chance to read the saved data and call setGuesses.
  useEffect(() => {
    if (!guessesKey || room?.targetDriverId == null) return;
    if (!restoredRef.current) return; // wait for restore to run first
    sessionStorage.setItem(
      guessesKey,
      JSON.stringify({
        targetDriverId: room.targetDriverId,
        guessIds: guesses.map((g) => g.id),
      })
    );
  }, [guesses, guessesKey, room?.targetDriverId]);

  // ---- actions --------------------------------------------------------------
  const create = useCallback(async () => {
    setError(null);
    try {
      const { code, slot: mySlot } = await createRoom();
      setGuesses([]);
      startSession(code, mySlot);
      return code;
    } catch (e) {
      setError('Could not create room. Check your connection.');
      return null;
    }
  }, [startSession]);

  const join = useCallback(
    async (code) => {
      setError(null);
      const normalized = (code || '').trim().toUpperCase();
      if (normalized.length !== 5) {
        setError('Enter a 5-character room code.');
        return false;
      }
      try {
        const res = await joinRoom(normalized);
        if (!res.ok) {
          setError(
            res.error === 'not-found'
              ? 'Room not found.'
              : res.error === 'full'
              ? 'That room is already full.'
              : 'That match has already finished.'
          );
          return false;
        }
        setGuesses([]);
        startSession(normalized, res.slot);
        return true;
      } catch (e) {
        setError('Could not join room. Check your connection.');
        return false;
      }
    },
    [startSession]
  );

  const submitGuess = useCallback(
    (driverId) => {
      if (inputDisabled || !targetDriver) return;
      if (guesses.some((g) => g.id === driverId)) return;
      const guessedDriver = drivers.find((d) => d.id === driverId);
      if (!guessedDriver) return;

      const newGuesses = [...guesses, guessedDriver];
      setGuesses(newGuesses);

      // Push only the color rows (never the driver picks) for the opponent grid.
      const rows = newGuesses.map((g) => computeRowStatuses(g, targetDriver));
      pushGuessRow(roomCode, slot, rows, newGuesses.length);

      if (guessedDriver.id === targetDriver.id) {
        declareWinner(roomCode, slot);
      } else if (newGuesses.length >= MAX_GUESSES) {
        markFinished(roomCode, slot);
      }
    },
    [inputDisabled, targetDriver, guesses, roomCode, slot]
  );

  // Send a rematch request — the opponent must accept before the room resets.
  const rematch = useCallback(() => {
    if (!roomCode || !slot) return;
    requestRematch(roomCode, slot);
  }, [roomCode, slot]);

  // Accept the opponent's rematch request — this is the side that resets the room.
  const acceptRematchCb = useCallback(() => {
    if (!roomCode) return;
    if (guessesKey) sessionStorage.removeItem(guessesKey);
    restoredRef.current = false;
    setGuesses([]);
    acceptRematch(roomCode);
  }, [roomCode, guessesKey]);

  // Decline the opponent's rematch request.
  const declineRematchCb = useCallback(() => {
    if (!roomCode) return;
    declineRematch(roomCode);
  }, [roomCode]);

  const leave = useCallback(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
    if (roomCode && slot) leaveRoom(roomCode, slot);
    if (guessesKey) sessionStorage.removeItem(guessesKey);
    sessionStorage.removeItem(SESSION_KEY);
    setRoomCode(null);
    setSlot(null);
    setRoom(null);
    setGuesses([]);
    setError(null);
    prevTargetRef.current = null;
    restoredRef.current = false;
  }, [roomCode, slot, guessesKey]);

  return {
    // identity / phase
    roomCode,
    slot,
    phase, // 'lobby' | 'waiting' | 'racing' | 'finished'
    error,
    // my board
    targetDriver,
    guesses,
    gameStatus, // 'playing' | 'won' | 'lost' | 'draw'
    inputDisabled,
    // opponent board
    opponent,
    opponentLeft,
    // rematch negotiation
    rematchPending,
    iRequestedRematch,
    // actions
    create,
    join,
    submitGuess,
    rematch,
    acceptRematch: acceptRematchCb,
    declineRematch: declineRematchCb,
    leave,
  };
};
