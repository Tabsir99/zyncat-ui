import { useState, type FormEvent } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '@zyncat/ui/text-field';
import { Textarea } from '@zyncat/ui/textarea';
import { NumberField } from '@zyncat/ui/number-field';
import { Checkbox } from '@zyncat/ui/checkbox';
import { Toggle } from '@zyncat/ui/toggle';
import { RadioGroup, type RadioOption } from '@zyncat/ui/radio-group';
import { renderApp } from './harness';

const ROLES: RadioOption[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

interface SignupFormProps {
  onSubmitted: (fields: Record<string, string>) => void;
  autosaveOn?: boolean;
  required?: boolean;
}

function SignupForm({ onSubmitted, autosaveOn = false, required = false }: SignupFormProps) {
  const [workspace, setWorkspace] = useState('');
  const [bio, setBio] = useState('');
  const [seats, setSeats] = useState(2);
  const [role, setRole] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmitted(Object.fromEntries(data.entries()) as Record<string, string>);
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="workspace"
        label="Workspace name"
        required={required}
        clearable
        value={workspace}
        onChange={(e) => setWorkspace(e.target.value)}
        htmlProps={{ name: 'workspace' }}
      />
      <Textarea id="bio" label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} htmlProps={{ name: 'bio' }} />
      <NumberField
        id="seats"
        label="Seats"
        min={1}
        max={9}
        value={seats}
        onChange={setSeats}
        htmlProps={{ name: 'seats' }}
      />
      <Checkbox label="Email me about product updates" htmlProps={{ name: 'newsletter', value: 'yes' }} />
      <Toggle label="Auto-save drafts" defaultChecked={autosaveOn} htmlProps={{ name: 'autosave', value: 'on' }} />
      <RadioGroup name="role" label="Member role" value={role} onChange={setRole} options={ROLES} />
      <button type="submit">Save</button>
    </form>
  );
}

describe('form integration', () => {
  test('every field hands its value to the form under the name it was given', async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    renderApp(<SignupForm onSubmitted={onSubmitted} autosaveOn />);

    await user.type(screen.getByRole('textbox', { name: 'Workspace name' }), 'acme');
    await user.type(screen.getByRole('textbox', { name: 'Bio' }), 'we make things');
    await user.click(screen.getByRole('button', { name: /increase/i }));
    await user.click(screen.getByRole('button', { name: /increase/i }));
    await user.click(screen.getByText('Email me about product updates'));
    await user.click(screen.getByText('Editor'));

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmitted).toHaveBeenCalledTimes(1);
    expect(onSubmitted.mock.calls[0][0]).toEqual({
      workspace: 'acme',
      bio: 'we make things',
      seats: '4',
      newsletter: 'yes',
      autosave: 'on',
      role: 'editor',
    });
  });

  test('an unchecked box, an off switch and an unchosen group send nothing at all', async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    renderApp(<SignupForm onSubmitted={onSubmitted} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    const fields = onSubmitted.mock.calls[0][0];
    expect(fields.newsletter).toBeUndefined();
    expect(fields.autosave).toBeUndefined();
    expect(fields.role).toBeUndefined();
    expect(fields.seats).toBe('2');
  });

  test('the stepper and clear buttons never submit the form', async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    renderApp(<SignupForm onSubmitted={onSubmitted} />);

    await user.type(screen.getByRole('textbox', { name: 'Workspace name' }), 'acme');
    await user.click(screen.getByRole('button', { name: /increase/i }));
    await user.click(screen.getByRole('button', { name: /decrease/i }));
    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(onSubmitted).not.toHaveBeenCalled();
  });

  test('a required field that is still empty holds the submission back until it is filled', async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    renderApp(<SignupForm onSubmitted={onSubmitted} required />);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmitted).not.toHaveBeenCalled();

    await user.type(screen.getByRole('textbox', { name: 'Workspace name' }), 'acme');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmitted).toHaveBeenCalledTimes(1);
    expect(onSubmitted.mock.calls[0][0].workspace).toBe('acme');
  });
});
