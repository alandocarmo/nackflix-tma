import { useMemo } from "react";

function r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function TapDot({ onSuccess, onClose }) {
  const pos = useMemo(() => ({ x: r(10, 260), y: r(10, 80) }), []);

  return (
    <>
      <h3 className="challenge-h">Desafio: toque</h3>
      <div className="challenge-sub">Toque no círculo para continuar.</div>

      <div className="challenge-area">
        <div
          className="dot"
          style={{ left: pos.x, top: pos.y, cursor: "pointer" }}
          onClick={onSuccess}
        >
          👆
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7, cursor: "pointer" }} onClick={onClose}>
        fechar
      </div>
    </>
  );
}