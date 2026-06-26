import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { teamLogos } from '../data/teamLogos';
import { driverPhotos } from '../data/driverPhotos';

const Tile = ({ value, status, label, delay, showArrow, imageUrl, isHardMode }) => {
  const getBgColor = () => {
    if (isHardMode && status !== 'empty') return 'var(--incorrect)';
    switch(status) {
      case 'correct': return 'var(--correct)';
      case 'incorrect-red': return 'var(--incorrect-red)';
      case 'empty': return 'var(--bg-secondary)';
      default: return 'var(--incorrect)';
    }
  };

  return (
    <div 
      className={status === 'empty' ? 'animate-pop' : 'animate-flip'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100px',
        height: '85px',
        backgroundColor: getBgColor(),
        border: status === 'empty' ? '2px solid var(--border-color)' : 'none',
        borderRadius: 'var(--border-radius)',
        color: '#fff',
        padding: '6px',
        textAlign: 'center',
        animationDelay: `${delay}ms`,
        opacity: 0,
        animationFillMode: 'forwards',
        boxShadow: status !== 'empty' ? '0 4px 6px rgba(0,0,0,0.2)' : 'none',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {status === 'empty' ? null : (
        <>
          {imageUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '4px', zIndex: 2 }}>
              <img 
                src={imageUrl} 
                alt={value} 
                style={{ 
                  width: label === 'Nationality' ? '55px' : '80px', 
                  height: label === 'Nationality' ? '38px' : '52px', 
                  objectFit: 'contain',
                  objectPosition: 'center',
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' 
                }} 
              />
              <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center', lineHeight: '1.1', maxWidth: '80px', wordBreak: 'break-word', color: '#fff' }}>
                {value}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600, fontSize: '20px', zIndex: 2, textAlign: 'center' }}>
              {value}
              {showArrow === 'up' && <ArrowUp size={20} />}
              {showArrow === 'down' && <ArrowDown size={20} />}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const AttributeRow = ({ guess, target, isHeader, isEmpty, rowIndex = 0, isHardMode }) => {
  if (isHeader) {
    const headers = ['Driver', 'Nationality', 'Team', 'Age', 'Wins'];
    return (
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {headers.map((h, i) => (
          <div key={i} style={{ width: '100px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {h}
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {Array.from({ length: 5 }).map((_, colIndex) => (
          <Tile key={colIndex} status="empty" delay={(rowIndex + colIndex) * 60} />
        ))}
      </div>
    );
  }

  const checkNum = (gVal, tVal) => {
    if (gVal === tVal) return { status: 'correct', arrow: null };
    return { status: 'incorrect', arrow: gVal < tVal ? 'up' : 'down' };
  };

  const getNatStatus = () => guess.countryCode === target.countryCode ? 'correct' : 'incorrect-red';
  const getTeamStatus = () => guess.team === target.team ? 'correct' : 'incorrect-red';

  const driverPhoto = driverPhotos[guess.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(guess.name)}&background=2a2d34&color=fff&size=100`;
  const flagUrl = `https://flagcdn.com/w80/${guess.countryCode}.png`;
  
  const teamLogo = teamLogos[guess.team] || `https://ui-avatars.com/api/?name=${encodeURIComponent(guess.team)}&background=2a2d34&color=fff&size=100`;

  const results = [
    { label: 'Driver', value: guess.name.split(' ').pop(), imageUrl: driverPhoto, status: guess.id === target.id ? 'correct' : 'incorrect' },
    { label: 'Nationality', value: guess.nationality, imageUrl: flagUrl, status: getNatStatus() },
    { label: 'Team', value: guess.team, imageUrl: teamLogo, status: getTeamStatus() },
    { label: 'Age', value: guess.age, ...checkNum(guess.age, target.age) },
    { label: 'Wins', value: guess.wins, ...checkNum(guess.wins, target.wins) },
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
      {results.map((r, i) => (
        <Tile 
          key={i} 
          label={r.label} 
          value={r.value} 
          status={r.status} 
          showArrow={r.arrow} 
          imageUrl={r.imageUrl}
          delay={i * 150} 
          isHardMode={isHardMode}
        />
      ))}
    </div>
  );
};
