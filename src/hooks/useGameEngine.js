import { useState, useEffect } from 'react';
import { drivers } from '../data/drivers';

const mulberry32 = (a) => {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export const useGameEngine = (mode = 'daily') => {
  const [targetDriver, setTargetDriver] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); 
  const [hintMessage, setHintMessage] = useState(null);
  const [isHintClosed, setIsHintClosed] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('f1wordle_stats');
    return saved ? JSON.parse(saved) : {
      played: 0, wins: 0, currentStreak: 0, maxStreak: 0, hintsUsed: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    };
  });

  const saveStats = (newStats) => {
    setStats(newStats);
    localStorage.setItem('f1wordle_stats', JSON.stringify(newStats));
  };

  useEffect(() => {
    // Only the solo modes are handled here; multiplayer has its own engine.
    if (mode !== 'daily' && mode !== 'infinite') return;

    let selectedDriver;
    let savedState = null;

    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    if (mode === 'daily') {
      let hash = 0;
      for (let i = 0; i < dateString.length; i++) {
        hash = Math.imul(31, hash) + dateString.charCodeAt(i) | 0;
      }
      const rand = mulberry32(hash)();
      const index = Math.floor(rand * drivers.length);
      selectedDriver = drivers[index];
      
      const saved = localStorage.getItem('f1wordle_daily');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === dateString) {
          savedState = parsed;
        } else {
          localStorage.removeItem('f1wordle_daily');
        }
      }
    } else {
      const saved = localStorage.getItem('f1wordle_infinite');
      if (saved) {
        savedState = JSON.parse(saved);
        selectedDriver = drivers.find(d => d.id === savedState.targetDriverId);
      }
      
      if (!selectedDriver) {
        const index = Math.floor(Math.random() * drivers.length);
        selectedDriver = drivers[index];
      }
    }
    
    setTargetDriver(selectedDriver);
    if (savedState) {
      setGuesses(savedState.guesses);
      setGameStatus(savedState.status);
      setHintMessage(savedState.hintMessage || null);
      setIsHintClosed(savedState.isHintClosed || false);
    } else {
      setGuesses([]);
      setGameStatus('playing');
      setHintMessage(null);
      setIsHintClosed(false);
    }
    setJustCompleted(false);
  }, [mode]);

  useEffect(() => {
    if (!targetDriver) return;
    if (mode !== 'daily' && mode !== 'infinite') return; // don't persist in multiplayer

    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    const stateToSave = {
      guesses,
      status: gameStatus,
      targetDriverId: targetDriver.id,
      date: dateString,
      hintMessage,
      isHintClosed
    };
    
    if (mode === 'daily') {
      localStorage.setItem('f1wordle_daily', JSON.stringify(stateToSave));
    } else {
      localStorage.setItem('f1wordle_infinite', JSON.stringify(stateToSave));
    }
  }, [guesses, gameStatus, targetDriver, mode, hintMessage, isHintClosed]);

  const submitGuess = (driverId) => {
    if (gameStatus !== 'playing') return;
    if (guesses.some(g => g.id === driverId)) return;
    
    const guessedDriver = drivers.find(d => d.id === driverId);
    if (!guessedDriver) return;
    
    const newGuesses = [...guesses, guessedDriver];
    setGuesses(newGuesses);
    
    if (guessedDriver.id === targetDriver.id) {
      setGameStatus('won');
      setJustCompleted(true);
      const newStats = { ...stats };
      newStats.played += 1;
      newStats.wins += 1;
      newStats.currentStreak += 1;
      if (newStats.currentStreak > newStats.maxStreak) newStats.maxStreak = newStats.currentStreak;
      newStats.distribution[newGuesses.length] += 1;
      if (hintMessage) newStats.hintsUsed += 1;
      saveStats(newStats);
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      setJustCompleted(true);
      const newStats = { ...stats };
      newStats.played += 1;
      newStats.currentStreak = 0;
      if (hintMessage) newStats.hintsUsed += 1;
      saveStats(newStats);
    }
  };

  const resetInfinite = () => {
    if (mode !== 'infinite') return;
    localStorage.removeItem('f1wordle_infinite');
    const index = Math.floor(Math.random() * drivers.length);
    setTargetDriver(drivers[index]);
    setGuesses([]);
    setGameStatus('playing');
    setHintMessage(null);
    setIsHintClosed(false);
    setJustCompleted(false);
  };

  const resetDaily = () => {
    if (mode !== 'daily') return;
    localStorage.removeItem('f1wordle_daily');
    setGuesses([]);
    setGameStatus('playing');
    setHintMessage(null);
    setIsHintClosed(false);
    setJustCompleted(false);
  };

  const revealHint = () => {
    if (hintMessage || !targetDriver) return;
    const hints = [
      `Nationality: ${targetDriver.nationality}`,
      `Team: ${targetDriver.team}`,
      `Age: ${targetDriver.age}`,
      `Wins: ${targetDriver.wins}`
    ];
    const randomIndex = Math.floor(Math.random() * hints.length);
    setHintMessage(hints[randomIndex]);
    setIsHintClosed(false);
  };

  const closeHint = () => {
    setIsHintClosed(true);
  };

  return {
    targetDriver,
    guesses,
    gameStatus,
    hintMessage,
    isHintClosed,
    justCompleted,
    stats,
    submitGuess,
    resetInfinite,
    resetDaily,
    revealHint,
    closeHint
  };
};
