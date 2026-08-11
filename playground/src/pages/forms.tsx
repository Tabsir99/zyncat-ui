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
import { Demo } from '../kit';
import { Icon } from '../icon';

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

const PEOPLE: Option[] = [
  { value: 'an', label: 'Ana Ng', description: 'Design' },
  { value: 'bo', label: 'Bo Park', description: 'Engineering' },
  { value: 'ci', label: 'Cira Diaz', description: 'Product' },
  { value: 'de', label: 'Dee Okafor', description: 'Marketing' },
  { value: 'el', label: 'Eli Stone', description: 'Support', disabled: true },
];

const TIMEZONES: Option[] = [
  { value: 'utc', label: 'UTC', description: 'Coordinated Universal Time' },
  { value: 'lon', label: 'London', description: 'GMT+1' },
  { value: 'nyc', label: 'New York', description: 'GMT-4' },
  { value: 'la', label: 'Los Angeles', description: 'GMT-7' },
  { value: 'tok', label: 'Tokyo', description: 'GMT+9' },
];

const W = 280;

export function TextFieldPage() {
  const [name, setName] = useState('');
  const [search, setSearch] = useState('Quarterly report');
  const [handle, setHandle] = useState('');
  return (
    <>
      <Demo label="label - placeholder - helper">
        <TextField
          id="ws"
          label="Workspace name"
          required
          placeholder="e.g. Acme"
          helper="Shown to your team."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: W }}
        />
      </Demo>
      <Demo label="leading icon - clearable - optional">
        <TextField
          id="search"
          label="Search"
          optional
          leadingIcon={<Icon name="magnifying-glass" />}
          clearable
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: W }}
        />
      </Demo>
      <Demo label="error - warning - success">
        <TextField
          id="handle"
          label="Username"
          error="Must be at least 4 characters."
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          style={{ width: W }}
        />
        <TextField
          id="warn"
          label="Display name"
          warning="This is already taken."
          value="acme"
          readOnly
          style={{ width: W }}
        />
        <TextField id="ok" label="Slug" success="Available." value="acme-team" readOnly style={{ width: W }} />
      </Demo>
      <Demo label="sizes - disabled">
        <TextField id="sm" size="sm" placeholder="Small" style={{ width: W }} />
        <TextField id="md" size="md" placeholder="Medium (default)" style={{ width: W }} />
        <TextField id="lg" size="lg" placeholder="Large" style={{ width: W }} />
        <TextField id="dis" label="Region" disabled value="us-east-1" style={{ width: W }} />
      </Demo>
    </>
  );
}

export function NumberFieldPage() {
  const [seats, setSeats] = useState(7);
  const [perPage, setPerPage] = useState(3);
  return (
    <>
      <Demo label="unit - bounds - helper">
        <NumberField
          id="seats"
          label="Seats"
          unit="users"
          min={1}
          max={50}
          value={seats}
          onChange={setSeats}
          helper="1-50 seats."
          style={{ width: W }}
        />
      </Demo>
      <Demo label="error - sizes">
        <NumberField
          id="pp"
          label="Items per page"
          min={0}
          max={10}
          value={perPage}
          onChange={setPerPage}
          error={perPage > 8 ? 'Keep it under 8.' : undefined}
          style={{ width: W }}
        />
        <NumberField id="nsm" size="sm" unit="%" value={25} onChange={() => {}} style={{ width: W }} />
        <NumberField id="nlg" size="lg" unit="hrs" value={2} onChange={() => {}} style={{ width: W }} />
      </Demo>
      <Demo label="disabled">
        <NumberField id="ndis" label="Concurrency" value={4} onChange={() => {}} disabled style={{ width: W }} />
      </Demo>
    </>
  );
}

export function OtpFieldPage() {
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('12');
  return (
    <>
      <Demo label="6 slots - grouped 3-3">
        <OtpField length={6} group={3} value={code} onChange={setCode} />
      </Demo>
      <Demo label="error - small">
        <OtpField length={4} value={pin} onChange={setPin} error size="sm" />
      </Demo>
      <Demo label="disabled">
        <OtpField length={6} value="481" disabled onChange={() => {}} />
      </Demo>
    </>
  );
}

export function TextareaPage() {
  const [bio, setBio] = useState('');
  const [note, setNote] = useState('Reviewed the latest draft - looks great to ship.');
  return (
    <>
      <Demo label="char meter - hint" fill>
        <Textarea
          id="bio"
          label="Bio"
          max={280}
          minRows={4}
          maxRows={12}
          placeholder="Tell us about yourself..."
          hint={
            <>
              <span className="txa__kbd">⌘</span>
              <span className="txa__kbd">↵</span> to save
            </>
          }
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          onSubmit={(v) => setBio(v)}
        />
      </Demo>
      <Demo label="helper - optional" fill>
        <Textarea
          id="note"
          label="Internal note"
          optional
          helper="Only your team sees this."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Demo>
      <Demo label="error - large - disabled" fill>
        <Textarea id="berr" label="Summary" max={280} error="Can't be empty." value="" onChange={() => {}} />
        <Textarea id="blg" label="Composer" size="lg" placeholder="Prominent composer" value="" onChange={() => {}} />
        <Textarea id="bdis" label="Template" disabled value="Read-only content" onChange={() => {}} />
      </Demo>
    </>
  );
}

export function CheckboxPage() {
  const [updates, setUpdates] = useState(true);
  const [twofa, setTwofa] = useState(false);
  const [agree, setAgree] = useState(false);
  return (
    <>
      <Demo label="label - description">
        <div className="stack">
          <Checkbox
            label="Email me about product updates"
            checked={updates}
            onChange={(e) => setUpdates(e.target.checked)}
          />
          <Checkbox
            size="sm"
            label="Enable two-factor auth"
            description="Adds a code prompt at sign-in."
            checked={twofa}
            onChange={(e) => setTwofa(e.target.checked)}
          />
        </div>
      </Demo>
      <Demo label="indeterminate - invalid - disabled">
        <div className="stack">
          <Checkbox label="Select all" indeterminate onChange={() => {}} />
          <Checkbox
            label="I agree to the terms"
            invalid={!agree}
            required
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <Checkbox label="Notify on failures" disabled defaultChecked />
        </div>
      </Demo>
    </>
  );
}

export function TogglePage() {
  const [autosave, setAutosave] = useState(true);
  const [pub, setPub] = useState(false);
  const [twofa, setTwofa] = useState(false);
  return (
    <>
      <Demo label="label - description">
        <div className="stack">
          <Toggle label="Auto-save drafts" checked={autosave} onChange={(e) => setAutosave(e.target.checked)} />
          <Toggle
            size="sm"
            label="Public profile"
            description="Anyone with the link can view."
            checked={pub}
            onChange={(e) => setPub(e.target.checked)}
          />
        </div>
      </Demo>
      <Demo label="controlled - disabled">
        <div className="stack">
          <Toggle label="Two-factor auth" checked={twofa} onChange={(e) => setTwofa(e.target.checked)} />
          <Toggle label="Locked setting" disabled defaultChecked />
        </div>
      </Demo>
    </>
  );
}

export function RadioGroupPage() {
  const [role, setRole] = useState('owner');
  const [plan, setPlan] = useState('pro');
  const [chosenRole, setChosenRole] = useState('');
  return (
    <>
      <Demo label="rows - helper - disabled option">
        <RadioGroup
          name="role"
          value={role}
          onChange={setRole}
          label="Member role"
          helper="Controls what they can access."
          options={ROLES}
          style={{ width: W }}
        />
      </Demo>
      <Demo label="cards - horizontal - icons">
        <RadioGroup
          name="plan"
          variant="cards"
          orientation="horizontal"
          value={plan}
          onChange={setPlan}
          label="Plan"
          options={PLAN}
        />
      </Demo>
      <Demo label="required - error">
        <RadioGroup
          name="rr"
          required
          value={chosenRole}
          onChange={setChosenRole}
          label="Assign a role"
          error={!chosenRole ? 'Pick a role to continue.' : undefined}
          options={[
            { value: 'a', label: 'Admin' },
            { value: 'm', label: 'Member' },
          ]}
          style={{ width: W }}
        />
      </Demo>
    </>
  );
}

export function SelectPage() {
  const [tz, setTz] = useState<string | null>('utc');
  const [assignee, setAssignee] = useState<string | null>(null);
  return (
    <>
      <Demo label="searchable - leading icon">
        <div style={{ width: W }}>
          <Select
            options={TIMEZONES}
            value={tz}
            onChange={(v) => setTz(v)}
            searchable
            searchPlaceholder="Search time zones"
            leadingIcon={<Icon name="globe" />}
            placeholder="Choose a time zone"
            ariaLabel="Time zone"
          />
        </div>
      </Demo>
      <Demo label="placeholder - disabled option">
        <div style={{ width: W }}>
          <Select
            options={PEOPLE}
            value={assignee}
            onChange={(v) => setAssignee(v)}
            placeholder="Assign reviewer"
            leadingIcon={<Icon name="user" />}
            ariaLabel="Assignee"
          />
        </div>
      </Demo>
      <Demo label="sizes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: W }}>
          <Select options={PEOPLE} size="sm" placeholder="Small" ariaLabel="Small select" />
          <Select options={PEOPLE} size="lg" placeholder="Large" ariaLabel="Large select" />
        </div>
      </Demo>
      <Demo label="invalid - loading - disabled">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: W }}>
          <Select options={PEOPLE} invalid placeholder="Pick someone" ariaLabel="Invalid select" />
          <Select options={PEOPLE} loading ariaLabel="Loading select" />
          <Select options={PEOPLE} disabled placeholder="Unavailable" ariaLabel="Disabled select" />
        </div>
      </Demo>
    </>
  );
}

export function MultiSelectPage() {
  const [labels, setLabels] = useState<string[]>(['an', 'bo']);
  const [reviewers, setReviewers] = useState<string[]>([]);
  return (
    <>
      <Demo label="array value - summary">
        <div style={{ width: W }}>
          <MultiSelect
            options={PEOPLE}
            value={labels}
            onChange={(v) => setLabels(v)}
            placeholder="Choose members"
            leadingIcon={<Icon name="users" />}
            ariaLabel="Members"
          />
        </div>
      </Demo>
      <Demo label="searchable">
        <div style={{ width: W }}>
          <MultiSelect
            options={PEOPLE}
            value={reviewers}
            onChange={(v) => setReviewers(v)}
            searchable
            searchPlaceholder="Filter people"
            placeholder="Add reviewers"
            ariaLabel="Reviewers"
          />
        </div>
      </Demo>
      <Demo label="invalid - disabled">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: W }}>
          <MultiSelect options={PEOPLE} invalid placeholder="Pick at least one" ariaLabel="Invalid multi-select" />
          <MultiSelect options={PEOPLE} disabled defaultValue={['an']} ariaLabel="Disabled multi-select" />
        </div>
      </Demo>
    </>
  );
}
