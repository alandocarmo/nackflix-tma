import { useEffect, useState } from "react";
import { initTelegram } from "./core/telegram";
import Home from "./pages/Home";
import Watch from "./pages/Watch";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);

  // vídeo exemplo (trocar depois por lista)
  const VIDEO_ID = "u1deRi0_l9U";

  useEffect(() => {
    const data = initTelegram();
    if (data?.user) setUser(data.user);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, Arial" }}>
      {screen === "home" && (
        <div>
          <div style={{ padding: 16, fontSize: 12, opacity: 0.7 }}>
            {user ? `Telegram: ${user.first_name}` : "Telegram: (abrindo fora do app)"}
          </div>
          <Home onStart={() => setScreen("watch")} />
        </div>
      )}

      {screen === "watch" && (
        <Watch
          videoId={VIDEO_ID}
          onDone={() => {
            console.log("NackFlix: vídeo finalizado");
            setScreen("home");
          }}
        />
      )}
    </div>
  );
}