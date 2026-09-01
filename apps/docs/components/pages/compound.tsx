'use client';

import { useState, type CSSProperties } from 'react';
import { ChatCircle, Clock, Envelope, Lifebuoy, Monitor, WhatsappLogo } from '@phosphor-icons/react';

import { Button } from '@zyncat/ui/button';
import { SupportFan, type SupportAction, type SupportFanLayout } from '@zyncat/ui/support-fan';
import { SupportRail, type SupportRailProps } from '@zyncat/ui/support-rail';

import { KnobRange, KnobSegment, KnobSwitch, KnobText, Playground } from '../playground';

const COLUMN: CSSProperties = { display: 'flex', gap: 'var(--space-4)', flexDirection: 'column' };
const ROW: CSSProperties = { display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' };
const GRID: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-4)',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
};
const CAPTION: CSSProperties = { font: 'var(--type-caption)', color: 'var(--text-muted)' };
const LABELLED: CSSProperties = { display: 'grid', gap: 'var(--space-1)' };

const STAGE: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  minHeight: 'calc(var(--space-10) * 3.4)',
  borderRadius: 'var(--radius-lg)',
  border: 'var(--border-hairline) solid var(--border-default)',
  background: 'var(--bg-subtle)',
};

const WIDE_STAGE: CSSProperties = { ...STAGE, minHeight: 'calc(var(--space-10) * 2)' };
const HALF_STAGE: CSSProperties = { ...STAGE, flex: '1 1 0', minWidth: 'calc(var(--space-10) * 4)' };

const STAGE_NOTE: CSSProperties = {
  position: 'absolute',
  left: 'var(--space-4)',
  top: 'var(--space-4)',
  font: 'var(--type-caption)',
  color: 'var(--text-muted)',
};

const FRAME: CSSProperties = {
  position: 'relative',
  height: '26rem',
  borderRadius: 'var(--radius-xl)',
  border: 'var(--border-hairline) solid var(--border-subtle)',
  background: 'var(--bg-app)',
  overflow: 'hidden',
  isolation: 'isolate',
};

const PAGE: CSSProperties = { padding: 'var(--space-5)', maxWidth: '30ch', color: 'var(--text-muted)' };

const CHIPS: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' };
const CHIP: CSSProperties = {
  padding: 'var(--space-1) var(--space-2)',
  border: 'var(--border-hairline) solid var(--border-subtle)',
  borderRadius: 'var(--radius-full)',
  font: 'var(--type-micro)',
  fontWeight: 'var(--weight-regular)',
  color: 'var(--text-secondary)',
};

const SEATS: CSSProperties = { display: 'flex' };
const SEAT: CSSProperties = {
  width: 'var(--space-5)',
  height: 'var(--space-5)',
  marginLeft: 'calc(var(--space-2) * -1)',
  display: 'grid',
  placeItems: 'center',
  borderRadius: 'var(--radius-full)',
  border: 'var(--border-hairline) solid var(--bg-surface)',
  background: 'var(--bg-muted)',
  font: 'var(--type-mono)',
  fontSize: 'var(--size-micro)',
  color: 'var(--text-secondary)',
};
const SEAT_LEAD: CSSProperties = {
  ...SEAT,
  marginLeft: 0,
  background: 'var(--accent-wash)',
  color: 'var(--text-accent)',
};

const GRAPHITE: CSSProperties = {
  '--support-fan-trigger-size': '4rem',
  '--support-fan-surface': 'var(--gray-900)',
  '--support-fan-surface-lifted': 'var(--gray-800)',
  '--support-fan-ink': 'var(--text-inverse)',
  '--support-fan-ink-soft': 'var(--gray-300)',
  '--support-fan-ink-faint': 'var(--gray-400)',
  '--support-fan-line': 'var(--gray-700)',
  '--support-fan-accent': 'var(--accent-lift)',
  '--support-fan-caption-tracking': '0.24em',
  '--support-fan-collapse-scale': '0.12',
} as CSSProperties;

const SNAPPY: CSSProperties = {
  '--support-fan-open-duration': 'var(--duration-base)',
  '--support-fan-close-duration': 'var(--duration-fast)',
  '--support-fan-stagger': 'calc(var(--duration-fast) * 0.12)',
  '--support-fan-inset': 'var(--space-4)',
} as CSSProperties;

const LOUD: CSSProperties = {
  '--support-rail-width': '272px',
  '--support-rail-needle-width': '34px',
  '--support-rail-needle-height': '210px',
  '--support-rail-row-pad-block': 'var(--space-2)',
  '--support-rail-row-pad-inline': 'var(--space-5)',
  '--support-rail-radius': 'var(--radius-md)',
  '--support-rail-surface': 'var(--bg-muted)',
  '--support-rail-accent': 'var(--danger)',
  '--support-rail-caps-tracking': '0.28em',
  '--support-rail-open-duration': 'var(--duration-slowest)',
} as CSSProperties;

const ACTIONS: SupportAction[] = [
  { id: 'chat', label: 'Live chat', meta: '~40s', icon: <ChatCircle />, description: '5 engineers on shift now' },
  { id: 'call', label: 'Book a call', meta: '15:00', icon: <Clock />, description: '25 min, screen optional' },
  { id: 'wa', label: 'WhatsApp', meta: '~6m', icon: <WhatsappLogo />, description: 'Keep the thread on your phone' },
  {
    id: 'mail',
    label: 'Email a ticket',
    meta: '~4h',
    icon: <Envelope />,
    description: 'Attach logs, we thread the reply',
  },
  { id: 'share', label: 'Screen share', meta: 'on ask', icon: <Monitor />, description: 'You approve every frame' },
];

const SHORT_ACTIONS: SupportAction[] = ACTIONS.slice(0, 3);
const LONG_ACTIONS: SupportAction[] = ACTIONS.concat([
  { id: 'docs', label: 'Read the docs', meta: 'always', icon: <Lifebuoy />, description: 'Self serve' },
  { id: 'status', label: 'Status page', meta: 'live', icon: <Monitor />, description: 'Every incident, public' },
]);

function Page() {
  return (
    <div style={PAGE}>
      <p>Page content sits behind the rail. The closed rail never blocks a click on it.</p>
      <p>The needle is the only hit target until the panel opens.</p>
    </div>
  );
}

function Shift() {
  return (
    <>
      <span style={SEATS}>
        <span style={SEAT_LEAD}>ME</span>
        <span style={SEAT}>IV</span>
        <span style={SEAT}>RK</span>
      </span>
      <span>Mara, Idris &amp; 3 more on shift</span>
    </>
  );
}

export function SupportFanPlayground() {
  const [layout, setLayout] = useState<SupportFanLayout>('arc');
  const [count, setCount] = useState(5);
  const [glide, setGlide] = useState(1);
  const [bow, setBow] = useState(1);
  const [spread, setSpread] = useState(1.45);
  const [live, setLive] = useState(true);

  const code = `<SupportFan
  actions={actions.slice(0, ${count})}
  layout="${layout}"
  glide={${glide}}
  bow={${bow}}
  spread={${spread}}
  live={${live}}
  caption="Studio open · GMT+1"
  onSelect={route}
/>`;

  return (
    <Playground
      code={code}
      stage="bare"
      note="Switch the layout while the row is still deploying - the slots retarget from wherever they are."
      rail={
        <>
          <KnobSegment label="layout" value={layout} onChange={setLayout} options={['arc', 'dock', 'icon-dock']} />
          <KnobRange label="actions" value={count} onChange={setCount} min={2} max={7} />
          <KnobRange label="glide" value={glide} onChange={setGlide} min={0} max={2} step={0.1} />
          <KnobRange label="bow" value={bow} onChange={setBow} min={0} max={2} step={0.1} />
          <KnobRange label="spread" value={spread} onChange={setSpread} min={0.6} max={3} step={0.05} />
          <KnobSwitch label="live" checked={live} onChange={setLive} />
        </>
      }
    >
      <div style={{ ...STAGE, border: 'none', borderRadius: 0, background: 'transparent' }}>
        <span style={STAGE_NOTE}>Point at the row - it glides under the cursor</span>
        <SupportFan
          actions={LONG_ACTIONS.slice(0, count)}
          layout={layout}
          glide={glide}
          bow={bow}
          spread={spread}
          live={live}
          caption="Studio open · GMT+1"
          defaultOpen
        />
      </div>
    </Playground>
  );
}

export function SupportFanKeyboardDemo() {
  return (
    <div style={WIDE_STAGE}>
      <span style={STAGE_NOTE}>
        Tab to the trigger, then Down/Up to open onto the first/last chip. Arrows step, Home/End jump, Escape returns
        focus. The row glides to the focused chip exactly as it does for the pointer.
      </span>
      <SupportFan actions={ACTIONS} layout="dock" caption="Keyboard drives the same field" />
    </div>
  );
}

export function SupportFanControlledDemo() {
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<SupportFanLayout>('arc');
  const [picked, setPicked] = useState('nothing yet');
  return (
    <div style={COLUMN}>
      <div style={STAGE}>
        <span style={STAGE_NOTE}>picked: {picked}</span>
        <SupportFan
          actions={ACTIONS}
          layout={layout}
          open={open}
          onOpenChange={setOpen}
          onSelect={(id, action) => setPicked(action.label + ' (' + id + ')')}
          caption="Interrupt me"
        />
      </div>
      <div style={ROW}>
        <Button size="sm" variant="secondary" onClick={() => setOpen(!open)}>
          Toggle
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setLayout(layout === 'arc' ? 'dock' : layout === 'dock' ? 'icon-dock' : 'arc')}
        >
          Next layout ({layout})
        </Button>
        <span style={CAPTION}>open = {String(open)}</span>
      </div>
    </div>
  );
}

export function SupportFanThemeDemo() {
  return (
    <div style={{ ...ROW, alignItems: 'stretch' }}>
      <div style={LABELLED}>
        <span style={CAPTION}>House defaults</span>
        <div style={HALF_STAGE}>
          <SupportFan actions={SHORT_ACTIONS} caption="House" defaultOpen />
        </div>
      </div>
      <div style={LABELLED}>
        <span style={CAPTION}>Level 2 - graphite scoped properties</span>
        <div style={HALF_STAGE}>
          <SupportFan actions={SHORT_ACTIONS} caption="Graphite" style={GRAPHITE} defaultOpen />
        </div>
      </div>
      <div style={LABELLED}>
        <span style={CAPTION}>Level 2 - retuned durations</span>
        <div style={HALF_STAGE}>
          <SupportFan actions={SHORT_ACTIONS} caption="Snappy" style={SNAPPY} defaultOpen />
        </div>
      </div>
    </div>
  );
}

export function SupportRailPlayground() {
  const [side, setSide] = useState<NonNullable<SupportRailProps['side']>>('right');
  const [open, setOpen] = useState(true);
  const [live, setLive] = useState(true);
  const [needleLabel, setNeedleLabel] = useState('Support');
  const [picked, setPicked] = useState<string | null>(null);

  const code = `<SupportRail
  actions={actions}
  side="${side}"
  open={open}
  onOpenChange={setOpen}
  needleLabel="${needleLabel}"
  status="Open · closes 20:00 GMT+1"
  live={${live}}
  onSelect={route}
  footer={<Shift />}
/>`;

  return (
    <Playground
      code={code}
      stage="bare"
      note="Drag the grabber on the panel's inner edge outward past 88px - or flick it over 500px/s - to dismiss."
      rail={
        <>
          <KnobSegment label="side" value={side} onChange={setSide} options={['right', 'left']} />
          <KnobSwitch label="open" checked={open} onChange={setOpen} />
          <KnobSwitch label="live" checked={live} onChange={setLive} />
          <KnobText label="needle label" value={needleLabel} onChange={setNeedleLabel} />
        </>
      }
    >
      <div style={{ ...FRAME, border: 'none', borderRadius: 0 }}>
        <Page />
        <SupportRail
          actions={ACTIONS}
          side={side}
          open={open}
          onOpenChange={setOpen}
          needleLabel={needleLabel || 'Support'}
          status="Open · closes 20:00 GMT+1"
          live={live}
          onSelect={(id) => setPicked(id)}
          footer={<Shift />}
        >
          <div style={CHIPS}>
            <span style={CHIP}>Acme · Growth</span>
            <span style={CHIP}>Build 4.18.2</span>
            <span style={CHIP}>{picked ? 'Routing to ' + picked + '…' : 'Nothing picked yet'}</span>
          </div>
        </SupportRail>
      </div>
    </Playground>
  );
}

export function SupportRailThemeDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Level 2 override: every knob is a --support-rail-* custom property on the root, so a narrower panel, a taller
        needle, tighter rows, sharper corners, a different accent and a slower spring need no props.
      </span>
      <div style={GRID}>
        <div style={FRAME}>
          <Page />
          <SupportRail actions={ACTIONS} status="Defaults" live defaultOpen footer={<Shift />} />
        </div>
        <div style={FRAME}>
          <Page />
          <SupportRail
            actions={ACTIONS}
            status="Retuned"
            needleLabel="Escalate"
            live
            defaultOpen
            style={LOUD}
            footer={<Shift />}
          />
        </div>
      </div>
    </div>
  );
}
