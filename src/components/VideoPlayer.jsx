export default function VideoPlayer({ source }) {
  if (!source) return null;

  // 1) YouTube embed (Shorts-like)
  if (source.type === "youtube") {
    const videoId = source.id;
    const src =
      `https://www.youtube.com/embed/${videoId}` +
      `?autoplay=1&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&mute=0`;

    return (
      <iframe
        className="shorts-iframe"
        src={src}
        title="NackFlix Player"
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // 2) MP4 (storage próprio no futuro)
  if (source.type === "mp4") {
    return (
      <video
        className="shorts-iframe"
        src={source.url}
        autoPlay
        playsInline
        controls={false}
        muted={false}
        preload="auto"
      />
    );
  }

  return null;
}