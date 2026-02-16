import EpochStatus from "../components/EpochStatus";
import VideoPlayer from "../components/VideoPlayer";
import InteractionOverlay from "../components/InteractionOverlay";
import GestureChallenge from "../components/GestureChallenge";

export default function Watch({ videoId, videoTitle, videoIndex, sessionId, onVideoEnd }) {
  const showGesture = videoIndex % 2 === 1;

  return (
    <div style={{ position: "relative", padding: 10 }}>
      <EpochStatus />
      <div style={{ fontSize: 12, opacity: 0.7, padding: "4px 10px" }}>
        Assistindo: {videoTitle}
      </div>

      <div style={{ borderRadius: 12, overflow: "hidden" }}>
        <VideoPlayer videoId={videoId} onVideoEnd={onVideoEnd} />
      </div>

      <InteractionOverlay sessionId={sessionId} />
      {showGesture && <GestureChallenge sessionId={sessionId} />}
    </div>
  );
}