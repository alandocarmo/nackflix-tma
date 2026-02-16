import { useMemo } from "react";
import TapDot from "./TapDot";
import HoldDot from "./HoldDot";
import SwipeToTarget from "./SwipeToTarget";
import TwoTapSequence from "./TwoTapSequence";
import MiniMath from "./MiniMath";

export default function ChallengeOverlay({ open, onSuccess, onClose }) {
  const Challenge = useMemo(() => {
    const list = [TapDot, HoldDot, SwipeToTarget, TwoTapSequence, MiniMath];
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }, [open]); // muda a cada abertura

  if (!open) return null;

  return (
    <div className="challenge-overlay">
      <div className="challenge-card">
        <Challenge onSuccess={onSuccess} onClose={onClose} />
      </div>
    </div>
  );
}