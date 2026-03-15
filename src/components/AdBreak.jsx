import { useEffect, useState } from "react";

export default function AdBreak({
  durationSec = 10,
  onFinish,

  // ad config
  adType = "video", // "video" | "image"
  mediaUrl = "",
  title = "Anúncio patrocinado",
  subtitle = "Confira esta oferta",
  ctaLabel = "Entrar em contato",
  ctaUrl = "",
  sponsorLabel = "Publicidade",
}) {
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

  function handleCTA() {
    if (!ctaUrl) return;
    window.open(ctaUrl, "_blank", "noopener,noreferrer");
  }

  function handleMediaClick() {
    if (!ctaUrl) return;
    window.open(ctaUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="adbreak-root">
      <div className="adbreak-card">
        <div className="adbreak-badge">{sponsorLabel}</div>

        <div className="adbreak-media">
          {adType === "video" ? (
            <div
              className="adbreak-clickable"
              onClick={handleMediaClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleMediaClick();
              }}
            >
              <video
                className="adbreak-video"
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
              >
                <source src={mediaUrl} type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>
            </div>
          ) : (
            <div
              className="adbreak-clickable"
              onClick={handleMediaClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleMediaClick();
              }}
            >
              <img
                src={mediaUrl}
                alt={title}
                className="adbreak-image"
              />
            </div>
          )}
        </div>

        <div className="adbreak-info">
          <div className="adbreak-title">{title}</div>
          <div className="adbreak-subtitle">
            {subtitle}
          </div>

          <div className="adbreak-footer">
            <div className="adbreak-timer">
              Próximo vídeo em {timeLeft}s
            </div>

            <button
              className="adbreak-cta"
              onClick={handleCTA}
              disabled={!ctaUrl}
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
