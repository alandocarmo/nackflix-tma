import { useEffect, useMemo, useRef, useState } from "react";

const ROUNDS = 3;            // aparece em 3 posições
const TAPS_PER_ROUND = 2;    // double tap por posição
const TIMEOUT_MS = 2500;     // tempo para completar cada posição (ajustável)

function r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newPos() {
  // Ajuste conforme sua .challenge-area (140px altura) e tamanho do dot (54)
  return { x: r(10, 260), y: r(10, 70) };
}

export default function TapTarget({ onSuccess, onClose }) {
  const [round, setRound] = useState(0);        // 0..2
  const [tapCount, setTapCount] = useState(0);  // 0..1 dentro do round
  const [pos, setPos] = useState(() => newPos());
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_MS);

  const deadlineRef = useRef(Date.now() + TIMEOUT_MS);
  const timerRef = useRef(null);

  // reseta deadline quando round/pos muda
  useEffect(() => {
    deadlineRef.current = Date.now() + TIMEOUT_MS;
    setTimeLeft(TIMEOUT_MS);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const left = Math.max(0, deadlineRef.current - Date.now());
      setTimeLeft(left);

      if (left <= 0) {
        // timeout: reinicia apenas o round atual (UX não agressivo)
        setTapCount(0);
        setPos(newPos());
        deadlineRef.current = Date.now() + TIMEOUT_MS;
        setTimeLeft(TIMEOUT_MS);
      }
    }, 60);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [round]);

  const totalNeeded = ROUNDS * TAPS_PER_ROUND; // 6
  const totalDone = round * TAPS_PER_ROUND + tapCount;

  const barPct = useMemo(() => {
    return Math.round((timeLeft / TIMEOUT_MS) * 100);
  }, [timeLeft]);

  function handleTap() {
    const nextTap = tapCount + 1;

    if (nextTap < TAPS_PER_ROUND) {
      // precisa do segundo tap nesta mesma posição
      setTapCount(nextTap);
      return;
    }

    // completou double tap deste round
    const nextRound = round + 1;

    if (nextRound >= ROUNDS) {
      // completou 3 rounds => sucesso
      onSuccess();
      return;
    }

    // avança para próximo round (muda posição)
    setRound(nextRound);
    setTapCount(0);
    setPos(newPos());
  }

  return (
    <>
      <h3 className="challenge-h">Tap rápido (6x)</h3>
      <div className="challenge-sub">
        Dê <b>2 taps</b> no alvo. Ele vai mudar de posição <b>2 vezes</b>.
      </div>

      {/* barra de tempo */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
          Progresso: {totalDone}/{totalNeeded} • Round {round + 1}/{ROUNDS}
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 10,
            background: "rgba(255,255,255,.15)",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${barPct}%`,
              background: "rgba(255,255,255,.85)"
            }}
          />
        </div>
      </div>

      <div className="challenge-area">
        <div
          className="dot"
          style={{
            left: pos.x,
            top: pos.y,
            cursor: "pointer",
            transition: "transform 120ms ease",
          }}
          onClick={handleTap}
          title="Toque rápido"
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
          userSelect: "none"
        }}
        onClick={onClose}
      >
        fechar
      </div>
    </>
  );
}