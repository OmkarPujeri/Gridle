import React from 'react';
import { X, Settings } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose, isColorBlindMode, toggleColorBlindMode, isHardMode, toggleHardMode, isHintsEnabled, toggleHintsEnabled }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '24px'
    }}>
      <div 
        className="glass animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-secondary)' }}
          className="hover-opacity"
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={28} color="var(--text-primary)" />
          Settings
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: '500' }}>Color Blind Mode</span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>High contrast colors</span>
            </div>
            
            <button 
              onClick={toggleColorBlindMode}
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: isColorBlindMode ? 'var(--correct)' : 'var(--incorrect)',
                position: 'relative',
                transition: 'background 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#fff',
                transform: `translateX(${isColorBlindMode ? '20px' : '0'})`,
                transition: 'transform 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
        </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '75%' }}>
              <span style={{ fontSize: '18px', fontWeight: '500' }}>Hard Mode</span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No color blocks will be given when you guess</span>
            </div>
            
            <button 
              onClick={toggleHardMode}
              style={{
                width: '44px', height: '24px', borderRadius: '12px',
                background: isHardMode ? 'var(--correct)' : 'var(--incorrect)',
                position: 'relative', transition: 'background 0.3s ease',
                display: 'flex', alignItems: 'center', padding: '2px', flexShrink: 0
              }}
            >
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                transform: `translateX(${isHardMode ? '20px' : '0'})`,
                transition: 'transform 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)', opacity: isHardMode ? 0.5 : 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '75%' }}>
              <span style={{ fontSize: '18px', fontWeight: '500' }}>Hints</span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Allow 1 hint per game (disabled in Hard Mode)</span>
            </div>
            
            <button 
              onClick={toggleHintsEnabled}
              disabled={isHardMode}
              style={{
                width: '44px', height: '24px', borderRadius: '12px',
                background: isHintsEnabled ? 'var(--correct)' : 'var(--incorrect)',
                position: 'relative', transition: 'background 0.3s ease',
                display: 'flex', alignItems: 'center', padding: '2px', flexShrink: 0,
                cursor: isHardMode ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                transform: `translateX(${isHintsEnabled ? '20px' : '0'})`,
                transition: 'transform 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
