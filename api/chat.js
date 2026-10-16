// Vercel serverless function: POST /api/chat
// Plain Node handler (no Next.js). Requires "type": "module" in package.json (Vite default).

import * as resume from '../src/data/resume.js';
import { validateMessages, LIMITS } from './_lib/validate.js';
import { checkRateLimit, getClientIp } from './_lib/rateLimit.js';
import { buildSystemPrompt } from './_lib/prompt.js';

export const config = { maxDuration: 30 };

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

const ERRORS = {
  METHOD_NOT_ALLOWED: [405, 'Use POST.'],
  FORBIDDEN_ORIGIN: [403, 'Request not allowed.'],
  UNSUPPORTED_MEDIA: [415, 'Content-Type must be application/json.'],
  PAYLOAD_TOO_LARGE: [413, 'Request is too large.'],
  INVALID_REQUEST: [400, 'Invalid request.'],
  RATE_LIMITED: [429, 'Too many requests. Please wait a moment and try again.'],
  NOT_CONFIGURED: [500, 'AGENT is not configured.'],
  UPSTREAM_BUSY: [429, 'AGENT is busy. Please try again shortly.'],
  MODEL_UNAVAILABLE: [503, 'AGENT is temporarily unavailable.'],
  UPSTREAM_ERROR: [502, 'AGENT could not generate a response.'],
  EMPTY_RESPONSE: [502, 'AGENT returned an empty response.'],
  TIMEOUT: [504, 'AGENT took too long to respond.'],
  INTERNAL: [500, 'Something went wrong.'],
};

function respond(res, code, extra = {}, headers = {}) {
  const [status, message] = ERRORS[code];
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  // Only fixed, generic strings are ever returned. Provider text is never forwarded.
  return res.status(status).json({ error: { code, message: extra.message || message } });
}

const num = (v, fallback, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // non-browser client; this check only stops other websites' browsers
  let host;
  try { host = new URL(origin).host; } catch { return false; }
  if (host === req.headers.host) return true;
  const extra = (process.env.AGENT_ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return extra.includes(origin);
}

async function readBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') return JSON.parse(req.body);
    return req.body;
  }
  let size = 0;
  const chunks = [];
  for await (const c of req) {
    size += c.length;
    if (size > LIMITS.maxBodyBytes) throw Object.assign(new Error('too large'), { tooLarge: true });
    chunks.push(c);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function cleanReply(content) {
  return String(content)
    .replace(/<think>[\s\S]*?<\/think>/gi, '') // never surface reasoning blocks
    .replace(/<think>[\s\S]*$/i, '')
    .trim()
    .slice(0, 4000);
}

let cachedPrompt;
const systemPrompt = () =>
  `${(cachedPrompt ??= buildSystemPrompt(resume.DATA ?? resume.default))}\n\nToday's date: ${new Date().toISOString().slice(0, 10)}.`;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  try {
    if (req.method !== 'POST') return respond(res, 'METHOD_NOT_ALLOWED', {}, { Allow: 'POST' });
    if (!originAllowed(req)) return respond(res, 'FORBIDDEN_ORIGIN');
    if (!String(req.headers['content-type'] || '').toLowerCase().includes('application/json')) {
      return respond(res, 'UNSUPPORTED_MEDIA');
    }
    if (Number(req.headers['content-length'] || 0) > LIMITS.maxBodyBytes) return respond(res, 'PAYLOAD_TOO_LARGE');

    const limit = checkRateLimit(getClientIp(req), {
      perMinute: num(process.env.AGENT_RATE_PER_MINUTE, 8, 1, 120),
      perHour: num(process.env.AGENT_RATE_PER_HOUR, 40, 1, 2000),
    });
    if (!limit.allowed) return respond(res, 'RATE_LIMITED', {}, { 'Retry-After': String(limit.retryAfter) });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('[agent] NOT_CONFIGURED: OPENROUTER_API_KEY is not set');
      return respond(res, 'NOT_CONFIGURED');
    }

    let body;
    try {
      body = await readBody(req);
    } catch (e) {
      return respond(res, e?.tooLarge ? 'PAYLOAD_TOO_LARGE' : 'INVALID_REQUEST', { message: 'Body must be valid JSON.' });
    }
    if (JSON.stringify(body ?? null).length > LIMITS.maxBodyBytes) return respond(res, 'PAYLOAD_TOO_LARGE');

    const v = validateMessages(body);
    if (!v.ok) return respond(res, 'INVALID_REQUEST', { message: v.message });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), num(process.env.AGENT_TIMEOUT_MS, 25_000, 1, 28_000));

    let upstream;
    try {
      upstream = await fetch(ENDPOINT, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'Jabin James Portfolio AGENT',
          ...(process.env.SITE_URL ? { 'HTTP-Referer': process.env.SITE_URL } : {}),
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'qwen/qwen3-32b',
          messages: [{ role: 'system', content: systemPrompt() }, ...v.messages],
          max_tokens: num(process.env.AGENT_MAX_TOKENS, 800, 64, 2000),
          temperature: num(process.env.AGENT_TEMPERATURE, 0.3, 0, 1.5),
          stream: false,
          reasoning: { exclude: true },
        }),
      });
    } catch (e) {
      if (e?.name === 'AbortError') {
        console.error('[agent] TIMEOUT');
        return respond(res, 'TIMEOUT');
      }
      console.error('[agent] network error reaching provider');
      return respond(res, 'UPSTREAM_ERROR');
    } finally {
      clearTimeout(timer);
    }

    if (!upstream.ok) {
      const s = upstream.status;
      console.error(`[agent] provider status ${s}`); // status only, never bodies
      if (s === 429) return respond(res, 'UPSTREAM_BUSY');
      if (s === 401 || s === 402 || s === 403) return respond(res, 'NOT_CONFIGURED');
      if (s === 400 || s === 404) return respond(res, 'MODEL_UNAVAILABLE');
      return respond(res, 'UPSTREAM_ERROR');
    }

    let data;
    try { data = await upstream.json(); } catch { return respond(res, 'UPSTREAM_ERROR'); }

    const content = data?.choices?.[0]?.message?.content;
    const reply = typeof content === 'string' ? cleanReply(content) : '';
    if (!reply) {
      console.error(`[agent] EMPTY_RESPONSE finish_reason=${data?.choices?.[0]?.finish_reason}`);
      return respond(res, 'EMPTY_RESPONSE');
    }
    return res.status(200).json({ reply });
  } catch {
    console.error('[agent] unexpected error');
    return respond(res, 'INTERNAL');
  }
}