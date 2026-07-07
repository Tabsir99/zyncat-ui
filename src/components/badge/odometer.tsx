'use client';

/* Odometer - rolling digit display; each digit column clips a 0-9 strip and
   .odo__strip--N sets the translateY (no inline styles). Owns odometer.css, so
   any renderer (CountBadge, Table's bulk count) ships the styles with it. */
import './odometer.css';

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

export interface OdometerProps {
  /** Stringified; digits become rolling columns, other characters render fixed. */
  value: string | number;
}

export function Odometer({ value }: OdometerProps) {
  const str = String(value);
  return (
    <span className="odo" role="text" aria-label={str}>
      {str.split('').map((ch, i) =>
        /\d/.test(ch) ? (
          <Digit key={i} d={Number(ch)} />
        ) : (
          <span key={i} className="odo__fixed" aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
