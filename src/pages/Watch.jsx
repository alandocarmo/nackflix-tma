import EpochStatus from "../components/EpochStatus";
import VideoPlayer from "../components/VideoPlayer";
import InteractionOverlay from "../components/InteractionOverlay";

export default function Watch({ videoId, onDone }) {
  return (
    <div style={{ position: "relative", padding: 10 }}>
      <EpochStatus />

      <div style={{ borderRadius: 12, overflow: "hidden" }}>
        <VideoPlayer videoId={videoId} onVideoEnd={onDone} />
      </div>

      <InteractionOverlay />
    </div>
  );
}