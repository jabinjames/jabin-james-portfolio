// Best-effort, per-instance rate limiting.
//
// IMPORTANT: this state lives in the memory of one serverless instance. Vercel can run
// many instances and recycles them, so this is NOT a strict global limit. It only slows
// casual abuse. For a real limit use Vercel Firewall rate limiting or a shared store
// (Upstash Redis / Vercel KV) and keep this as a first line of defence.

const hits = new Map(); // ip -> timestamps (ms)
const MINUTE = 60_000;
const HOUR = 3_600_000;

export function getClientIp(req) {
  const h = req.headers || {};
  const raw = h['x-vercel-forwarded-for'] || h['x-forwarded-for'] || h['x-real-ip'] || '';
  const first = String(raw).split(',')[0].trim();
  return first || req.socket?.remoteAddress || 'unknown';
}

export function checkRateLimit(ip, { perMinute = 8, perHour = 40, now = Date.now() } = {}) {
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > HOUR) hits.delete(k);
  }
  const stamps = (hits.get(ip) || []).filter((t) => now - t < HOUR);
  const lastMinute = stamps.filter((t) => now - t < MINUTE);

  if (lastMinute.length >= perMinute) {
    hits.set(ip, stamps);
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((MINUTE - (now - lastMinute[0])) / 1000)) };
  }
  if (stamps.length >= perHour) {
    hits.set(ip, stamps);
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((HOUR - (now - stamps[0])) / 1000)) };
  }
  stamps.push(now);
  hits.set(ip, stamps);
  return { allowed: true, retryAfter: 0 };
}

export function __resetRateLimit() {
  hits.clear();
}