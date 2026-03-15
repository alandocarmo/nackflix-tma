import { useEffect, useMemo, useState } from "react";
import { initTelegram } from "./core/telegram";
import Watch from "./pages/Watch";
import CreatorProfile from "./pages/CreatorProfile";
import AdvertiserPage from "./pages/AdvertiserPage";
import AdBreak from "./components/AdBreak";
import { fetchFeed, startSession, listAds } from "./services/api";
import { pickAdForBreak } from "./utils/adQueue";

export default function App() {
  const [mode, setMode] = useState("feed"); // feed | creator | advertiser | ad
  const [creatorHandle, setCreatorHandle] = useState("alan");

  const [sessionId, setSessionId] = useState(null);
  const [feed, setFeed] = useState([]);
  const [ads, setAds] = useState([]);

  const [videoIndex, setVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState(0);

  const [selectedAd, setSelectedAd] = useState(null);

  // localização do usuário / sessão
  // por enquanto você pode deixar manual; depois dá para puxar de perfil/geo/IP/backend
  const [viewerLocation, setViewerLocation] = useState("global");

  const currentVideo = useMemo(() => {
    if (!feed.length) return null;
    return feed[videoIndex % feed.length];
  }, [feed, videoIndex]);

  useEffect(() => {
    const tg = initTelegram();

    (async () => {
      const [{ videos }, started, adData] = await Promise.all([
        fetchFeed({ limit: 30 }),
        startSession(tg?.user?.id || null),
        listAds(),
      ]);

      setFeed(videos || []);
      setSessionId(started.sessionId || null);
      setAds(adData?.ads || []);
    })().catch((e) => console.error("boot_failed", e));
  }, []);

  function goToNextVideo() {
    setVideoIndex((prev) => prev + 1);
  }

  function goToPrevVideo() {
    setVideoIndex((prev) => {
      if (!feed.length) return 0;
      return (prev - 1 + feed.length) % feed.length;
    });
  }

  function handleNextVideo() {
    const nextCompleted = completedVideos + 1;
    setCompletedVideos(nextCompleted);

    // a cada 10 vídeos completos, entra ad break
    if (nextCompleted % 10 === 0) {
      const chosenAd = pickAdForBreak({
        ads,
        viewerLocation,
        now: new Date(),
      });

      if (chosenAd) {
        setSelectedAd(chosenAd);
        setMode("ad");
        return;
      }
    }

    goToNextVideo();
  }

  function handleAdFinished() {
    setSelectedAd(null);
    setMode("feed");
    goToNextVideo();
  }

  async function refreshAds() {
    try {
      const adData = await listAds();
      setAds(adData?.ads || []);
    } catch (e) {
      console.error("refresh_ads_failed", e);
    }
  }

  if (mode === "creator") {
    return <CreatorProfile handle={creatorHandle} />;
  }

  if (mode === "advertiser") {
    return (
      <AdvertiserPage
        onBack={() => setMode("feed")}
        onCreated={refreshAds}
      />
    );
  }

  if (mode === "ad" && selectedAd) {
    return (
      <AdBreak
        durationSec={10}
        onFinish={handleAdFinished}
        adType={selectedAd.adType}
        mediaUrl={selectedAd.mediaUrl}
        title={selectedAd.title}
        subtitle={selectedAd.subtitle}
        ctaLabel={selectedAd.ctaLabel}
        ctaUrl={selectedAd.ctaUrl}
        sponsorLabel={`Publicidade • ${selectedAd.plan}`}
      />
    );
  }

  if (!currentVideo) {
    return <div style={{ padding: 16 }}>Carregando feed...</div>;
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 20,
          top: 12,
          left: 12,
          display: "flex",
          gap: 8,
        }}
      >
        <button onClick={() => setMode("creator")}>Criador</button>
        <button onClick={() => setMode("advertiser")}>Anunciante</button>
      </div>

      <div
        style={{
          position: "absolute",
          zIndex: 20,
          top: 12,
          right: 12,
          background: "rgba(0,0,0,0.45)",
          color: "#fff",
          padding: "6px 8px",
          borderRadius: 10,
          fontSize: 12,
        }}
      >
        Região: {viewerLocation}
      </div>

      <Watch
        video={currentVideo}
        sessionId={sessionId}
        onNext={handleNextVideo}
        onPrev={goToPrevVideo}
      />
    </>
  );
}
