import type { ComponentDoc } from './types';

export const datetime: Record<string, ComponentDoc> = {
  'date-field': {
    example: `import { DateField } from '@zyncat/ui/date-field';

<DateField
  label="Start date"
  value={date}
  onChange={setDate}
  min="2026-06-01"
  timezone="Europe/Riga"
/>`,
  },

  'datetime-field': {
    example: `import { DateTimeField } from '@zyncat/ui/datetime-field';

<DateTimeField
  label="Schedule post"
  value={scheduledAt}
  onChange={setScheduledAt}
  format="12h"
  minuteStep={15}
  timezone="America/New_York"
/>`,
  },

  'date-range': {
    example: `import { DateRangeField } from '@zyncat/ui/date-range-field';

<DateRangeField
  label="Reporting period"
  value={range}
  onChange={setRange}
  max={today}
/>`,
  },

  'time-field': {
    example: `import { TimeField } from '@zyncat/ui/time-field';

<TimeField
  label="Send at"
  value={sendAt}
  onChange={setSendAt}
  format="12h"
  minuteStep={15}
  min="09:00"
  max="17:30"
/>`,
  },

  tabs: {
    example: `import { Tabs, TabPanel } from '@zyncat/ui/tabs';

const items = [
  { value: 'scheduled', label: 'Scheduled', count: 12 },
  { value: 'published', label: 'Published' },
  { value: 'failed', label: 'Failed', count: 3 },
];

<Tabs
  name="batch"
  ariaLabel="Batch status"
  variant="pill"
  items={items}
  value={view}
  onChange={(v, d) => { setView(v); setDir(d); }}
/>
<TabPanel name="batch" tab={view} dir={dir}>
  {panels[view]}
</TabPanel>`,
  },
};
