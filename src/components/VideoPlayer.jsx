import { useEffect } from "react";
import { loadYouTubeAPI, createPlayer } from "../core/youtube";

export default function VideoPlayer({ videoId, onVideoEnd }) {
  useEffect(() => {
    loadYouTubeAPI(() => {
      createPlayer(videoId, (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
          onVideoEnd();
        }
      });
    });
  }, []);

  return <div id="youtube-player" />;
}