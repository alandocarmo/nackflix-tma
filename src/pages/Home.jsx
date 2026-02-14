export default function Home({ onStart }) {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: 0 }}>NackFlix</h2>
      <p style={{ marginTop: 6 }}>
        Assista vídeos + micro interações humanas para ativar o Mobile Verifier.
      </p>

      <button
        onClick={onStart}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #ccc",
          cursor: "pointer"
        }}
      >
        Começar ▶️
      </button>
    </div>
  );
}