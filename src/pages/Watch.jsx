import { useMemo, useRef, useState } from "react";
import "../styles/shorts.css";
import VideoPlayer from "../components/VideoPlayer";
import WatchHUD from "../components/WatchHUD";
import { pingSession } from "../services/api";

export default function Watch({ video, sessionId, onNext }) {
  const swipeStartY = useRef(null);
  const draggingRef = useRef(false);

  const [dragY, setDragY] = useState(0);

  const videoKey = useMemo(() => {
    if (video?.source?.type === "youtube") return `yt:${video?.source?.id}`;
    return `mp4:${video?.source?.url || "unknown"}`;
  }, [video]);

  function onPointerDown(e) {
    draggingRef.current = true;
    swipeStartY.current = e.clientY ?? (e.touches?.[0]?.clientY);
    setDragY(0);
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return;
    const y = e.clientY ?? (e.touches?.[0]?.clientY);
    if (typeof y !== "number") return;

    const delta = y - swipeStartY.current; // negativo = swipe up
    // limita a arrastada
    const clamped = Math.max(-220, Math.min(220, delta));
    setDragY(clamped);
  }

  function onPointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    // swipe up para próximo
    if (dragY < -90) {
      setDragY(-220);
      // pequena animação e troca
      setTimeout(() => {
        setDragY(0);
        onNext?.();
      }, 120);
      return;
    }

    // volta ao lugar
    setDragY(0);
  }

  async function handleThirtyDone() {
    // não bloqueia: só reporta pro backend que "bateu 30s"
    try {
      if (sessionId) await pingSession({ sessionId, event: "watch_30s_complete", videoDelta: 1 });
    } catch {}
  }

  return (
    <div className="shorts-root">
      <div className="shorts-container">
        {/* Player */}
        <div className="shorts-player">
          <VideoPlayer source={video?.source} />
        </div>

        {/* Swipe layer + animação */}
        <div
          className="swipe-stage"
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
        >
          <div
            className="swipe-inner"
            style={{
              transform: `translateY(${dragY}px)`,
              transition: draggingRef.current ? "none" : "transform 140ms ease-out",
            }}
          />
        </div>

        {/* Ações lado direito (placeholder) */}
        <div className="shorts-actions">
          <div className="action-btn" title="Curtir">❤️</div>
          <div className="action-btn" title="Comentar">💬</div>
          <div className="action-btn" title="Compartilhar">↗</div>
        </div>

        {/* Bottom info */}
        <div className="shorts-bottombar">
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {video?.title || "Vídeo"}
          </div>
          <div style={{ fontSize: 12, opacity: 0.78, marginTop: 4 }}>
            {video?.creator ? `@${video.creator}` : ""}
            {Array.isArray(video?.tags) && video.tags.length ? ` • #${video.tags.join(" #")}` : ""}
          </div>
        </div>

        {/* HUD (timer + taps flutuantes) — reinicia por vídeo */}
        <WatchHUD
          key={videoKey}
          sessionId={sessionId}
          onThirtyDone={handleThirtyDone}
        />
      </div>
    </div>
  );
}