import { useMemo, useState } from "react";

export default function TwoTapSequence({ onSuccess, onClose }) {
  const order = useMemo(() => (Math.random() > 0.5 ? ["A", "B"] : ["B", "A"]), []);
  const [step, setStep] = useState(0);

  function tap(letter) {
    if (letter === order[step]) {
      const next = step + 1;
      if (next >= 2) onSuccess();
      else setStep(next);
    } else {
      setStep(0);
    }
  }

  return (
    <>
      <h3 className="challenge-h">Desafio: sequência</h3>
      <div className="challenge-sub">Toque na ordem: <b>{order.join(" → ")}</b></div>

      <div className="challenge-area" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="dot" style={{ position: "relative", left: 0, top: 0, cursor: "pointer" }} onClick={() => tap("A")}>
            A
          </div>
          <div className="dot" style={{ position: "relative", left: 0, top: 0, cursor: "pointer" }} onClick={() => tap("B")}>
            B
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, opacity: .75 }}>
          Progresso: {step}/2
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7, cursor: "pointer" }} onClick={onClose}>
        fechar
      </div>
    </>
  );
}