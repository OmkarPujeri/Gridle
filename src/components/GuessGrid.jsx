import React from 'react';
import { AttributeRow } from './AttributeRow';

export const GuessGrid = ({ guesses, targetDriver, isHardMode }) => {
  if (!targetDriver) return null;

  const MAX_GUESSES = 6;
  const rows = Array.from({ length: MAX_GUESSES });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '24px',
      overflowX: 'auto',
      paddingBottom: '24px',
      width: '100%'
    }}>
      <div style={{ minWidth: 'min-content' }}>
        <AttributeRow isHeader={true} />
        {rows.map((_, index) => {
          const guess = guesses[index];
          if (guess) {
            return <AttributeRow key={`${guess.id}-${index}`} guess={guess} target={targetDriver} isHardMode={isHardMode} />;
          } else {
            return <AttributeRow key={`empty-${index}`} isEmpty={true} rowIndex={index} />;
          }
        })}
      </div>
    </div>
  );
};
