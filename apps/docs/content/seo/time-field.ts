import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Time Picker & Time Input Component',
  description:
    'A React time picker with segmented HH:mm entry, keyboard control and zero dependencies. Value stays a canonical 24-hour string in 12-hour or 24-hour display.',
  keywords: [
    'timepicker',
    'time picker',
    'react time picker',
    'html time picker',
    'html time input',
    'time picker html',
    'time picker ui',
    'input type time',
    'input time',
    'time field',
    'time picker react',
    'timefield',
    'time selector',
    'time input',
    'react timepicker',
  ],
  lede: 'A React time picker - a segmented HH:mm input with full keyboard control. For forms, bookings and schedules.',
  faq: [
    {
      q: 'How do I add a time picker to a React form?',
      a: 'Import it per subpath and give it a label and a value: import { TimeField } from \'@zyncat/ui/time-field\', then <TimeField label="Send at" value={time} onChange={setTime} />. Unlike a popover-based date picker, TimeField is inline - two segments for hours and minutes (a third AM/PM segment appears when format="12h") sitting directly in the field - and onChange fires the instant both segments are filled, no separate confirm step. It\'s a client component, so it drops straight into the Next.js App Router; pass defaultValue instead of value to run it uncontrolled.',
    },
    {
      q: 'Does the value change between 12-hour and 24-hour format?',
      a: "No. The format prop only changes how the field displays and lets you type the hour - 1 to 12 plus an AM/PM segment, or 0 to 23 - the value committed through onChange, and value, defaultValue, min and max themselves, are always the canonical 24-hour 'HH:mm' string. '14:30' is '14:30' whether the field is showing \"2:30 PM\" or \"14:30\".",
    },
    {
      q: 'Can I restrict the time to a range, like business hours or a booking window?',
      a: 'Pass min and/or max as \'HH:mm\', both inclusive: <TimeField min="09:00" max="17:00" /> keeps every pick inside a business day. The bounds saturate rather than reject - typing or arrowing past an edge clamps straight to min or max instead of refusing the keystroke, so the field can never commit a time outside the window.',
    },
    {
      q: 'Can you type or use the keyboard to set the time?',
      a: 'Yes - each segment is a real role="spinbutton". Type digits and the hour segment auto-advances to minutes once the entry is unambiguous, Arrow Up/Down step the hour by 1 and the minute by minuteStep, Backspace clears a segment, and Left/Right or the colon key move between segments. Pasting a time like "2:30pm" or "14:30" fills every segment in one go.',
    },
    {
      q: 'Can I limit the minute options to something like every 15 minutes?',
      a: 'Set minuteStep (default 5) - it governs the Up/Down arrow increment on the minute segment, so minuteStep={15} steps 00, 15, 30, 45. Typing stays exact to the minute regardless of the step, so a keyboard or paste entry can still land on any minute from 00 to 59.',
    },
    {
      q: 'How is this different from the native <input type="time">?',
      a: "The native time input's look and interaction vary by browser and OS, and it can't be themed. TimeField is a styled, segmented HH:mm control built from ordinary system tokens - --accent, --danger, --font-code, --ring-accent - so it matches the rest of a Zyncat UI form and behaves identically everywhere, with zero runtime dependencies beyond React 19 as a peer.",
    },
  ],
};

export default seo;
