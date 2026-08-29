const VIEW_BOX = '0 0 24 24';

export interface GlyphProps {
  className: string;
}

export function PrivacyGlobe({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <circle cx="12" cy="12" r="10.6" />
      <path d="M4.1 6.7c1.5.4 2.4 1.3 2.6 2.7.2 1.4 1.2 2.2 3 2.4 1.6.2 2.3 1.1 2.1 2.7-.2 1.7.3 3.2 1.4 4.5-1 .5-2.1.8-3.2.8-3.9 0-7.1-3.1-7.1-7 0-2.3.4-4.2 1.2-6.1z" />
      <path d="M14.6 3.9c2.9 1 5 3.7 5 6.9 0 1.1-.2 2.1-.7 3-1.4-1.7-2.9-2.6-4.4-2.6-1.6 0-2.4-.7-2.4-2.1 0-1.3.5-2.2 1.5-2.7 1-.5 1.3-1.3 1-2.5z" />
    </svg>
  );
}

export function Dismiss({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M4.6 4.6 19.4 19.4M19.4 4.6 4.6 19.4" />
    </svg>
  );
}

export function ThumbOutline({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M2.6 19.7V11.5a1 1 0 0 1 1-1h3.9L9.3 3.7a1.7 1.7 0 0 1 3.4.4v5.6h6.5a1.1 1.1 0 0 1 1 1.1l-.8 5.6-1.1 3.3z" />
      <path d="M7.5 10.5v9.2" />
    </svg>
  );
}

export function CommentOutline({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M17.8 17.8a8.9 8.9 0 1 0-3.4 2.1l5.5.1z" />
    </svg>
  );
}

export function ShareOutline({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M10.6 3.4 20.8 11.6 10.6 19.9v-4.7H6.4c-1.8.7-3.1 2.2-3.8 4.4-.4-5-.4-8.4 1.9-9.6L10.6 8.2z" />
    </svg>
  );
}

export function ThumbSolid() {
  return (
    <svg viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M2.6 11.2h4.1V21H2.6zM8.3 11 12 4.1a1.5 1.5 0 0 1 2.8 1l-.7 3.7h4.4a1.7 1.7 0 0 1 1.7 2.1l-1.3 6.4a1.8 1.8 0 0 1-1.8 1.5H8.3z" />
    </svg>
  );
}

export function HeartSolid() {
  return (
    <svg viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M12 20.8C8.6 18.4 3 14.4 3 9.9A4.7 4.7 0 0 1 12 7.3a4.7 4.7 0 0 1 9 2.6c0 4.5-5.6 8.5-9 10.9z" />
    </svg>
  );
}

export function VerifiedBadge({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <circle cx="12" cy="12" r="11" />
      <path d="M6.8 12.4 10.3 15.8 17.2 8.7" />
    </svg>
  );
}

export function Magnifier({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <circle cx="10.4" cy="10.4" r="7.6" />
      <path d="M16.1 16.1 21 21" />
    </svg>
  );
}

export function SpeakerOutlineOff({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M3.2 9.2h3.4L11 5.2v13.6l-4.4-4H3.2z" />
      <path d="M15.6 9.6l4.8 4.8M20.4 9.6l-4.8 4.8" />
    </svg>
  );
}

export function SpeakerOutlineOn({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M3.2 9.2h3.4L11 5.2v13.6l-4.4-4H3.2z" />
      <path d="M14.9 9.3a3.8 3.8 0 0 1 0 5.4M17.7 6.6a7.7 7.7 0 0 1 0 10.8" />
    </svg>
  );
}

export function SpeakerSolidOn({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M3 9.4h3.4L11 5.2v13.6L6.4 14.6H3z" />
      <path d="M14.4 8.6a5.6 5.6 0 0 1 0 6.8l1.7 1.3a7.7 7.7 0 0 0 0-9.4zm3.4-2.6a10 10 0 0 1 0 12l1.7 1.3a12.1 12.1 0 0 0 0-14.6z" />
    </svg>
  );
}

export function SpeakerSolidOff({ className, crossClassName }: GlyphProps & { crossClassName: string }) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M3 9.4h3.4L11 5.2v13.6L6.4 14.6H3z" />
      <path className={crossClassName} d="M15.6 9.6l4.8 4.8M20.4 9.6l-4.8 4.8" />
    </svg>
  );
}

export function PlaySolid({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M5.5 2.8 20 12 5.5 21.2z" />
    </svg>
  );
}

export function AudienceFriends({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <circle cx="8.6" cy="8" r="3.7" />
      <path d="M1.9 20.4c0-3.7 3-5.6 6.7-5.6s6.7 1.9 6.7 5.6z" />
      <circle cx="17.2" cy="9.2" r="2.9" />
      <path d="M13.4 14.9c1-.4 2.3-.6 3.8-.6 3.1 0 5.1 1.6 5.1 4.8h-5.4c0-1.7-1.2-3.2-3.5-4.2z" />
    </svg>
  );
}

export function ChevronRight({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M8.5 3.5 17 12l-8.5 8.5" />
    </svg>
  );
}
