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
    props: [
      { name: 'value', type: 'string | null', description: 'Controlled value, format YYYY-MM-DD.' },
      {
        name: 'defaultValue',
        type: 'string | null',
        default: 'null',
        description: 'Uncontrolled initial date, format YYYY-MM-DD.',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        description: 'Fires on day pick with the new YYYY-MM-DD string.',
      },
      { name: 'label', type: 'string', description: 'Visible label rendered above the field.' },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Pick a date'",
        description: 'Text shown when no date is selected.',
      },
      {
        name: 'timezone',
        type: 'string',
        description: 'IANA timezone name (e.g. Europe/Riga), shown as GMT offset in the popover footer.',
      },
      { name: 'min', type: 'string', description: 'Earliest pickable date, format YYYY-MM-DD, inclusive.' },
      { name: 'max', type: 'string', description: 'Latest pickable date, format YYYY-MM-DD, inclusive.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Appends an asterisk to the label.' },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'Applies danger border and error message color.',
      },
      { name: 'message', type: 'string', description: 'Helper or error text rendered below the field.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger button.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra class names on the field shell.' },
    ],
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
    props: [
      { name: 'value', type: 'string | null', description: 'Controlled value, format YYYY-MM-DDTHH:mm.' },
      {
        name: 'defaultValue',
        type: 'string | null',
        default: 'null',
        description: 'Uncontrolled initial value, format YYYY-MM-DDTHH:mm.',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        description: 'Fires on a complete date and time selection.',
      },
      { name: 'label', type: 'string', description: 'Visible label rendered above the field.' },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Pick date & time'",
        description: 'Text shown when no value is selected.',
      },
      {
        name: 'timezone',
        type: 'string',
        description: 'IANA timezone name (e.g. Europe/Riga), shown in the popover footer.',
      },
      { name: 'min', type: 'string', description: 'Lower bound, format YYYY-MM-DD or YYYY-MM-DDTHH:mm, inclusive.' },
      { name: 'max', type: 'string', description: 'Upper bound, format YYYY-MM-DD or YYYY-MM-DDTHH:mm, inclusive.' },
      {
        name: 'format',
        type: "'24h' | '12h'",
        default: "'24h'",
        description: 'Display format for the time segment; storage always stays in 24h.',
      },
      {
        name: 'minuteStep',
        type: 'number',
        default: '5',
        description: 'Arrow key step granularity in minutes; typing accepts any exact value.',
      },
      { name: 'required', type: 'boolean', default: 'false', description: 'Appends an asterisk to the label.' },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'Applies danger border and error message color.',
      },
      { name: 'message', type: 'string', description: 'Helper or error text rendered below the field.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger button.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra class names on the field shell.' },
    ],
  },

  'date-range': {
    example: `import { DateRangeField } from '@zyncat/ui/date-range-field';

<DateRangeField
  label="Reporting period"
  value={range}
  onChange={setRange}
  max={today}
/>`,
    props: [
      {
        name: 'value',
        type: 'DateRange | null',
        description: 'Controlled range with start and end as YYYY-MM-DD strings, or null when empty.',
      },
      {
        name: 'defaultValue',
        type: 'DateRange | null',
        default: 'null',
        description: 'Uncontrolled initial range value.',
      },
      {
        name: 'onChange',
        type: '(value: DateRange) => void',
        description: 'Fires only when both endpoints are confirmed; a lone anchor never commits.',
      },
      { name: 'label', type: 'string', description: 'Visible label rendered above the field.' },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Pick a date range'",
        description: 'Text shown when no range is selected.',
      },
      {
        name: 'timezone',
        type: 'string',
        description: 'IANA timezone name (e.g. Europe/Riga), shown in the panel footer for display context.',
      },
      { name: 'min', type: 'string', description: 'Earliest pickable date, format YYYY-MM-DD, inclusive.' },
      { name: 'max', type: 'string', description: 'Latest pickable date, format YYYY-MM-DD, inclusive.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Appends an asterisk to the label.' },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'Applies danger border and error message color.',
      },
      { name: 'message', type: 'string', description: 'Helper or error text rendered below the field.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger button.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra class names on the field shell.' },
    ],
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
    props: [
      { name: 'value', type: 'string | null', description: 'Controlled value, canonical format HH:mm in 24h.' },
      {
        name: 'defaultValue',
        type: 'string | null',
        default: 'null',
        description: 'Uncontrolled initial time value, format HH:mm.',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        description: 'Fires live the instant both hour and minute segments are filled.',
      },
      { name: 'label', type: 'string', description: 'Visible label rendered above the field.' },
      {
        name: 'format',
        type: "'24h' | '12h'",
        default: "'24h'",
        description: 'Display format for the time segments; storage always stays in 24h HH:mm.',
      },
      {
        name: 'minuteStep',
        type: 'number',
        default: '5',
        description: 'Arrow key step granularity in minutes; typing accepts any exact value.',
      },
      {
        name: 'min',
        type: 'string',
        description: 'Lower bound in HH:mm; values outside the bound are clamped, not rejected.',
      },
      {
        name: 'max',
        type: 'string',
        description: 'Upper bound in HH:mm; values outside the bound are clamped, not rejected.',
      },
      { name: 'required', type: 'boolean', default: 'false', description: 'Appends an asterisk to the label.' },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'Applies danger border and error message color.',
      },
      { name: 'message', type: 'string', description: 'Helper or error text rendered below the field.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all time segment inputs.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra class names on the field shell.' },
    ],
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
  label="Batch status"
  items={items}
  value={view}
  onChange={(v, d) => { setView(v); setDir(d); }}
/>
<TabPanel name="batch" tab={view} dir={dir}>
  {/* active panel content */}
</TabPanel>`,
    props: [
      // Tabs props
      {
        name: 'items',
        type: 'TabItem[]',
        default: '[]',
        description:
          'Array of tab descriptors; each has value (string), label (ReactNode), and optional icon, count, and disabled fields.',
      },
      {
        name: 'value',
        type: 'string | null | undefined',
        required: true,
        description: 'Controlled value of the active tab; null or undefined hides the ink underline.',
      },
      {
        name: 'onChange',
        type: '(value: string, dir: 1 | -1) => void',
        description: 'Fires on click and arrow-key travel; dir is +1 for rightward movement and -1 for leftward.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Shared id prefix wiring tab and panel aria; omit when no managed panel is paired.',
      },
      { name: 'label', type: 'string', description: 'aria-label for the tablist element.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra class names on the Tabs wrapper.' },
      {
        name: '...rest',
        type: 'HTMLAttributes<HTMLDivElement>',
        description: 'Additional div props (excluding onChange) forwarded to the Tabs wrapper element.',
      },
      // TabPanel props
      {
        name: 'tab',
        type: 'string',
        required: true,
        description: 'The active tab value; changing it triggers the panel entrance animation.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Same name as the paired Tabs, wires role, id, and aria-labelledby.',
      },
      {
        name: 'dir',
        type: '-1 | 0 | 1',
        default: '0',
        description: 'Direction of travel from Tabs onChange; 0 produces a plain fade.',
      },
      { name: 'children', type: 'ReactNode', description: 'Content rendered inside the panel.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra class names on the panel wrapper.' },
      {
        name: '...rest',
        type: 'HTMLAttributes<HTMLDivElement>',
        description: 'Additional div props (excluding dir) forwarded to the TabPanel element.',
      },
    ],
  },
};
