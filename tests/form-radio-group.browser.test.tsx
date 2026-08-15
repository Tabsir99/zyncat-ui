import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, type RadioOption } from '@zyncat/ui/radio-group';
import { renderApp, settle } from './harness';

const ROLES: RadioOption[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

interface RolesProps {
  onValue?: (value: string) => void;
  initial?: string;
  options?: RadioOption[];
  disabled?: boolean;
  variant?: 'rows' | 'cards';
  error?: string;
  helper?: string;
}

function ControlledRoles({ onValue, initial = '', options = ROLES, ...rest }: RolesProps) {
  const [role, setRole] = useState(initial);
  return (
    <RadioGroup
      name="role"
      label="Member role"
      value={role}
      onChange={(value) => {
        setRole(value);
        onValue?.(value);
      }}
      options={options}
      {...rest}
    />
  );
}

function radios(): HTMLInputElement[] {
  return screen.getAllByRole('radio') as HTMLInputElement[];
}

function chosen(): string | null {
  const checked = radios().find((radio) => radio.checked);
  return checked ? checked.value : null;
}

describe('RadioGroup selection', () => {
  test('every option is a radio named by its label and nothing is chosen to begin with', () => {
    renderApp(<ControlledRoles />);

    expect(radios()).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Owner' })).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByRole('radio', { name: 'Editor' })).toBeInstanceOf(HTMLInputElement);
    expect(chosen()).toBeNull();
  });

  test('clicking an option chooses it and reports its value once', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledRoles onValue={onValue} />);

    await user.click(screen.getByText('Editor'));

    expect(chosen()).toBe('editor');
    expect(onValue.mock.calls).toEqual([['editor']]);
  });

  test('choosing another option drops the previous one, leaving exactly one chosen', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledRoles initial="owner" />);

    await user.click(screen.getByText('Viewer'));

    expect(
      radios()
        .filter((radio) => radio.checked)
        .map((radio) => radio.value),
    ).toEqual(['viewer']);
  });

  test('a group pinned to one value never moves its selection, but reports the attempt', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<RadioGroup name="role" label="Member role" value="owner" onChange={onChange} options={ROLES} />);

    await user.click(screen.getByText('Editor'));

    expect(chosen()).toBe('owner');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['editor']);
  });

  test('onChange is silent on mount', () => {
    const onValue = vi.fn();
    renderApp(<ControlledRoles initial="owner" onValue={onValue} />);

    expect(onValue).not.toHaveBeenCalled();
  });
});

describe('RadioGroup keyboard', () => {
  test('the arrow keys walk the options and wrap round at the ends', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledRoles initial="owner" onValue={onValue} />);

    await user.click(screen.getByText('Owner'));
    onValue.mockClear();

    await user.keyboard('{ArrowDown}');
    expect(chosen()).toBe('editor');

    await user.keyboard('{ArrowDown}');
    expect(chosen()).toBe('viewer');

    await user.keyboard('{ArrowDown}');
    expect(chosen()).toBe('owner');

    await user.keyboard('{ArrowUp}');
    expect(chosen()).toBe('viewer');

    expect(onValue.mock.calls.map(([value]) => value)).toEqual(['editor', 'viewer', 'owner', 'viewer']);
  });

  test('the arrow keys step over a disabled option', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(
      <ControlledRoles
        initial="owner"
        onValue={onValue}
        options={[ROLES[0], { ...ROLES[1], disabled: true }, ROLES[2]]}
      />,
    );

    await user.click(screen.getByText('Owner'));
    await user.keyboard('{ArrowDown}');

    expect(chosen()).toBe('viewer');
    expect(onValue.mock.calls.map(([value]) => value)).toEqual(['viewer']);
  });

  test('Space chooses the option that has focus', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledRoles onValue={onValue} />);

    await user.tab();
    expect(document.activeElement).toBe(radios()[0]);

    await user.keyboard(' ');

    expect(chosen()).toBe('owner');
    expect(onValue.mock.calls).toEqual([['owner']]);
  });

  test('once an option is chosen the group is a single stop in the tab order', async () => {
    const user = userEvent.setup();
    renderApp(
      <>
        <button type="button">before</button>
        <ControlledRoles initial="editor" />
        <button type="button">after</button>
      </>,
    );

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'before' }));

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Editor' }));

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'after' }));
  });
});

describe('RadioGroup disabled and invalid states', () => {
  test('a disabled option cannot be chosen', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledRoles onValue={onValue} options={[ROLES[0], { ...ROLES[1], disabled: true }, ROLES[2]]} />);

    await user.click(screen.getByText('Editor'));

    expect(chosen()).toBeNull();
    expect(onValue).not.toHaveBeenCalled();
  });

  test('a disabled group refuses every option and takes nothing from the keyboard', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(
      <>
        <button type="button">before</button>
        <ControlledRoles disabled onValue={onValue} />
        <button type="button">after</button>
      </>,
    );

    await user.click(screen.getByText('Owner'));
    expect(chosen()).toBeNull();

    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'after' }));
    expect(onValue).not.toHaveBeenCalled();
  });

  test('a group error marks the group invalid and shows the message', async () => {
    const view = renderApp(<ControlledRoles helper="Members can be changed later." />);
    const group = screen.getByRole('group');
    expect(group.getAttribute('aria-invalid')).toBeNull();
    expect(screen.getByText('Members can be changed later.')).toBeInstanceOf(HTMLElement);

    view.rerender(<ControlledRoles helper="Members can be changed later." error="Pick a role." />);
    await settle();

    expect(screen.getByRole('group').getAttribute('aria-invalid')).toBe('true');
    expect(getComputedStyle(screen.getByText('Pick a role.')).visibility).toBe('visible');
  });

  test('the group carries its label as its accessible name', () => {
    renderApp(<ControlledRoles />);

    expect(screen.getByRole('group', { name: 'Member role' })).toBeInstanceOf(HTMLFieldSetElement);
  });
});

describe('RadioGroup cards variant', () => {
  test('cards select by click and by arrow key just as rows do, and keep their icons', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(
      <ControlledRoles
        variant="cards"
        onValue={onValue}
        options={ROLES.map((role) => ({ ...role, icon: <span data-icon={role.value} /> }))}
      />,
    );

    expect(document.querySelectorAll('[data-icon]')).toHaveLength(3);

    await user.click(screen.getByText('Owner'));
    await settle();
    expect(chosen()).toBe('owner');

    await user.keyboard('{ArrowDown}');
    await settle();
    expect(chosen()).toBe('editor');

    expect(onValue.mock.calls.map(([value]) => value)).toEqual(['owner', 'editor']);
  });
});
