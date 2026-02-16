import { useEffect, useMemo, useRef, useState } from "react";
import { WATCH_WINDOW_SEC, CHALLENGE_COUNT, buildSchedule } from "../engine/watchGateEngine";
import ChallengeOverlay from "./challenges/ChallengeOverlay";
import { pingSession } from "../services/api";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function WatchGate({ sessionId, onGateComplete }) {
  const [elapsed, setElapsed] = useState(0);
  const [passed, setPassed] = useState(0);
  const [schedule] = useState(() => buildSchedule());
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(null);
  const [challengeDoneSet, setChallengeDoneSet] = useState(() => new Set());

  const runningRef = useRef(true);
  const startRef = useRef(Date.now());
  const pausedAccumRef = useRef(0);
  const pauseStartRef = useRef(null);

  // pausa timer quando aba não está visível (evita completar 30s “em background”)
  useEffect(() => {
    function onVis() {
      if (document.hidden) {
        runningRef.current = false;
        pauseStartRef.current = Date.now();
      } else {
        runningRef.current = true;
        if (pauseStartRef.current) {
          pausedAccumRef.current += Date.now() - pauseStartRef.current;
          pauseStartRef.current = null;
        }
      }
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // ticker 200ms
  useEffect(() => {
    const t = setInterval(() => {
      if (!runningRef.current) return;

      const now = Date.now();
      const effectiveElapsedMs = now - startRef.current - pausedAccumRef.current;
      const sec = clamp(Math.floor(effectiveElapsedMs / 1000), 0, WATCH_WINDOW_SEC);
      setElapsed(sec);

      // ativa desafios conforme schedule
      for (let i = 0; i < schedule.length; i++) {
        if (sec >= schedule[i] && !challengeDoneSet.has(i) && activeChallengeIndex === null) {
          setActiveChallengeIndex(i);
          break;
        }
      }
    }, 200);

    return () => clearInterval(t);
  }, [schedule, challengeDoneSet, activeChallengeIndex]);

  const timeLeft = WATCH_WINDOW_SEC - elapsed;

  const progressPct = useMemo(() => {
    return (elapsed / WATCH_WINDOW_SEC) * 100;
  }, [elapsed]);

  const ready = elapsed >= WATCH_WINDOW_SEC && passed >= CHALLENGE_COUNT;

  async function markChallengePassed() {
    // marca o desafio atual como concluído
    setChallengeDoneSet((prev) => {
      const n = new Set(prev);
      n.add(activeChallengeIndex);
      return n;
    });

    setPassed((p) => p + 1);
    setActiveChallengeIndex(null);

    // ping backend (não trava UX)
    try {
      if (sessionId) await pingSession({ sessionId, event: "proof_ok", proofsDelta: 1 });
    } catch {}
  }

  async function completeGate() {
    // ping de conclusão de 30s
    try {
      if (sessionId) await pingSession({ sessionId, event: "watch_30s_complete", videoDelta: 1 });
    } catch {}
    onGateComplete?.();
  }

  return (
    <>
      <div className="gate-card">
        <div className="gate-title">
          ⏱️ {timeLeft}s • ✅ Desafios: {passed}/{CHALLENGE_COUNT}
        </div>

        <div className="gate-row" style={{ marginBottom: 10 }}>
          <div className="progress" style={{ flex: 1 }}>
            <div style={{ width: `${progressPct}%` }} />
          </div>
          <button className="next-btn" disabled={!ready} onClick={completeGate}>
            Próximo ▶
          </button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Você libera o próximo vídeo após <b>30s</b> + <b>5 desafios</b>.
        </div>
      </div>

      <ChallengeOverlay
        open={activeChallengeIndex !== null}
        onSuccess={markChallengePassed}
        onClose={() => setActiveChallengeIndex(null)}
      />
    </>
  );
}