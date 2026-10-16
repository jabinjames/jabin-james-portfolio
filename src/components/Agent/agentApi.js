/**
 * AGENT data layer. The browser only ever talks to our own /api/chat route.
 * No provider URL, model name or key exists in frontend code.
 *
 *   request : { messages: [{ role: 'user' | 'assistant', content: string }] }
 *   response: { reply: string }  |  { error: { code, message } }
 */

const ENDPOINT = '/api/chat';
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_HISTORY = 10;
const MAX_CHARS = 1000;

export const FALLBACK_ERROR_TEXT =
  "I'm having trouble connecting right now. Please try again in a moment.";
const RATE_LIMIT_TEXT = 'You are sending messages quickly. Please wait a moment and try again.';

export class AgentError extends Error {
  constructor(userMessage, { status = 0, code = 'UNKNOWN' } = {}) {
    super(code);
    this.name = 'AgentError';
    this.userMessage = userMessage;
    this.status = status;
    this.code = code;
  }
}

/** Bounded history: drop error bubbles, keep the last N turns, clip each message. */
function toPayload(messages) {
  return messages
    .filter((m) => !m.error && typeof m.text === 'string' && m.text.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text.trim().slice(0, MAX_CHARS),
    }));
}

export async function requestAgentReply(messages, { signal } = {}) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const onOuterAbort = () => controller.abort();
  signal?.addEventListener('abort', onOuterAbort);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ messages: toPayload(messages) }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON body: handled below */
    }

    if (!res.ok) {
      throw new AgentError(res.status === 429 ? RATE_LIMIT_TEXT : FALLBACK_ERROR_TEXT, {
        status: res.status,
        code: data?.error?.code,
      });
    }
    if (typeof data?.reply !== 'string' || !data.reply.trim()) {
      throw new AgentError(FALLBACK_ERROR_TEXT, { status: res.status, code: 'BAD_RESPONSE' });
    }
    return { text: data.reply };
  } catch (err) {
    if (err instanceof AgentError) throw err;
    if (err?.name === 'AbortError' && !timedOut) throw err; // cancelled by the component
    throw new AgentError(FALLBACK_ERROR_TEXT, { code: timedOut ? 'TIMEOUT' : 'NETWORK' });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onOuterAbort);
  }
}
