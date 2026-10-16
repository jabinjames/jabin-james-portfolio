// Request validation for /api/chat. Pure functions, no I/O.

export const LIMITS = {
  maxBodyBytes: 20_000,   // raw request body
  maxEntries: 50,         // reject absurd payloads outright
  maxMessages: 10,        // history actually forwarded to the model
  maxChars: 1000,         // per message
  maxTotalChars: 6000,    // across forwarded history
};

const ROLES = new Set(['user', 'assistant']);
// strip control characters except tab and newline
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const fail = (message) => ({ ok: false, code: 'INVALID_REQUEST', message });

export function validateMessages(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('Body must be a JSON object.');
  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) return fail('messages must be a non-empty array.');
  if (messages.length > LIMITS.maxEntries) return fail('Too many messages.');

  const clean = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object') return fail('Each message must be an object.');
    if (!ROLES.has(m.role)) return fail('Invalid message role.');
    if (typeof m.content !== 'string') return fail('Message content must be a string.');
    const content = m.content.replace(CONTROL, '').trim();
    if (!content) return fail('Message content cannot be empty.');
    if (content.length > LIMITS.maxChars) return fail(`Message exceeds ${LIMITS.maxChars} characters.`);
    clean.push({ role: m.role, content }); // only role + content ever leave this function
  }

  let history = clean.slice(-LIMITS.maxMessages);
  while (history.length && history[0].role !== 'user') history = history.slice(1);

  if (!history.length || history[history.length - 1].role !== 'user') {
    return fail('The last message must come from the user.');
  }
  const total = history.reduce((n, m) => n + m.content.length, 0);
  if (total > LIMITS.maxTotalChars) return fail('Conversation is too long.');

  return { ok: true, messages: history };
}