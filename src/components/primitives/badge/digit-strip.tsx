'use client';

import './digit-strip.css';

function Digit({ d }: { d: number }) {
  return (
    <span className="zc-odo__col" aria-hidden="true">
      <span className={'zc-odo__strip zc-odo__strip--' + d}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </span>
    </span>
  );
}

export interface DigitStripProps {
  value: string | number;
}

export function DigitStrip({ value }: DigitStripProps) {
  const str = String(value);
  return (
    <span className="zc-odo" role="text" aria-label={str}>
      {str.split('').map((ch, i) =>
        /\d/.test(ch) ? (
          <Digit key={i} d={Number(ch)} />
        ) : (
          <span key={i} className="zc-odo__fixed" aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
