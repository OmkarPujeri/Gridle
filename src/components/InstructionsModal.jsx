import React from 'react';
import { X, Info, ArrowUp, ArrowDown } from 'lucide-react';
import { drivers } from '../data/drivers';

export const InstructionsModal = ({ isOpen, onClose }) => {
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
          How to Play
        </h2>

        <p style={{ marginBottom: '16px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
          Guess the mystery Formula 1 driver out of our database of <strong>{drivers.length} drivers</strong> in <strong>6 tries</strong>.
        </p>

        <ul style={{ marginBottom: '24px', paddingLeft: '24px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <li>Type a driver's name and select them from the list.</li>
          <li>After each guess, the color of the tiles will change to show how close your guess was to the mystery driver.</li>
        </ul>

        <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Color Codes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ minWidth: '32px', minHeight: '32px', backgroundColor: 'var(--correct)', borderRadius: '4px', flexShrink: 0 }}></div>
            <span><strong>Green:</strong> Exact match.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ minWidth: '32px', minHeight: '32px', backgroundColor: 'var(--incorrect-red)', borderRadius: '4px', flexShrink: 0 }}></div>
            <span><strong>Red:</strong> Incorrect Nationality or Team.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ minWidth: '32px', minHeight: '32px', backgroundColor: 'var(--incorrect)', borderRadius: '4px', flexShrink: 0 }}></div>
            <span><strong>Grey:</strong> No match at all.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ minWidth: '32px', minHeight: '32px', backgroundColor: 'var(--incorrect)', border: '1px solid var(--border-color)', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ArrowUp size={14} style={{ marginRight: '-2px' }} />
              <ArrowDown size={14} />
            </div>
            <span><strong>Arrows:</strong> For numbers (Age, Wins), indicates if the mystery driver's number is higher (↑) or lower (↓) than your guess.</span>
          </div>
        </div>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          borderLeft: '4px solid var(--accent-red)'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <strong>Note:</strong> Driver statistics and information are updated up to the last Grand Prix of Barcelona 2026.
          </p>
        </div>

      </div>
    </div>
  );
};
