'use client';

import { useState, type CSSProperties } from 'react';

import { Button } from '@zyncat/ui/button';
import { Odometer } from '@zyncat/ui/odometer';

const ROW: CSSProperties = { display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap' };
const COLUMN: CSSProperties = { display: 'flex', gap: 'var(--space-4)', flexDirection: 'column' };
const grouped = (v: number) => v.toLocaleString('en-US');

export function OdometerHero() {
  const [value, setValue] = useState(12480);
  return (
    <div style={ROW}>
      <Odometer value={value} format={grouped} />
      <Button size="sm" variant="secondary" onClick={() => setValue((v) => v + 137)}>
        Nudge
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setValue((v) => v + 1000 + Math.floor(Math.random() * 8600))}
      >
        Jump
      </Button>
    </div>
  );
}

export function OdometerFormatDemo() {
  const [value, setValue] = useState(4821);
  return (
    <div style={COLUMN}>
      <div style={ROW}>
        <Odometer value={value} />
        <Odometer value={value} format={grouped} />
        <Odometer value={value} format={(v) => String(v).padStart(8, '0')} />
      </div>
      <div style={ROW}>
        <Button size="sm" variant="secondary" onClick={() => setValue((v) => v + 9)}>
          +9
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setValue((v) => v + 4444)}>
          +4,444
        </Button>
      </div>
    </div>
  );
}

export function OdometerSpeedDemo() {
  const [value, setValue] = useState(2500);
  return (
    <div style={COLUMN}>
      <div style={ROW}>
        <Odometer value={value} speed={0.4} />
        <Odometer value={value} />
        <Odometer value={value} speed={2} />
      </div>
      <Button size="sm" variant="secondary" onClick={() => setValue((v) => v + 3717)}>
        Roll all three
      </Button>
    </div>
  );
}

export function OdometerThemeDemo() {
  const [value, setValue] = useState(78210);
  const compact: CSSProperties = {
    '--odometer-size': 'var(--size-title)',
    '--odometer-weight': '600',
  } as CSSProperties;
  const loud: CSSProperties = {
    '--odometer-accent': 'var(--accent-active)',
    '--odometer-gap': '0.14em',
  } as CSSProperties;
  return (
    <div style={COLUMN}>
      <div style={ROW}>
        <Odometer value={value} format={grouped} style={compact} />
        <Odometer value={value} format={grouped} style={loud} />
      </div>
      <Button size="sm" variant="secondary" onClick={() => setValue((v) => v + 5309)}>
        Roll
      </Button>
    </div>
  );
}
