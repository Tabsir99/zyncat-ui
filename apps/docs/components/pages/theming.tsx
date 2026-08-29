'use client';

import { useState, type CSSProperties } from 'react';

import { Badge } from '@zyncat/ui/badge';
import { Button } from '@zyncat/ui/button';
import { Odometer } from '@zyncat/ui/odometer';
import { StatusBadge } from '@zyncat/ui/status-badge';
import { TextField } from '@zyncat/ui/text-field';

import { Callout, CodeBlock, TabGroup } from '../kit';

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
    count: 12,
    sample: '--weight-field-reach, --weight-field-peak-weight',
  },
  {
    component: 'FlowField',
    subpath: 'flow-field',
    count: 15,
    sample: '--flow-field-ramp-0 … -11, --flow-field-accent',
  },
  { component: 'Confetti', subpath: 'confetti', count: 21, sample: '--confetti-paper-1 … -5, --confetti-weights' },
  {
    component: 'SupportFan',
    subpath: 'support-fan',
    count: 26,
    sample: '--support-fan-surface, --support-fan-stagger',
  },
  {
    component: 'SupportRail',
    subpath: 'support-rail',
    count: 26,
    sample: '--support-rail-width, --support-rail-accent',
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

const LEVEL_1_CODE = `/* your-app.css - loaded after @zyncat/ui/styles.css */
:root {
  --accent: oklch(0.58 0.19 292);
  --accent-hover: oklch(0.5 0.19 292);
  --accent-active: oklch(0.43 0.17 292);
  --accent-subtle: oklch(0.96 0.03 292);
  --accent-border: oklch(0.86 0.07 292);
  --text-accent: oklch(0.43 0.17 292);

  --radius-md: var(--radius-full);
  --radius-lg: var(--radius-full);
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

const LEVEL_2_CODE = `<Odometer value={total} style={{ '--odometer-size': 'var(--size-display-lg)', '--odometer-accent': 'var(--danger)' }} />

/* or from any ancestor, for every instance underneath */
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

        <div className="props-table-wrapper">
          <table className="props-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Level</th>
                <th style={{ width: '26%' }}>Mechanism</th>
                <th style={{ width: '20%' }}>Reaches</th>
                <th style={{ width: '44%' }}>Use it when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code className="prop-badge prop-badge--name">0</code>
                </td>
                <td>Your own unlayered CSS</td>
                <td>Every instance</td>
                <td>You need a rule the token vocabulary has no name for.</td>
              </tr>
              <tr>
                <td>
                  <code className="prop-badge prop-badge--name">1</code>
                </td>
                <td>
                  Tokens on <code className="doc-inline-code">:root</code>
                </td>
                <td>The whole system</td>
                <td>You are rebranding, adding a dark theme, or retiming motion.</td>
              </tr>
              <tr>
                <td>
                  <code className="prop-badge prop-badge--name">2</code>
                </td>
                <td>
                  Scoped <code className="doc-inline-code">--component-*</code> properties
                </td>
                <td>One component</td>
                <td>An expressive or compound component needs retuning, not rebuilding.</td>
              </tr>
              <tr>
                <td>
                  <code className="prop-badge prop-badge--name">3</code>
                </td>
                <td>
                  <code className="doc-inline-code">className</code>, <code className="doc-inline-code">style</code>,{' '}
                  <code className="doc-inline-code">htmlProps</code>
                </td>
                <td>One instance</td>
                <td>This one button, in this one layout, needs to be different.</td>
              </tr>
            </tbody>
          </table>
        </div>
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
          Repoint the semantic tokens and the whole system moves at once. Components read them live, and the WAAPI
          motion engine reads the same DOM values, so animation retimes with the CSS rather than drifting out of sync
          with it.
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
          <div className="theming-cell theming-retheme">
            <span className="theming-cell__label">Six tokens repointed</span>
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
          The same mechanism gives you themes. Scope the block to an attribute instead of{' '}
          <code className="doc-inline-code">:root</code> and toggle it on{' '}
          <code className="doc-inline-code">&lt;html&gt;</code>:
        </p>

        <CodeBlock code={LEVEL_1_DARK_CODE} language="css" />

        <Callout tone="warning" title="Duration tokens belong on :root">
          Reduced motion is handled for you — every <code className="doc-inline-code">--duration-*</code> collapses to
          1ms under <code className="doc-inline-code">prefers-reduced-motion: reduce</code>. That collapse targets{' '}
          <code className="doc-inline-code">:root</code>, so a duration repointed on a nested scope inherits straight
          past it and animates at full speed for a user who asked for none.
        </Callout>

        <CodeBlock code={REDUCED_MOTION_CODE} language="css" />

        <p className="guide-section__p">
          The full vocabulary — colour, spacing, type, radius, elevation, motion, icons, layers, glass, avatar — is
          printed with real values by the MCP server&rsquo;s <code className="doc-inline-code">get_tokens</code> tool.
        </p>
      </section>

      <section className="guide-section" id="level-2">
        <h2 className="guide-section__title">Level 2 — retune one component</h2>
        <p className="guide-section__p">
          Expressive and compound components publish scoped{' '}
          <code className="doc-inline-code">--&lt;component&gt;-&lt;name&gt;</code> custom properties as their public
          contract. Set them inline, or on any ancestor to reach every instance underneath. System primitives and
          composites publish none by design: they answer to the token vocabulary alone, so retheme those at level 1.
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
              style={
                {
                  '--odometer-size': 'var(--size-display-lg)',
                  '--odometer-accent': 'var(--danger)',
                  '--odometer-gap': '0.12em',
                } as CSSProperties
              }
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

        <div className="props-table-wrapper">
          <table className="props-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Component</th>
                <th style={{ width: '14%' }}>Properties</th>
                <th style={{ width: '64%' }}>For example</th>
              </tr>
            </thead>
            <tbody>
              {SCOPED_PROPERTIES.map((row) => (
                <tr key={row.subpath}>
                  <td>
                    <code className="prop-badge prop-badge--name">{row.component}</code>
                  </td>
                  <td>{row.count}</td>
                  <td className="props-td-desc">
                    <code className="prop-badge prop-badge--type">{row.sample}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout tone="note" title="A few are state, not knobs">
          The canvas and drag components write a handful of these to themselves every frame —{' '}
          <code className="doc-inline-code">--odometer-velocity</code>,{' '}
          <code className="doc-inline-code">--lens-lift</code>,{' '}
          <code className="doc-inline-code">--morphing-text-heat</code>,{' '}
          <code className="doc-inline-code">--weight-field-wght</code>,{' '}
          <code className="doc-inline-code">--support-fan-x</code>,{' '}
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
