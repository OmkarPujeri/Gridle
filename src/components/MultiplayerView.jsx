import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { LogOut } from 'lucide-react';
import { GuessInput } from './GuessInput';
import { GuessGrid } from './GuessGrid';
import { OpponentGrid } from './OpponentGrid';
import { MultiplayerLobby } from './MultiplayerLobby';
import { MultiplayerResult } from './MultiplayerResult';
import { useMultiplayerEngine } from '../hooks/useMultiplayerEngine';
import { isFirebaseConfigured } from '../services/firebase';

// Self-contained 1v1 experience. Calls useMultiplayerEngine internally so the
// Firebase subscription only lives while the user is actually in 1v1 mode.
export const MultiplayerView = () => {
  const {
    phase, roomCode, error, slot,
    targetDriver, guesses, gameStatus, inputDisabled,
    opponent,
    opponentLeft, rematchPending, iRequestedRematch,
    create, join, submitGuess, rematch, acceptRematch, declineRematch, leave,
  } = useMultiplayerEngine();

  // 3-2-1 countdown when a race starts (or restarts on rematch).
  const [countdown, setCountdown] = useState(0);
  const racingSeenRef = useRef(false);
  useEffect(() => {
    if (phase === 'racing' && !racingSeenRef.current) {
      racingSeenRef.current = true;
      setCountdown(3);
    }
    if (phase !== 'racing') racingSeenRef.current = false;
  }, [phase]);
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [countdown]);

  // Reset the countdown gate on rematch (new target while still racing).
  const targetIdRef = useRef(null);
  useEffect(() => {
    if (targetDriver && targetDriver.id !== targetIdRef.current) {
      if (targetIdRef.current !== null && phase === 'racing') setCountdown(3);
      targetIdRef.current = targetDriver.id;
    }
  }, [targetDriver, phase]);

  // Celebrate a win.
  useEffect(() => {
    if (gameStatus === 'won') {
      confetti({
        particleCount: 150, spread: 70, origin: { y: 0.6 },
        colors: ['#e10600', '#ffffff', '#00b84b'],
      });
    }
  }, [gameStatus]);

  if (!isFirebaseConfigured) {
    return (
      <div className="glass animate-fade-in" style={{ maxWidth: '420px', margin: '24px auto', padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Multiplayer not configured</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Set the <code>VITE_FIREBASE_*</code> environment variables (see <code>.env.example</code>) to enable 1v1 mode.
        </p>
      </div>
    );
  }

  // Lobby / waiting room.
  if (phase === 'lobby' || phase === 'waiting') {
    return (
      <div style={{ width: '100%', paddingTop: '24px' }}>
        <MultiplayerLobby
          phase={phase}
          roomCode={roomCode}
          error={error}
          onCreate={create}
          onJoin={join}
          onLeave={leave}
        />
      </div>
    );
  }

  // Active race (racing or finished).
  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {countdown > 0 && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(15,17,21,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '120px', fontWeight: 800, color: 'var(--accent-red)' }}>
            {countdown}
          </span>
        </div>
      )}

      {/* Room info + leave button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 4px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '2px' }}>
          ROOM <span style={{ color: 'var(--text-primary)' }}>{roomCode}</span>
        </span>
        <button
          onClick={leave}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px',
            background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontSize: '13px', fontWeight: 600,
          }}
        >
          <LogOut size={14} /> Leave
        </button>
      </div>

      {/* Race layout: responsive container that handles mobile wrapping */}
      <div className="multiplayer-layout">
        {/* My board */}
        <div style={{ width: '100%' }}>
          <GuessInput
            onGuess={submitGuess}
            disabled={inputDisabled}
            guesses={guesses}
            isHardMode={false}
            isHintsEnabled={false}
            hintMessage={null}
            isHintClosed={true}
            onUseHint={() => {}}
            onCloseHint={() => {}}
            isMultiplayer={true}
          />
          <GuessGrid guesses={guesses} targetDriver={targetDriver} isHardMode={false} />
        </div>

        {/* Opponent mini-grid */}
        <div className="opponent-wrapper">
          <OpponentGrid opponent={opponent} />
        </div>
      </div>

      <MultiplayerResult
        gameStatus={gameStatus}
        targetDriver={targetDriver}
        opponentLeft={opponentLeft}
        rematchPending={rematchPending}
        iRequestedRematch={iRequestedRematch}
        onRematch={rematch}
        onAcceptRematch={acceptRematch}
        onDeclineRematch={declineRematch}
        onLeave={leave}
      />
    </div>
  );
};
