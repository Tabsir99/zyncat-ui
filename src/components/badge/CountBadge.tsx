'use client';

// CountBadge.tsx — a count chip: counts, totals, deltas. All badges are
// mono + tabular by default (CLAUDE.md §E), so this just specializes for counts.
//
//   <CountBadge value="7 / 10" />        static
//   <CountBadge value={n} roll />        ODOMETER: digits roll vertically on change
//
// roll mode (transform only): each digit is a column clipping a 0–9 strip; the
// strip's position is set by an .odo__strip--N class (no inline styles).

import { Badge, type BadgeProps } from './Badge';

function Digit({ d }: { d: number }) {
  return (
    <span className="odo__col" aria-hidden="true">
      <span className={'odo__strip odo__strip--' + d}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </span>
    </span>
  );
}

export interface CountBadgeProps extends Omit<BadgeProps, 'children'> {
  value: string | number;
  /** Odometer: digits roll vertically on change. */
  roll?: boolean;
}

export function CountBadge({ value, tone = 'neutral', roll = false, ...rest }: CountBadgeProps) {
  const str = String(value);
  return (
    <Badge tone={tone} {...rest}>
      {roll ? (
        <span className="odo" role="text" aria-label={str}>
          {str.split('').map((ch, i) =>
            /\d/.test(ch) ? (
              <Digit key={i} d={Number(ch)} />
            ) : (
              <span key={i} className="odo__fixed" aria-hidden="true">
                {ch === ' ' ? ' ' : ch}
              </span>
            ),
          )}
        </span>
      ) : (
        str
      )}
    </Badge>
  );
}
