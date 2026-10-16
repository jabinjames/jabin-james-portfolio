import { AgentGlyph, ExternalIcon, UserIcon } from './AgentIcons';

/** Renders a structured project payload returned by the backend. */
function ProjectCard({ project }) {
  const { title, description, tags = [], image, links = [] } = project;
  return (
    <article className="agent-card">
      {image && <img className="agent-card__img" src={image} alt="" loading="lazy" />}
      <div className="agent-card__body">
        <h4 className="agent-card__title">{title}</h4>
        {tags.length > 0 && (
          <ul className="agent-card__tags">
            {tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        {description && <p className="agent-card__desc">{description}</p>}
        {links.length > 0 && (
          <div className="agent-card__links">
            {links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
                <ExternalIcon />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/** Minimal, safe markdown: **bold**, `code`, "- " lists, "#" headings. Everything else is plain text. */
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(part)) return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function RichText({ text }) {
  const blocks = [];
  let list = null;
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd();
    const li = line.match(/^\s*(?:[-*\u2022])\s+(.*)$/);
    const oli = line.match(/^\s*(\d+)[.)\s]\s+(.*)$/);
    if (li) {
      if (!list || list.type !== 'ul') {
        list = { type: 'ul', items: [] };
        blocks.push(list);
      }
      list.items.push(li[1]);
      continue;
    }
    if (oli) {
      if (!list || list.type !== 'ol') {
        list = { type: 'ol', items: [] };
        blocks.push(list);
      }
      list.items.push(oli[2]);
      continue;
    }
    list = null;
    if (!line.trim()) continue;
    const h = line.match(/^#{1,6}\s+(.*)$/);
    blocks.push(h ? { type: 'h', text: h[1] } : { type: 'p', text: line });
  }
  return (
    <div className="agent-rich">
      {blocks.map((b, i) => {
        if (b.type === 'ul') {
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        }
        if (b.type === 'ol') {
          return (
            <ol key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ol>
          );
        }
        if (b.type === 'h') return <p key={i}><strong>{renderInline(b.text)}</strong></p>;
        return <p key={i}>{renderInline(b.text)}</p>;
      })}
    </div>
  );
}

export default function AgentMessage({ message, onRetry }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="agent-msg agent-msg--user">
        <div className="agent-bubble agent-bubble--user">{message.text}</div>
        <span className="agent-avatar agent-avatar--user" aria-hidden="true">
          <UserIcon />
        </span>
      </div>
    );
  }

  return (
    <div className="agent-msg agent-msg--agent">
      <span className="agent-avatar" aria-hidden="true">
        <AgentGlyph variant="node" size={22} />
      </span>
      <div className={`agent-bubble agent-bubble--agent${message.error ? ' is-error' : ''}`}>
        <span className="agent-sr-only">AGENT: </span>
        {message.text && <RichText text={message.text} />}
        {message.retry && onRetry && (
          <button type="button" className="agent-retry" onClick={onRetry}>
            Try again
          </button>
        )}
        {message.projects?.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </div>
  );
}