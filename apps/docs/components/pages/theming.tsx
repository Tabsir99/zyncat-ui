'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

import { Badge } from '@zyncat/ui/badge';
import { Button } from '@zyncat/ui/button';
import { Odometer } from '@zyncat/ui/odometer';
import { StatusBadge } from '@zyncat/ui/status-badge';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { TextField } from '@zyncat/ui/text-field';
import { defineTheme, ZyncatTheme } from '@zyncat/ui/theme';

import { Callout, CodeBlock, FeatureCard, FeatureGrid, TabGroup } from '../kit';
import { KnobRange, KnobSegment, Playground } from '../playground';

interface OverrideLevelRow {
  level: string;
  mechanism: ReactNode;
  reaches: string;
  when: string;
}

interface TailwindRow {
  family: string;
  utilities: string;
  tokens: string;
}

const TAILWIND_COLUMNS: TableColumn<TailwindRow>[] = [
  { key: 'family', label: 'Family', strong: true },
  {
    key: 'utilities',
    label: 'Utilities',
    render: (r) => <code className="doc-inline-code">{r.utilities}</code>,
    grow: true,
  },
  { key: 'tokens', label: 'Reads', render: (r) => <code className="doc-inline-code">{r.tokens}</code> },
];

const TAILWIND_ROWS: TailwindRow[] = [
  {
    family: 'Surfaces',
    utilities: 'bg-app, bg-surface, bg-surface-raised, bg-subtle, bg-muted, bg-inset, bg-overlay',
    tokens: '--bg-*',
  },
  {
    family: 'Ink',
    utilities:
      'text-strong, text-default, text-secondary, text-muted, text-subtle, text-disabled, text-accent, text-on-accent, text-inverse; text-success, text-warning, text-danger, text-info',
    tokens: '--text-*, --<hue>-text',
  },
  { family: 'Hairlines', utilities: 'border-subtle, border-default, border-strong', tokens: '--border-*' },
  {
    family: 'Hues',
    utilities:
      'bg-accent, bg-accent-fill, hover:bg-accent-hover, bg-accent-wash, border-accent-border, ring-accent, bg-danger/10 … on every colour utility',
    tokens: '--accent*, --success*, --warning*, --danger*, --info*, --neutral-wash*',
  },
  {
    family: 'Type',
    utilities:
      'text-micro, text-caption, text-body, text-body-lg, text-label, text-heading, text-title, text-title-lg, text-display, text-display-lg, text-code + font-code; font-body, leading-<role>, tracking-caps, tracking-display',
    tokens: '--type-*, --font-*, --leading-*, --tracking-*',
  },
  {
    family: 'Corners, elevation',
    utilities: 'rounded-sm … rounded-2xl, rounded-full, shadow-xs … shadow-xl, shadow-glow-<hue>, outline-ring-<hue>',
    tokens: '--radius-*, --shadow-*, --focus-ring, --ring-*, --ring-color-*, --glow-*',
  },
  {
    family: 'Motion',
    utilities: 'duration-fast … duration-slowest, ease-standard, ease-entrance, ease-exit, ease-spring, ease-glide',
    tokens: '--duration-*, --ease-*',
  },
  { family: 'Measure', utilities: 'max-w-prose, max-w-floating', tokens: '--measure-*' },
];

const TAILWIND_IMPORT_CODE = `/* app.css - the stylesheet Tailwind compiles; init writes this line */
@import '@zyncat/ui/tailwind.css';
@import 'tailwindcss';`;

const TAILWIND_CARD_CODE = `<article className="bg-surface border border-subtle rounded-lg shadow-sm p-4 max-w-prose">
  <h3 className="text-heading text-strong">Weekly digest</h3>
  <p className="text-caption text-muted">Sent every Monday at 9:00.</p>
  <button className="bg-accent-fill text-on-accent rounded-md px-3 py-2 duration-fast ease-standard hover:bg-accent-hover">
    Enable
  </button>
</article>`;

const OVERRIDE_LEVEL_COLUMNS: TableColumn<OverrideLevelRow>[] = [
  { key: 'level', label: 'Level', mono: true, strong: true },
  { key: 'mechanism', label: 'Mechanism', render: (r) => r.mechanism },
  { key: 'reaches', label: 'Reaches' },
  { key: 'when', label: 'Use it when', grow: true },
];

const OVERRIDE_LEVEL_ROWS: OverrideLevelRow[] = [
  {
    level: '0',
    mechanism: 'Your own unlayered CSS',
    reaches: 'Every instance',
    when: 'You need a rule the token vocabulary has no name for.',
  },
  {
    level: '1',
    mechanism: (
      <>
        <code className="doc-inline-code">zyncat.theme.css</code>, or{' '}
        <code className="doc-inline-code">defineTheme</code>
      </>
    ),
    reaches: 'The whole system',
    when: 'You are rebranding, adding a dark theme, or retiming motion.',
  },
  {
    level: '2',
    mechanism: (
      <>
        The <code className="doc-inline-code">components</code> group, or scoped{' '}
        <code className="doc-inline-code">--component-*</code> properties
      </>
    ),
    reaches: 'One component',
    when: 'An expressive or compound component needs retuning, not rebuilding.',
  },
  {
    level: '3',
    mechanism: (
      <>
        <code className="doc-inline-code">className</code>, <code className="doc-inline-code">style</code>,{' '}
        <code className="doc-inline-code">htmlProps</code>
      </>
    ),
    reaches: 'One instance',
    when: 'This one button, in this one layout, needs to be different.',
  },
];

const SCOPED_PROPERTY_COLUMNS: TableColumn<(typeof SCOPED_PROPERTIES)[number]>[] = [
  { key: 'component', label: 'Component', mono: true, strong: true },
  { key: 'count', label: 'Properties' },
  {
    key: 'sample',
    label: 'For example',
    grow: true,
    render: (r) => <code className="doc-inline-code">{r.sample}</code>,
  },
];

const ROW: CSSProperties = { display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' };

const SCOPED_PROPERTIES: { component: string; subpath: string; count: number; sample: string }[] = [
  {
    component: 'Odometer',
    subpath: 'odometer',
    count: 6,
    sample: '--odometer-size, --odometer-accent, --odometer-gap',
  },
  {
    component: 'TypingLines',
    subpath: 'typing-lines',
    count: 7,
    sample: '--typing-lines-caret-ink, --typing-lines-blink',
  },
  { component: 'Lens', subpath: 'lens', count: 4, sample: '--lens-surface, --lens-fringe-warm, --lens-fringe-cool' },
  {
    component: 'MorphingText',
    subpath: 'morphing-text',
    count: 10,
    sample: '--morphing-text-size, --morphing-text-smear',
  },
  {
    component: 'WeightField',
    subpath: 'weight-field',
    count: 14,
    sample: '--weight-field-peak-weight, --weight-field-hover-padding',
  },
  {
    component: 'FlowField',
    subpath: 'flow-field',
    count: 15,
    sample: '--flow-field-ramp-0 … -11, --flow-field-accent',
  },
  { component: 'Confetti', subpath: 'confetti', count: 11, sample: '--confetti-paper-1 … -5, --confetti-weights' },
  {
    component: 'SupportRail',
    subpath: 'support-rail',
    count: 12,
    sample: '--support-rail-width, --support-rail-accent, --support-rail-row-pad-block',
  },
];

interface VocabularyRow {
  family: string;
  tokens: string;
  pick: string;
}

const VOCABULARY_COLUMNS: TableColumn<VocabularyRow>[] = [
  { key: 'family', label: 'Family', strong: true },
  { key: 'tokens', label: 'Tokens', render: (r) => <code className="doc-inline-code">{r.tokens}</code> },
  { key: 'pick', label: 'Pick it for', grow: true },
];

const VOCABULARY_ROWS: VocabularyRow[] = [
  {
    family: 'Surfaces',
    tokens: '--bg-app, --bg-surface, --bg-surface-raised, --bg-subtle, --bg-muted, --bg-inset, --bg-overlay',
    pick: 'The page, a card, a raised panel, a quiet fill, a recessed well, the scrim behind an overlay.',
  },
  {
    family: 'Ink',
    tokens:
      '--text-strong, --text-body, --text-secondary, --text-muted, --text-subtle, --text-disabled, --text-accent, --text-on-accent, --text-inverse',
    pick: 'Headings, body copy, supporting copy, hints, placeholders, a link, text on an accent fill.',
  },
  {
    family: 'Borders',
    tokens: '--border-subtle, --border-default, --border-strong',
    pick: 'A divider, a control edge, an emphasised edge.',
  },
  {
    family: 'Status',
    tokens: '--accent, --success, --warning, --danger, --info, each with -subtle and -text',
    pick: 'A status fill, its quiet background, its readable text. Status hues mark genuine status only.',
  },
  {
    family: 'Type',
    tokens: '--type-display-lg … --type-micro, --type-code, --font-body, --font-code',
    pick: 'One font: shorthand per role with size and leading matched; eleven of them.',
  },
  {
    family: 'Space',
    tokens: '--space-px, --space-1 … --space-10',
    pick: 'Padding and gaps on the components\u2019 4px grid: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.',
  },
  {
    family: 'Radius',
    tokens: '--radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-2xl, --radius-full',
    pick: 'Controls take md, cards lg, sheets xl, pills full. Every step is a ratio of --radius.',
  },
  {
    family: 'Elevation',
    tokens: '--shadow-xs … --shadow-xl, --focus-ring, --shadow-strength, --sheen-strength, --glow-strength',
    pick: 'Lift, the one focus treatment every control shares, and the three numbers a theme scales the lighting with.',
  },
  {
    family: 'Motion',
    tokens:
      '--duration-fast … --duration-slowest, --ease-standard, --ease-entrance, --ease-exit, --ease-spring, --ease-glide, --transition-control, --transition-colors, --transition-opacity',
    pick: 'Your own transitions on the system\u2019s bands; reduced motion collapses them for you.',
  },
];

const LEVEL_0_CODE = `/* your-app.css - loaded after @zyncat/ui/styles.css */

/* Specificity (0,0,0) and it still wins: every shipped rule
   is inside @layer zyncat.components, and unlayered CSS
   outranks every layer no matter how specific the layered
   rule is. No !important. No parent selector. */
:where(.zc-btn) {
  border-radius: 0;
  text-transform: uppercase;
}`;

const LEVEL_1_CODE = `/* zyncat.theme.css - written by init beside your app entry, loaded after @zyncat/ui/styles.css */
:root {
  /* hover, active, lift, subtle, border, disabled, wash, text-accent,
     the focus ring and info all follow this one decision */
  --accent: oklch(0.58 0.19 292);

  /* every --radius-* step follows this one */
  --radius: var(--radius-full);
}`;

const LEVEL_1_DARK_CODE = `{/* dark ships in the package - one attribute, on <html> or on any subtree root */}
<html lang="en" data-theme="dark">

{/* and a light island inside it */}
<section data-theme="light">
  <Button variant="primary">Light in here</Button>
</section>`;

const LEVEL_1_DARK_EXTEND_CODE = `/* zyncat.theme.css - extend the shipped dark theme in the same block */
[data-theme='dark'] {
  /* a lighter accent for dark surfaces; hover, wash, ring and info follow */
  --accent: oklch(0.72 0.14 292);

  /* the lighting model is three numbers: shadow alpha, top-light highlight alpha, cast light */
  --shadow-strength: 2.5;
  --sheen-strength: 0.3;
  --glow-strength: 0.6;
}`;

const LEVEL_2_CODE = `{/* one instance */}
<Odometer value={total} style={{ '--odometer-size': 'var(--size-display-lg)', '--odometer-accent': 'var(--danger)' }} />

{/* every instance in the app - the typed theme */}
defineTheme({ components: { odometer: { size: 'var(--size-display-lg)', accent: 'var(--danger)' } } });

/* or every instance underneath one element, from CSS */
.metrics-panel {
  --odometer-size: var(--size-display-lg);
  --odometer-gap: 0.12em;
}`;

const LEVEL_3_PRIMITIVE = `<Button className="checkout-cta" style={{ minWidth: '12rem' }}>
  Place order
</Button>

/* .zc-btn is still there; your class rides alongside it */
.checkout-cta {
  width: 100%;
}`;

const LEVEL_3_FIELD = `{/* className and style land on the field WRAPPER;
    htmlProps reaches the native <input> */}
<TextField
  label="Workspace"
  className="settings-field"
  htmlProps={{ autoComplete: 'off', spellCheck: false }}
/>`;

const LEVEL_3_OVERLAY = `{/* Overlays have no className prop - the panel is not the root.
    htmlProps lands on the panel itself. */}
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete workspace"
  htmlProps={{ className: 'danger-dialog', 'data-testid': 'delete-dialog' }}
/>`;

type Corner = 'sharp' | 'default' | 'round';
type Polarity = 'light' | 'dark';
type OdometerInk = 'accent' | 'warning';

const PREVIEW = 'zyncat-preview';

const CORNERS: Record<Corner, string> = { sharp: '0', default: '0.5rem', round: '1rem' };

const playgroundCode = (
  hue: number,
  corner: Corner,
  ink: OdometerInk,
  polarity: Polarity,
) => `import { defineTheme, ZyncatTheme } from '@zyncat/ui/theme';

const base = defineTheme({
  color: { accent: 'oklch(0.63 0.118 ${hue})' },
  shape: { radius: '${CORNERS[corner]}' },
  components: { odometer: { accent: 'var(--${ink})' } },
});

// once, at the app root - beside your import of '@zyncat/ui/styles.css'
<ZyncatTheme theme={{ base }} />;

// dark ships in the package: the same decisions, on dark surfaces
<html lang="en"${polarity === 'dark' ? ' data-theme="dark"' : ''}>`;

export function ThemingPlayground() {
  const [hue, setHue] = useState(292);
  const [corner, setCorner] = useState<Corner>('round');
  const [polarity, setPolarity] = useState<Polarity>('light');
  const [ink, setInk] = useState<OdometerInk>('accent');
  const [total, setTotal] = useState(4820);

  const base = defineTheme({
    color: { accent: `oklch(0.63 0.118 ${hue})` },
    shape: { radius: CORNERS[corner] },
    components: { odometer: { accent: `var(--${ink})` } },
  });

  return (
    <Playground
      code={playgroundCode(hue, corner, ink, polarity)}
      note="Every control writes one typed key at the top of the theme; the accent's hover, active, wash and focus ring, and every corner step, derive from it. The preview scopes the theme to this panel with a named theme, so the rest of the page keeps its own, and the theme switch is the shipped dark on the panel's root - the attribute you would put on <html>."
      rail={
        <>
          <KnobRange label="accent hue" value={hue} onChange={setHue} min={0} max={360} format={(v) => `${v}°`} />
          <KnobSegment label="radius" value={corner} onChange={setCorner} options={['sharp', 'default', 'round']} />
          <KnobSegment label="theme" value={polarity} onChange={setPolarity} options={['light', 'dark']} />
          <KnobSegment label="odometer.accent" value={ink} onChange={setInk} options={['accent', 'warning']} />
        </>
      }
      stage="fill"
    >
      <ZyncatTheme theme={{ [PREVIEW]: base }} />
      <div data-theme={PREVIEW}>
        <div className="theming-stage" data-theme={polarity}>
          <div className="theming-cell__row">
            <Button variant="primary">Publish</Button>
            <Button variant="secondary">Save draft</Button>
            <Button variant="ghost" onClick={() => setTotal((v) => v + 137)}>
              Add 137
            </Button>
          </div>
          <div className="theming-cell__row">
            <Badge tone="info">Draft</Badge>
            <StatusBadge status="published" />
            <Odometer value={total} style={{ '--odometer-size': 'var(--size-title-lg)' }} />
          </div>
          <TextField label="Workspace" placeholder="Acme Marketing" />
        </div>
      </div>
    </Playground>
  );
}

const THEME_FILE_CODE = `// zyncat.theme.ts
import { defineTheme } from '@zyncat/ui/theme';

export const base = defineTheme({
  color: { accent: 'oklch(0.58 0.19 292)' },
  shape: { radius: '0.75rem' },
  type: { font: { body: "'Inter', system-ui, sans-serif" } },
  motion: { duration: { base: '180ms' } },
  components: { odometer: { accent: 'var(--warning)' }, supportRail: { width: '22rem' } },
});

// extends the shipped dark theme - only what differs on dark surfaces
export const dark = defineTheme({
  color: { accent: 'oklch(0.72 0.14 292)' },
  custom: { '--shadow-strength': 2.5 },
});`;

const THEME_MOUNT_CODE = `// app/layout.tsx
import '@zyncat/ui/styles.css';

import { ZyncatTheme } from '@zyncat/ui/theme';
import { base, dark, ocean } from '../zyncat.theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ZyncatTheme theme={{ base, dark, ocean }} />
        {children}
      </body>
    </html>
  );
}`;

const THEME_SWITCH_CODE = `// base is always on. Any other key is a [data-theme='<key>'] block,
// so switching a whole theme is one attribute - no re-render, no reload.
document.documentElement.dataset.theme = 'dark';

{/* or scope one to a subtree */}
<section data-theme="ocean">
  <Button variant="primary">Ocean accent in here only</Button>
</section>`;

const TYPED_STYLE_CODE = `{/* the component's own knobs are typed on its style prop */}
<Odometer value={total} style={{ '--odometer-size': '3rem', '--odometer-accent': 'var(--danger)' }} />

{/* not this component's surface -> compile error */}
<Odometer value={total} style={{ '--lens-ink': 'red' }} />

{/* private per-frame state -> compile error */}
<Odometer value={total} style={{ '--_odometer-velocity': '1' }} />`;

const REDUCED_MOTION_CODE = `/* WRONG - a reduced-motion user gets 90ms animations in here.
   The reduced-motion collapse only targets :root, so this
   scoped value overrides it. */
.hero {
  --duration-fast: 90ms;
}

/* RIGHT - retime at :root, where the collapse can reach it */
:root {
  --duration-fast: 90ms;
}`;

export function ThemingDoc() {
  const [count, setCount] = useState(4820);

  return (
    <>
      <section className="guide-section" id="override-levels">
        <h2 className="guide-section__title">The four override levels</h2>
        <p className="guide-section__p">
          Zyncat UI is built to be overridden. There are four ways in, and they escalate: level 0 changes how a
          component looks everywhere with plain CSS, level 3 changes a single instance. Reach for the lowest level that
          does the job, and never fork the source.
        </p>

        <Table
          columns={OVERRIDE_LEVEL_COLUMNS}
          rows={OVERRIDE_LEVEL_ROWS}
          rowKey="level"
          ariaLabel="The four override levels"
          density="compact"
        />
      </section>

      <section className="guide-section" id="level-0">
        <h2 className="guide-section__title">Level 0 — your CSS already wins</h2>
        <p className="guide-section__p">
          Every stylesheet Zyncat UI ships opens with{' '}
          <code className="doc-inline-code">@layer zyncat.tokens, zyncat.components</code> and puts its rules inside
          those layers. Unlayered CSS outranks every layer regardless of specificity, so a rule in your own stylesheet
          lands without <code className="doc-inline-code">!important</code>, without a specificity ladder, and without a
          parent selector to lean on.
        </p>

        <div className="theming-pair">
          <div className="theming-cell">
            <span className="theming-cell__label">Shipped</span>
            <div className="theming-cell__row">
              <Button variant="primary">Publish</Button>
              <Button variant="secondary">Save draft</Button>
            </div>
          </div>
          <div className="theming-cell theming-unlayered">
            <span className="theming-cell__label">One unlayered rule</span>
            <div className="theming-cell__row">
              <Button variant="primary">Publish</Button>
              <Button variant="secondary">Save draft</Button>
            </div>
          </div>
        </div>

        <CodeBlock code={LEVEL_0_CODE} language="css" />

        <Callout tone="note" title="This site is the proof">
          These docs are a level 0 consumer. Everything in the documentation stylesheet outside its small reset block is
          unlayered, which is the only reason the buttons on the right look like that.
        </Callout>

        <p className="guide-section__p">
          Every class the library renders is BEM off a short base behind one{' '}
          <code className="doc-inline-code">zc-</code> namespace, so nothing in your own sheet can collide with it and
          every name is stable to target: <code className="doc-inline-code">.zc-btn</code>,{' '}
          <code className="doc-inline-code">.zc-btn--primary</code>,{' '}
          <code className="doc-inline-code">.zc-btn__label</code>; <code className="doc-inline-code">.zc-fld</code>,{' '}
          <code className="doc-inline-code">.zc-fld__input</code>;{' '}
          <code className="doc-inline-code">.zc-dialog__body</code>.
        </p>
      </section>

      <section className="guide-section" id="level-1">
        <h2 className="guide-section__title">Level 1 — retheme with tokens</h2>
        <p className="guide-section__p">
          Eight values are decisions: four hues (<code className="doc-inline-code">--accent</code>,{' '}
          <code className="doc-inline-code">--success</code>, <code className="doc-inline-code">--warning</code>,{' '}
          <code className="doc-inline-code">--danger</code>), the gray ramp&rsquo;s hue (
          <code className="doc-inline-code">--neutral</code>, the accent by default), roundness (
          <code className="doc-inline-code">--radius</code>) and the two faces. Everything else derives from them: set
          the accent and its hover, active, subtle, border, wash and focus ring follow; set the radius and every corner
          step follows. <code className="doc-inline-code">init</code> writes those eight lines, at their defaults, into{' '}
          <code className="doc-inline-code">zyncat.theme.css</code> beside your app entry — the whole retheme surface,
          in your project, and a retheme is editing a value there. VS Code&rsquo;s built-in CSS completion only sees
          variables declared in the file you are editing; the CSS Variable Autocomplete extension indexes the workspace,
          and this file is in it. The roles you read while building your own pages stay in the package, which is what
          the vocabulary table below is for.
        </p>

        <div className="theming-pair">
          <div className="theming-cell">
            <span className="theming-cell__label">Default tokens</span>
            <div className="theming-cell__row">
              <Button variant="primary">Publish</Button>
              <Badge tone="info">Draft</Badge>
              <StatusBadge status="published" />
            </div>
            <TextField label="Workspace" placeholder="Acme Marketing" />
          </div>
          <div className="theming-cell" data-theme="retheme">
            <span className="theming-cell__label">Two tokens repointed</span>
            <div className="theming-cell__row">
              <Button variant="primary">Publish</Button>
              <Badge tone="info">Draft</Badge>
              <StatusBadge status="published" />
            </div>
            <TextField label="Workspace" placeholder="Acme Marketing" />
          </div>
        </div>

        <CodeBlock code={LEVEL_1_CODE} language="css" />

        <p className="guide-section__p">
          Components read the tokens live, and the WAAPI motion engine reads the same DOM values, so animation retimes
          with the CSS rather than drifting out of sync with it. Dark ships the same way.{' '}
          <code className="doc-inline-code">data-theme=&quot;dark&quot;</code> on{' '}
          <code className="doc-inline-code">&lt;html&gt;</code> turns the page — the package paints the body in the app
          surface and the body ink, so there is no wrapper to add — and on any other element it turns that subtree,
          where <code className="doc-inline-code">data-theme=&quot;light&quot;</code> makes a light island inside it.
          The dark theme sets the neutral roles, the shadow ink and three strengths — how much shadow the surfaces cast,
          how bright the top-light highlights render, how much light a hovered fill casts around it — drops the filled
          faces a step, and re-derives the hue steps whose light values pin a lightness near white. The decisions
          cascade in, so the accent you set is the dark theme&rsquo;s accent too, and the derived tokens are declared on
          every theme root, so a subtree that repoints only the accent re-derives its whole family.
        </p>

        <CodeBlock code={LEVEL_1_DARK_CODE} language="tsx" />

        <p className="guide-section__p">
          Extend it in the same block. Whatever you leave out keeps the shipped dark value, the way the light side keeps
          its defaults.
        </p>

        <CodeBlock code={LEVEL_1_DARK_EXTEND_CODE} language="css" />

        <Callout tone="warning" title="Duration tokens belong on :root">
          Reduced motion is handled for you — every <code className="doc-inline-code">--duration-*</code> collapses to
          1ms under <code className="doc-inline-code">prefers-reduced-motion: reduce</code>. That collapse targets{' '}
          <code className="doc-inline-code">:root</code>, so a duration repointed on a nested scope inherits straight
          past it and animates at full speed for a user who asked for none.
        </Callout>

        <CodeBlock code={REDUCED_MOTION_CODE} language="css" />
      </section>

      <section className="guide-section" id="vocabulary">
        <h2 className="guide-section__title">The vocabulary you use</h2>
        <p className="guide-section__p">
          Your own pages read the same tokens the components do, so a card you build sits on the same surfaces, ink,
          rhythm and corners as the shipped ones — and follows a retheme. This is the tier to know by name. The
          decisions above drive it; the plumbing beneath it — ramp stops, the hover and wash derivations, rings, control
          sizes — is nothing you set.
        </p>

        <Table
          columns={VOCABULARY_COLUMNS}
          rows={VOCABULARY_ROWS}
          rowKey="family"
          ariaLabel="The token vocabulary you use"
          density="compact"
        />

        <p className="guide-section__p">
          The full vocabulary, with real values, is what the MCP server&rsquo;s{' '}
          <code className="doc-inline-code">get_tokens</code> tool prints, and every token is typed on any
          component&rsquo;s <code className="doc-inline-code">style</code> prop once{' '}
          <code className="doc-inline-code">@zyncat/ui/theme</code> is imported anywhere in the app.
        </p>
      </section>

      <section className="guide-section" id="tailwind">
        <h2 className="guide-section__title">With Tailwind</h2>
        <p className="guide-section__p">
          On Tailwind v4 the same vocabulary is a set of utilities, and IntelliSense completes them. One import in the
          stylesheet Tailwind compiles - <code className="doc-inline-code">init</code> writes it - and every role above
          has a utility named after its token: <code className="doc-inline-code">bg-surface</code>,{' '}
          <code className="doc-inline-code">text-muted</code>, <code className="doc-inline-code">border-subtle</code>,{' '}
          <code className="doc-inline-code">text-caption</code>, <code className="doc-inline-code">rounded-md</code>,{' '}
          <code className="doc-inline-code">shadow-md</code>, <code className="doc-inline-code">ease-standard</code>.
          Each one reads the token itself rather than a copy, so a themed subtree and the dark theme reach it, and{' '}
          <code className="doc-inline-code">dark:</code> follows <code className="doc-inline-code">data-theme</code>{' '}
          instead of the OS. The base stylesheet stays on its JS import at the app root; only the bridge goes through
          Tailwind.
        </p>

        <CodeBlock code={TAILWIND_IMPORT_CODE} language="css" />
        <CodeBlock code={TAILWIND_CARD_CODE} language="tsx" />

        <Table
          columns={TAILWIND_COLUMNS}
          rows={TAILWIND_ROWS}
          rowKey="family"
          ariaLabel="The token vocabulary as Tailwind utilities"
          density="compact"
        />

        <p className="guide-section__p">
          The names Tailwind also ships - <code className="doc-inline-code">rounded-md</code>,{' '}
          <code className="doc-inline-code">shadow-md</code>, <code className="doc-inline-code">tracking-tight</code> -
          now read the zyncat token of the same name, so a card built from utilities and a shipped component share one
          radius and one lighting model, and <code className="doc-inline-code">--radius</code> in your theme file moves
          both. Spacing stays Tailwind&rsquo;s own scale; both sit on the 4px grid.{' '}
          <code className="doc-inline-code">text-body</code> is the type role, so the body ink is{' '}
          <code className="doc-inline-code">text-default</code>, and <code className="doc-inline-code">text-code</code>{' '}
          sets size and leading with <code className="doc-inline-code">font-code</code> beside it for the face.
        </p>

        <Callout tone="warning" title="First line, above tailwindcss">
          The bridge declares the cascade layers - Tailwind&rsquo;s utilities above the component rules, so{' '}
          <code className="doc-inline-code">className=&quot;rounded-full&quot;</code> on a Button lands - and the first
          layer statement in a stylesheet fixes the order. Below the Tailwind import it still adds the utilities, but
          they lose to the component rules.
        </Callout>
      </section>

      <section className="guide-section" id="typed-theme">
        <h2 className="guide-section__title">The typed theme</h2>
        <p className="guide-section__p">
          <code className="doc-inline-code">@zyncat/ui/theme</code> is the same level 1 retheme with a type behind it,
          for a theme that is data: several named themes, values computed at build time, a design tool&rsquo;s export.
          The type is the shape of a theme, not a list of every token: four categories —{' '}
          <code className="doc-inline-code">color</code>, <code className="doc-inline-code">type</code>,{' '}
          <code className="doc-inline-code">shape</code>, <code className="doc-inline-code">motion</code> — each
          grouping what it holds, so <code className="doc-inline-code">color.bg.app</code> is{' '}
          <code className="doc-inline-code">--bg-app</code> and <code className="doc-inline-code">type.font.body</code>{' '}
          is <code className="doc-inline-code">--font-body</code>; then the scoped knobs under{' '}
          <code className="doc-inline-code">components</code>. Everything else — ramp stops, the type scale, spacing, a
          derived hover or wash — is reachable by its CSS name under <code className="doc-inline-code">custom</code>.
          Every level completes, hovering a key shows what it does and what it currently is, and a typo is a compile
          error instead of a property that silently does nothing.
        </p>

        <ThemingPlayground />

        <p className="guide-section__p">
          Keep the themes in one file, and keep one writer per decision: a project on this route drops those lines from{' '}
          <code className="doc-inline-code">zyncat.theme.css</code>. Everything you leave out keeps its shipped value,
          so upgrading the package picks up new tokens instead of drifting from them.
        </p>

        <CodeBlock code={THEME_FILE_CODE} language="tsx" />

        <p className="guide-section__p">
          Render <code className="doc-inline-code">ZyncatTheme</code> once at the root. It is a plain component that
          renders a <code className="doc-inline-code">&lt;style&gt;</code> element on the server, so the themed values
          are in the first HTML the browser sees — no flash, no client hook, and nothing to configure in your bundler.
        </p>

        <CodeBlock code={THEME_MOUNT_CODE} language="tsx" />

        <p className="guide-section__p">
          <code className="doc-inline-code">base</code> lands on <code className="doc-inline-code">:root</code>. Every
          other key becomes a <code className="doc-inline-code">[data-theme=&apos;&lt;key&gt;&apos;]</code> block, which
          is why there is one prop rather than a light one, a dark one and a list — and why{' '}
          <code className="doc-inline-code">dark</code> here extends the shipped dark theme rather than starting one.
        </p>

        <CodeBlock code={THEME_SWITCH_CODE} language="tsx" />

        <Callout tone="note" title="Reduced motion travels with your durations">
          A duration you repoint here gets the same collapse the shipped tokens get: the rendered stylesheet carries a{' '}
          <code className="doc-inline-code">prefers-reduced-motion</code> block for every duration token you touched, in
          every theme you defined. The trap in the previous section is one you cannot fall into through this API.
        </Callout>

        <FeatureGrid>
          <FeatureCard
            icon="sparkle"
            title="The shape of a theme, not a list"
            description="Four categories — color, type, shape, motion — each grouped by what it holds; components for the scoped knobs; and custom, where every other token goes by its CSS name."
          />
          <FeatureCard
            icon="shield-check"
            title="Generated from the CSS"
            description="The types are built from the token stylesheets themselves, and a lint fails the build if the two ever disagree."
          />
          <FeatureCard
            icon="lightning"
            title="About a kilobyte"
            description="Names are derived rather than tabulated, so the whole module is ~1.1KB gzipped and stays a zero-dependency component."
          />
        </FeatureGrid>
      </section>

      <section className="guide-section" id="level-2">
        <h2 className="guide-section__title">Level 2 — retune one component</h2>
        <p className="guide-section__p">
          Expressive and compound components publish scoped{' '}
          <code className="doc-inline-code">--&lt;component&gt;-&lt;name&gt;</code> custom properties as their public
          contract. Set them inline, or on any ancestor to reach every instance underneath. System primitives and
          composites publish none by design: they answer to the token vocabulary alone, so retheme those at level 1.
        </p>
        <p className="guide-section__p">
          These are typed twice over. In a theme they are the <code className="doc-inline-code">components</code> group,
          shaped like the theme — <code className="doc-inline-code">components.odometer.accent</code> is{' '}
          <code className="doc-inline-code">--odometer-accent</code>,{' '}
          <code className="doc-inline-code">components.typingLines.caret.ink</code> is{' '}
          <code className="doc-inline-code">--typing-lines-caret-ink</code>. On one instance they are the
          component&rsquo;s own <code className="doc-inline-code">style</code> prop, which accepts the design tokens and
          that component&rsquo;s knobs, and nothing from any other component.
        </p>

        <CodeBlock code={TYPED_STYLE_CODE} language="tsx" />

        <p className="guide-section__p">
          That is also where the line between a knob and a component&rsquo;s own workings stops being something to
          remember: private properties are not on the type, so setting one is a compile error rather than a line that
          quietly does nothing.
        </p>

        <div className="theming-pair">
          <div className="theming-cell">
            <span className="theming-cell__label">Default</span>
            <Odometer value={count} />
          </div>
          <div className="theming-cell">
            <span className="theming-cell__label">Three properties set</span>
            <Odometer
              value={count}
              style={{
                '--odometer-size': 'var(--size-display-lg)',
                '--odometer-accent': 'var(--danger)',
                '--odometer-gap': '0.12em',
              }}
            />
          </div>
        </div>

        <div style={{ ...ROW, marginTop: 'var(--space-4)' }}>
          <Button variant="secondary" onClick={() => setCount((v) => v + 137)}>
            Add 137
          </Button>
          <Button variant="ghost" onClick={() => setCount((v) => Math.max(0, v - 209))}>
            Subtract 209
          </Button>
        </div>

        <CodeBlock code={LEVEL_2_CODE} language="tsx" />

        <Table
          columns={SCOPED_PROPERTY_COLUMNS}
          rows={SCOPED_PROPERTIES}
          rowKey="subpath"
          ariaLabel="Scoped custom properties per component"
          density="compact"
        />

        <Callout tone="note" title="The rest is private">
          Everything else a component declares — its constants, its derivations, the per-frame state the canvas and drag
          components write to themselves — is a private <code className="doc-inline-code">--_&lt;component&gt;-*</code>{' '}
          property: <code className="doc-inline-code">--_odometer-velocity</code>,{' '}
          <code className="doc-inline-code">--_lens-lift</code>,{' '}
          <code className="doc-inline-code">--_morphing-text-heat</code>,{' '}
          <code className="doc-inline-code">--_support-rail-drag</code>. Not a contract, and the types leave them out.
        </Callout>

        <p className="guide-section__p">
          The simulations sample their properties at their next measure rather than on every frame: WeightField and
          FlowField on resize, FlowField also when a theme attribute changes, Confetti on the next{' '}
          <code className="doc-inline-code">fire()</code>.
        </p>
      </section>

      <section className="guide-section" id="level-3">
        <h2 className="guide-section__title">Level 3 — restyle one instance</h2>
        <p className="guide-section__p">
          Where the first three levels move every instance, props move one. What a component accepts depends on how many
          surfaces it renders.
        </p>

        <TabGroup
          tabs={[
            {
              id: 'primitive',
              label: 'Primitives',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <p className="guide-section__p">
                    One element, so <code className="doc-inline-code">className</code> and{' '}
                    <code className="doc-inline-code">style</code> land on it directly and merge with the shipped
                    classes. Native attributes pass straight through; <code className="doc-inline-code">htmlProps</code>{' '}
                    is there for the ones that would collide with a component prop.
                  </p>
                  <CodeBlock code={LEVEL_3_PRIMITIVE} language="tsx" />
                </div>
              ),
            },
            {
              id: 'field',
              label: 'Fields',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <p className="guide-section__p">
                    A field renders a label, a control shell and an input.{' '}
                    <code className="doc-inline-code">className</code> and{' '}
                    <code className="doc-inline-code">style</code> land on the wrapper — the thing you position — while{' '}
                    <code className="doc-inline-code">htmlProps</code> reaches the native{' '}
                    <code className="doc-inline-code">&lt;input&gt;</code>.
                  </p>
                  <CodeBlock code={LEVEL_3_FIELD} language="tsx" />
                </div>
              ),
            },
            {
              id: 'overlay',
              label: 'Overlays',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <p className="guide-section__p">
                    Dialog, Modal, Sheet, Popover, Tooltip and Dropdown render into a portal, so their root is a
                    backdrop, not the surface you want to style. They take no{' '}
                    <code className="doc-inline-code">className</code> prop at all —{' '}
                    <code className="doc-inline-code">htmlProps</code> lands on the panel itself.
                  </p>
                  <CodeBlock code={LEVEL_3_OVERLAY} language="tsx" />
                </div>
              ),
            },
          ]}
        />
      </section>

      <section className="guide-section" id="replicas">
        <h2 className="guide-section__title">Replicas answer to none of this</h2>
        <p className="guide-section__p">
          <code className="doc-inline-code">FacebookFeed</code>, <code className="doc-inline-code">InstagramFeed</code>,{' '}
          <code className="doc-inline-code">TikTok</code> and <code className="doc-inline-code">YouTube</code> reproduce
          a real platform surface, and fidelity is their contract. Their metrics are pinned as constants rather than
          tokens, so a level 1 retheme cannot move them and there are no scoped properties to set at level 2. Only{' '}
          <code className="doc-inline-code">--font-body</code>, <code className="doc-inline-code">--focus-ring</code>{' '}
          and the duration tokens reach inside.
        </p>
        <Callout tone="warning" title="That immunity is the feature">
          A replica that drifted with your accent colour would stop being a replica. If you want a card that follows
          your theme, compose one from primitives instead of reaching into these.
        </Callout>
      </section>
    </>
  );
}
