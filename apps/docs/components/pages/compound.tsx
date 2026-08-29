'use client';

import { useState, type CSSProperties } from 'react';
import { ChatCircle, Clock, Envelope, Lifebuoy, Monitor, WhatsappLogo } from '@phosphor-icons/react';

import { Button } from '@zyncat/ui/button';
import { SupportFan, type SupportAction, type SupportFanLayout } from '@zyncat/ui/support-fan';
import { SupportRail } from '@zyncat/ui/support-rail';

const COLUMN: CSSProperties = { display: 'flex', gap: 'var(--space-4)', flexDirection: 'column' };
const ROW: CSSProperties = { display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' };
const GRID: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-4)',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
};
const CAPTION: CSSProperties = { font: 'var(--type-caption)', color: 'var(--text-muted)' };
const LABELLED: CSSProperties = { display: 'grid', gap: 'var(--space-1)' };
const LOG: CSSProperties = { font: 'var(--type-mono)', color: 'var(--text-subtle)', minHeight: 'var(--space-5)' };

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

const SHORT_FRAME: CSSProperties = { ...FRAME, height: '18rem' };
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

const INSTANT: CSSProperties = {
  '--support-rail-open-duration': '0ms',
  '--support-rail-close-duration': '0ms',
  '--support-rail-needle-delay': '0ms',
  '--support-rail-stagger': '0ms',
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

const MINIMAL_ACTIONS: SupportAction[] = [
  { id: 'chat', label: 'Live chat' },
  { id: 'mail', label: 'Email a ticket' },
  { id: 'docs', label: 'Read the runbook' },
];

const LAYOUTS: SupportFanLayout[] = ['arc', 'dock', 'icon-dock'];
const GLIDES = [0, 1, 1.8];
const SPREADS = [0.6, 1.45, 3];
const COUNTS = [2, 3, 5, 7];

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

export function SupportFanHero() {
  return (
    <div style={STAGE}>
      <span style={STAGE_NOTE}>Point at the row - it glides under the cursor</span>
      <SupportFan actions={ACTIONS} caption="Studio open · GMT+1" defaultOpen />
    </div>
  );
}

export function SupportFanLayoutDemo() {
  const [layout, setLayout] = useState<SupportFanLayout>('arc');
  return (
    <div style={COLUMN}>
      <div style={STAGE}>
        <span style={STAGE_NOTE}>{layout}</span>
        <SupportFan key={layout} actions={ACTIONS} layout={layout} caption="Studio open · GMT+1" defaultOpen />
      </div>
      <div style={ROW}>
        {LAYOUTS.map((name) => (
          <Button
            key={name}
            size="sm"
            variant={name === layout ? 'primary' : 'secondary'}
            onClick={() => setLayout(name)}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function SupportFanCountDemo() {
  const [count, setCount] = useState(5);
  return (
    <div style={COLUMN}>
      <div style={STAGE}>
        <span style={STAGE_NOTE}>{count} actions - the arc radius follows the count</span>
        <SupportFan actions={LONG_ACTIONS.slice(0, count)} caption="Studio open · GMT+1" defaultOpen />
      </div>
      <div style={ROW}>
        {COUNTS.map((n) => (
          <Button key={n} size="sm" variant={n === count ? 'primary' : 'secondary'} onClick={() => setCount(n)}>
            {n}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function SupportFanGlideDemo() {
  return (
    <div style={ROW}>
      {GLIDES.map((glide) => (
        <div key={glide} style={LABELLED}>
          <span style={CAPTION}>glide {glide}</span>
          <div style={HALF_STAGE}>
            <SupportFan
              actions={SHORT_ACTIONS}
              glide={glide}
              magnify={glide === 0 ? 0 : 1}
              caption="Glide"
              defaultOpen
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SupportFanBowDemo() {
  return (
    <div style={ROW}>
      {SPREADS.map((spread) => (
        <div key={spread} style={LABELLED}>
          <span style={CAPTION}>bow 1.6 · spread {spread}</span>
          <div style={HALF_STAGE}>
            <SupportFan actions={SHORT_ACTIONS} bow={1.6} spread={spread} caption="Bow" defaultOpen />
          </div>
        </div>
      ))}
    </div>
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

export function SupportFanTriggerDemo() {
  return (
    <div style={ROW}>
      <div style={LABELLED}>
        <span style={CAPTION}>live dot on (default)</span>
        <div style={HALF_STAGE}>
          <SupportFan actions={SHORT_ACTIONS} caption="On the desk" />
        </div>
      </div>
      <div style={LABELLED}>
        <span style={CAPTION}>live off, custom glyph and name</span>
        <div style={HALF_STAGE}>
          <SupportFan
            actions={SHORT_ACTIONS}
            live={false}
            label="Get help"
            triggerIcon={<Lifebuoy />}
            caption="Away until 09:00"
          />
        </div>
      </div>
    </div>
  );
}

export function SupportFanReducedMotionDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Under prefers-reduced-motion every --duration-* collapses to 1ms, so the slots and the stagger snap; the engine
        calls snap() once instead of starting the pointer loop, so every chip stays at its resting place at scale 1 and
        the caption still names whatever the pointer or the keyboard is on.
      </span>
      <div style={STAGE}>
        <span style={STAGE_NOTE}>Turn reduced motion on in the OS and reopen</span>
        <SupportFan actions={ACTIONS} caption="Studio open · GMT+1" />
      </div>
    </div>
  );
}

export function SupportRailHero() {
  return (
    <div style={FRAME}>
      <Page />
      <SupportRail actions={ACTIONS} status="Open · closes 20:00 GMT+1" live footer={<Shift />}>
        <div style={CHIPS}>
          <span style={CHIP}>Acme · Growth</span>
          <span style={CHIP}>Build 4.18.2</span>
          <span style={CHIP}>2 seats failing</span>
        </div>
      </SupportRail>
    </div>
  );
}

export function SupportRailSidesDemo() {
  return (
    <div style={GRID}>
      <div style={FRAME}>
        <Page />
        <SupportRail actions={ACTIONS} side="right" status="Right edge" needleLabel="Support" live defaultOpen />
      </div>
      <div style={FRAME}>
        <Page />
        <SupportRail actions={ACTIONS} side="left" status="Left edge" needleLabel="Aide" live defaultOpen />
      </div>
    </div>
  );
}

export function SupportRailMinimalDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        No status, no footer, no children, no meta or description: the rows stay aligned and the panel keeps its
        proportions.
      </span>
      <div style={SHORT_FRAME}>
        <Page />
        <SupportRail actions={MINIMAL_ACTIONS} title="Need a hand?" needleLabel="Help" />
      </div>
    </div>
  );
}

export function SupportRailSelectDemo() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Selecting a row does not close the rail. The app decides what happens next and renders it through children.
      </span>
      <div style={FRAME}>
        <Page />
        <SupportRail
          actions={ACTIONS}
          status="Pick a channel"
          live
          defaultOpen
          onSelect={(id) => setPicked(id)}
          footer={<Shift />}
        >
          <span style={LOG}>{picked ? 'Routing to ' + picked + '…' : 'Nothing picked yet.'}</span>
        </SupportRail>
      </div>
    </div>
  );
}

export function SupportRailControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={COLUMN}>
      <div style={ROW}>
        <Button size="sm" variant="secondary" onClick={() => setOpen(!open)}>
          {open ? 'Close from outside' : 'Open from outside'}
        </Button>
        <span style={CAPTION}>
          Hit this while the panel is still collapsing: the shell reverses from wherever it is instead of restarting.
        </span>
      </div>
      <div style={FRAME}>
        <Page />
        <SupportRail actions={ACTIONS} status="Controlled" live open={open} onOpenChange={setOpen} footer={<Shift />} />
      </div>
    </div>
  );
}

export function SupportRailDragDemo() {
  const [log, setLog] = useState('idle');
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Drag the grabber on the panel&apos;s inner edge outward to dismiss - past 88px, or a shorter flick over 500px/s.
        Drag it the wrong way and it rubber-bands at a sixth of the travel. Escape and the close button are the keyboard
        equivalents.
      </span>
      <div style={FRAME}>
        <Page />
        <SupportRail
          actions={ACTIONS}
          status="Drag me out"
          live
          defaultOpen
          onOpenChange={(next) => setLog(next ? 'opened' : 'dismissed')}
        />
      </div>
      <span style={LOG}>{log}</span>
    </div>
  );
}

export function SupportRailResizeDemo() {
  const [tall, setTall] = useState(false);
  const frame: CSSProperties = { ...FRAME, height: tall ? '30rem' : '16rem' };
  return (
    <div style={COLUMN}>
      <div style={ROW}>
        <Button size="sm" variant="secondary" onClick={() => setTall(!tall)}>
          {tall ? 'Shrink the container' : 'Grow the container'}
        </Button>
        <span style={CAPTION}>
          The collapse target is measured, not pinned: resize the container, close the rail, and it still folds exactly
          onto the needle.
        </span>
      </div>
      <div style={frame}>
        <Page />
        <SupportRail actions={ACTIONS} status="Measured collapse" live defaultOpen />
      </div>
    </div>
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

export function SupportRailReducedMotionDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Under prefers-reduced-motion every --duration-* collapses to 1ms: the panel appears at full size, the rows land
        without a stagger, and the live dot keeps a static halo instead of a repeating one. The right-hand rail forces
        the same duration knobs to 0ms, which demonstrates the knobs rather than the media query.
      </span>
      <div style={GRID}>
        <div style={SHORT_FRAME}>
          <Page />
          <SupportRail actions={MINIMAL_ACTIONS} status="Token timing" live />
        </div>
        <div style={SHORT_FRAME}>
          <Page />
          <SupportRail actions={MINIMAL_ACTIONS} status="Knobs at 0ms" live style={INSTANT} />
        </div>
      </div>
    </div>
  );
}
