let tapTimes = [];

export function registerTap() {
  const now = Date.now();
  tapTimes.push(now);

  if (tapTimes.length > 5) tapTimes.shift();
}

export function isHumanRhythm() {
  if (tapTimes.length < 3) return true;

  const intervals = tapTimes.slice(1).map((t, i) => t - tapTimes[i]);
  const variance = Math.max(...intervals) - Math.min(...intervals);

  return variance > 80; // evita padrão robótico muito “perfeito”
}