import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Date Picker & Calendar Component',
  description:
    "React date picker with a month calendar in a popover, min/max bounds and full keyboard control. Its value is a plain 'YYYY-MM-DD' string, not a Date object.",
  keywords: [
    'date picker',
    'react datepicker',
    'react date picker',
    'react calendar',
    'datepicker',
    'html date input',
    'react calendar component',
    'date picker in react',
    'html date picker',
    'input type date',
    'datepicker react',
    'react calendar picker',
    'calendar component',
    'date selector',
    'date input',
  ],
  lede: "A React date picker - a month calendar in a popover that commits a plain 'YYYY-MM-DD' string. For forms.",
  faq: [
    {
      q: 'How do I add a date picker to a React or Next.js form?',
      a: 'Import it per subpath and give it a label and a value: import { DateField } from \'@zyncat/ui/date-field\', then <DateField label="Publish date" value={date} onChange={setDate} />. The calendar opens in a popover under the trigger and commit is live, so each day you pick fires onChange immediately; the panel stays up until you press Done, click outside or hit Escape. It is a client component, so it drops straight into the Next.js App Router - link @zyncat/ui/styles.css once at the root, and pass defaultValue instead of value to run it uncontrolled.',
    },
    {
      q: 'Why does the date picker give me a string instead of a Date object?',
      a: 'Because a calendar date has no time and no timezone, and \'YYYY-MM-DD\' says exactly that. onChange hands you that string, and value, defaultValue, min and max all take the same shape - the same shape <input type="date"> puts in its value, JSON carries unaltered and a SQL date column stores. So there is nothing to serialise, nothing to shift across zones on the round trip, and new Date(value) is one line away on the rare occasion you want the object.',
    },
    {
      q: 'How do I disable past dates or limit the picker to a range?',
      a: 'Pass min, max or both as \'YYYY-MM-DD\', each inclusive: <DateField label="Ship date" min="2026-09-02" max="2026-12-31" />. Days outside the window render disabled so they cannot be picked or focused, and the month arrows stop once the previous or next month falls entirely outside the bounds. A separate timezone prop takes an IANA name like \'Europe/Riga\' and only labels the footer with its GMT offset - it never shifts the date you picked.',
    },
    {
      q: 'Does it need date-fns, dayjs or Moment?',
      a: 'No. Most React date pickers pull one in - react-datepicker takes date-fns as a peer dependency - while @zyncat/ui has zero runtime dependencies and React 19 as its only peer. The month grid, the leading blanks and the min/max comparison run on the built-in Date and plain string ordering, with Intl.DateTimeFormat used only for the optional timezone label. Nothing lands in your bundle but the component and its CSS.',
    },
    {
      q: 'How do I restyle the calendar without Tailwind?',
      a: 'Override CSS custom properties rather than fight class names - there is no Tailwind, no CSS-in-JS and no config file. It reads the ordinary system tokens: --accent for the selected day pill, --bg-surface-raised and --shadow-lg for the popover, --radius-lg, --focus-ring, --danger for the invalid state. One property is its own, --dtp-cell, which sizes all seven day columns and defaults to --control-height. Set them on :root or on a single wrapper.',
    },
    {
      q: 'Can you pick a date with the keyboard?',
      a: 'Yes - the day grid is a real role="grid" with roving focus that lands in it when the popover opens. Arrow keys move by a day or a week, PageUp and PageDown change month, Home and End jump to the ends of the week, Enter or Space commits, and Escape closes. Every cell carries its full date as an aria-label, the panel is a role="dialog" named by your label, and under prefers-reduced-motion the month slide and the pill that travels between days settle instantly instead of animating.',
    },
  ],
};

export default seo;
