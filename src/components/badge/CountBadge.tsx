'use client';

// CountBadge - count chip (counts, totals, deltas); roll mode is an odometer, digits roll on change.

import './badge.css';
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
