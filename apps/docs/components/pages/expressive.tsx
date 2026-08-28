'use client';

import { useRef, useState, type CSSProperties } from 'react';

import { Button } from '@zyncat/ui/button';
import { Confetti, type ConfettiEmitter, type ConfettiHandle } from '@zyncat/ui/confetti';
import { FlowField } from '@zyncat/ui/flow-field';
import { Lens } from '@zyncat/ui/lens';
import { MorphingText } from '@zyncat/ui/morphing-text';
import { Odometer } from '@zyncat/ui/odometer';
import { TypingLines, type TypingCaret } from '@zyncat/ui/typing-lines';
import { WeightField } from '@zyncat/ui/weight-field';

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

const CAPTION: CSSProperties = { font: 'var(--type-caption)', color: 'var(--text-muted)' };
const LABELLED: CSSProperties = { display: 'grid', gap: 'var(--space-1)' };
const SPEEDS = [0.4, 1, 2];

export function WeightFieldHero() {
  return <WeightField text="Kinetic" />;
}

export function WeightFieldSpeedDemo() {
  const [speed, setSpeed] = useState(1);
  const compact: CSSProperties = {
    '--weight-field-size': 'var(--size-display-lg)',
    '--weight-field-pad': 'var(--space-5) var(--space-4)',
  } as CSSProperties;
  return (
    <div style={COLUMN}>
      <WeightField text="Damped" speed={speed} style={compact} />
      <div style={ROW}>
        {SPEEDS.map((rate) => (
          <Button
            key={rate}
            size="sm"
            variant={rate === speed ? 'primary' : 'secondary'}
            onClick={() => setSpeed(rate)}
          >
            {rate}x
          </Button>
        ))}
        <span style={CAPTION}>Sampled live — change it mid-swing and the springs keep their state.</span>
      </div>
    </div>
  );
}

export function WeightFieldSplitDemo() {
  const compact: CSSProperties = {
    '--weight-field-size': 'var(--size-title-lg)',
    '--weight-field-pad': 'var(--space-4)',
  } as CSSProperties;
  return (
    <div style={COLUMN}>
      <div style={LABELLED}>
        <span style={CAPTION}>Under the cap — one spring per glyph</span>
        <WeightField text="Kinetic type" style={compact} />
      </div>
      <div style={RULE} />
      <div style={LABELLED}>
        <span style={CAPTION}>Over the cap — one spring per word</span>
        <WeightField
          text="A headline long enough that per glyph springs would outnumber the animated unit cap"
          style={compact}
        />
      </div>
    </div>
  );
}

export function WeightFieldThemeDemo() {
  const restrained: CSSProperties = {
    '--weight-field-size': 'var(--size-display-lg)',
    '--weight-field-pad': 'var(--space-4)',
    '--weight-field-rest-weight': '400',
    '--weight-field-peak-weight': '600',
    '--weight-field-lift': '0em',
    '--weight-field-tint': '0',
  } as CSSProperties;
  const exaggerated: CSSProperties = {
    '--weight-field-size': 'var(--size-display-lg)',
    '--weight-field-pad': 'var(--space-4)',
    '--weight-field-accent': 'var(--accent-active)',
    '--weight-field-reach': '4',
    '--weight-field-lift': '0.16em',
    '--weight-field-tracking': '0.04em',
  } as CSSProperties;
  return (
    <div style={COLUMN}>
      <div style={LABELLED}>
        <span style={CAPTION}>Weight only — no lift, no tint, 400→600</span>
        <WeightField text="Restrained" style={restrained} />
      </div>
      <div style={RULE} />
      <div style={LABELLED}>
        <span style={CAPTION}>Wider reach, deeper lift, louder accent</span>
        <WeightField text="Exaggerated" style={exaggerated} />
      </div>
    </div>
  );
}

const MORPH_WORDS = ['Weight', 'Timing', 'Ease', 'Rest'];
const MORPH_PHRASES = ['Design every state', 'Interrupt every motion', 'Ship the polish'];

export function MorphingTextHero() {
  return (
    <div style={{ ...COLUMN, width: '100%' }}>
      <MorphingText words={MORPH_WORDS} />
      <span style={{ ...CAPTION, textAlign: 'center' }}>Hover to hold the word.</span>
    </div>
  );
}

export function MorphingTextPacingDemo() {
  const [hold, setHold] = useState(1500);
  const [speed, setSpeed] = useState(1);
  return (
    <div style={COLUMN}>
      <div style={ROW}>
        <Button size="sm" variant="secondary" onClick={() => setHold((h) => (h >= 2200 ? 400 : h + 600))}>
          Hold {hold}ms
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setSpeed((s) => (s >= 2 ? 0.5 : s + 0.5))}>
          Speed {speed.toFixed(1)}x
        </Button>
      </div>
      <MorphingText words={MORPH_WORDS} hold={hold} speed={speed} />
    </div>
  );
}

export function MorphingTextPhrasesDemo() {
  const phrase: CSSProperties = { '--morphing-text-size': 'var(--size-title-lg)' } as CSSProperties;
  return (
    <div style={{ ...COLUMN, gap: 'var(--space-5)', width: '100%' }}>
      <MorphingText words={MORPH_PHRASES} hold={2200} style={phrase} />
      <span style={{ ...CAPTION, textAlign: 'center' }}>Spaces hold their place; only the glyphs pool.</span>
    </div>
  );
}

export function MorphingTextThemeDemo() {
  const molten: CSSProperties = {
    '--morphing-text-size': 'var(--size-display)',
    '--morphing-text-smear': '1.6',
    '--morphing-text-rule-accent': 'var(--accent-active)',
    '--morphing-text-rule-height': '2px',
  } as CSSProperties;
  const bare: CSSProperties = {
    '--morphing-text-size': 'var(--size-display)',
    '--morphing-text-smear': '0.5',
    '--morphing-text-rule-height': '0',
  } as CSSProperties;
  return (
    <div style={{ ...COLUMN, gap: 'var(--space-6)', width: '100%' }}>
      <MorphingText words={MORPH_WORDS} style={molten} />
      <MorphingText words={MORPH_WORDS} style={bare} />
    </div>
  );
}

const FIELD: CSSProperties = {
  border: 'var(--border-hairline) solid var(--border-subtle)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--bg-surface)',
  '--flow-field-min-height': 'calc(var(--space-10) * 2)',
} as CSSProperties;

const FIELD_INSET: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2)',
  alignItems: 'center',
  padding: 'var(--space-9) var(--space-6)',
  textAlign: 'center',
};

const SPACING_STEPS = [14, 26, 44];

const PALETTE_QUIET: CSSProperties = {
  ...FIELD,
  '--flow-field-ink': 'var(--border-strong)',
  '--flow-field-accent': 'var(--text-strong)',
} as CSSProperties;

const PALETTE_LOUD: CSSProperties = {
  ...FIELD,
  '--flow-field-ink': 'var(--text-disabled)',
  '--flow-field-accent': 'var(--danger)',
  '--flow-field-min-height': 'calc(var(--space-10) * 1.25)',
} as CSSProperties;

export function FlowFieldHero() {
  return (
    <FlowField style={FIELD}>
      <div style={FIELD_INSET}>
        <span style={{ font: 'var(--type-title)', color: 'var(--text-strong)' }}>Sweep the pointer across it</span>
        <span style={CAPTION}>
          The needles breathe on a noise loop until the pointer arrives, then swing away from it with per-cell lag.
        </span>
      </div>
    </FlowField>
  );
}

export function FlowFieldDensityDemo() {
  const [spacing, setSpacing] = useState(26);
  return (
    <div style={COLUMN}>
      <FlowField spacing={spacing} style={FIELD} />
      <div style={ROW}>
        {SPACING_STEPS.map((step) => (
          <Button
            key={step}
            size="sm"
            variant={step === spacing ? 'primary' : 'secondary'}
            onClick={() => setSpacing(step)}
          >
            {step} px
          </Button>
        ))}
        <span style={CAPTION}>The gap widens on its own so the field never draws more than 1600 needles.</span>
      </div>
    </div>
  );
}

export function FlowFieldReachDemo() {
  return (
    <div style={COLUMN}>
      <FlowField radius={80} speed={0.5} style={FIELD} />
      <span style={CAPTION}>radius 80, speed 0.5 — a tight, slow eddy that follows the pointer.</span>
      <FlowField radius={420} speed={1.8} style={FIELD} />
      <span style={CAPTION}>radius 420, speed 1.8 — the whole panel leans away from the pointer.</span>
    </div>
  );
}

export function FlowFieldPaletteDemo() {
  return (
    <div style={COLUMN}>
      <FlowField style={PALETTE_QUIET} />
      <span style={CAPTION}>--flow-field-ink and --flow-field-accent are the two ends of the needle ramp.</span>
      <FlowField style={PALETTE_LOUD} />
      <span style={CAPTION}>
        The twelve --flow-field-ramp-* stops are mixed from them in oklab, and --flow-field-min-height sizes the band.
      </span>
    </div>
  );
}

const CONFETTI_STAGE: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  display: 'grid',
  placeItems: 'center',
  minHeight: 'calc(var(--space-10) * 2.5)',
  padding: 'var(--space-6)',
  borderRadius: 'var(--radius-lg)',
  border: 'var(--border-hairline) solid var(--border-default)',
  background: 'var(--bg-subtle)',
};

const CONFETTI_EMITTERS: ConfettiEmitter[] = ['sides', 'top', 'corners'];

const GOLD_FOIL: CSSProperties = {
  '--confetti-paper-1': 'oklch(0.82 0.13 88)',
  '--confetti-paper-2': 'oklch(0.93 0.05 92)',
  '--confetti-paper-3': 'oklch(0.62 0.09 80)',
  '--confetti-paper-4': 'oklch(0.72 0.11 70)',
  '--confetti-paper-5': 'var(--text-strong)',
  '--confetti-weights': '1 0.8 0.9 1 0.3',
  '--confetti-gloss': '78%',
} as CSSProperties;

export function ConfettiHero() {
  const confetti = useRef<ConfettiHandle>(null);
  return (
    <div style={CONFETTI_STAGE}>
      <Confetti ref={confetti} />
      <Button onClick={() => confetti.current?.fire()}>Celebrate</Button>
    </div>
  );
}

export function ConfettiEmitterDemo() {
  const confetti = useRef<ConfettiHandle>(null);
  const [emitter, setEmitter] = useState<ConfettiEmitter>('sides');
  return (
    <div style={COLUMN}>
      <div style={CONFETTI_STAGE}>
        <Confetti ref={confetti} emitter={emitter} />
        <span style={CAPTION}>{emitter}</span>
      </div>
      <div style={ROW}>
        {CONFETTI_EMITTERS.map((name) => (
          <Button
            key={name}
            size="sm"
            variant={name === emitter ? 'primary' : 'secondary'}
            onClick={() => {
              setEmitter(name);
              confetti.current?.fire({ emitter: name });
            }}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ConfettiWindowDemo() {
  const confetti = useRef<ConfettiHandle>(null);
  return (
    <div style={COLUMN}>
      <div style={CONFETTI_STAGE}>
        <Confetti ref={confetti} emitter="top" />
      </div>
      <div style={ROW}>
        <Button size="sm" variant="secondary" onClick={() => confetti.current?.fire({ duration: 0, count: 220 })}>
          One shove
        </Button>
        <Button size="sm" variant="secondary" onClick={() => confetti.current?.fire({ duration: 2.5, count: 300 })}>
          Taper over 2.5s
        </Button>
        <Button size="sm" variant="secondary" onClick={() => confetti.current?.clear()}>
          Clear
        </Button>
      </div>
    </div>
  );
}

export function ConfettiPaletteDemo() {
  const house = useRef<ConfettiHandle>(null);
  const gold = useRef<ConfettiHandle>(null);
  return (
    <div style={{ ...ROW, alignItems: 'stretch' }}>
      <div style={{ ...CONFETTI_STAGE, flex: '1 1 0' }}>
        <Confetti ref={house} emitter="corners" />
        <Button size="sm" variant="secondary" onClick={() => house.current?.fire()}>
          House papers
        </Button>
      </div>
      <div style={{ ...CONFETTI_STAGE, flex: '1 1 0' }}>
        <Confetti ref={gold} emitter="corners" style={GOLD_FOIL} />
        <Button size="sm" variant="secondary" onClick={() => gold.current?.fire()}>
          Gold foil
        </Button>
      </div>
    </div>
  );
}
