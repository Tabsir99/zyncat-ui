import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Datetime Picker Component',
  description:
    "React datetime picker: a month calendar plus a segmented time input in one popover. Matches datetime-local's value, 'YYYY-MM-DDTHH:mm'. Zero dependencies.",
  keywords: [
    'datetimepicker',
    'react datetime picker',
    'date time picker',
    'react datetimepicker',
    'date and time picker',
    'react date time picker',
    'datetime-local',
    'datetime picker',
    'react date time',
    'datepicker with time',
    'html datetime',
  ],
  lede: 'A React datetime picker - a month calendar plus a segmented time input in one popover. For scheduling forms.',
  faq: [
    {
      q: 'How do I add a combined date and time picker to a React form?',
      a: 'Import it per subpath and give it a label and a value: import { DateTimeField } from \'@zyncat/ui/datetime-field\', then <DateTimeField label="Publish timestamp" value={datetime} onChange={setDatetime} />. It is a client component, so it drops straight into the Next.js App Router. onChange only fires once both the day and the time are set - pick a date and leave the time blank and nothing commits yet, which is why picking either half first never produces a half-finished value.',
    },
    {
      q: "Why is the value a string like '2026-09-02T14:30' instead of a Date object?",
      a: 'Because that string is exactly the value format the native <input type="datetime-local"> uses - value, defaultValue, min and max all take the same \'YYYY-MM-DDTHH:mm\' shape. It sorts correctly as a string, drops straight into a datetime-local form field or a timestamp column, and new Date(value) parses it directly on the rare occasion you need the object.',
    },
    {
      q: 'Can I limit the time picker to a window on a specific day, not just a date range?',
      a: "Yes - min and max each accept either 'YYYY-MM-DD' for a whole-day bound or the full 'YYYY-MM-DDTHH:mm' to also bound the time. Pass max=\"2026-09-02T17:00\" and every day up to September 2 stays fully open, but the moment you pick September 2 itself, the time segments clamp to 17:00 and below.",
    },
    {
      q: 'Does the timezone prop convert the time I pick?',
      a: "No - timezone only labels the footer with that zone's current GMT offset, read via Intl.DateTimeFormat; it never shifts the committed 'YYYY-MM-DDTHH:mm' string. Pass an IANA name like timezone=\"Europe/Riga\" for context next to the Done button, and treat the value itself as the local time the user actually clicked.",
    },
    {
      q: 'Does it need dayjs, date-fns or Moment for the time math?',
      a: "No - @zyncat/ui has zero runtime dependencies and React 19 as its only peer, while MUI X's date pickers need a date-library adapter (date-fns, dayjs, luxon or moment) just to render. The calendar grid, the min/max clamping and the hour/minute stepping all run on the built-in Date and plain string comparison, with Intl.DateTimeFormat used only for the optional timezone label.",
    },
    {
      q: 'Can I type the time instead of clicking, or only use the arrow keys?',
      a: 'Both - the Hours and Minutes segments are role="spinbutton" controls you can type digits into directly (type 1 then 4 for 14, and focus jumps to Minutes automatically), or step with ArrowUp/ArrowDown, minutes moving by the minuteStep prop (default 5). Backspace clears a segment, arrow keys move between segments, and pasting text like "3:45 PM" fills both at once; under prefers-reduced-motion the month-slide and the selected-day pill settle instantly instead of animating.',
    },
  ],
};

export default seo;
