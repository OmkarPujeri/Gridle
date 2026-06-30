import React from 'react';
import { RotateCcw, LogOut, Check, X } from 'lucide-react';
import { driverPhotos } from '../data/driverPhotos';

// Win / Loss / Draw banner driven by the synced result. Shows the revealed
// target driver and offers a rematch (same room, new driver) or leaving.
export const MultiplayerResult = ({ 
  gameStatus, targetDriver, 
  opponentLeft, rematchPending, iRequestedRematch,
  onRematch, onAcceptRematch, onDeclineRematch, onLeave 
}) => {
  if (gameStatus === 'playing' || !targetDriver) return null;

  const config = {
    won: { title: 'You Win! 🏆', accent: 'var(--correct)' },
    lost: { title: 'You Lose', accent: 'var(--accent-red)' },
    draw: { title: "It's a Draw", accent: 'var(--text-secondary)' },
  }[gameStatus];

  const driverPhoto =
    driverPhotos[targetDriver.name] ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(targetDriver.name)}&background=2a2d34&color=fff&size=100`;
  const flagUrl = `https://flagcdn.com/w40/${targetDriver.countryCode}.png`;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(15,17,21,0.75)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="glass animate-fade-in"
        style={{
          width: '100%', maxWidth: '440px',
          borderRadius: '16px', borderTop: `4px solid ${config.accent}`,
          padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px',
          alignItems: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
      <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
        {config.title}
      </h2>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'var(--bg-secondary)', padding: '6px 16px 6px 6px',
          borderRadius: '30px', border: '1px solid var(--border-color)',
        }}
      >
        <img src={driverPhoto} alt={targetDriver.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-primary)' }} />
        <img src={flagUrl} alt={targetDriver.nationality} style={{ width: '20px', borderRadius: '2px' }} />
        <span style={{ fontSize: '14px', fontWeight: 700 }}>{targetDriver.name}</span>
        <span style={{ color: 'var(--text-secondary)' }}>•</span>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{targetDriver.team}</span>
      </div>

      {opponentLeft ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
          <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>Opponent has left the room.</span>
          <button
            onClick={onLeave}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%',
              background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
              padding: '12px 20px', borderRadius: '12px',
              fontSize: '15px', fontWeight: 600, border: '1px solid var(--border-color)',
            }}
          >
            <LogOut size={18} /> Back to Lobby
          </button>
        </div>
      ) : rematchPending ? (
        iRequestedRematch ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Waiting for opponent to accept...</span>
            <button
              onClick={onLeave}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%',
                background: 'var(--bg-secondary)', color: 'var(--accent-red)',
                padding: '12px 20px', borderRadius: '12px',
                fontSize: '15px', fontWeight: 600, border: '1px solid var(--accent-red)',
              }}
            >
              <LogOut size={18} /> Leave Room
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
            <span style={{ color: 'var(--correct)', fontWeight: 600 }}>Opponent wants a rematch!</span>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button
                onClick={onAcceptRematch}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'var(--correct)', color: '#fff',
                  padding: '12px 24px', borderRadius: '12px',
                  fontSize: '15px', fontWeight: 700,
                }}
              >
                <Check size={18} /> Accept
              </button>
              <button
                onClick={onDeclineRematch}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                  padding: '12px 20px', borderRadius: '12px',
                  fontSize: '15px', fontWeight: 600, border: '1px solid var(--border-color)',
                }}
              >
                <X size={18} /> Decline
              </button>
            </div>
          </div>
        )
      ) : (
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button
            onClick={onRematch}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'var(--accent-red)', color: '#fff',
              padding: '12px 24px', borderRadius: '12px',
              fontSize: '15px', fontWeight: 700,
            }}
          >
            <RotateCcw size={18} /> Rematch
          </button>
          <button
            onClick={onLeave}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
              padding: '12px 20px', borderRadius: '12px',
              fontSize: '15px', fontWeight: 600, border: '1px solid var(--border-color)',
            }}
          >
            <LogOut size={18} /> Leave
          </button>
        </div>
      )}
      </div>
    </div>
  );
};
