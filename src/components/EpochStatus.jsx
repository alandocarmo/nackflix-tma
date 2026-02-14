import { useEffect, useState } from "react";

export default function EpochStatus() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 min “visual”

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "10px", fontSize: "14px" }}>
      ⛏️ Mobile Verifier: ativo (no device) <br />
      ⏱️ Próxima recompensa (epoch): {timeLeft}s
    </div>
  );
}