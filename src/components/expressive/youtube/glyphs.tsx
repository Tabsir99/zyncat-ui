import type { ReactElement } from 'react';

export function KebabGlyph(): ReactElement {
  return (
    <svg className="youtube__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <circle cx="12" cy="6" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="18" r="2" />
    </svg>
  );
}

export function VerifiedGlyph(): ReactElement {
  return (
    <svg className="youtube__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path className="youtube__glyph-knockout" d="M10.3 16.7 5.9 12.3l1.6-1.6 2.8 2.8 6.2-6.2 1.6 1.6z" />
    </svg>
  );
}

export function PlayGlyph(): ReactElement {
  return (
    <svg className="youtube__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M7.4 4.5 19.6 12 7.4 19.5z" />
    </svg>
  );
}

export function PauseGlyph(): ReactElement {
  return (
    <svg className="youtube__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <rect x="6.4" y="4.4" width="4" height="15.2" rx="0.5" />
      <rect x="13.6" y="4.4" width="4" height="15.2" rx="0.5" />
    </svg>
  );
}

export function SpeakerGlyph(): ReactElement {
  return (
    <svg className="youtube__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.4 9h3.4l4.8-4.2v14.4L6.8 15H3.4z" fill="currentColor" />
      <path
        d="M14.6 9.3a3.6 3.6 0 0 1 0 5.4M17.2 6.9a7.1 7.1 0 0 1 0 10.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ExpandGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.4 4.4 11 11M4.4 10.2V4.4h5.8" />
      <path d="M19.6 19.6 13 13M19.6 13.8v5.8h-5.8" />
    </svg>
  );
}

export function HeartGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11 20.8 3 11.5a5 5 0 0 1 7-7l1 1 1-1a5 5 0 0 1 7 7z" />
    </svg>
  );
}

export function BubbleGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 22 21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.5 0.9h17c.9 0 1.6.7 1.6 1.6v9.9c0 .9-.7 1.6-1.6 1.6H8l-4.4 6.1V14H2.5c-.9 0-1.6-.7-1.6-1.6V2.5c0-.9.7-1.6 1.6-1.6z" />
      <path d="M4.6 5h12.8M4.6 9.2h8.2" />
    </svg>
  );
}

export function ShareGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 22 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.8 1.5 20.9 10l-8.1 8.5v-4.9c-5 .1-8.5 1.8-10.6 5 .5-7.4 4.1-11.3 10.6-11.6z" />
    </svg>
  );
}

export function RemixGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.9 8.1A8.4 8.4 0 0 1 17.4 5.4" />
      <path d="M19.1 13.9A8.4 8.4 0 0 1 4.6 16.6" />
      <path d="M17.9 1.4v4.3h-4.3M4.1 20.6v-4.3h4.3" />
      <path d="M11 7.8v6.4M7.8 11h6.4" />
    </svg>
  );
}

export function ThumbUpGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 21 21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 8.6 11.4 1c1.1 0 1.9 1 1.6 2.1L12 7.4h5.4c1.3 0 2.3 1.2 2 2.5l-1.4 6.6c-.2 1-1.1 1.7-2.1 1.7H6z" />
      <rect x="1" y="8.6" width="4" height="9.6" rx="0.6" />
    </svg>
  );
}

export function ThumbDownGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 21 21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 12.4 11.4 20c1.1 0 1.9-1 1.6-2.1L12 13.6h5.4c1.3 0 2.3-1.2 2-2.5l-1.4-6.6c-.2-1-1.1-1.7-2.1-1.7H6z" />
      <rect x="1" y="2.8" width="4" height="9.6" rx="0.6" />
    </svg>
  );
}

export function ChevronLeftGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14.6 5.4 8 12l6.6 6.6" />
    </svg>
  );
}

export function ChevronRightGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9.4 5.4 16 12l-6.6 6.6" />
    </svg>
  );
}

export function StackGlyph(): ReactElement {
  return (
    <svg
      className="youtube__glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8.4 3.6h12v12" />
      <rect x="3.6" y="8.4" width="12" height="12" rx="1.6" />
    </svg>
  );
}
