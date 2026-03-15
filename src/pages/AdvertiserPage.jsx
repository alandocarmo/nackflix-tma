import { useState } from "react";
import { createAd } from "../services/api";

export default function AdvertiserPage({ onBack, onCreated }) {
  const [form, setForm] = useState({
    advertiserName: "",
    title: "",
    subtitle: "",
    adType: "video", // video | image
    mediaUrl: "",
    ctaLabel: "Entrar em contato",
    ctaUrl: "",
    plan: "daily", // daily | weekly | monthly
    locations: "global",
    startsAt: "",
    endsAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const payload = {
        advertiserName: form.advertiserName.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        adType: form.adType,
        mediaUrl: form.mediaUrl.trim(),
        ctaLabel: form.ctaLabel.trim(),
        ctaUrl: form.ctaUrl.trim(),
        plan: form.plan,
        locations: form.locations
          .split(",")
          .map((x) => x.trim().toLowerCase())
          .filter(Boolean),
        startsAt: form.startsAt,
        endsAt: form.endsAt,
      };

      await createAd(payload);
      setMsg("Campanha criada com sucesso.");
      onCreated?.();

      setForm({
        advertiserName: "",
        title: "",
        subtitle: "",
        adType: "video",
        mediaUrl: "",
        ctaLabel: "Entrar em contato",
        ctaUrl: "",
        plan: "daily",
        locations: "global",
        startsAt: "",
        endsAt: "",
      });
    } catch (e2) {
      console.error(e2);
      setMsg("Falha ao criar campanha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Painel do Anunciante</h2>
        <button onClick={onBack}>Voltar</button>
      </div>

      <p style={{ opacity: 0.75 }}>
        Crie campanhas diárias, semanais ou mensais e escolha as localizações onde elas devem aparecer.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Nome do anunciante"
          value={form.advertiserName}
          onChange={(e) => updateField("advertiserName", e.target.value)}
        />

        <input
          placeholder="Título do anúncio"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        <input
          placeholder="Subtítulo"
          value={form.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
        />

        <select
          value={form.adType}
          onChange={(e) => updateField("adType", e.target.value)}
        >
          <option value="video">Vídeo</option>
          <option value="image">Imagem</option>
        </select>

        <input
          placeholder="URL da mídia (mp4 ou imagem)"
          value={form.mediaUrl}
          onChange={(e) => updateField("mediaUrl", e.target.value)}
        />

        <input
          placeholder="Texto do botão CTA"
          value={form.ctaLabel}
          onChange={(e) => updateField("ctaLabel", e.target.value)}
        />

        <input
          placeholder="URL do contato / CTA"
          value={form.ctaUrl}
          onChange={(e) => updateField("ctaUrl", e.target.value)}
        />

        <select
          value={form.plan}
          onChange={(e) => updateField("plan", e.target.value)}
        >
          <option value="daily">Plano diário</option>
          <option value="weekly">Plano semanal</option>
          <option value="monthly">Plano mensal</option>
        </select>

        <input
          placeholder="Localizações separadas por vírgula (ex: global, brazil, sao-paulo)"
          value={form.locations}
          onChange={(e) => updateField("locations", e.target.value)}
        />

        <label>
          Início:
          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => updateField("startsAt", e.target.value)}
          />
        </label>

        <label>
          Fim:
          <input
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => updateField("endsAt", e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Criar campanha"}
        </button>
      </form>

      {msg ? (
        <div style={{ marginTop: 12, opacity: 0.85 }}>
          {msg}
        </div>
      ) : null}
    </div>
  );
}
