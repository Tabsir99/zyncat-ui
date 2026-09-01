'use client';

import { useState } from 'react';

import { Checkbox } from '@zyncat/ui/checkbox';
import { MultiSelect } from '@zyncat/ui/multi-select';
import { NumberField } from '@zyncat/ui/number-field';
import { OtpField } from '@zyncat/ui/otp-field';
import { RadioGroup, type RadioOption } from '@zyncat/ui/radio-group';
import { Select } from '@zyncat/ui/select';
import { TextField, type TextFieldProps } from '@zyncat/ui/text-field';
import { Textarea } from '@zyncat/ui/textarea';
import { toast } from '@zyncat/ui/toast';
import { Toggle } from '@zyncat/ui/toggle';

import { Icon } from '../icon';
import { KnobSegment, KnobSwitch, Playground } from '../playground';

const W = 320;

type Option = { value: string; label: string; description?: string; icon?: string; disabled?: boolean };

const ROLES: RadioOption[] = [
  { value: 'owner', label: 'Owner', description: 'Full access, including billing.' },
  { value: 'admin', label: 'Admin', description: 'Manage members and settings.' },
  { value: 'member', label: 'Member', description: 'Read and write content.', disabled: true },
];

const PLAN: RadioOption[] = [
  { value: 'starter', label: 'Starter', description: 'For individuals', icon: <Icon name="cloud" /> },
  { value: 'pro', label: 'Pro', description: 'For small teams', icon: <Icon name="lightning" /> },
  { value: 'scale', label: 'Scale', description: 'For organizations', icon: <Icon name="crown" /> },
];

const TIMEZONES: Option[] = [
  { value: 'utc', label: 'UTC (Coordinated Universal Time)' },
  { value: 'lon', label: 'London (GMT+1)' },
  { value: 'nyc', label: 'New York (GMT-4)' },
  { value: 'la', label: 'Los Angeles (GMT-7)' },
  { value: 'tok', label: 'Tokyo (GMT+9)' },
];

const CHANNELS: Option[] = [
  { value: 'tw', label: 'Twitter / X' },
  { value: 'ig', label: 'Instagram' },
  { value: 'li', label: 'LinkedIn' },
  { value: 'yt', label: 'YouTube' },
  { value: 'tt', label: 'TikTok' },
];

type FieldSize = NonNullable<TextFieldProps['size']>;
type FieldState = 'idle' | 'error' | 'warning' | 'success';

export function TextFieldPlayground() {
  const [size, setSize] = useState<FieldSize>('md');
  const [state, setState] = useState<FieldState>('idle');
  const [clearable, setClearable] = useState(true);
  const [leadingIcon, setLeadingIcon] = useState(true);
  const [value, setValue] = useState('Quarterly review');

  const stateProps = {
    error: state === 'error' ? 'That name is already taken.' : undefined,
    warning: state === 'warning' ? 'Renaming breaks existing share links.' : undefined,
    success: state === 'success' ? 'Name is available.' : undefined,
  };

  const stateCode =
    state === 'idle' ? '' : `\n  ${state}="${stateProps.error ?? stateProps.warning ?? stateProps.success}"`;
  const code = `<TextField
  label="Project name"
  size="${size}"
  clearable={${clearable}}${leadingIcon ? '\n  leadingIcon={<SearchIcon />}' : ''}${stateCode}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`;

  return (
    <Playground
      code={code}
      note="State messages disclose through Collapse - they ease in, never jump the layout."
      rail={
        <>
          <KnobSegment label="size" value={size} onChange={setSize} options={['sm', 'md', 'lg']} />
          <KnobSegment
            label="state"
            value={state}
            onChange={setState}
            options={['idle', 'error', 'warning', 'success']}
          />
          <KnobSwitch label="clearable" checked={clearable} onChange={setClearable} />
          <KnobSwitch label="leading icon" checked={leadingIcon} onChange={setLeadingIcon} />
        </>
      }
    >
      <div style={{ width: '100%', maxWidth: W }}>
        <TextField
          id="tf-playground"
          label="Project name"
          size={size}
          clearable={clearable}
          leadingIcon={leadingIcon ? <Icon name="magnifying-glass" /> : undefined}
          helper={state === 'idle' ? 'Visible to everyone on your team.' : undefined}
          error={stateProps.error}
          warning={stateProps.warning}
          success={stateProps.success}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </Playground>
  );
}

export function TextFieldValidationDemo() {
  const [handle, setHandle] = useState('ab');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: W }}>
      <TextField
        id="handle"
        label="Username"
        error={handle.length < 4 ? 'Must be at least 4 characters.' : undefined}
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <TextField id="ok" label="Workspace handle" success="Handle is available." value="acme-hq" readOnly />
    </div>
  );
}

export function NumberFieldHero() {
  const [seats, setSeats] = useState(5);
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <NumberField id="hero-num" label="Seats" unit="users" min={1} max={50} value={seats} onChange={setSeats} />
    </div>
  );
}

export function NumberFieldUnitDemo() {
  const [posts, setPosts] = useState(3);
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <NumberField
        id="posts-per-day"
        label="Posts per day"
        unit="posts"
        min={1}
        max={20}
        step={1}
        value={posts}
        onChange={setPosts}
        helper="Maximum cadence allowed by your subscription."
      />
    </div>
  );
}

export function OtpFieldHero() {
  const [code, setCode] = useState('492');
  return <OtpField length={6} group={3} value={code} onChange={setCode} />;
}

export function OtpFieldSizesDemo() {
  const [code, setCode] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <OtpField length={4} value={code} onChange={setCode} />
      <OtpField length={6} group={3} value={code} onChange={setCode} />
    </div>
  );
}

export function TextareaHero() {
  const [body, setBody] = useState('Launching our new React 19 design system today!');
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <Textarea
        id="hero-ta"
        label="Announcement draft"
        placeholder="Write your post..."
        max={280}
        minRows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onSubmit={() => toast.success('Draft submitted')}
        hint="Cmd+Enter to submit"
      />
    </div>
  );
}

export function TextareaAutoGrowDemo() {
  const [text, setText] = useState('');
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <Textarea
        id="autogrow-ta"
        label="Notes"
        placeholder="Type multiple lines to test auto-growth..."
        minRows={2}
        maxRows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}

export function CheckboxHero() {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      label="Pin post to queue"
      description="Published before any other scheduled items."
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}

export function CheckboxStatesDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Checkbox label="Default uncontrolled" defaultChecked />
      <Checkbox label="Indeterminate batch" indeterminate />
      <Checkbox label="Disabled option" disabled defaultChecked />
    </div>
  );
}

export function ToggleHero() {
  const [toggled, setToggled] = useState(true);
  return (
    <Toggle
      label="Auto-save drafts"
      description="Changes sync automatically as you type."
      checked={toggled}
      onChange={(e) => setToggled(e.target.checked)}
    />
  );
}

export function ToggleControlledDemo() {
  const [twoFa, setTwoFa] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <Toggle
        label="Two-factor authentication"
        description="Requires an authenticator app code on login."
        checked={twoFa}
        onChange={(e) => setTwoFa(e.target.checked)}
      />
      <Toggle label="Locked security policy" description="Managed by workspace admin." disabled defaultChecked />
    </div>
  );
}

export function RadioGroupHero() {
  const [plan, setPlan] = useState('pro');
  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <RadioGroup name="hero-plan" label="Select a plan" value={plan} onChange={setPlan} options={PLAN} />
    </div>
  );
}

export function RadioGroupRowsDemo() {
  const [role, setRole] = useState('admin');
  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <RadioGroup name="role-demo" label="Member permission" value={role} onChange={setRole} options={ROLES} />
    </div>
  );
}

export function SelectPlayground() {
  const [size, setSize] = useState<FieldSize>('md');
  const [searchable, setSearchable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [tz, setTz] = useState<string | null>('nyc');

  const code = `<Select
  ariaLabel="Timezone"
  options={TIMEZONES}
  value={tz}
  onChange={setTz}
  size="${size}"
  searchable={${searchable}}
  loading={${loading}}
  invalid={${invalid}}
  disabled={${disabled}}
/>`;

  return (
    <Playground
      code={code}
      note="Committing an option closes the menu and returns focus to the trigger."
      rail={
        <>
          <KnobSegment label="size" value={size} onChange={setSize} options={['sm', 'md', 'lg']} />
          <KnobSwitch label="searchable" checked={searchable} onChange={setSearchable} />
          <KnobSwitch label="loading" checked={loading} onChange={setLoading} />
          <KnobSwitch label="invalid" checked={invalid} onChange={setInvalid} />
          <KnobSwitch label="disabled" checked={disabled} onChange={setDisabled} />
        </>
      }
    >
      <div style={{ width: '100%', maxWidth: W }}>
        <Select
          ariaLabel="Timezone"
          placeholder="Choose timezone"
          value={tz}
          onChange={(v) => setTz(v)}
          options={TIMEZONES}
          size={size}
          searchable={searchable}
          loading={loading}
          invalid={invalid}
          disabled={disabled}
        />
      </div>
    </Playground>
  );
}

export function MultiSelectHero() {
  const [channels, setChannels] = useState(['tw', 'li']);
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <MultiSelect
        ariaLabel="Connected channels"
        placeholder="Select channels..."
        value={channels}
        onChange={setChannels}
        options={CHANNELS}
        searchable
      />
    </div>
  );
}
