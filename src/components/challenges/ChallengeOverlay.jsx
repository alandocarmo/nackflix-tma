import TapTarget from "./TapTarget";

export default function ChallengeOverlay({ open, onSuccess, onClose }) {
  if (!open) return null;

  return (
    <div className="challenge-overlay">
      <div className="challenge-card">
        <TapTarget onSuccess={onSuccess} onClose={onClose} />
      </div>
    </div>
  );
}