import React from 'react';
import { Info, RefreshCw, Settings, BarChart2 } from 'lucide-react';

export const Header = ({ mode, setMode, onOpenInstructions, onOpenSettings, onOpenStats, onReset }) => {
  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 24px 8px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' }}>
        
        <div style={{ position: 'absolute', left: 0, display: 'flex', gap: '16px' }}>
          <button onClick={onOpenInstructions} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="How to Play" className="hover-opacity">
            <Info size={28} />
          </button>
        </div>

        <h1 style={{ 
          fontSize: '40px', 
          fontWeight: 800, 
          letterSpacing: '-1.5px',
          color: 'var(--text-primary)'
        }}>
          GRID<span style={{ color: 'var(--accent-red)' }}>LE</span>
        </h1>

        <div style={{ position: 'absolute', right: 0, display: 'flex', gap: '16px' }}>
          {mode === 'infinite' && (
            <button onClick={onReset} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Restart Game" className="hover-opacity">
              <RefreshCw size={28} />
            </button>
          )}
          <button onClick={onOpenStats} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Statistics" className="hover-opacity">
            <BarChart2 size={28} />
          </button>
          <button onClick={onOpenSettings} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Settings" className="hover-opacity">
            <Settings size={28} />
          </button>
        </div>
      </div>

      <div style={{ 
        width: '100%', 
        height: '1px', 
        background: 'var(--border-color)', 
        marginBottom: '12px',
        opacity: 0.5
      }} />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        <div style={{ 
          display: 'flex', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '24px', 
          padding: '4px' 
        }}>
          <button 
            onClick={() => setMode('daily')}
            style={{
              padding: '8px 24px',
              borderRadius: '20px',
              fontSize: '15px',
              fontWeight: 600,
              background: mode === 'daily' ? 'var(--accent-red)' : 'transparent',
              color: mode === 'daily' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Daily
          </button>
          <button
            onClick={() => setMode('infinite')}
            style={{
              padding: '8px 24px',
              borderRadius: '20px',
              fontSize: '15px',
              fontWeight: 600,
              background: mode === 'infinite' ? 'var(--bg-secondary)' : 'transparent',
              color: mode === 'infinite' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Infinite
          </button>
          <button
            onClick={() => setMode('multiplayer')}
            style={{
              padding: '8px 24px',
              borderRadius: '20px',
              fontSize: '15px',
              fontWeight: 600,
              background: mode === 'multiplayer' ? 'var(--accent-red)' : 'transparent',
              color: mode === 'multiplayer' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            1v1
          </button>
        </div>

      </div>
    </header>
  );
};
