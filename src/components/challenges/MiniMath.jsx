import { useMemo, useState } from "react";

function r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function MiniMath({ onSuccess, onClose }) {
  const q = useMemo(() => {
    const a = r(1, 9);
    const b = r(1, 9);
    return { a, b, ans: a + b };
  }, []);

  const [val, setVal] = useState("");

  function submit() {
    if (Number(val) === q.ans) onSuccess();
    else setVal("");
  }

  return (
    <>
      <h3 className="challenge-h">Desafio: rápido</h3>
      <div className="challenge-sub">Digite o resultado: <b>{q.a} + {q.b}</b></div>

      <div className="challenge-area" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            inputMode="numeric"
            placeholder="?"
            style={{
              width: 90,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.25)",
              background: "rgba(255,255,255,.08)",
              color: "#fff"
            }}
          />
          <button
            onClick={submit}
            className="next-btn"
            style={{ padding: "10px 12px" }}
          >
            OK
          </button>
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7, cursor: "pointer" }} onClick={onClose}>
        fechar
      </div>
    </>
  );
}