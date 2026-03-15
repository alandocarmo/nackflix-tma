const PLAN_WEIGHT = {
  daily: 1,
  weekly: 2,
  monthly: 3,
};

function isActiveNow(ad, now) {
  const startOk = !ad.startsAt || new Date(ad.startsAt) <= now;
  const endOk = !ad.endsAt || new Date(ad.endsAt) >= now;
  return startOk && endOk;
}

function matchesLocation(ad, viewerLocation) {
  if (!Array.isArray(ad.locations) || ad.locations.length === 0) return true;
  if (ad.locations.includes("global")) return true;
  return ad.locations.includes(String(viewerLocation || "").toLowerCase());
}

export function pickAdForBreak({ ads = [], viewerLocation = "global", now = new Date() }) {
  const eligible = ads.filter(
    (ad) =>
      ad.enabled !== false &&
      isActiveNow(ad, now) &&
      matchesLocation(ad, viewerLocation)
  );

  if (!eligible.length) return null;

  const sorted = [...eligible].sort((a, b) => {
    const planDiff = (PLAN_WEIGHT[b.plan] || 0) - (PLAN_WEIGHT[a.plan] || 0);
    if (planDiff !== 0) return planDiff;

    const aLast = a.lastShownAt ? new Date(a.lastShownAt).getTime() : 0;
    const bLast = b.lastShownAt ? new Date(b.lastShownAt).getTime() : 0;

    return aLast - bLast;
  });

  return sorted[0];
}
