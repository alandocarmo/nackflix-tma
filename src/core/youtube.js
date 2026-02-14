let player;

export function loadYouTubeAPI(callback) {
  if (window.YT) return callback();

  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);

  window.onYouTubeIframeAPIReady = callback;
}

export function createPlayer(videoId, onStateChange) {
  player = new window.YT.Player('youtube-player', {
    videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1
    },
    events: {
      onStateChange
    }
  });
}

export function getPlayer() {
  return player;
}