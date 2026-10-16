import { ChevronIcon } from './AgentIcons';

export const DEFAULT_SUGGESTIONS = [
  'What does Jabin do?',
  'Tell me about his AI experience',
  'What projects has he built?',
  'What technologies does he use?',
  'How can I contact Jabin?',
];

export default function AgentSuggestions({ items = DEFAULT_SUGGESTIONS, onSelect, disabled }) {
  return (
    <ul className="agent-suggestions" aria-label="Suggested questions">
      {items.map((q) => (
        <li key={q}>
          <button
            type="button"
            className="agent-suggestion"
            disabled={disabled}
            onClick={() => onSelect(q)}
          >
            <span>{q}</span>
            <ChevronIcon />
          </button>
        </li>
      ))}
    </ul>
  );
}