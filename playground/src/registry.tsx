// The single source of truth for the docs: every group - its primitives, each
// with the route slug, sidebar label, page blurb, and the component that renders
// it. Both the sidebar nav and the router are built from this one array, so
// adding a component is one import + one entry here.
import type { ComponentType } from 'react';
import * as P from './pages/primitives';
import * as F from './pages/forms';
import * as D from './pages/data';
import * as T from './pages/datetime';
import * as O from './pages/overlays';
import { CONTENT } from './content';
import type { PropRow } from './PropsTable';

export interface Doc {
  slug: string;
  label: string;
  blurb: string;
  Component: ComponentType;
  example?: string;
  props?: PropRow[];
}

export interface DocGroup {
  id: string;
  title: string;
  docs: Doc[];
}

export const GROUPS: DocGroup[] = [
  {
    id: 'primitives',
    title: 'Primitives',
    docs: [
      {
        slug: 'button',
        label: 'Button',
        blurb: 'One control for every click action. Exactly one primary per view.',
        Component: P.ButtonPage,
      },
      {
        slug: 'icon',
        label: 'Icon',
        blurb: 'Any Phosphor glyph by name or semantic alias; fill marks active.',
        Component: P.IconPage,
      },
      {
        slug: 'collapse',
        label: 'Collapse',
        blurb: 'Layout-transition primitive - grid-fr open/close, never touches auto.',
        Component: P.CollapsePage,
      },
      {
        slug: 'badge',
        label: 'Badge',
        blurb: 'Glass or outline. Status hues reserved for genuine status.',
        Component: P.BadgePage,
      },
      {
        slug: 'status-badge',
        label: 'StatusBadge',
        blurb: 'Canonical status - tone + one-word label; morph animates in place.',
        Component: P.StatusBadgePage,
      },
      {
        slug: 'count-badge',
        label: 'CountBadge',
        blurb: 'Mono, tabular counts; roll animates digits like an odometer.',
        Component: P.CountBadgePage,
      },
    ],
  },
  {
    id: 'forms',
    title: 'Forms',
    docs: [
      {
        slug: 'text-field',
        label: 'TextField',
        blurb: 'The base text input - states disclose via Collapse, never jump.',
        Component: F.TextFieldPage,
      },
      {
        slug: 'number-field',
        label: 'NumberField',
        blurb: 'Tabular figures, caret steppers, unit suffix, clamp to bounds.',
        Component: F.NumberFieldPage,
      },
      {
        slug: 'otp-field',
        label: 'OtpField',
        blurb: 'Segmented one-time-code - auto-advance, paste-to-fill.',
        Component: F.OtpFieldPage,
      },
      {
        slug: 'textarea',
        label: 'Textarea',
        blurb: 'Auto-grow, character meter, over-limit highlight, ⌘/Ctrl+↵ submit.',
        Component: F.TextareaPage,
      },
      {
        slug: 'checkbox',
        label: 'Checkbox',
        blurb: 'Stages a choice you submit later - fill springs in, then the tick draws on.',
        Component: F.CheckboxPage,
      },
      {
        slug: 'toggle',
        label: 'Toggle',
        blurb: 'Actuates a setting on the spot - the thumb travels on a real spring.',
        Component: F.TogglePage,
      },
      {
        slug: 'radio-group',
        label: 'RadioGroup',
        blurb: 'Pick exactly one - quiet rows or selectable cards; the marker glides.',
        Component: F.RadioGroupPage,
      },
      {
        slug: 'select',
        label: 'Select',
        blurb: 'Custom single-select listbox - committing closes and returns focus.',
        Component: F.SelectPage,
      },
      {
        slug: 'multi-select',
        label: 'MultiSelect',
        blurb: 'Many-of listbox - toggling keeps the menu open; trigger summarises as first +N.',
        Component: F.MultiSelectPage,
      },
    ],
  },
  {
    id: 'data',
    title: 'Data display',
    docs: [
      {
        slug: 'avatar',
        label: 'Avatar',
        blurb: 'Identity mark - image, initials, or silhouette, with presence.',
        Component: D.AvatarPage,
      },
      {
        slug: 'tag',
        label: 'Tag',
        blurb: 'User-owned label - removable entries, applied filters. A control, not a status.',
        Component: D.TagPage,
      },
      {
        slug: 'table',
        label: 'Table',
        blurb: 'Declare columns + rows; it owns sort, selection, stickiness, overflow.',
        Component: D.TablePage,
      },
      {
        slug: 'pagination',
        label: 'Pagination',
        blurb: 'Honest cursor strip - a mono range readout and a prev/next pair.',
        Component: D.PaginationPage,
      },
    ],
  },
  {
    id: 'datetime',
    title: 'Date, time & tabs',
    docs: [
      {
        slug: 'date-field',
        label: 'DateField',
        blurb: "A month calendar in a popover; commit is live, value is 'YYYY-MM-DD'.",
        Component: T.DateFieldPage,
      },
      {
        slug: 'datetime-field',
        label: 'DateTimeField',
        blurb: "Calendar plus the segmented HH:MM machine; value is 'YYYY-MM-DDTHH:mm'.",
        Component: T.DateTimeFieldPage,
      },
      {
        slug: 'date-range',
        label: 'DateRangeField',
        blurb: 'Two-tap auto-ordering window; commits only when both ends exist.',
        Component: T.DateRangePage,
      },
      {
        slug: 'time-field',
        label: 'TimeField',
        blurb: "The standalone segmented time machine; value is 'HH:mm', bounds saturate.",
        Component: T.TimeFieldPage,
      },
      {
        slug: 'tabs',
        label: 'Tabs',
        blurb:
          'Line tabs - the ink reaches then releases; panels enter from the side you moved toward.',
        Component: T.TabsPage,
      },
    ],
  },
  {
    id: 'overlays',
    title: 'Overlays & feedback',
    docs: [
      {
        slug: 'alert',
        label: 'Alert',
        blurb: 'Persistent, in-flow status. Existence is the only motion - dismissal eases shut.',
        Component: O.AlertPage,
      },
      {
        slug: 'toast',
        label: 'Toast',
        blurb:
          'Imperative toast() API. Mount <Toaster /> once at the root, then fire one from anywhere.',
        Component: O.ToastPage,
      },
      {
        slug: 'tooltip',
        label: 'Tooltip',
        blurb: 'Transient hint on hover/focus. One bubble travels between triggers.',
        Component: O.TooltipPage,
      },
      {
        slug: 'dialog',
        label: 'Dialog',
        blurb: 'Styled modal over the headless overlay - scrim, focus trap, scroll lock.',
        Component: O.DialogPage,
      },
      {
        slug: 'popover',
        label: 'Popover',
        blurb:
          'Headless anchored panel, non-modal - flips and clamps to the viewport. The render-prop gets { close }.',
        Component: O.PopoverPage,
      },
      {
        slug: 'sheet',
        label: 'Sheet',
        blurb: 'Modal panel docked to an edge - drag-to-dismiss, coupled scrim, scroll handoff.',
        Component: O.SheetPage,
      },
    ],
  },
];

export const DOCS: Doc[] = GROUPS.flatMap((g) => g.docs).map((d) => ({
  ...d,
  ...CONTENT[d.slug],
}));
