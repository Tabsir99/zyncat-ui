import { describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { Select, type SelectOption } from '@zyncat/ui/select';
import { MultiSelect } from '@zyncat/ui/multi-select';
import { renderApp, settle } from './harness';

const FRUITS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
];

const EDGE_DISABLED: SelectOption[] = [
  { value: 'first', label: 'First', disabled: true },
  { value: 'middle', label: 'Middle' },
  { value: 'last', label: 'Last', disabled: true },
];

function trigger(): HTMLElement {
  return screen.getByRole('combobox');
}

function activeOptionLabel(): string | null {
  const focused = document.activeElement as HTMLElement | null;
  const id =
    (focused && focused.getAttribute('aria-activedescendant')) || trigger().getAttribute('aria-activedescendant');
  if (!id) return null;
  const option = document.getElementById(id);
  return option ? option.textContent : null;
}

function isOpen(): boolean {
  return trigger().getAttribute('aria-expanded') === 'true';
}

async function openWithPointer(user: UserEvent): Promise<void> {
  await user.click(trigger());
  await settle();
}

describe('Select keyboard navigation', () => {
  test('the closed trigger opens its menu on ArrowDown with the first selectable option active', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);

    await user.tab();
    expect(document.activeElement).toBe(trigger());

    await user.keyboard('{ArrowDown}');
    await settle();

    expect(isOpen()).toBe(true);
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(activeOptionLabel()).toBe('Apple');
  });

  test('the closed trigger also opens on ArrowUp, Enter and Space', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);

    for (const keys of ['{ArrowUp}', '{Enter}', ' '] as const) {
      trigger().focus();
      await user.keyboard(keys);
      await settle();
      expect(isOpen(), `${keys} did not open the menu`).toBe(true);

      await user.keyboard('{Escape}');
      await settle();
      expect(isOpen()).toBe(false);
    }
  });

  test('opening with the keyboard moves focus into the listbox so arrow keys reach it', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);

    trigger().focus();
    await user.keyboard('{ArrowDown}');
    await settle();

    expect(document.activeElement).toBe(screen.getByRole('listbox'));
  });

  test('ArrowDown and ArrowUp step over disabled options in both directions', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await openWithPointer(user);

    expect(activeOptionLabel()).toBe('Apple');
    await user.keyboard('{ArrowDown}');
    expect(activeOptionLabel()).toBe('Cherry');
    await user.keyboard('{ArrowUp}');
    expect(activeOptionLabel()).toBe('Apple');
  });

  test('the active option wraps around at both ends of the list', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await openWithPointer(user);

    await user.keyboard('{ArrowUp}');
    expect(activeOptionLabel()).toBe('Date');
    await user.keyboard('{ArrowDown}');
    expect(activeOptionLabel()).toBe('Apple');
  });

  test('Home and End jump to the first and last selectable option, never a disabled one', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={EDGE_DISABLED} ariaLabel="Edges" />);
    await openWithPointer(user);

    await user.keyboard('{End}');
    expect(activeOptionLabel()).toBe('Middle');
    await user.keyboard('{Home}');
    expect(activeOptionLabel()).toBe('Middle');
  });

  test('Enter commits the active option, closes the menu and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await openWithPointer(user);

    await user.keyboard('{ArrowDown}{Enter}');
    await settle();

    expect(isOpen()).toBe(false);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger().textContent).toContain('Cherry');
    expect(document.activeElement).toBe(trigger());
  });

  test('Space commits the active option like Enter does', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await openWithPointer(user);

    await user.keyboard('{ArrowDown}');
    expect(activeOptionLabel()).toBe('Cherry');

    await user.keyboard(' ');
    await settle();

    expect(trigger().textContent).toContain('Cherry');
    expect(isOpen()).toBe(false);
  });

  test('Enter on a disabled option selects nothing and leaves the menu open', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={[{ value: 'only', label: 'Only', disabled: true }]} ariaLabel="Fruit" />);
    await openWithPointer(user);

    await user.keyboard('{Enter}');
    await settle();

    expect(isOpen()).toBe(true);
    expect(trigger().textContent).toContain('Select an option');
  });

  test('Escape closes the menu without selecting and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await openWithPointer(user);

    await user.keyboard('{ArrowDown}');
    expect(activeOptionLabel()).toBe('Cherry');

    await user.keyboard('{Escape}');
    await settle();

    expect(isOpen()).toBe(false);
    expect(trigger().textContent).toContain('Select an option');
    expect(document.activeElement).toBe(trigger());
  });

  test('Tab closes the menu and moves focus out of the listbox', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await openWithPointer(user);

    await user.tab();
    await settle();

    expect(isOpen()).toBe(false);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('reopening starts on the already selected option instead of the first', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} defaultValue="date" ariaLabel="Fruit" />);
    await openWithPointer(user);

    expect(activeOptionLabel()).toBe('Date');
    await user.keyboard('{ArrowDown}');
    expect(activeOptionLabel()).toBe('Apple');
  });

  test('a disabled Select cannot be opened by pointer or by keyboard', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} disabled ariaLabel="Fruit" />);

    await user.click(trigger());
    await settle();
    expect(isOpen()).toBe(false);

    trigger().focus();
    await user.keyboard('{ArrowDown}');
    await settle();
    expect(isOpen()).toBe(false);
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('MultiSelect keyboard navigation', () => {
  test('Enter toggles the active option and leaves the menu open on the same option', async () => {
    const user = userEvent.setup();
    renderApp(<MultiSelect options={FRUITS} ariaLabel="Fruit" />);
    await openWithPointer(user);

    await user.keyboard('{ArrowDown}{Enter}');
    await settle();

    expect(isOpen()).toBe(true);
    expect(activeOptionLabel()).toBe('Cherry');
    expect(screen.getByRole('option', { name: 'Cherry' }).getAttribute('aria-selected')).toBe('true');

    await user.keyboard('{Enter}');
    await settle();
    expect(screen.getByRole('option', { name: 'Cherry' }).getAttribute('aria-selected')).toBe('false');
    expect(isOpen()).toBe(true);
  });

  test('Escape closes the menu and keeps everything toggled so far', async () => {
    const user = userEvent.setup();
    renderApp(<MultiSelect options={FRUITS} ariaLabel="Fruit" />);
    await openWithPointer(user);

    await user.keyboard('{Enter}{ArrowDown}{Enter}');
    await settle();

    await user.keyboard('{Escape}');
    await settle();

    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger());
    expect(trigger().textContent).toContain('Apple');
    expect(trigger().textContent).toContain('+1');
  });
});
