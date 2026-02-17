import "../styles/shorts.css";
import VideoPlayer from "../components/VideoPlayer";
import WatchGate from "../components/WatchGate";

export default function Watch({ video, sessionId, onNext }) {
  const gateKey =
    video?.source?.type === "youtube"
      ? `yt:${video?.source?.id}`
      : `mp4:${video?.source?.url || "unknown"}`;

  return (
    <div className="shorts-root">
      <div className="shorts-container">
        {/* Topbar */}
        <div className="shorts-topbar">
          <div style={{ fontSize: 13, opacity: 0.9 }}>NackFlix</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            {video?.creator ? `@${video.creator}` : ""}
          </div>
        </div>

        {/* Player */}
        <div className="shorts-player">
          <VideoPlayer source={video?.source} />
        </div>

        {/* Right actions (placeholder) */}
        <div className="shorts-actions">
          <div className="action-btn" title="Curtir">
            ❤️
          </div>
          <div className="action-btn" title="Comentar">
            💬
          </div>
          <div className="action-btn" title="Compartilhar">
            ↗
          </div>
        </div>

        {/* Bottom info */}
        <div className="shorts-bottombar">
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {video?.title || "Vídeo"}
          </div>
          <div style={{ fontSize: 12, opacity: 0.78, marginTop: 4 }}>
            {Array.isArray(video?.tags) && video.tags.length
              ? `#${video.tags.join(" #")}`
              : ""}
          </div>
        </div>

        {/* Gate 30s + desafios (reinicia ao mudar o vídeo) */}
        <WatchGate
          key={gateKey}
          sessionId={sessionId}
          onGateComplete={onNext}
        />
      </div>
    </div>
  );
}