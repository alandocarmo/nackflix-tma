export const WATCH_WINDOW_SEC = 30;
export const TAP_SPAWNS = 6;

// 6 janelas dentro de 30s (espalhadas)
export function buildTapSchedule() {
  const windows = [
    [3, 5],
    [7, 9],
    [11, 13],
    [15, 17],
    [20, 22],
    [25, 27],
  ];
  return windows.map(([a, b]) => randInt(a, b));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}