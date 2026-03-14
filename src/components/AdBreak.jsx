import { useEffect, useState } from "react";

export default function AdBreak({ durationSec = 10, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(durationSec);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [durationSec, onFinish]);

  return (
    <div className="adbreak-root">
      <div className="adbreak-card">
        <div className="adbreak-badge">Publicidade</div>

        <div className="adbreak-media">
          <div className="adbreak-placeholder">
            Espaço reservado para anúncio
          </div>
        </div>

        <div className="adbreak-info">
          <div className="adbreak-title">Anúncio patrocinado</div>
          <div className="adbreak-subtitle">
            Próximo vídeo em {timeLeft}s
          </div>
        </div>
      </div>
    </div>
  );
}