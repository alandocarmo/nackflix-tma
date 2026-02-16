import "../styles/shorts.css";
import VideoPlayer from "../components/VideoPlayer";
import WatchGate from "../components/WatchGate";

export default function Watch({ video, sessionId, onNext }) {
  return (
    <div className="shorts-root">
      <div className="shorts-container">
        {/* Topbar */}
        <div className="shorts-topbar">
          <div style={{ fontSize: 13, opacity: 0.9 }}>
            NackFlix
          </div>
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
          <div className="action-btn">❤️</div>
          <div className="action-btn">💬</div>
          <div className="action-btn">↗</div>
        </div>

        {/* Bottom info */}
        <div className="shorts-bottombar">
          <div style={{ fontSize: 14, fontWeight: 600 }}>{video?.title || "Vídeo"}</div>
          <div style={{ fontSize: 12, opacity: 0.78, marginTop: 4 }}>
            {video?.tags?.length ? `#${video.tags.join(" #")}` : ""}
          </div>
        </div>

        {/* Gate 30s + 5 desafios */}
        <WatchGate
          sessionId={sessionId}
          onGateComplete={onNext}
        />
      </div>
    </div>
  );
}