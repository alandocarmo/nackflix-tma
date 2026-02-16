export const WATCH_WINDOW_SEC = 30;
export const CHALLENGE_COUNT = 5;

// agenda 5 timestamps dentro de 30s (espalhados, sem ficar tudo junto)
export function buildSchedule() {
  // janelas sugeridas (segundos): 4-6, 8-10, 12-14, 16-20, 22-26
  const windows = [
    [4, 6],
    [8, 10],
    [12, 14],
    [16, 20],
    [22, 26]
  ];

  return windows.map(([a, b]) => randInt(a, b));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}