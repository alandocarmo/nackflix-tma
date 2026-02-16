import { BACKEND_BASE_URL } from "../config";

export async function fetchFeed({ creator, tag, limit } = {}) {
  const url = new URL(`${BACKEND_BASE_URL}/feed`);
  if (creator) url.searchParams.set("creator", creator);
  if (tag) url.searchParams.set("tag", tag);
  if (limit) url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error("feed_failed");
  return res.json();
}

export async function startSession(tgUserId) {
  const res = await fetch(`${BACKEND_BASE_URL}/session/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tgUserId })
  });
  if (!res.ok) throw new Error("session_start_failed");
  return res.json();
}

export async function pingSession({ sessionId, event, proofsDelta = 0, videoDelta = 0 }) {
  const res = await fetch(`${BACKEND_BASE_URL}/session/ping`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, event, proofsDelta, videoDelta })
  });
  if (!res.ok) throw new Error("session_ping_failed");
  return res.json();
}