import { useEffect, useMemo, useState } from "react";
import { useEpochStore } from "../store/epochStore";

function formatMMSS(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function EpochStatus() {
  const { epochLengthSec, epochStartMs, epochId, proofsAccepted, syncEpochNow } = useEpochStore();
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      syncEpochNow();
      setNowMs(Date.now());
    }, 500);
    return () => clearInterval(t);
  }, [syncEpochNow]);

  const timeLeft = useMemo(() => {
    const elapsedSec = Math.floor((nowMs - epochStartMs) / 1000);
    const left = Math.max(0, epochLengthSec - elapsedSec);
    return left;
  }, [nowMs, epochStartMs, epochLengthSec]);

  return (
    <div style={{ padding: "10px", fontSize: "14px" }}>
      <div>⛏️ Mobile Verifier: ativo (no device)</div>
      <div>🧺 Epoch #{epochId} — termina em {formatMMSS(timeLeft)}</div>
      <div>✅ Provas aceitas neste epoch: {proofsAccepted}</div>
    </div>
  );
}