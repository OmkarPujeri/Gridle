import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { teamLogos } from '../data/teamLogos';
import { driverPhotos } from '../data/driverPhotos';
import { compareDriver } from '../data/driverCompare';

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
      className={`tile ${status === 'empty' ? 'animate-pop' : 'animate-flip'}`}
      style={{
        backgroundColor: getBgColor(),
        border: status === 'empty' ? '2px solid var(--border-color)' : 'none',
        animationDelay: `${delay}ms`,
        opacity: 0,
        boxShadow: status !== 'empty' ? '0 4px 6px rgba(0,0,0,0.2)' : 'none',
      }}
    >
      {status === 'empty' ? null : (
        <>
          {imageUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '4px', zIndex: 2 }}>
              <img 
                src={imageUrl} 
                alt={value} 
                className="tile-img"
                style={{ 
                  width: label === 'Nationality' ? '55px' : '80px', 
                  height: label === 'Nationality' ? '38px' : '52px', 
                }} 
              />
              <span className="tile-text-img">
                {value}
              </span>
            </div>
          ) : (
            <div className="tile-text-val">
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
    const headers = ['Driver', 'Nat.', 'Team', 'Age', 'Wins'];
    return (
      <div className="guess-row">
        {headers.map((h, i) => (
          <div key={i} className="tile-header">
            {h}
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="guess-row">
        {Array.from({ length: 5 }).map((_, colIndex) => (
          <Tile key={colIndex} status="empty" delay={(rowIndex + colIndex) * 60} />
        ))}
      </div>
    );
  }

  const driverPhoto = driverPhotos[guess.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(guess.name)}&background=2a2d34&color=fff&size=100`;
  const flagUrl = `https://flagcdn.com/w80/${guess.countryCode}.png`;

  const teamLogo = teamLogos[guess.team] || `https://ui-avatars.com/api/?name=${encodeURIComponent(guess.team)}&background=2a2d34&color=fff&size=100`;

  // Status + arrow come from the shared comparison helper; values/images stay local.
  const [driverCmp, natCmp, teamCmp, ageCmp, winsCmp] = compareDriver(guess, target);
  const results = [
    { label: 'Driver', value: guess.name.split(' ').pop(), imageUrl: driverPhoto, ...driverCmp },
    { label: 'Nationality', value: guess.nationality, imageUrl: flagUrl, ...natCmp },
    { label: 'Team', value: guess.team, imageUrl: teamLogo, ...teamCmp },
    { label: 'Age', value: guess.age, ...ageCmp },
    { label: 'Wins', value: guess.wins, ...winsCmp },
  ];

  return (
    <div className="guess-row">
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
