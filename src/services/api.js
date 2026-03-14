import { BACKEND_BASE_URL } from "../config";

function joinUrl(base, path) {
  return `${String(base).replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
}

/* =========================
   FEED / SESSION
========================= */

export async function fetchFeed({ creator, tag, limit } = {}) {
  const url = new URL(joinUrl(BACKEND_BASE_URL, "/feed"));

  if (creator) url.searchParams.set("creator", creator);
  if (tag) url.searchParams.set("tag", tag);
  if (limit) url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error("feed_failed");
  return res.json();
}

export async function startSession(tgUserId) {
  const res = await fetch(joinUrl(BACKEND_BASE_URL, "/session/start"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tgUserId }),
  });

  if (!res.ok) throw new Error("session_start_failed");
  return res.json();
}

export async function pingSession(payload) {
  const res = await fetch(joinUrl(BACKEND_BASE_URL, "/session/ping"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("session_ping_failed");
  return res.json();
}

/* =========================
   CREATORS
========================= */

export async function createCreator(payload) {
  const res = await fetch(joinUrl(BACKEND_BASE_URL, "/creators"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("create_creator_failed");
  return res.json();
}

export async function listCreators() {
  const res = await fetch(joinUrl(BACKEND_BASE_URL, "/creators"), {
    method: "GET",
  });

  if (!res.ok) throw new Error("list_creators_failed");
  return res.json();
}

export async function getCreator(handle) {
  const res = await fetch(joinUrl(BACKEND_BASE_URL, `/creators/${handle}`), {
    method: "GET",
  });

  if (!res.ok) throw new Error("get_creator_failed");
  return res.json();
}

/* =========================
   UPLOADS / VIDEOS
========================= */

export async function signUpload(payload) {
  const res = await fetch(joinUrl(BACKEND_BASE_URL, "/uploads/sign"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("sign_upload_failed");
  return res.json();
}

export async function createVideo(payload) {
  const res = await fetch(joinUrl(BACKEND_BASE_URL, "/videos"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("create_video_failed");
  return res.json();
}

export async function uploadCreatorVideo(file, creatorHandle, title, tags = []) {
  const { uploadUrl, publicUrl } = await signUpload({
    creatorHandle,
    filename: file.name,
    contentType: file.type || "video/mp4",
  });

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "video/mp4",
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("upload_failed");
  }

  const { video } = await createVideo({
    creatorHandle,
    title,
    tags,
    url: publicUrl,
    durationSec: null,
  });

  return video;
}