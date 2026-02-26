import { useEffect, useMemo, useRef, useState } from "react";
import { WATCH_WINDOW_SEC, TAP_SPAWNS, buildTapSchedule } from "../engine/tapSchedule";
import { pingSession } from "../services/api";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// gera posição em % para funcionar em qualquer tamanho de tela
function newRandomPos() {
  // evita bordas (pra não ficar embaixo de UI)
  const x = randInt(8, 88); // %
  const y = randInt(12, 82); // %
  return { x, y };
}

export default function WatchHUD({ sessionId, onThirtyDone }) {
  const [elapsed, setElapsed] = useState(0);
  const [activeTap, setActiveTap] = useState(null); // {x,y, id}
  const [spawnedSet, setSpawnedSet] = useState(() => new Set());
  const [tapsDone, setTapsDone] = useState(0);

  const schedule = useMemo(() => buildTapSchedule(), []);
  const startRef = useRef(Date.now());
  const done30Ref = useRef(false);

  // ticker
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      const sec = clamp(Math.floor((now - startRef.current) / 1000), 0, WATCH_WINDOW_SEC);
      setElapsed(sec);

      // dispara 30s complete UMA vez (não bloqueia nada)
      if (sec >= WATCH_WINDOW_SEC && !done30Ref.current) {
        done30Ref.current = true;
        onThirtyDone?.();
      }

      // spawn taps conforme schedule (um por vez)
      for (let i = 0; i < schedule.length; i++) {
        if (sec >= schedule[i] && !spawnedSet.has(i) && !activeTap) {
          setSpawnedSet((prev) => {
            const n = new Set(prev);
            n.add(i);
            return n;
          });

          // mostra o ícone por pouco tempo
          const pos = newRandomPos();
          const id = `${i}-${Date.now()}`;
          setActiveTap({ ...pos, id });

          // auto-hide se não tocar
          setTimeout(() => {
            setActiveTap((cur) => (cur?.id === id ? null : cur));
          }, 1200);

          break;
        }
      }
    }, 120);

    return () => clearInterval(t);
  }, [schedule, spawnedSet, activeTap, onThirtyDone]);

  const timeLeft = WATCH_WINDOW_SEC - elapsed;

  async function handleTap() {
    setTapsDone((n) => n + 1);
    setActiveTap(null);

    // ping backend (não trava UX)
    try {
      if (sessionId) {
        await pingSession({ sessionId, event: "proof_ok", proofsDelta: 1 });
      }
    } catch {}
  }

  return (
    <>
      <div className="hud-timer">
        {timeLeft}s
      </div>

      {activeTap && (
        <div
          className="tap-float"
          style={{ left: `${activeTap.x}%`, top: `${activeTap.y}%` }}
          onClick={handleTap}
          title="Toque"
        >
          👆
        </div>
      )}

      {/* opcional: se quiser depuração (remova depois) */}
      {/* <div style={{ position:'absolute', bottom:10, left:10, zIndex:9, fontSize:12, opacity:.6 }}>
        taps: {tapsDone}/{TAP_SPAWNS}
      </div> */}
    </>
  );
}