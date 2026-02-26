import { useMemo, useRef, useState } from "react";
import "../styles/shorts.css";
import VideoPlayer from "../components/VideoPlayer";
import WatchHUD from "../components/WatchHUD";
import { pingSession } from "../services/api";

function getClientY(e) {
  // React SyntheticEvent: touch e mouse
  if (e?.touches && e.touches.length) return e.touches[0].clientY;
  if (e?.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientY;
  if (typeof e?.clientY === "number") return e.clientY;
  return null;
}

export default function Watch({ video, sessionId, onNext, onPrev }) {
  const startYRef = useRef(null);
  const draggingRef = useRef(false);

  const [dragY, setDragY] = useState(0);

  const videoKey = useMemo(() => {
    if (video?.source?.type === "youtube") return `yt:${video?.source?.id}`;
    return `mp4:${video?.source?.url || "unknown"}`;
  }, [video]);

  function beginDrag(e) {
    const y = getClientY(e);
    if (y === null) return;
    draggingRef.current = true;
    startYRef.current = y;
    setDragY(0);
  }

  function moveDrag(e) {
    if (!draggingRef.current) return;

    const y = getClientY(e);
    if (y === null) return;

    const delta = y - startYRef.current; // negativo = swipe up, positivo = swipe down
    const clamped = Math.max(-260, Math.min(260, delta));
    setDragY(clamped);
  }

  function endDrag() {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    // thresholds (ajuste se quiser)
    const UP_THRESHOLD = -90;
    const DOWN_THRESHOLD = 90;

    if (dragY <= UP_THRESHOLD) {
      // swipe up -> next
      setDragY(-260);
      setTimeout(() => {
        setDragY(0);
        onNext?.();
      }, 140);
      return;
    }

    if (dragY >= DOWN_THRESHOLD) {
      // swipe down -> prev
      setDragY(260);
      setTimeout(() => {
        setDragY(0);
        onPrev?.();
      }, 140);
      return;
    }

    // volta ao centro
    setDragY(0);
  }

  async function handleThirtyDone() {
    // não bloqueia: só reporta pro backend que completou 30s
    try {
      if (sessionId) await pingSession({ sessionId, event: "watch_30s_complete", videoDelta: 1 });
    } catch {}
  }

  return (
    <div className="shorts-root">
      <div className="shorts-container">
        {/* Player fullscreen */}
        <div className="shorts-player">
          <VideoPlayer source={video?.source} />
        </div>

        {/* Swipe layer (captura gesto sem travar UI acima) */}
        <div
          className="swipe-stage"
          onTouchStart={beginDrag}
          onTouchMove={moveDrag}
          onTouchEnd={endDrag}
          onMouseDown={beginDrag}
          onMouseMove={moveDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          aria-hidden="true"
        >
          <div
            className="swipe-inner"
            style={{
              transform: `translateY(${dragY}px)`,
              transition: draggingRef.current ? "none" : "transform 140ms ease-out",
            }}
          />
        </div>

        {/* Actions direita (placeholder) */}
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

        {/* HUD: apenas timer + ícone flutuante (reinicia por vídeo) */}
        <WatchHUD
          key={videoKey}
          sessionId={sessionId}
          onThirtyDone={handleThirtyDone}
        />
      </div>
    </div>
  );
}