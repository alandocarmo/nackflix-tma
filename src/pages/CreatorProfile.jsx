import { useEffect, useState } from "react";
import { getCreator } from "../services/api";
import UploadVideo from "./UploadVideo";

export default function CreatorProfile({ handle }) {
  const [creator, setCreator] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getCreator(handle);
      setCreator(data.creator || null);
      setVideos(data.videos || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [handle]);

  if (loading) {
    return <div style={{ padding: 16 }}>Carregando criador...</div>;
  }

  if (!creator) {
    return <div style={{ padding: 16 }}>Criador não encontrado.</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>{creator.name}</h2>
        <div style={{ opacity: 0.7 }}>@{creator.handle}</div>
        <p>{creator.bio}</p>
      </div>

      <UploadVideo
        creatorHandle={creator.handle}
        onUploaded={(video) => setVideos((prev) => [video, ...prev])}
      />

      <h3 style={{ marginTop: 24 }}>Vídeos</h3>

      <div style={{ display: "grid", gap: 12 }}>
        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ fontWeight: 600 }}>{video.title}</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
              {Array.isArray(video.tags) ? `#${video.tags.join(" #")}` : ""}
            </div>
            <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>
              {video.source?.url}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}