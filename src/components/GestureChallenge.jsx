import { useEffect, useMemo, useRef, useState } from "react";
import { useEpochStore } from "../store/epochStore";
import { pingSession } from "../services/api";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function GestureChallenge({ sessionId }) {
  const { markProofAccepted, syncEpochNow } = useEpochStore();
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | hold | drag | done
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  const holdTimer = useRef(null);

  useEffect(() => {
    // aparece perto do final do vídeo (18–25s) para não atrapalhar
    const t = setTimeout(() => {
      setTargetPos({ x: rand(40, 180), y: rand(10, 40) });
      setVisible(true);
      setStatus("hold");
    }, rand(18000, 25000));
    return () => clearTimeout(t);
  }, []);

  const instruction = useMemo(() => {
    if (!visible) return "";
    if (status === "hold") return "Segure 1s no círculo";
    if (status === "drag") return "Arraste até o alvo 🎯";
    if (status === "done") return "✅ Ok!";
    return "";
  }, [visible, status]);

  function onPointerDown() {
    if (status !== "hold") return;
    holdTimer.current = setTimeout(() => {
      setStatus("drag");
    }, 900);
  }

  function onPointerUp() {
    clearTimeout(holdTimer.current);
  }

  async function onDragEnd(e) {
    if (status !== "drag") return;

    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - targetPos.x;
    const dy = y - targetPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 40) {
      // 1) marca prova no estado local
      syncEpochNow();
      markProofAccepted();

      // 2) envia métrica para backend (sem bloquear UX)
      try {
        if (sessionId) {
          await pingSession({ sessionId, event: "proof_ok", proofsDelta: 1 });
        }
      } catch (err) {
        console.warn("pingSession failed", err);
      }

      // 3) feedback e some
      setStatus("done");
      setTimeout(() => setVisible(false), 700);
    }
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 12,
        right: 12,
        background: "rgba(0,0,0,0.72)",
        color: "white",
        padding: 12,
        borderRadius: 14
      }}
    >
      <div style={{ fontSize: 13, marginBottom: 8 }}>{instruction}</div>

      {status !== "done" && (
        <div
          style={{
            position: "relative",
            height: 70,
            borderRadius: 12,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden"
          }}
        >
          {/* draggable circle */}
          <div
            draggable={status === "drag"}
            onDragEnd={onDragEnd}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: "rgba(255,255,255,0.9)",
              cursor: status === "drag" ? "grab" : "pointer",
              position: "absolute",
              left: 12,
              top: 9
            }}
            title="Arraste"
          />

          {/* target */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              border: "2px dashed rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: `${targetPos.x}px`,
              top: `${targetPos.y}px`
            }}
            title="Alvo"
          >
            🎯
          </div>
        </div>
      )}
    </div>
  );
}