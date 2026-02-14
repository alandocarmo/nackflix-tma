export function scheduleRandomEvent(callback) {
  const randomTime = Math.random() * 15000 + 5000; // 5–20s
  setTimeout(callback, randomTime);
}