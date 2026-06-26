import React, { useState, useEffect } from 'react';
import { Share2, Clock, Play } from 'lucide-react';
import { driverPhotos } from '../data/driverPhotos';

export const GameResult = ({ targetDriver, gameStatus, guesses, mode, onReset }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (mode !== 'daily' || gameStatus === 'playing') return;

    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;
      
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      setTimeLeft(`${h}:${m}:${s}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [mode, gameStatus]);

  if (gameStatus === 'playing' || !targetDriver) return null;

  const didWin = gameStatus === 'won';
  const driverPhoto = driverPhotos[targetDriver.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetDriver.name)}&background=2a2d34&color=fff&size=100`;
  const flagUrl = `https://flagcdn.com/w40/${targetDriver.countryCode}.png`;

  return (
    <div className="glass animate-fade-in" style={{
      width: '100%',
      maxWidth: '600px',
      margin: '8px auto 0',
      borderRadius: '12px',
      borderTop: '4px solid var(--accent-red)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ 
            width: '48px', height: '48px', 
            background: 'var(--bg-secondary)', 
            borderRadius: '12px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-red)'
          }}>
            <span style={{ fontSize: '24px' }}>🏁</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
              {didWin ? 'Chequered Flag' : 'Out of Time'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              The mystery driver was <strong style={{ color: 'var(--text-primary)' }}>{targetDriver.name}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '24px', fontWeight: 800 }}>{didWin ? guesses.length : 'X'}<span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>/6</span></span>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>GUESSES</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', 
          background: 'var(--bg-secondary)', 
          padding: '6px 16px 6px 6px', 
          borderRadius: '30px',
          border: '1px solid var(--border-color)'
        }}>
          <img src={driverPhoto} alt={targetDriver.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-primary)' }} />
          <img src={flagUrl} alt={targetDriver.nationality} style={{ width: '20px', borderRadius: '2px' }} />
          <span style={{ fontSize: '14px', fontWeight: 700 }}>{targetDriver.name}</span>
          <span style={{ color: 'var(--text-secondary)' }}>•</span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{targetDriver.team}</span>
        </div>

        {mode === 'daily' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 800 }}>
              <Clock size={20} color="var(--text-secondary)" />
              {timeLeft}
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>NEXT DRIVER</span>
          </div>
        ) : (
          <button 
            onClick={onReset}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'var(--bg-secondary)', 
              padding: '8px 16px', borderRadius: '20px',
              fontSize: '14px', fontWeight: 600,
              border: '1px solid var(--border-color)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border-color)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
          >
            <Play size={16} /> Next Race
          </button>
        )}
      </div>

    </div>
  );
};
