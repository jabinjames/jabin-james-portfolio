import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import AgentMessage from './AgentMessage';
import AgentSuggestions, { DEFAULT_SUGGESTIONS } from './AgentSuggestions';
import { AgentGlyph, ChevronIcon, CloseIcon, MinimizeIcon, SendIcon, CheckIcon } from './AgentIcons';
import { requestAgentReply, FALLBACK_ERROR_TEXT } from './agentApi';
import './Agent.css';

const STATUS_STEPS = [
  'Retrieving portfolio information...',
  'Analyzing relevant context...',
  'Generating response...',
];
const COLLAPSE_AFTER_SCROLL = 480;

export default function Agent({ ownerName = 'Jabin', suggestions = DEFAULT_SUGGESTIONS }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [igniting, setIgniting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const launcherRef = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const busyRef = useRef(false);
  const idRef = useRef(0);
  const nextId = useCallback(() => `m${++idRef.current}`, []);

  /* ---------- open / close ---------- */
  const openChat = useCallback(() => {
    setIgniting(true);
    setIsOpen(true);
    setMinimized(false);
    window.setTimeout(() => setIgniting(false), 450);
    window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120);
  }, []);

  const closeChat = useCallback(({ minimize = false } = {}) => {
    const hadFocus = panelRef.current?.contains(document.activeElement);
    setIsOpen(false);
    setMinimized(minimize);
    if (hadFocus) window.setTimeout(() => launcherRef.current?.focus({ preventScroll: true }), 60);
  }, []);

  /* Escape closes */
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeChat();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeChat]);

  /* Collapse launcher into a pill after scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > COLLAPSE_AFTER_SCROLL);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Mobile keyboard: lift the sheet above the on-screen keyboard */
  useEffect(() => {
    if (!isOpen) return undefined;
    const vv = window.visualViewport;
    const root = rootRef.current;
    if (!vv || !root) return undefined;
    const update = () => {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty('--agent-kb', `${kb}px`);
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      root.style.removeProperty('--agent-kb');
    };
  }, [isOpen]);

  /* Cancel any in-flight request on unmount */
  useEffect(() => () => abortRef.current?.abort(), []);

  /* Cycle the user-friendly status steps while waiting */
  useEffect(() => {
    if (!loading) return undefined;
    setStep(0);
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, STATUS_STEPS.length - 1)), 1100);
    return () => window.clearInterval(id);
  }, [loading]);

  /* Keep the log pinned to the latest message */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  /* Auto-grow textarea */
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
  }, [input]);

  /* ---------- sending ---------- */
  const runRequest = useCallback(async (history) => {
    busyRef.current = true;
    setLoading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const reply = await requestAgentReply(history, { signal: ctrl.signal });
      setMessages((m) => [...m, { id: nextId(), role: 'agent', ...reply }]);
    } catch (err) {
      if (err?.name === 'AbortError') return; // component unmounted
      // The visitor's message stays in the log; the error bubble offers a retry.
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: 'agent',
          error: true,
          retry: true,
          text: err?.userMessage || FALLBACK_ERROR_TEXT,
        },
      ]);
    } finally {
      if (abortRef.current === ctrl) {
        abortRef.current = null;
        busyRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  const send = useCallback(
    (raw) => {
      const text = raw.trim();
      if (!text || busyRef.current) return; // ref guard blocks double-submits within one tick
      const history = [...messages, { id: nextId(), role: 'user', text }];
      setMessages(history);
      setInput('');
      runRequest(history);
    },
    [messages, runRequest],
  );

  const retry = useCallback(() => {
    if (busyRef.current) return;
    const history = messages.filter((m) => !m.error);
    setMessages(history);
    runRequest(history);
    inputRef.current?.focus({ preventScroll: true });
  }, [messages, runRequest]);

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const showPill = !isOpen && (minimized || scrolled);
  const launcherClass = [
    'agent-launcher',
    isOpen && 'is-hidden',
    showPill && 'is-pill',
    igniting && 'is-igniting',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="agent-root" ref={rootRef}>
      {/* ---------- floating node / pill ---------- */}
      <div className={launcherClass}>
        <span className="agent-tip" aria-hidden="true">
          Ask AGENT
        </span>
        <button
          ref={launcherRef}
          type="button"
          className="agent-launcher__btn"
          onClick={openChat}
          aria-label={`Open AGENT, ask anything about ${ownerName}'s portfolio`}
          aria-expanded={isOpen}
          aria-controls="agent-panel"
          tabIndex={isOpen ? -1 : 0}
        >
          <span className="agent-burst" aria-hidden="true" />
          <span className="agent-node">
            <AgentGlyph size={22} />
            <span className="agent-node__dot" />
          </span>
          <span className="agent-pill__label" aria-hidden="true">
            AGENT
          </span>
          <span className="agent-pill__dot" aria-hidden="true" />
          <span className="agent-pill__chev" aria-hidden="true">
            <ChevronIcon />
          </span>
        </button>
      </div>

      {/* ---------- chat panel / bottom sheet ---------- */}
      <section
        id="agent-panel"
        ref={panelRef}
        className="agent-panel"
        data-state={isOpen ? 'open' : 'closed'}
        role="dialog"
        aria-modal="false"
        aria-label="AGENT, portfolio intelligence"
      >
        <div className="agent-panel__inner">
          <div className="agent-grabber" aria-hidden="true" />

          <header className="agent-header">
            <span className="agent-header__avatar" aria-hidden="true">
              <AgentGlyph size={26} />
            </span>
            <div className="agent-header__meta">
              <h2 className="agent-header__title">AGENT</h2>
              <p className={`agent-status${loading ? ' is-busy' : ''}`}>
                <span className="agent-status__dot" aria-hidden="true" />
                {loading ? 'REASONING...' : 'ONLINE'}
              </p>
              <p className="agent-header__sub">Portfolio Intelligence</p>
            </div>
            <div className="agent-header__actions">
              <button
                type="button"
                className="agent-icon-btn"
                onClick={() => closeChat({ minimize: true })}
                aria-label="Minimize AGENT"
              >
                <MinimizeIcon />
              </button>
              <button
                type="button"
                className="agent-icon-btn"
                onClick={() => closeChat()}
                aria-label="Close AGENT"
              >
                <CloseIcon />
              </button>
            </div>
          </header>

          <div className="agent-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions">
            <AgentMessage
              message={{
                role: 'agent',
                text: `Hi, I'm AGENT. ðŸ‘‹\nI can help you explore ${ownerName}'s experience, projects, technical work, education, and AI systems.\n\nWhat would you like to know?`,
              }}
            />

            {messages.length === 0 && (
              <AgentSuggestions items={suggestions} onSelect={send} disabled={loading} />
            )}

            {messages.map((m, i) => (
              <AgentMessage
                key={m.id}
                message={m}
                onRetry={m.retry && i === messages.length - 1 && !loading ? retry : undefined}
              />
            ))}

            {loading && (
              <div className="agent-msg agent-msg--agent" role="status">
                <span className="agent-avatar" aria-hidden="true">
                  <AgentGlyph variant="node" size={22} />
                </span>
                <div className="agent-thinking">
                  <div className="agent-thinking__head">
                    <span className="agent-thinking__name">AGENT</span>
                    <span className="agent-thinking__state">
                      <span className="agent-status__dot" aria-hidden="true" />
                      REASONING...
                      <span className="agent-dots" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    </span>
                  </div>
                  <ol className="agent-steps">
                    {STATUS_STEPS.map((label, i) => (
                      <li
                        key={label}
                        className={i < step ? 'is-done' : i === step ? 'is-active' : ''}
                      >
                        <span className="agent-steps__icon" aria-hidden="true">
                          {i < step ? <CheckIcon size={12} /> : <i />}
                        </span>
                        {label}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>

          <form className="agent-form" onSubmit={onSubmit}>
            <div className="agent-input">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={1000}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={`Ask AGENT anything about ${ownerName}...`}
                aria-label={`Ask AGENT anything about ${ownerName}`}
                enterKeyHint="send"
              />
              <button
                type="submit"
                className="agent-send"
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
            <p className="agent-footer">
              {input.length > 700 && (
                <span className={`agent-charcount${input.length >= 950 ? ' is-warn' : ''}`} aria-live="polite">
                  {input.length}/1000
                </span>
              )}
              Based on {ownerName}&apos;s portfolio <span aria-hidden="true">&bull;</span> Powered by AI
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
