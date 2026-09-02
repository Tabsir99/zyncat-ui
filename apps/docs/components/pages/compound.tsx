'use client';

import { useState, type CSSProperties } from 'react';
import { ChatCircle, Clock, Envelope, Monitor, WhatsappLogo } from '@phosphor-icons/react';

import { SupportRail, type SupportAction, type SupportRailProps } from '@zyncat/ui/support-rail';

import { KnobSegment, KnobSwitch, KnobText, Playground } from '../playground';

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
