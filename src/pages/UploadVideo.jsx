import { useState } from "react";
import { uploadCreatorVideo } from "../services/api";

export default function UploadVideo({ creatorHandle, onUploaded }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Selecione um vídeo.");
      return;
    }

    try {
      setLoading(true);

      const video = await uploadCreatorVideo(
        file,
        creatorHandle,
        title.trim(),
        tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      );

      setTitle("");
      setTags("");
      setFile(null);
      onUploaded?.(video);
    } catch (err) {
      setError("Falha no upload.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 16 }}>
      <h3>Enviar vídeo</h3>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 10 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Tags separadas por vírgula"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 10 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          type="file"
          accept="video/mp4,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {error ? (
        <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
      ) : null}

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar vídeo"}
      </button>
    </form>
  );
}