import React, { useState } from 'react';
import { Copy, Check, Users, ArrowRight, LogOut } from 'lucide-react';

// Create/Join screen shown before a race starts. While the host waits for an
// opponent (phase === 'waiting'), it shows the room code with copy-to-clipboard.
export const MultiplayerLobby = ({ phase, roomCode, error, onCreate, onJoin, onLeave }) => {
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    setBusy(true);
    await onCreate();
    setBusy(false);
  };

  const handleJoin = async () => {
    setBusy(true);
    await onJoin(joinCode);
    setBusy(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked; the code is still visible on screen */
    }
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '420px',
    margin: '0 auto',
    padding: '32px 24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  };

  // Host has created a room and is waiting for player 2.
  if (phase === 'waiting' && roomCode) {
    return (
      <div className="glass animate-fade-in" style={cardStyle}>
        <Users size={36} color="var(--accent-red)" />
        <h2 style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          Waiting for opponent…
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
          Share this code. The race starts the moment they join.
        </p>
        <button
          onClick={copyCode}
          title="Copy room code"
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            fontSize: '38px', fontWeight: 800, letterSpacing: '8px',
            color: 'var(--text-primary)', background: 'var(--bg-secondary)',
            padding: '16px 24px', borderRadius: '12px',
            border: '1px solid var(--border-color)',
          }}
        >
          {roomCode}
          {copied ? <Check size={24} color="var(--correct)" /> : <Copy size={22} color="var(--text-secondary)" />}
        </button>

        <button
          onClick={onLeave}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '12px', borderRadius: '12px',
            background: 'var(--bg-secondary)', color: 'var(--accent-red)',
            border: '1px solid var(--accent-red)',
            fontSize: '14px', fontWeight: 600,
          }}
        >
          <LogOut size={16} /> Leave Room
        </button>
      </div>
    );
  }

  // Default: choose create or join.
  return (
    <div className="glass animate-fade-in" style={cardStyle}>
      <Users size={36} color="var(--accent-red)" />
      <h2 style={{ fontSize: '22px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
        1v1 Race
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', marginTop: '-8px' }}>
        Same driver, 6 guesses. First to find them wins.
      </p>

      <button
        onClick={handleCreate}
        disabled={busy}
        style={{
          width: '100%', padding: '14px', borderRadius: '12px',
          background: 'var(--accent-red)', color: '#fff',
          fontSize: '16px', fontWeight: 700,
          opacity: busy ? 0.6 : 1,
        }}
      >
        Create Room
      </button>

      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px', color: 'var(--text-secondary)' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        <span style={{ fontSize: '12px', fontWeight: 600 }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
      </div>

      <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 5))}
          onKeyDown={(e) => e.key === 'Enter' && !busy && handleJoin()}
          placeholder="ENTER CODE"
          maxLength={5}
          style={{
            flex: 1, padding: '14px', borderRadius: '12px',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            fontSize: '18px', fontWeight: 700, letterSpacing: '4px',
            textAlign: 'center', textTransform: 'uppercase',
          }}
        />
        <button
          onClick={handleJoin}
          disabled={busy}
          title="Join Room"
          style={{
            padding: '0 18px', borderRadius: '12px',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: busy ? 0.6 : 1,
          }}
        >
          <ArrowRight size={22} />
        </button>
      </div>

      {error && (
        <p style={{ color: 'var(--accent-red)', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  );
};
