'use client';

import { useState, type CSSProperties } from 'react';

import { Button } from '@zyncat/ui/button';
import { Lens } from '@zyncat/ui/lens';
import { Odometer } from '@zyncat/ui/odometer';
import { TypingLines, type TypingCaret } from '@zyncat/ui/typing-lines';

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

const CARETS: { caret: TypingCaret; label: string; lines: string[] }[] = [
  { caret: 'line', label: 'Line', lines: ['A caret that blinks only at rest.', 'Steady, and out of the way.'] },
  {
    caret: 'block',
    label: 'Block',
    lines: ['The block rides the next character.', 'Terminal habits, kept on purpose.'],
  },
  {
    caret: 'underscore',
    label: 'Underscore',
    lines: ['A rule that sits under the line.', 'Softer than a bar, still legible.'],
  },
];

export function TypingLinesHero() {
  return <TypingLines lines={['Design every state.', 'Make every motion interruptible.']} />;
}

export function TypingLinesCaretsDemo() {
  return (
    <div style={COLUMN}>
      {CARETS.map((row) => (
        <div key={row.caret} style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{row.label}</span>
          <TypingLines lines={row.lines} caret={row.caret} />
        </div>
      ))}
    </div>
  );
}

export function TypingLinesWordDemo() {
  return (
    <TypingLines
      unit="word"
      caret="none"
      lines={['Words arrive whole, one at a time.', 'No caret, because nothing is pending.']}
    />
  );
}

const SPECIMEN_ROWS = [
  { text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', weight: 'var(--weight-semibold)', ink: 'var(--text-strong)' },
  { text: 'abcdefghijklmnopqrstuvwxyz', weight: 'var(--weight-regular)', ink: 'var(--text-strong)' },
  { text: '0123456789', weight: 'var(--weight-regular)', ink: 'var(--text-muted)' },
];

const RULE: CSSProperties = { height: 'var(--border-hairline)', background: 'var(--border-default)' };

function Specimen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-6)' }}>
        <span style={{ font: 'var(--type-display-lg)', letterSpacing: '-0.05em', lineHeight: 0.8 }}>Aa</span>
        <span
          style={{
            font: 'var(--type-micro)',
            color: 'var(--text-muted)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          Geist
        </span>
      </div>
      <div style={RULE} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {SPECIMEN_ROWS.map((row) => (
          <div
            key={row.text}
            style={{
              font: 'var(--type-title)',
              fontWeight: row.weight,
              color: row.ink,
              letterSpacing: '0.05em',
              lineHeight: 1.1,
            }}
          >
            {row.text}
          </div>
        ))}
      </div>
      <div style={RULE} />
      <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>
        . , : ; … ! ? &lsquo; &rsquo; &ldquo; &rdquo; ( ) [ ] &#123; &#125; / \ | - – — @ &amp; # % ‰ + × ÷ = ≠ ± ~ ° √
        ∞ µ π Ω
      </div>
    </div>
  );
}

export function LensHero() {
  return (
    <Lens>
      <Specimen />
    </Lens>
  );
}

export function LensOpticsDemo() {
  const [magnification, setMagnification] = useState(2.6);
  const [radius, setRadius] = useState(132);
  return (
    <div style={COLUMN}>
      <div style={ROW}>
        <Button size="sm" variant="secondary" onClick={() => setMagnification((m) => (m >= 5 ? 1.4 : m + 1.2))}>
          Magnification {magnification.toFixed(1)}x
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setRadius((r) => (r >= 200 ? 80 : r + 40))}>
          Radius {radius}px
        </Button>
      </div>
      <Lens magnification={magnification} radius={radius}>
        <Specimen />
      </Lens>
    </div>
  );
}

export function LensChromaticDemo() {
  const [chromatic, setChromatic] = useState(false);
  return (
    <div style={COLUMN}>
      <Button size="sm" variant="secondary" onClick={() => setChromatic((c) => !c)}>
        Chromatic {chromatic ? 'on' : 'off'}
      </Button>
      <Lens chromatic={chromatic} magnification={3.4}>
        <Specimen />
      </Lens>
    </div>
  );
}

export function TypingLinesThemeDemo() {
  const loud: CSSProperties = {
    '--typing-lines-size': 'var(--size-display)',
    '--typing-lines-weight': 'var(--weight-semibold)',
    '--typing-lines-caret-ink': 'var(--accent-active)',
  } as CSSProperties;
  return (
    <div style={COLUMN}>
      <TypingLines lines={['Retuned through scoped properties.']} style={loud} />
      <TypingLines lines={['The default, for comparison.']} />
    </div>
  );
}
