import type { ComponentDoc } from './types';

export const forms: Record<string, ComponentDoc> = {
  'text-field': {
    example: `import { TextField } from 'premium-ds/text-field';

<TextField
  id="post-title"
  label="Post title"
  placeholder="Enter a title..."
  required
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  clearable
  helper="Shown in the content calendar."
/>`,
    props: [
      { name: 'id', type: 'string', description: 'Field id that ties the label to the input.' },
      { name: 'label', type: 'ReactNode', description: 'Label text (sentence case).' },
      { name: 'required', type: 'boolean', description: 'Show a danger * after the label.' },
      { name: 'optional', type: 'boolean', description: 'Show a muted (optional) after the label.' },
      {
        name: 'helper',
        type: 'ReactNode',
        description: 'Neutral helper text shown when there is no validation message.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description:
          'Error message; sets the error state (red border, ring, icon). Wins over warning, success, and helper.',
      },
      { name: 'warning', type: 'ReactNode', description: 'Warning message - amber state.' },
      { name: 'success', type: 'ReactNode', description: 'Success message - green state.' },
      { name: 'leadingIcon', type: 'ReactNode', description: 'Leading icon node sized to the control. Decorative.' },
      { name: 'clearable', type: 'boolean', description: 'Show a clear button when the field has a value.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Control height: sm 28px, md 36px (default), lg 40px.' },
      {
        name: '...rest',
        type: 'InputHTMLAttributes<HTMLInputElement>',
        description: 'All native input attributes except size.',
      },
    ],
  },

  'number-field': {
    example: `import { NumberField } from 'premium-ds/number-field';

<NumberField
  id="posts-per-day"
  label="Posts per day"
  unit="posts"
  min={1}
  max={20}
  step={1}
  value={postsPerDay}
  onChange={setPostsPerDay}
  helper="Maximum allowed by your plan."
/>`,
    props: [
      { name: 'id', type: 'string', description: 'Field id that ties the label to the input.' },
      { name: 'label', type: 'ReactNode', description: 'Label text (sentence case).' },
      { name: 'helper', type: 'ReactNode', description: 'Neutral helper text shown below the field.' },
      { name: 'error', type: 'ReactNode', description: 'Error message; also sets the error state (red border, icon).' },
      { name: 'unit', type: 'string', description: 'Unit suffix shown inside the field (e.g. "days" or "%").' },
      {
        name: 'min',
        type: 'number',
        default: '0',
        description: 'Lower bound; stepper disables at this value and input clamps on blur.',
      },
      {
        name: 'max',
        type: 'number',
        default: 'Infinity',
        description: 'Upper bound; stepper disables at this value and input clamps on blur.',
      },
      { name: 'step', type: 'number', default: '1', description: 'Increment used by the steppers and arrow keys.' },
      { name: 'value', type: 'number | string', description: 'Controlled numeric value.' },
      { name: 'onChange', type: '(value: number) => void', description: 'Called with the next clamped number.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Control height: sm, md (default), lg.' },
      {
        name: '...rest',
        type: 'InputHTMLAttributes<HTMLInputElement>',
        description: 'All native input attributes except size, value, onChange, min, max, and step.',
      },
    ],
  },

  'otp-field': {
    example: `import { OtpField } from 'premium-ds/otp-field';

<OtpField
  length={6}
  group={3}
  value={code}
  onChange={setCode}
/>`,
    props: [
      { name: 'length', type: 'number', default: '6', description: 'Number of digit slots.' },
      { name: 'value', type: 'string', default: "''", description: 'Controlled digit string.' },
      {
        name: 'onChange',
        type: '(value: string) => void',
        description: 'Called with the updated digit string after each keystroke or paste.',
      },
      { name: 'group', type: 'number', description: 'Insert a visual separator between every N slots.' },
      { name: 'error', type: 'boolean', description: 'Error state - red slots and focus ring.' },
      { name: 'disabled', type: 'boolean', description: 'Disables all slots.' },
      { name: 'size', type: "'sm'", description: 'Compact size variant; sm is the only non-default option.' },
      {
        name: 'className',
        type: 'string',
        default: "''",
        description: 'Extra class names merged onto the root element.',
      },
    ],
  },

  textarea: {
    example: `import { Textarea } from 'premium-ds/textarea';

<Textarea
  id="post-body"
  label="Post content"
  placeholder="Write your post..."
  required
  max={280}
  minRows={3}
  value={body}
  onChange={(e) => setBody(e.target.value)}
  onSubmit={schedulePost}
  hint="Cmd+Enter to schedule"
/>`,
    props: [
      { name: 'id', type: 'string', description: 'Field id that ties the label to the textarea.' },
      { name: 'label', type: 'ReactNode', description: 'Label text (sentence case).' },
      { name: 'required', type: 'boolean', description: 'Show a danger * after the label.' },
      { name: 'optional', type: 'boolean', description: 'Show a muted (optional) after the label.' },
      {
        name: 'helper',
        type: 'ReactNode',
        description: 'Neutral helper text shown when there is no validation message.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description:
          'Error message; sets the error state (border, icon, colour). Wins over warning, success, and helper.',
      },
      { name: 'warning', type: 'ReactNode', description: 'Warning message - amber state.' },
      { name: 'success', type: 'ReactNode', description: 'Success message - green state.' },
      { name: 'value', type: 'string', default: "''", description: 'Controlled text value.' },
      { name: 'onChange', type: 'ChangeEventHandler<HTMLTextAreaElement>', description: 'Standard change handler.' },
      {
        name: 'onSubmit',
        type: '(value: string) => void',
        description: 'Fired on Cmd/Ctrl+Enter with the current text.',
      },
      {
        name: 'max',
        type: 'number',
        description: 'Soft char limit; shows the ring meter and highlights over-limit text. Does not truncate.',
      },
      {
        name: 'minRows',
        type: 'number',
        default: '3',
        description: 'Visible rows before the textarea starts growing.',
      },
      {
        name: 'maxRows',
        type: 'number',
        default: '10',
        description: 'Row cap before the box scrolls instead of growing.',
      },
      {
        name: 'warnAt',
        type: 'number',
        default: '20',
        description: 'Remaining-char threshold that flips the meter amber.',
      },
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Footer hint shown left of the char meter (e.g. a Cmd+Enter affordance).',
      },
      { name: 'size', type: "'md' | 'lg'", description: 'md for default fields; lg for a prominent composer.' },
      {
        name: '...rest',
        type: 'TextareaHTMLAttributes<HTMLTextAreaElement>',
        description: 'All native textarea attributes except size, rows, and onSubmit.',
      },
    ],
  },

  checkbox: {
    example: `import { Checkbox } from 'premium-ds/checkbox';

<Checkbox
  label="Pin to top of queue"
  description="Published before any other queued items."
  checked={pinned}
  onChange={(e) => setPinned(e.target.checked)}
/>`,
    props: [
      { name: 'checked', type: 'boolean', description: 'Controlled checked state; omit for uncontrolled.' },
      { name: 'defaultChecked', type: 'boolean', description: 'Uncontrolled initial state.' },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: 'The some-not-all select-all state; visually wins over checked.',
      },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'Error state for consent gates; also sets aria-invalid.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Inert and de-emphasized; distinct fill when checked.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Box size: md 18px (default) or sm 16px for dense table rows.',
      },
      { name: 'label', type: 'ReactNode', description: 'Label text beside the box.' },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Optional secondary line under the label for settings rows.',
      },
      {
        name: 'onChange',
        type: 'ChangeEventHandler<HTMLInputElement>',
        description: 'Fires on toggle; read e.target.checked.',
      },
      {
        name: '...rest',
        type: 'InputHTMLAttributes<HTMLInputElement>',
        description: 'All native input attributes except size and type.',
      },
    ],
  },

  toggle: {
    example: `import { Toggle } from 'premium-ds/toggle';

<Toggle
  label="Auto-publish drafts"
  description="Scheduled drafts publish automatically at their queued time."
  checked={autoPublish}
  onChange={(e) => setAutoPublish(e.target.checked)}
/>`,
    props: [
      { name: 'checked', type: 'boolean', description: 'Controlled checked state; omit for uncontrolled.' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Uncontrolled initial state.' },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Inert and de-emphasized; faded track that retains its on/off position.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Track size: md 36x20px (default) or sm 28x16px for dense settings rows.',
      },
      { name: 'label', type: 'ReactNode', description: 'Label text beside the track.' },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Optional secondary line under the label for settings rows.',
      },
      {
        name: 'onChange',
        type: 'ChangeEventHandler<HTMLInputElement>',
        description: 'Fires on flip; read e.target.checked.',
      },
      {
        name: '...rest',
        type: 'InputHTMLAttributes<HTMLInputElement>',
        description: 'All native input attributes except size and type.',
      },
    ],
  },

  'radio-group': {
    example: `import { RadioGroup } from 'premium-ds/radio-group';

const CADENCE_OPTIONS = [
  { value: 'daily', label: 'Daily', description: 'One post per day.' },
  { value: 'weekly', label: 'Weekly', description: 'One post per week.' },
  { value: 'custom', label: 'Custom', description: 'Set your own interval.' },
];

<RadioGroup
  name="cadence"
  label="Posting cadence"
  value={cadence}
  onChange={setCadence}
  options={CADENCE_OPTIONS}
/>`,
    props: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Shared radio name that ties the options into one keyboard group.',
      },
      { name: 'value', type: 'string', description: 'The selected value (controlled).' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called with the chosen option value.' },
      { name: 'label', type: 'ReactNode', description: 'Group label and legend (sentence case).' },
      {
        name: 'helper',
        type: 'ReactNode',
        description: 'Persistent context shown under the legend before the options.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Group-level error; sets the error state and reveals the message.',
      },
      { name: 'required', type: 'boolean', description: 'Show a danger * after the label.' },
      { name: 'optional', type: 'boolean', description: 'Show a muted (optional) after the label.' },
      {
        name: 'variant',
        type: "'rows' | 'cards'",
        default: "'rows'",
        description: 'Skin: quiet rows (default) or selectable cards.',
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: 'Lay options out horizontally instead of stacked vertically.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Control size: sm (dot 16px) or md (default, dot 18px).',
      },
      { name: 'disabled', type: 'boolean', description: 'Disable the whole group.' },
      { name: 'options', type: 'RadioOption[]', required: true, description: 'The options to choose between.' },
      {
        name: 'className',
        type: 'string',
        default: "''",
        description: 'Extra class names merged onto the root fieldset.',
      },
      {
        name: '...rest',
        type: 'FieldsetHTMLAttributes<HTMLFieldSetElement>',
        description: 'All native fieldset attributes except onChange.',
      },
    ],
  },

  select: {
    example: `import { Select } from 'premium-ds/select';

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'New York (ET)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

<Select
  options={TIMEZONE_OPTIONS}
  value={timezone}
  onChange={(v) => setTimezone(v)}
  placeholder="Choose a time zone"
  searchable
  ariaLabel="Time zone"
/>`,
    props: [
      {
        name: 'options',
        type: 'SelectOption[] | SelectGroup[]',
        required: true,
        description: 'Flat option list or array of grouped options.',
      },
      { name: 'value', type: 'string | null', description: 'Controlled value; null clears the selection.' },
      {
        name: 'defaultValue',
        type: 'string | null',
        default: 'null',
        description: 'Initial value for uncontrolled use.',
      },
      {
        name: 'onChange',
        type: '(value: string, option: SelectOption) => void',
        description: 'Called with the chosen value and the full option object.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Select an option'",
        description: 'Trigger label shown when nothing is selected.',
      },
      { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Trigger and menu size.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Inert and de-emphasized.' },
      { name: 'invalid', type: 'boolean', default: 'false', description: 'Danger ring and border.' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Skeleton rows in the menu; trigger reads "Loading...".',
      },
      {
        name: 'searchable',
        type: 'boolean',
        default: 'false',
        description: 'Type-to-filter field pinned above the option list.',
      },
      {
        name: 'searchPlaceholder',
        type: 'string',
        default: "'Filter options'",
        description: 'Placeholder text for the search field.',
      },
      {
        name: 'leadingIcon',
        type: 'ReactNode',
        description: 'Your own icon node pinned before the trigger label; falls back to the selected option icon.',
      },
      { name: 'id', type: 'string', description: 'Base id for the trigger and menu (auto-generated if omitted).' },
      { name: 'ariaLabel', type: 'string', description: 'Accessible label for the listbox.' },
    ],
  },

  'multi-select': {
    example: `import { MultiSelect } from 'premium-ds/multi-select';

const CHANNEL_OPTIONS = [
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
];

<MultiSelect
  options={CHANNEL_OPTIONS}
  value={channels}
  onChange={(v) => setChannels(v)}
  placeholder="Choose channels"
  searchable
  ariaLabel="Channels"
/>`,
    props: [
      {
        name: 'options',
        type: 'SelectOption[] | SelectGroup[]',
        required: true,
        description: 'Flat option list or array of grouped options.',
      },
      { name: 'value', type: 'string[]', description: 'Controlled array of selected values.' },
      { name: 'defaultValue', type: 'string[]', default: '[]', description: 'Initial selection for uncontrolled use.' },
      {
        name: 'onChange',
        type: '(value: string[], toggled: SelectOption) => void',
        description: 'Fires with the next array and the option that was toggled.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Select options'",
        description: 'Trigger label shown when nothing is selected.',
      },
      { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Trigger and menu size.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Inert and de-emphasized.' },
      { name: 'invalid', type: 'boolean', default: 'false', description: 'Danger ring and border.' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Skeleton rows in the menu; trigger reads "Loading...".',
      },
      {
        name: 'searchable',
        type: 'boolean',
        default: 'false',
        description: 'Type-to-filter field pinned above the option list.',
      },
      {
        name: 'searchPlaceholder',
        type: 'string',
        default: "'Filter options'",
        description: 'Placeholder text for the search field.',
      },
      { name: 'leadingIcon', type: 'ReactNode', description: 'Your own icon node pinned before the trigger label.' },
      { name: 'id', type: 'string', description: 'Base id for the trigger and menu (auto-generated if omitted).' },
      { name: 'ariaLabel', type: 'string', description: 'Accessible label for the listbox.' },
    ],
  },
};
