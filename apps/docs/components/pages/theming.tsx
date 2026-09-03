'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

import { Badge } from '@zyncat/ui/badge';
import { Button } from '@zyncat/ui/button';
import { Odometer } from '@zyncat/ui/odometer';
import { StatusBadge } from '@zyncat/ui/status-badge';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { TextField } from '@zyncat/ui/text-field';
import { defineTheme, ZyncatTheme, type ThemeTokens } from '@zyncat/ui/theme';

import { Callout, CodeBlock, FeatureCard, FeatureGrid, TabGroup } from '../kit';
import { KnobRange, KnobSegment, Playground } from '../playground';

interface OverrideLevelRow {
  level: string;
  mechanism: ReactNode;
  reaches: string;
  when: string;
}

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
    count: 8,
    sample: '--odometer-size, --odometer-accent, --odometer-gap',
  },
  {
    component: 'TypingLines',
    subpath: 'typing-lines',
    count: 7,
    sample: '--typing-lines-caret-ink, --typing-lines-blink',
  },
  { component: 'Lens', subpath: 'lens', count: 10, sample: '--lens-surface, --lens-fringe-warm, --lens-rim-start' },
  {
    component: 'MorphingText',
    subpath: 'morphing-text',
    count: 12,
    sample: '--morphing-text-size, --morphing-text-smear',
  },
  {
    component: 'WeightField',
    subpath: 'weight-field',
    count: 16,
    sample: '--weight-field-peak-weight, --weight-field-hover-padding',
  },
  {
    component: 'FlowField',
    subpath: 'flow-field',
    count: 15,
    sample: '--flow-field-ramp-0 … -11, --flow-field-accent',
  },
  { component: 'Confetti', subpath: 'confetti', count: 21, sample: '--confetti-paper-1 … -5, --confetti-weights' },
  {
    component: 'SupportRail',
    subpath: 'support-rail',
    count: 26,
    sample: '--support-rail-width, --support-rail-accent',
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
    tokens: '--type-display-lg … --type-micro, --type-mono, --font-sans, --font-mono',
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
    tokens: '--shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl, --focus-ring',
    pick: 'Lift, and the one focus treatment every control shares.',
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
:where(.btn) {
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

const LEVEL_1_DARK_CODE = `[data-theme='dark'] {
  --bg-app: var(--gray-950);
  --bg-surface: var(--gray-900);
  --bg-surface-raised: var(--gray-800);
  --bg-subtle: var(--gray-900);

  --text-strong: var(--gray-50);
  --text-body: var(--gray-200);
  --text-muted: var(--gray-400);

  --border-subtle: var(--gray-800);
  --border-default: var(--gray-700);
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

/* .btn is still there; your class rides alongside it */
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
type Mode = 'base' | 'dark';
type OdometerInk = 'accent' | 'warning';

const PREVIEW = 'zyncat-preview';
const PREVIEW_DARK = 'zyncat-preview-dark';

const CORNERS: Record<Corner, string> = { sharp: '0', default: '0.5rem', round: '1rem' };

const DARK_SURFACES: ThemeTokens['color'] = {
  bgApp: 'oklch(0.19 0.008 198)',
  bgSurface: 'oklch(0.225 0.008 198)',
  bgSurfaceRaised: 'oklch(0.265 0.008 198)',
  bgSubtle: 'oklch(0.245 0.008 198)',
  bgMuted: 'oklch(0.28 0.008 198)',
  bgInset: 'oklch(0.235 0.008 198)',
  textStrong: 'oklch(0.97 0.003 198)',
  textBody: 'oklch(0.92 0.004 198)',
  textSecondary: 'oklch(0.84 0.005 198)',
  textMuted: 'oklch(0.72 0.008 198)',
  textSubtle: 'oklch(0.64 0.01 198)',
  borderSubtle: 'oklch(0.3 0.008 198)',
  borderDefault: 'oklch(0.36 0.009 198)',
  borderStrong: 'oklch(0.44 0.01 198)',
};

const playgroundCode = (
  hue: number,
  corner: Corner,
  ink: OdometerInk,
) => `import { defineTheme, ZyncatTheme } from '@zyncat/ui/theme';

const base = defineTheme({
  accent: 'oklch(0.63 0.118 ${hue})',
  radius: '${CORNERS[corner]}',
  components: { odometer: { accent: 'var(--${ink})' } },
});

const dark = defineTheme({
  color: { bgApp: 'oklch(0.19 0.008 198)', textBody: 'oklch(0.92 0.004 198)', borderDefault: 'oklch(0.36 0.009 198)' },
});

// once, at the app root - beside your import of '@zyncat/ui/styles.css'
<ZyncatTheme theme={{ base, dark }} />;`;

export function ThemingPlayground() {
  const [hue, setHue] = useState(292);
  const [corner, setCorner] = useState<Corner>('round');
  const [mode, setMode] = useState<Mode>('base');
  const [ink, setInk] = useState<OdometerInk>('accent');
  const [total, setTotal] = useState(4820);

  const base = defineTheme({
    accent: `oklch(0.63 0.118 ${hue})`,
    radius: CORNERS[corner],
    components: { odometer: { accent: `var(--${ink})` } },
  });
  const dark = defineTheme({ ...base, color: DARK_SURFACES });

  return (
    <Playground
      code={playgroundCode(hue, corner, ink)}
      note="Every control writes one typed key at the top of the theme; the accent's hover, active, wash and focus ring, and every corner step, derive from it. The preview scopes the theme to this panel with a named theme, so the rest of the page keeps its own."
      rail={
        <>
          <KnobRange label="accent hue" value={hue} onChange={setHue} min={0} max={360} format={(v) => `${v}°`} />
          <KnobSegment label="radius" value={corner} onChange={setCorner} options={['sharp', 'default', 'round']} />
          <KnobSegment label="theme" value={mode} onChange={setMode} options={['base', 'dark']} />
          <KnobSegment label="odometer.accent" value={ink} onChange={setInk} options={['accent', 'warning']} />
        </>
      }
      stage="fill"
    >
      <ZyncatTheme theme={{ [PREVIEW]: base, [PREVIEW_DARK]: dark }} />
      <div className="theming-stage" data-theme={mode === 'dark' ? PREVIEW_DARK : PREVIEW}>
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
    </Playground>
  );
}

const THEME_FILE_CODE = `// zyncat.theme.ts
import { defineTheme } from '@zyncat/ui/theme';

export const base = defineTheme({
  accent: 'oklch(0.58 0.19 292)',
  radius: '0.75rem',
  fontSans: "'Inter', system-ui, sans-serif",
  motion: { durationBase: '180ms' },
  components: { odometer: { accent: 'var(--warning)' }, supportFan: { inset: 'var(--space-6)' } },
});

export const dark = defineTheme({
  color: { bgApp: 'oklch(0.19 0.008 198)', textBody: 'oklch(0.92 0.004 198)' },
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

{/* per-frame state the component writes to itself -> compile error */}
<Odometer value={total} style={{ '--odometer-velocity': '1' }} />`;

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
          Class names are BEM off a short base, so they are stable to target:{' '}
          <code className="doc-inline-code">.btn</code>, <code className="doc-inline-code">.btn--primary</code>,{' '}
          <code className="doc-inline-code">.btn__label</code>; <code className="doc-inline-code">.fld</code>,{' '}
          <code className="doc-inline-code">.fld__input</code>; <code className="doc-inline-code">.dialog__body</code>.
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
          with the CSS rather than drifting out of sync with it. The same mechanism gives you themes. A dark theme sets
          the neutral roles — surfaces, ink, borders — directly, in a block scoped to an attribute you toggle on{' '}
          <code className="doc-inline-code">&lt;html&gt;</code> or any subtree root. The derived tokens are declared on
          every theme root, so a subtree that repoints only the accent re-derives its whole family, while the neutral
          roles cascade through untouched.
        </p>

        <CodeBlock code={LEVEL_1_DARK_CODE} language="css" />

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

      <section className="guide-section" id="typed-theme">
        <h2 className="guide-section__title">The typed theme</h2>
        <p className="guide-section__p">
          <code className="doc-inline-code">@zyncat/ui/theme</code> is the same level 1 retheme with a type behind it,
          for a theme that is data: several named themes, values computed at build time, a design tool&rsquo;s export.
          The eight decisions are the top-level keys; every other token is a key on a group named the way the files are,
          so the editor completes the names, hovering one shows what it does and what it currently is, and a typo is a
          compile error instead of a property that silently does nothing.
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
          is why there is one prop rather than a light one, a dark one and a list.
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
            title="Decisions first, then groups"
            description="Eight decisions at the top level; under them color, type, space, radii, elevation, motion, glass, icon, layer, avatar — plus components for the scoped knobs, and custom for anything else."
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
          with the prefix dropped — <code className="doc-inline-code">components.odometer.accent</code> is{' '}
          <code className="doc-inline-code">--odometer-accent</code>. On one instance they are the component&rsquo;s own{' '}
          <code className="doc-inline-code">style</code> prop, which accepts the design tokens and that
          component&rsquo;s knobs, and nothing from any other component.
        </p>

        <CodeBlock code={TYPED_STYLE_CODE} language="tsx" />

        <p className="guide-section__p">
          That is also where the distinction below stops being something to remember: the per-frame properties are not
          on the type, so setting one is a compile error rather than a line that quietly does nothing.
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

        <Callout tone="note" title="A few are state, not knobs">
          The canvas and drag components write a handful of these to themselves every frame —{' '}
          <code className="doc-inline-code">--odometer-velocity</code>,{' '}
          <code className="doc-inline-code">--lens-lift</code>,{' '}
          <code className="doc-inline-code">--morphing-text-heat</code>,{' '}
          <code className="doc-inline-code">--support-rail-drag</code>,{' '}
          <code className="doc-inline-code">--youtube-progress</code>. Setting those from CSS does nothing; the next
          frame overwrites them.
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
          <code className="doc-inline-code">--font-sans</code>, <code className="doc-inline-code">--focus-ring</code>{' '}
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
