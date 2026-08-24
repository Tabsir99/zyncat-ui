import { useState } from 'react';
import { DateField } from '@zyncat/ui/date-field';
import { DateTimeField } from '@zyncat/ui/datetime-field';
import { DateRangeField } from '@zyncat/ui/date-range-field';
import { TimeField } from '@zyncat/ui/time-field';
import { Tabs } from '@zyncat/ui/tabs';

const W = 320;

/* ==========================================================================
   DateField
   ========================================================================== */
export function DateFieldHero() {
  const [val, setVal] = useState('2026-08-21');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <DateField id="hero-date" label="Publish date" value={val} onChange={setVal} />
    </div>
  );
}

export function DateFieldBoundsDemo() {
  const [val, setVal] = useState('2026-08-25');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <DateField
        id="bounds-date"
        label="Schedule window"
        min="2026-08-01"
        max="2026-08-31"
        helper="Restricted to current month."
        value={val}
        onChange={setVal}
      />
    </div>
  );
}

/* ==========================================================================
   DateTimeField
   ========================================================================== */
export function DateTimeFieldHero() {
  const [val, setVal] = useState('2026-08-21T14:30');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <DateTimeField id="hero-datetime" label="Publish timestamp" value={val} onChange={setVal} />
    </div>
  );
}

/* ==========================================================================
   DateRangeField
   ========================================================================== */
export function DateRangeFieldHero() {
  const [start, setStart] = useState('2026-08-10');
  const [end, setEnd] = useState('2026-08-24');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <DateRangeField
        id="hero-daterange"
        label="Campaign duration"
        startDate={start}
        endDate={end}
        onRangeChange={(s, e) => {
          setStart(s);
          setEnd(e);
        }}
      />
    </div>
  );
}

/* ==========================================================================
   TimeField
   ========================================================================== */
export function TimeFieldHero() {
  const [time, setTime] = useState('09:00');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <TimeField id="hero-time" label="Broadcast time" value={time} onChange={setTime} />
    </div>
  );
}

/* ==========================================================================
   Tabs
   ========================================================================== */
const TAB_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    children: (
      <div style={{ padding: '16px 0', color: 'var(--text-muted)' }}>Project analytics and summary metrics.</div>
    ),
  },
  {
    id: 'activity',
    label: 'Activity',
    children: (
      <div style={{ padding: '16px 0', color: 'var(--text-muted)' }}>Recent scheduled batches and team changes.</div>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    children: (
      <div style={{ padding: '16px 0', color: 'var(--text-muted)' }}>Team member roles and webhook settings.</div>
    ),
  },
];

export function TabsHero() {
  const [active, setActive] = useState('overview');
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <Tabs items={TAB_ITEMS} activeId={active} onChange={setActive} />
    </div>
  );
}
