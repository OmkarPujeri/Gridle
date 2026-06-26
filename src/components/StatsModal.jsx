import React from 'react';
import { X, BarChart2 } from 'lucide-react';

export const StatsModal = ({ isOpen, onClose, stats }) => {
  if (!isOpen || !stats) return null;

  const winPercentage = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  
  const maxDist = Math.max(...Object.values(stats.distribution), 1);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: '24px'
    }}>
      <div 
        className="glass animate-fade-in"
        style={{
          width: '100%', maxWidth: '400px', borderRadius: '16px',
          padding: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto'
        }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-secondary)' }}
          className="hover-opacity"
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--accent-red)', fontWeight: 800, letterSpacing: '1px' }}>
          STATISTICS
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '50px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.played}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Played</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '50px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{winPercentage}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Win %</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '50px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.currentStreak}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Streak</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '50px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.maxStreak}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Best</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '50px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-red)' }}>{stats.hintsUsed}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hints</span>
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', letterSpacing: '1px' }}>
          GUESS DISTRIBUTION
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3, 4, 5, 6].map(num => {
            const count = stats.distribution[num];
            const percent = Math.max((count / maxDist) * 100, 5);
            return (
              <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{num}</span>
                <div style={{ flex: 1, height: '24px', display: 'flex' }}>
                  <div style={{
                    width: count === 0 ? 'auto' : `${percent}%`,
                    minWidth: '24px',
                    background: count > 0 ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: count > 0 ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}>
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
