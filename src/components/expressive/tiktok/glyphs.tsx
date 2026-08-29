const VIEW_BOX = '0 0 24 24';

const SPEAKER_BODY =
  'M3.4 9.1h3.4l4.6-3.8a.7.7 0 0 1 1.2.6v12.2a.7.7 0 0 1-1.2.6L6.8 15H3.4a.9.9 0 0 1-.9-.9v-4.1a.9.9 0 0 1 .9-.9z';

export function MutedGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d={SPEAKER_BODY} fill="currentColor" />
      <path
        d="M16.2 9.6 21 14.4M21 9.6l-4.8 4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AudibleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d={SPEAKER_BODY} fill="currentColor" />
      <path
        d="M16.2 9.2a4.2 4.2 0 0 1 0 5.6M18.9 6.6a7.8 7.8 0 0 1 0 10.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PreviousGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M14.4 5.6 8 12l6.4 6.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NextGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M9.6 5.6 16 12l-6.4 6.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PinGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M12 2.6a6.4 6.4 0 0 0-6.4 6.4c0 4.6 6.4 12.4 6.4 12.4s6.4-7.8 6.4-12.4A6.4 6.4 0 0 0 12 2.6zm0 8.9a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HeartGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M12 21.4 10.4 20C4.9 15.1 1.3 12 1.3 8.2 1.3 5.1 3.8 2.6 6.9 2.6c1.8 0 3.6.9 4.7 2.3C12.7 3.5 14.5 2.6 16.3 2.6c3.1 0 5.6 2.5 5.6 5.6 0 3.8-3.6 6.9-9.1 11.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CommentGlyph({ className, holeClassName }: { className?: string; holeClassName: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M4.8 3.4h14.4a2.4 2.4 0 0 1 2.4 2.4v9.3a2.4 2.4 0 0 1-2.4 2.4H9.6l-4.3 3.2a.7.7 0 0 1-1.1-.6v-2.6h-.2a2.4 2.4 0 0 1-2.4-2.4V5.8a2.4 2.4 0 0 1 2.4-2.4z"
        fill="currentColor"
      />
      <circle className={holeClassName} cx="8.2" cy="10.4" r="1.5" />
      <circle className={holeClassName} cx="12" cy="10.4" r="1.5" />
      <circle className={holeClassName} cx="15.8" cy="10.4" r="1.5" />
    </svg>
  );
}

export function BookmarkGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M6.6 2.8h10.8a1.8 1.8 0 0 1 1.8 1.8v16.1a.8.8 0 0 1-1.2.7L12 17.6l-6 3.8a.8.8 0 0 1-1.2-.7V4.6a1.8 1.8 0 0 1 1.8-1.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ShareGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M4.4 17.2v-6.4c0-.7.6-1.3 1.3-1.3h5.1V5.7c0-1 1.2-1.6 2-.9l7.4 6.5c.5.5.5 1.3 0 1.8l-7.4 6.5c-.8.7-2 .1-2-.9v-3.8H5.7c-.7 0-1.3-.6-1.3-1.3z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlusGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export function MenuGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M3.2 6.4h17.6M3.2 12h17.6M3.2 17.6h17.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
        <circle cx="10.4" cy="10.4" r="7.6" />
        <path d="M16 16 21.2 21.2" />
      </g>
    </svg>
  );
}

export function NoteGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M9.2 17.6a2.7 2.7 0 1 1-1.9-2.6V5.6l9.4-2v8.5a2.7 2.7 0 1 1-1.9-2.6V6.2L9.2 7.5z" fill="currentColor" />
    </svg>
  );
}
