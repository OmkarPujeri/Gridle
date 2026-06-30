import React from 'react';
import { X, Info } from 'lucide-react';
import { drivers } from '../data/drivers';

export const InfoModal = ({ isOpen, onClose }) => {
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
          maxWidth: '500px',
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
          <Info size={28} color="var(--accent-red)" />
          Database Info
        </h2>

        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          borderLeft: '4px solid var(--accent-red)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>Database:</strong> Features <strong>{drivers.length}</strong> drivers, including all racers from the 2017 season onwards, plus a curated selection of iconic Formula 1 legends.
            </p>
            <p>
              <strong>Stats:</strong> Driver statistics (Wins, Age, Teams) are updated up to the <strong>Austrian Grand Prix 2026</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
