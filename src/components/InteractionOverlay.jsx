import { useState, useEffect } from "react";
import { scheduleRandomEvent } from "../engine/interactionEngine";
import { registerTap, isHumanRhythm } from "../engine/rhythmAnalyzer";
import { useEpochStore } from "../store/epochStore";
import { pingSession } from "../services/api";

export default function InteractionOverlay({ sessionId }) {
  const [visible, setVisible] = useState(false);
  const { markProofAccepted, syncEpochNow } = useEpochStore();

  useEffect(() => {
    scheduleRandomEvent(() => setVisible(true));
  }, []);

  async function handleTap() {
    registerTap();

    syncEpochNow();
    if (isHumanRhythm()) {
      markProofAccepted();
      try {
        if (sessionId) await pingSession({ sessionId, event: "proof_ok", proofsDelta: 1 });
      } catch {}
    }

    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      onClick={handleTap}
      style={{
        position: "absolute",
        top: "40%",
        left: "40%",
        background: "rgba(255,255,255,0.92)",
        padding: "16px 18px",
        borderRadius: "12px",
        cursor: "pointer",
        userSelect: "none"
      }}
    >
      Toque agora ✅
    </div>
  );
}