import { useEffect, useMemo, useState } from "react";
import { initTelegram } from "./core/telegram";
import Watch from "./pages/Watch";
import CreatorProfile from "./pages/CreatorProfile";
import AdBreak from "./components/AdBreak";
import { fetchFeed, startSession } from "./services/api";

export default function App() {
  const [mode, setMode] = useState("feed"); // "feed" | "creator" | "ad"
  const [creatorHandle, setCreatorHandle] = useState("alan");

  const [sessionId, setSessionId] = useState(null);
  const [feed, setFeed] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);

  const [completedVideos, setCompletedVideos] = useState(0);

  const currentVideo = useMemo(() => {
    if (!feed.length) return null;
    return feed[videoIndex % feed.length];
  }, [feed, videoIndex]);

  useEffect(() => {
    const tg = initTelegram();

    (async () => {
      const { videos } = await fetchFeed({ limit: 30 });
      setFeed(videos || []);

      const started = await startSession(tg?.user?.id || null);
      setSessionId(started.sessionId || null);
    })().catch((e) => console.error("boot_failed", e));
  }, []);

  function handleNextVideo() {
    const nextCompleted = completedVideos + 1;
    setCompletedVideos(nextCompleted);

    // a cada 10 vídeos completos, entra no ad break
    if (nextCompleted % 10 === 0) {
      setMode("ad");
      return;
    }

    setVideoIndex((v) => v + 1);
  }

  function handleAdFinished() {
    setVideoIndex((v) => v + 1);
    setMode("feed");
  }

  if (mode === "creator") {
    return <CreatorProfile handle={creatorHandle} />;
  }

  if (mode === "ad") {
    return <AdBreak durationSec={10} onFinish={handleAdFinished} />;
  }

  if (!currentVideo) {
    return <div style={{ padding: 16 }}>Carregando feed...</div>;
  }

  return (
    <>
      <button
        onClick={() => setMode("creator")}
        style={{ position: "absolute", zIndex: 20, top: 12, left: 12 }}
      >
        Criador
      </button>

      <Watch
        video={currentVideo}
        sessionId={sessionId}
        onNext={handleNextVideo}
        onPrev={() =>
          setVideoIndex((v) => (v - 1 + feed.length) % feed.length)
        }
      />
    </>
  );
}