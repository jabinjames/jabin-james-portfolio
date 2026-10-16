/* Small inline icon set for AGENT. Colors come from CSS variables set in Agent.css. */

export function AgentGlyph({ variant = 'star', size = 24 }) {
  if (variant === 'node') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="9" cy="9" r="2.4" fill="#f4efe6" />
        <circle cx="15" cy="9" r="2.4" fill="#f4efe6" />
        <circle cx="9" cy="15" r="2.4" fill="#f4efe6" />
        <circle cx="15" cy="15" r="2.4" fill="#f4efe6" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 3 13.8 10.2 21 12 13.8 13.8 12 21 10.2 13.8 3 12 10.2 10.2Z"
        fill="var(--a-amber)"
      />
      <circle cx="18.2" cy="5.8" r="1.15" fill="var(--a-teal)" />
      <circle cx="5.8" cy="18.2" r="1.15" fill="var(--a-teal)" />
    </svg>
  );
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const SendIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...stroke}>
    <path d="M21 3 10 14" />
    <path d="M21 3 14.5 21l-4.5-7-7-4.5Z" />
  </svg>
);

export const ChevronIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...stroke}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const CloseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...stroke}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const MinimizeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...stroke}>
    <path d="M6 12h12" />
  </svg>
);

export const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...stroke}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
  </svg>
);

export const ExternalIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...stroke}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

export const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...stroke}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);