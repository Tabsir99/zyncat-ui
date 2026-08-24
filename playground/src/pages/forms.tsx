import { useState } from 'react';
import { TextField } from '@zyncat/ui/text-field';
import { NumberField } from '@zyncat/ui/number-field';
import { OtpField } from '@zyncat/ui/otp-field';
import { Textarea } from '@zyncat/ui/textarea';
import { Checkbox } from '@zyncat/ui/checkbox';
import { Toggle } from '@zyncat/ui/toggle';
import { RadioGroup, type RadioOption } from '@zyncat/ui/radio-group';
import { Select } from '@zyncat/ui/select';
import { MultiSelect } from '@zyncat/ui/multi-select';
import { toast } from '@zyncat/ui/toast';
import { Icon } from '../icon';

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

/* ==========================================================================
   TextField
   ========================================================================== */
export function TextFieldHero() {
  const [val, setVal] = useState('Quarterly review');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <TextField
        id="hero-search"
        label="Search projects"
        leadingIcon={<Icon name="magnifying-glass" />}
        clearable
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
    </div>
  );
}

export function TextFieldLabelDemo() {
  const [name, setName] = useState('');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <TextField
        id="ws"
        label="Workspace name"
        required
        placeholder="e.g. Acme Studio"
        helper="Visible to everyone on your team."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
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

export function TextFieldSizesDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: W }}>
      <TextField id="sm" size="sm" placeholder="Small (28px)" />
      <TextField id="md" size="md" placeholder="Medium (36px)" />
      <TextField id="lg" size="lg" placeholder="Large (40px)" />
    </div>
  );
}

/* ==========================================================================
   NumberField
   ========================================================================== */
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

/* ==========================================================================
   OtpField
   ========================================================================== */
export function OtpFieldHero() {
  const [code, setCode] = useState('492');
  return <OtpField length={6} group={3} value={code} onChange={setCode} />;
}

export function OtpFieldSizesDemo() {
  const [code, setCode] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <OtpField length={4} size="sm" value={code} onChange={setCode} />
      <OtpField length={6} group={3} size="md" value={code} onChange={setCode} />
    </div>
  );
}

/* ==========================================================================
   Textarea
   ========================================================================== */
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

/* ==========================================================================
   Checkbox
   ========================================================================== */
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

/* ==========================================================================
   Toggle
   ========================================================================== */
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

/* ==========================================================================
   RadioGroup
   ========================================================================== */
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

/* ==========================================================================
   Select
   ========================================================================== */
export function SelectHero() {
  const [tz, setTz] = useState('nyc');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <Select
        ariaLabel="Timezone"
        placeholder="Choose timezone"
        value={tz}
        onChange={setTz}
        options={TIMEZONES}
        searchable
      />
    </div>
  );
}

export function SelectOptionsDemo() {
  const [val, setVal] = useState('');
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <Select
        ariaLabel="Publishing channel"
        placeholder="Select destination"
        value={val}
        onChange={setVal}
        options={CHANNELS}
      />
    </div>
  );
}

/* ==========================================================================
   MultiSelect
   ========================================================================== */
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
