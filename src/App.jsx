import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { GuessInput } from './components/GuessInput';
import { GuessGrid } from './components/GuessGrid';
import { InstructionsModal } from './components/InstructionsModal';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { GameResult } from './components/GameResult';
import { useGameEngine } from './hooks/useGameEngine';

function App() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('f1wordle_mode') || 'daily';
  });

  useEffect(() => {
    localStorage.setItem('f1wordle_mode', mode);
  }, [mode]);

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isColorBlindMode, setIsColorBlindMode] = useState(() => {
    return localStorage.getItem('f1wordle_colorblind') === 'true';
  });
  const [isHardMode, setIsHardMode] = useState(() => {
    return localStorage.getItem('f1wordle_hardmode') === 'true';
  });
  const [isHintsEnabled, setIsHintsEnabled] = useState(() => {
    const val = localStorage.getItem('f1wordle_hints');
    return val !== null ? val === 'true' : true;
  });

  const { targetDriver, guesses, gameStatus, hintMessage, isHintClosed, justCompleted, stats, submitGuess, resetInfinite, resetDaily, revealHint, closeHint } = useGameEngine(mode);

  useEffect(() => {
    if (justCompleted && (gameStatus === 'won' || gameStatus === 'lost')) {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 500); // Allow time for the final row animations and result render
    }
  }, [gameStatus, justCompleted]);

  const toggleHardMode = () => {
    const newVal = !isHardMode;
    setIsHardMode(newVal);
    localStorage.setItem('f1wordle_hardmode', newVal);
    if (newVal) {
      setIsHintsEnabled(false);
      localStorage.setItem('f1wordle_hints', 'false');
    } else {
      setIsHintsEnabled(true);
      localStorage.setItem('f1wordle_hints', 'true');
    }
  };

  const toggleHintsEnabled = () => {
    if (isHardMode) return;
    const newVal = !isHintsEnabled;
    setIsHintsEnabled(newVal);
    localStorage.setItem('f1wordle_hints', newVal);
  };

  useEffect(() => {
    if (justCompleted && gameStatus === 'won') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e10600', '#ffffff', '#00b84b']
      });
    }
  }, [gameStatus, justCompleted]);

  useEffect(() => {
    if (isColorBlindMode) {
      document.body.classList.add('color-blind');
      localStorage.setItem('f1wordle_colorblind', 'true');
    } else {
      document.body.classList.remove('color-blind');
      localStorage.setItem('f1wordle_colorblind', 'false');
    }
  }, [isColorBlindMode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <Header 
        mode={mode} 
        setMode={setMode} 
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onReset={mode === 'infinite' ? resetInfinite : resetDaily}
      />

      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '0px 24px 24px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        
        <div style={{ width: '100%', marginBottom: '16px', zIndex: 20 }}>
          <GuessInput 
            onGuess={submitGuess} 
            disabled={gameStatus !== 'playing'} 
            guesses={guesses}
            isHardMode={isHardMode}
            isHintsEnabled={isHintsEnabled}
            hintMessage={hintMessage}
            isHintClosed={isHintClosed}
            onUseHint={revealHint}
            onCloseHint={closeHint}
          />
        </div>

        <GuessGrid guesses={guesses} targetDriver={targetDriver} isHardMode={isHardMode} />
        
        <GameResult 
          targetDriver={targetDriver}
          gameStatus={gameStatus}
          guesses={guesses}
          mode={mode}
          onReset={mode === 'infinite' ? resetInfinite : resetDaily}
        />
        
      </main>

      <InstructionsModal 
        isOpen={isInstructionsOpen} 
        onClose={() => setIsInstructionsOpen(false)} 
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isColorBlindMode={isColorBlindMode}
        toggleColorBlindMode={() => setIsColorBlindMode(!isColorBlindMode)}
        isHardMode={isHardMode}
        toggleHardMode={toggleHardMode}
        isHintsEnabled={isHintsEnabled}
        toggleHintsEnabled={toggleHintsEnabled}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />
    </div>
  );
}

export default App;
