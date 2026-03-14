import { pingSession } from "../services/api";

export function useTapTracker(sessionId) {
  async function trackTap(action, extra = {}) {
    try {
      if (!sessionId) return;

      await pingSession({
        sessionId,
        event: "ui_tap",
        action,
        count: 1,
        ...extra,
      });
    } catch {
      // não trava UX
    }
  }

  return { trackTap };
}