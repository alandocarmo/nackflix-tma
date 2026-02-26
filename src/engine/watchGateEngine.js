export const WATCH_WINDOW_SEC = 30;
export const CHALLENGE_COUNT = 1;

// Um desafio por vídeo (porque agora são 6 taps)
export function buildSchedule() {
  // aparece entre 10–16s
  return [randInt(10, 16)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}