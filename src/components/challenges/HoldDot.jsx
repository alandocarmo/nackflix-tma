import { useMemo, useRef, useState } from "react";

function r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function HoldDot({ onSuccess, onClose }) {
  const pos = useMemo(() => ({ x: r(10, 260), y: r(10, 80) }), []);
  const [holding, setHolding] = useState(false);
  const timerRef = useRef(null);

  function down() {
    setHolding(true);
    timerRef.current = setTimeout(() => {
      onSuccess();
    }, 750);
  }

  function up() {
    setHolding(false);
    clearTimeout(timerRef.current);
  }

  return (
    <>
      <h3 className="challenge-h">Desafio: segurar</h3>
      <div className="challenge-sub">Segure o círculo por 0,75s.</div>

      <div className="challenge-area">
        <div
          className="dot"
          style={{
            left: pos.x,
            top: pos.y,
            cursor: "pointer",
            transform: holding ? "scale(0.95)" : "scale(1)"
          }}
          onPointerDown={down}
          onPointerUp={up}
          onPointerCancel={up}
          onPointerLeave={up}
        >
          ✋
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7, cursor: "pointer" }} onClick={onClose}>
        fechar
      </div>
    </>
  );
}