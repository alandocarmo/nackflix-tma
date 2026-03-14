export default function VideoPlayer({ source, videoRef, onPlay, onPause }) {
  if (!source) return null;

  if (source.type === "mp4") {
    return (
      <video
        ref={videoRef}
        className="shorts-iframe"
        src={source.url}
        autoPlay
        playsInline
        controls={false}
        muted={false}
        preload="auto"
        onPlay={onPlay}
        onPause={onPause}
      />
    );
  }

  if (source.type === "youtube") {
    const src =
      `https://www.youtube.com/embed/${source.id}` +
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

  return null;
}