import React from 'react';

// Compact, color-only mini-grid of the opponent's progress. No driver names,
// no values, no arrows — just the tile colors, so you can't infer their picks.
const statusToColor = (status) => {
  switch (status) {
    case 'correct':
      return 'var(--correct)';
    case 'incorrect-red':
      return 'var(--incorrect-red)';
    default:
      return 'var(--incorrect)'; // 'incorrect'
  }
};

const MAX_GUESSES = 6;
const COLS = 5;

export const OpponentGrid = ({ opponent }) => {
  const rows = opponent?.rows || [];
  const guessCount = opponent?.guessCount || 0;
  const connected = opponent?.connected !== false;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '16px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: connected ? 'var(--correct)' : 'var(--accent-red)',
            display: 'inline-block',
          }}
        />
        Opponent {connected ? `${guessCount}/${MAX_GUESSES}` : '· left'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {Array.from({ length: MAX_GUESSES }).map((_, r) => {
          const row = rows[r];
          return (
            <div key={r} style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: COLS }).map((_, c) => {
                const status = row ? row[c] : null;
                return (
                  <div
                    key={c}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '4px',
                      background: status
                        ? statusToColor(status)
                        : 'transparent',
                      border: status
                        ? 'none'
                        : '2px solid var(--border-color)',
                      opacity: status ? 1 : 0.5,
                      transition: 'background 0.2s',
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
