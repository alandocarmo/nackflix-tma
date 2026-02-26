import { useEffect, useMemo, useState } from "react";
import { initTelegram } from "./core/telegram";
import Watch from "./pages/Watch";
import { fetchFeed, startSession } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const [feed, setFeed] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [bootError, setBootError] = useState(null);

  const currentVideo = useMemo(() => {
    if (!feed.length) return null;
    return feed[videoIndex % feed.length];
  }, [feed, videoIndex]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setBootError(null);

        // Telegram init (fora do Telegram pode vir null — ok)
        const tgData = initTelegram();
        if (alive && tgData?.user) setUser(tgData.user);

        // 1) carregar feed do backend
        const { videos } = await fetchFeed({ limit: 30 });
        if (!alive) return;

        const safeVideos = Array.isArray(videos) ? videos : [];
        setFeed(safeVideos);

        // 2) iniciar sessão (MVP)
        const started = await startSession(tgData?.user?.id || null);
        if (!alive) return;
        setSessionId(started.sessionId || null);

        setLoading(false);
      } catch (e) {
        console.error("boot_failed", e);
        if (!alive) return;
        setBootError(e?.message || "boot_failed");
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // UI de loading
  if (loading) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
        Carregando NackFlix...
      </div>
    );
  }

  // UI de erro
  if (bootError) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
        <div style={{ marginBottom: 8 }}>Falha ao iniciar.</div>
        <div style={{ opacity: 0.7, fontSize: 13 }}>
          {String(bootError)}
        </div>
        <div style={{ marginTop: 12, fontSize: 13, opacity: 0.7 }}>
          Dica: confirme se o backend está online e se o CORS_ORIGIN no Render é exatamente o domínio do Vercel (sem barra final).
        </div>
      </div>
    );
  }

  // Sem vídeos
  if (!currentVideo) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
        Nenhum vídeo disponível no feed.
      </div>
    );
  }

  return (
    <Watch
      video={currentVideo}
      sessionId={sessionId}
      onNext={() => setVideoIndex((v) => v + 1)}
      onPrev={() => setVideoIndex((v) => (v - 1 + feed.length) % feed.length)}
    />
  );
}