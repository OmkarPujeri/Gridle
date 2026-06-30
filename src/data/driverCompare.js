// Shared attribute-comparison logic for a guessed driver vs the target.
// Used by both the full grid (AttributeRow.jsx, with values + arrows) and the
// multiplayer engine (which syncs only the color statuses to the opponent).

// Numeric attributes (age, wins): exact match is correct, otherwise show whether
// the guess is too low (arrow up = go higher) or too high (arrow down).
export const compareNum = (gVal, tVal) => {
  if (gVal === tVal) return { status: 'correct', arrow: null };
  return { status: 'incorrect', arrow: gVal < tVal ? 'up' : 'down' };
};

// Returns one entry per column, in grid order, each with a { status, arrow }.
// status is one of: 'correct' | 'incorrect' | 'incorrect-red'.
export const compareDriver = (guess, target) => [
  { label: 'Driver', status: guess.id === target.id ? 'correct' : 'incorrect', arrow: null },
  { label: 'Nationality', status: guess.countryCode === target.countryCode ? 'correct' : 'incorrect-red', arrow: null },
  { label: 'Team', status: guess.team === target.team ? 'correct' : 'incorrect-red', arrow: null },
  { label: 'Age', ...compareNum(guess.age, target.age) },
  { label: 'Wins', ...compareNum(guess.wins, target.wins) },
];

// Compact 5-element status array — the only thing pushed to the opponent.
// Arrows are intentionally omitted so the opponent can't infer the magnitude
// (and therefore narrow down) of your age/wins guesses.
export const computeRowStatuses = (guess, target) =>
  compareDriver(guess, target).map((r) => r.status);
