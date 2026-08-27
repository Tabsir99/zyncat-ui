'use client';

import { useState } from 'react';

import { DateField } from '@zyncat/ui/date-field';
import { DateRangeField } from '@zyncat/ui/date-range-field';
import { DateTimeField } from '@zyncat/ui/datetime-field';
import { Tabs } from '@zyncat/ui/tabs';
import { TimeField } from '@zyncat/ui/time-field';

const W = 320;

/* ==========================================================================
   DateField
   ========================================================================== */
export function DateFieldHero() {
  const [val, setVal] = useState<string | null>('2026-08-21');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <DateField label="Publish date" value={val} onChange={setVal} />
    </div>
  );
}

export function DateFieldBoundsDemo() {
  const [val, setVal] = useState<string | null>('2026-08-25');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <DateField
        label="Schedule window"
        min="2026-08-01"
        max="2026-08-31"
        message="Restricted to current month."
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
  const [val, setVal] = useState<string | null>('2026-08-21T14:30');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <DateTimeField label="Publish timestamp" value={val} onChange={setVal} />
    </div>
  );
}

/* ==========================================================================
   DateRangeField
   ========================================================================== */
export function DateRangeFieldHero() {
  const [range, setRange] = useState<{ start: string; end: string } | null>({ start: '2026-08-10', end: '2026-08-24' });
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <DateRangeField label="Campaign duration" value={range} onChange={setRange} />
    </div>
  );
}

/* ==========================================================================
   TimeField
   ========================================================================== */
export function TimeFieldHero() {
  const [time, setTime] = useState<string | null>('09:00');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <TimeField label="Broadcast time" value={time} onChange={setTime} />
    </div>
  );
}

/* ==========================================================================
   Tabs
   ========================================================================== */
const TAB_ITEMS = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
];

export function TabsHero() {
  const [active, setActive] = useState('overview');
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <Tabs items={TAB_ITEMS} value={active} onChange={setActive} />
    </div>
  );
}
