import { useState, useEffect } from "react";
import { scheduleRandomEvent } from "../engine/interactionEngine";
import { registerTap, isHumanRhythm } from "../engine/rhythmAnalyzer";

export default function InteractionOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    scheduleRandomEvent(() => setVisible(true));
  }, []);

  function handleTap() {
    registerTap();

    if (isHumanRhythm()) {
      console.log("NackFlix: prova humana válida (local)");
    } else {
      console.log("NackFlix: padrão suspeito (ajustar dificuldade depois)");
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