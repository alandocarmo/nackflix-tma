export function initTelegram() {
  const tg = window.Telegram?.WebApp;

  if (!tg) return null;

  tg.expand();
  tg.ready();

  return {
    user: tg.initDataUnsafe?.user || null,
    tg
  };
}