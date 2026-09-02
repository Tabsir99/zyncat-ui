import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Date Range Picker Component',
  description:
    'A React date range picker: two taps set start and end, min/max bounds, quick presets. Zero runtime dependencies - no dayjs, date-fns or Moment required.',
  keywords: [
    'date range picker',
    'date range',
    'daterangepicker',
    'react date range picker',
    'range picker',
    'date range picker react',
    'react date range',
    'daterange',
    'date range selector',
    'daterange picker',
    'daterangepicker react',
    'react daterangepicker',
  ],
  lede: 'A React date range picker - two taps set the start and end. For booking forms and analytics date filters.',
  faq: [
    {
      q: 'How do I add a date range picker to a React or Next.js form?',
      a: 'Import it per subpath and give it a label and a value: import { DateRangeField } from \'@zyncat/ui/date-range-field\', then <DateRangeField label="Reporting period" value={range} onChange={setRange} />. It is a client component, so it drops straight into the Next.js App Router - link @zyncat/ui/styles.css once at the root, and pass defaultValue instead of value to run it uncontrolled. On viewports 640px and narrower the panel switches from a popover to a bottom sheet on its own.',
    },
    {
      q: "Why doesn't onChange fire after I click the first day?",
      a: "A range needs two endpoints: the first day you click becomes a provisional anchor, hovering or arrowing to another day previews the band before anything commits, and the second click auto-orders the pair into { start, end } regardless of which end you clicked first, then fires onChange once. value and defaultValue take that same DateRange shape, both 'YYYY-MM-DD', or null when empty - a lone anchor never commits, so a half-made pick can't leak into your state.",
    },
    {
      q: 'How do I disable past dates or cap the picker to a min/max window?',
      a: "Pass min, max or both as 'YYYY-MM-DD', each inclusive: <DateRangeField label=\"Stay dates\" min=\"2026-09-02\" />. Days outside the window render disabled so neither endpoint can land there, and a month's arrow disables once that whole adjacent month falls outside the bounds. A separate timezone prop takes an IANA name like 'Europe/Riga' and only labels the footer with its GMT offset - it never shifts the committed start or end.",
    },
    {
      q: 'Does it have quick presets like Last 7 days or This month?',
      a: "Yes - eight presets sit beside the calendar: Today, Yesterday, Last 7 days, Last 30 days, This month, Last month, Last 90 days and Year to date, the same vocabulary a booking form's check-in/check-out step or an analytics dashboard's reporting-date filter already uses. Clicking one commits a complete range immediately, with no anchor step.",
    },
    {
      q: 'Does it need dayjs, date-fns or Moment for the range math?',
      a: 'No - @zyncat/ui has zero runtime dependencies and React 19 as its only peer. The two-month grid, the day-count readout and the min/max comparison all run on plain string ordering and the built-in Date; Intl.DateTimeFormat appears once, inside the optional timezone label. Nothing but the component and its CSS lands in your bundle.',
    },
    {
      q: 'Can you pick a date range with the keyboard alone?',
      a: 'Yes - the grid is a real role="grid" with roving focus, arrow keys move a day or a week, PageUp and PageDown change month, Enter or Space sets the anchor then commits the pair, and Escape cancels a half-picked anchor without closing the panel. Every cell carries its full date as an aria-label and the panel is a role="dialog" named by your label; under prefers-reduced-motion the sliding month animation is skipped and the pill that travels between the start and end caps settles instantly.',
    },
  ],
};

export default seo;
