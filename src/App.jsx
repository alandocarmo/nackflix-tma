import { useEffect, useState } from "react";
import { initTelegram } from "./core/telegram";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import { fetchFeed, startSession, pingSession } from "./services/api";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);

  const [sessionId, setSessionId] = useState(null);

  const [feed, setFeed] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);

  const currentVideo = feed.length ? feed[videoIndex % feed.length] : null;

  useEffect(() => {
    const data = initTelegram();
    if (data?.user) setUser(data.user);

    (async () => {
      // 1) carregar feed
      const { videos } = await fetchFeed({ limit: 20 });
      setFeed(videos || []);

      // 2) iniciar sessão (MVP)
      const started = await startSession(data?.user?.id || null);
      setSessionId(started.sessionId);
    })().catch((e) => console.error("boot_failed", e));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, Arial" }}>
      {screen === "home" && (
        <div>
          <div style={{ padding: 16, fontSize: 12, opacity: 0.7 }}>
            {user ? `Telegram: ${user.first_name}` : "Telegram: (abrindo fora do app)"}
            <br />
            {sessionId ? `Sessão: ${sessionId}` : "Sessão: carregando..."}
          </div>

          <Home
            onStart={() => setScreen("watch")}
          />
        </div>
      )}

      {screen === "watch" && currentVideo && (
        <Watch
          videoId={currentVideo.id}
          videoTitle={currentVideo.title}
          videoIndex={videoIndex}
          sessionId={sessionId}
          onVideoEnd={async () => {
            try {
              if (sessionId) await pingSession({ sessionId, event: "video_end", videoDelta: 1 });
            } catch {}
            setVideoIndex((v) => v + 1);
            setScreen("home");
          }}
        />
      )}

      {screen === "watch" && !currentVideo && (
        <div style={{ padding: 16 }}>Carregando feed...</div>
      )}
    </div>
  );
}