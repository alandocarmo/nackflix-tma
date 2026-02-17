export const WATCH_WINDOW_SEC = 30;
export const CHALLENGE_COUNT = 3;

// agenda 3 timestamps dentro de 30s (espalhados e previsíveis o suficiente para UX)
export function buildSchedule() {
  // janelas em segundos: 6–9, 14–18, 22–26
  const windows = [
    [6, 9],
    [14, 18],
    [22, 26],
  ];

  return windows.map(([a, b]) => randInt(a, b));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}