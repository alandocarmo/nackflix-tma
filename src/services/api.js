import { BACKEND_BASE_URL } from "../config";

function joinUrl(base, path) {
  return `${String(base).replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
}

export async function fetchFeed({ creator, tag, limit } = {}) {
  const url = new URL(joinUrl(BACKEND_BASE_URL, "/feed"));
  if (creator) url.searchParams.set("creator", creator);
  if (tag) url.searchParams.set("tag", tag);
  if (limit) url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error("feed_failed");
  return res.json();
}