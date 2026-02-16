import { useMemo, useRef, useState } from "react";

function r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function SwipeToTarget({ onSuccess, onClose }) {
  const dotPos = useMemo(() => ({ x: 16, y: 42 }), []);
  const targetPos = useMemo(() => ({ x: r(210, 280), y: r(12, 80) }), []);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ x: dotPos.x, y: dotPos.y });

  function onDown() {
    setDragging(true);
  }

  function onMove(e) {
    if (!dragging) return;
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const x = e.clientX - rect.left - 27;
    const y = e.clientY - rect.top - 27;
    dragRef.current = { x, y };
    e.currentTarget.style.left = `${x}px`;
    e.currentTarget.style.top = `${y}px`;
  }

  function onUp(e) {
    setDragging(false);

    const dx = dragRef.current.x - targetPos.x;
    const dy = dragRef.current.y - targetPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 40) onSuccess();
  }

  return (
    <>
      <h3 className="challenge-h">Desafio: arrastar</h3>
      <div className="challenge-sub">Arraste o círculo até o alvo 🎯.</div>

      <div className="challenge-area">
        <div className="target" style={{ left: targetPos.x, top: targetPos.y }}>
          🎯
        </div>

        <div
          className="dot"
          style={{ left: dotPos.x, top: dotPos.y, cursor: "grab" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => setDragging(false)}
        >
          ⬤
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7, cursor: "pointer" }} onClick={onClose}>
        fechar
      </div>
    </>
  );
}