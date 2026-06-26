import React, { useState, useRef, useEffect } from 'react';
import { Search, Lightbulb, X } from 'lucide-react';
import { drivers } from '../data/drivers';

export const GuessInput = ({ onGuess, disabled, guesses, isHardMode, isHintsEnabled, hintMessage, isHintClosed, onUseHint, onCloseHint }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isHintHovered, setIsHintHovered] = useState(false);
  const inputRef = useRef(null);
  
  const guessedIds = guesses.map(g => g.id);
  
  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) && !guessedIds.includes(d.id)
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (driverId) => {
    onGuess(driverId);
    setQuery('');
    setIsOpen(false);
  };

  const hintDisabled = isHardMode || !isHintsEnabled || hintMessage || guesses.length < 3 || disabled;
  let hintTooltip = "Click for a hint";
  if (isHardMode) hintTooltip = "No hints in Hard Mode";
  else if (!isHintsEnabled) hintTooltip = "Hints are disabled. Enable them in settings";
  else if (hintMessage) hintTooltip = "Hint used";
  else if (disabled) hintTooltip = "Game over";
  else if (guesses.length < 3) hintTooltip = "Only available after 3 guesses";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      
      {hintMessage && !isHintClosed && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }}>
          <div className="glass animate-pop" style={{
            background: 'var(--bg-secondary)', borderTop: '4px solid var(--accent-red)',
            padding: '40px 32px', borderRadius: '16px', position: 'relative',
            maxWidth: '400px', width: '100%', textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <button 
              onClick={onCloseHint}
              style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-secondary)' }}
              className="hover-opacity"
            >
              <X size={24} />
            </button>

            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(233, 26, 62, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Lightbulb size={32} color="var(--accent-red)" />
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-secondary)', letterSpacing: '2px' }}>
              YOUR HINT
            </h3>
            
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <p style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                {hintMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', width: '100%', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', height: '48px', display: 'flex', alignItems: 'center' }} 
             onMouseEnter={() => setIsHintHovered(true)} 
             onMouseLeave={() => setIsHintHovered(false)}>
          <button 
            onClick={onUseHint}
            disabled={hintDisabled || disabled}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '48px', height: '48px', borderRadius: 'var(--border-radius)',
              background: hintDisabled ? 'var(--incorrect)' : 'var(--accent-red)',
              color: hintDisabled ? 'var(--text-secondary)' : '#fff',
              cursor: hintDisabled ? 'not-allowed' : 'pointer',
              opacity: disabled && !hintMessage ? 0.5 : 1,
              transition: 'all 0.2s', flexShrink: 0
            }}
          >
            <Lightbulb size={24} />
            
            <div style={{
              position: 'absolute', top: '-6px', right: '-6px',
              background: hintMessage ? 'var(--text-secondary)' : 'var(--text-primary)',
              color: 'var(--bg-primary)', width: '20px', height: '20px', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, boxShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 10
            }}>
              {hintMessage ? '0' : '1'}
            </div>
          </button>
          
          {isHintHovered && (
            <div className="animate-fade-in" style={{
              position: 'absolute', right: '100%', top: '50%', transform: 'translate(-12px, -50%)',
              background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
              padding: '8px 12px', borderRadius: '8px', color: 'var(--text-primary)',
              fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', zIndex: 30, pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              {hintTooltip}
              <div style={{
                position: 'absolute', right: '-5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)',
                width: '10px', height: '10px', background: 'var(--bg-primary)',
                borderRight: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)',
              }} />
            </div>
          )}
        </div>

        <div ref={inputRef} style={{ position: 'relative', flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius)',
            padding: '12px 16px',
            opacity: disabled ? 0.5 : 1
          }}>
            <Search size={20} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
            <input 
              type="text"
              placeholder="Guess a driver..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              disabled={disabled}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          {isOpen && query.length > 0 && filteredDrivers.length > 0 && !disabled && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              maxHeight: '250px',
              overflowY: 'auto',
              zIndex: 20,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              {filteredDrivers.map(driver => (
                <div
                  key={driver.id}
                  onClick={() => handleSelect(driver.id)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <img 
                    src={`https://flagcdn.com/w40/${driver.countryCode}.png`} 
                    alt={driver.nationality} 
                    style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} 
                  />
                  <span style={{ color: 'var(--text-primary)' }}>{driver.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
