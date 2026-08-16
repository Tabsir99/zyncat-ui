import { useState, type CSSProperties } from 'react';
import { DateField } from '@zyncat/ui/date-field';
import { DateTimeField } from '@zyncat/ui/datetime-field';
import { DateRangeField, type DateRange } from '@zyncat/ui/date-range-field';
import { TimeField } from '@zyncat/ui/time-field';
import { Tabs, TabPanel, type TabItem } from '@zyncat/ui/tabs';
import { Demo } from '../kit';
import { Icon } from '../icon';

const COL: CSSProperties = { minWidth: 240, maxWidth: 320 };

export function DateFieldPage() {
  const [date, setDate] = useState<string | null>(null);
  const [datePreset, setDatePreset] = useState<string | null>('2026-06-18');
  return (
    <>
      <Demo label="empty">
        <div style={COL}>
          <DateField label="Start date" value={date} onChange={setDate} timezone="Europe/Riga" />
        </div>
      </Demo>
      <Demo label="preset - bounded">
        <div style={COL}>
          <DateField
            label="Start date"
            value={datePreset}
            onChange={setDatePreset}
            timezone="Europe/Riga"
            min="2026-06-01"
            max="2026-12-31"
          />
        </div>
      </Demo>
      <Demo label="disabled">
        <div style={COL}>
          <DateField label="Start date" defaultValue="2026-06-18" disabled />
        </div>
      </Demo>
    </>
  );
}

export function DateTimeFieldPage() {
  const [dateTime, setDateTime] = useState<string | null>(null);
  const [dateTimePreset, setDateTimePreset] = useState<string | null>('2026-06-18T09:30');
  return (
    <>
      <Demo label="empty">
        <div style={COL}>
          <DateTimeField label="Due at" value={dateTime} onChange={setDateTime} timezone="Europe/Riga" />
        </div>
      </Demo>
      <Demo label="preset - 12h - 15-min steps">
        <div style={COL}>
          <DateTimeField
            label="Due at"
            value={dateTimePreset}
            onChange={setDateTimePreset}
            timezone="Europe/Riga"
            format="12h"
            minuteStep={15}
            min="2026-06-12T08:00"
          />
        </div>
      </Demo>
      <Demo label="disabled">
        <div style={COL}>
          <DateTimeField label="Due at" defaultValue="2026-06-18T09:30" disabled />
        </div>
      </Demo>
    </>
  );
}

export function DateRangePage() {
  const [range, setRange] = useState<DateRange | null>(null);
  const [rangePreset, setRangePreset] = useState<DateRange | null>({ start: '2026-06-01', end: '2026-06-30' });
  return (
    <>
      <Demo label="empty">
        <div style={COL}>
          <DateRangeField label="Reporting period" value={range} onChange={setRange} timezone="Europe/Riga" />
        </div>
      </Demo>
      <Demo label="preset - bounded">
        <div style={COL}>
          <DateRangeField
            label="Reporting period"
            value={rangePreset}
            onChange={setRangePreset}
            min="2026-01-01"
            max="2026-12-31"
          />
        </div>
      </Demo>
      <Demo label="disabled">
        <div style={COL}>
          <DateRangeField label="Reporting period" defaultValue={{ start: '2026-06-01', end: '2026-06-30' }} disabled />
        </div>
      </Demo>
    </>
  );
}

export function TimeFieldPage() {
  const [time, setTime] = useState<string | null>(null);
  const [timePreset, setTimePreset] = useState<string | null>('09:30');
  return (
    <>
      <Demo label="empty">
        <div style={COL}>
          <TimeField label="Send at" value={time} onChange={setTime} />
        </div>
      </Demo>
      <Demo label="preset - 12h - 15-min - bounded">
        <div style={COL}>
          <TimeField
            label="Send at"
            value={timePreset}
            onChange={setTimePreset}
            format="12h"
            minuteStep={15}
            min="09:00"
            max="17:30"
          />
        </div>
      </Demo>
      <Demo label="disabled">
        <div style={COL}>
          <TimeField label="Send at" defaultValue="09:30" disabled />
        </div>
      </Demo>
    </>
  );
}

const TAB_DEFS = [
  { value: 'overview', label: 'Overview', icon: 'house', count: 12 },
  { value: 'activity', label: 'Activity', icon: 'clock', count: 4 },
  { value: 'members', label: 'Members', icon: 'users', count: 128 },
  { value: 'settings', label: 'Settings', icon: 'gear', disabled: true },
] as const;

export function TabsPage() {
  const [view, setView] = useState<string>('overview');
  const [dir, setDir] = useState<-1 | 0 | 1>(0);

  // active tab fills its icon - selection-aware nodes built by the consumer
  const items: TabItem[] = TAB_DEFS.map((t) => ({
    ...t,
    icon: <Icon name={t.icon} weight={view === t.value ? 'fill' : 'regular'} />,
  }));
  return (
    <Demo label="controlled - with panels">
      <div className="stack" style={{ width: '100%', maxWidth: 560 }}>
        <Tabs
          name="views"
          ariaLabel="Workspace views"
          value={view}
          onChange={(v, d) => {
            setView(v);
            setDir(d);
          }}
          items={items}
        />
        <TabPanel name="views" tab={view} dir={dir} style={{ padding: 'var(--space-4) 0', color: 'var(--text-muted)' }}>
          {view === 'overview' && <span>A calm summary of everything at a glance.</span>}
          {view === 'activity' && <span>4 events in the last hour.</span>}
          {view === 'members' && <span>128 people across your workspace.</span>}
        </TabPanel>
      </div>
    </Demo>
  );
}
