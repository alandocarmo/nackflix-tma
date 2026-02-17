import { useMemo } from "react";

function r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function TapTarget({ onSuccess, onClose }) {
  // Ajuste conforme seu CSS .challenge-area (140px height)
  // Aqui a ideia é manter dentro da área e evitar cortar o botão
  const pos = useMemo(() => ({ x: r(10, 260), y: r(10, 70) }), []);

  return (
    <>
      <h3 className="challenge-h">Toque no alvo</h3>
      <div className="challenge-sub">
        Um toque rápido no alvo para continuar.
      </div>

      <div className="challenge-area">
        <div
          className="dot"
          style={{ left: pos.x, top: pos.y, cursor: "pointer" }}
          onClick={onSuccess}
          title="Toque"
        >
          👆
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          opacity: 0.7,
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={onClose}
      >
        fechar
      </div>
    </>
  );
}