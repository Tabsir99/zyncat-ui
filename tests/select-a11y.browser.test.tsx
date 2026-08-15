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
];

function trigger(): HTMLElement {
  return screen.getByRole('combobox');
}

function activeDescendantOf(element: HTMLElement): HTMLElement | null {
  const id = element.getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
}

async function open(user: UserEvent): Promise<void> {
  await user.click(trigger());
  await settle();
}

describe('Select accessibility wiring', () => {
  test('the trigger is a combobox that advertises the listbox it controls', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);

    expect(trigger().getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    await open(user);

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);
  });

  test('the trigger and the listbox both take their accessible name from ariaLabel', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Time zone" />);

    expect(screen.getByRole('combobox', { name: 'Time zone' })).toBeTruthy();

    await open(user);

    expect(screen.getByRole('listbox', { name: 'Time zone' })).toBeTruthy();
  });

  test('the trigger keeps its accessible name while the text it shows follows the selection', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} placeholder="Choose a fruit" ariaLabel="Fruit" />);

    expect(screen.getByRole('combobox', { name: 'Fruit' }).textContent).toContain('Choose a fruit');

    await open(user);
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    await settle();

    const named = screen.getByRole('combobox', { name: 'Fruit' });
    expect(named.textContent).toContain('Cherry');
    expect(named.textContent).not.toContain('Choose a fruit');
  });

  test('every choice is an option carrying its own selected and disabled state', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} defaultValue="cherry" ariaLabel="Fruit" />);
    await open(user);

    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual(['Apple', 'Banana', 'Cherry']);
    expect(options.map((option) => option.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true']);
    expect(screen.getByRole('option', { name: 'Banana' }).getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByRole('option', { name: 'Apple' }).getAttribute('aria-disabled')).toBeNull();
  });

  test('aria-selected follows the selection as the user changes it', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await open(user);

    expect(screen.getAllByRole('option').every((o) => o.getAttribute('aria-selected') === 'false')).toBe(true);

    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    await settle();
    await open(user);

    expect(screen.getByRole('option', { name: 'Cherry' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('option', { name: 'Apple' }).getAttribute('aria-selected')).toBe('false');
  });

  test('a single Select listbox is not announced as multi-selectable, a MultiSelect one is', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await open(user);
    expect(screen.getByRole('listbox').getAttribute('aria-multiselectable')).toBeNull();

    view.unmount();
    renderApp(<MultiSelect options={FRUITS} ariaLabel="Fruit" />);
    await open(user);
    expect(screen.getByRole('listbox').getAttribute('aria-multiselectable')).toBe('true');
  });

  test('aria-activedescendant is dropped when the menu is closed', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);

    expect(trigger().getAttribute('aria-activedescendant')).toBeNull();

    await open(user);
    expect(activeDescendantOf(trigger())).not.toBeNull();

    await user.keyboard('{Escape}');
    await settle();
    expect(trigger().getAttribute('aria-activedescendant')).toBeNull();
  });

  test('the active descendant is always a real option in the open listbox', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await open(user);

    await user.keyboard('{ArrowDown}');
    const active = activeDescendantOf(trigger());
    expect(active).not.toBeNull();
    expect(active!.getAttribute('role')).toBe('option');
    expect(screen.getByRole('listbox').contains(active)).toBe(true);
    expect(active!.textContent).toBe('Cherry');
  });

  test('a searchable menu keeps focus on the filter field and points it at the active option', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} searchable ariaLabel="Fruit" />);
    await open(user);

    const field = screen.getByRole('textbox');
    expect(document.activeElement).toBe(field);
    expect(field.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);
    expect(activeDescendantOf(field)!.textContent).toBe('Apple');

    await user.keyboard('{ArrowDown}');
    expect(activeDescendantOf(field)!.textContent).toBe('Cherry');
  });

  test('the element holding focus points at the active option with aria-activedescendant', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await open(user);

    const focused = document.activeElement as HTMLElement;
    expect(focused).toBe(screen.getByRole('listbox'));
    expect(focused.getAttribute('aria-activedescendant')).toBeTruthy();
    expect(activeDescendantOf(focused)!.textContent).toBe('Apple');
  });

  test('an invalid Select marks its trigger invalid for assistive technology', () => {
    renderApp(<Select options={FRUITS} invalid ariaLabel="Fruit" />);

    expect(trigger().getAttribute('aria-invalid')).toBe('true');
  });

  test('a disabled Select exposes a disabled trigger that is skipped by tabbing', async () => {
    const user = userEvent.setup();
    renderApp(
      <>
        <Select options={FRUITS} disabled ariaLabel="Fruit" />
        <button type="button">after</button>
      </>,
    );

    await user.tab();

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'after' }));
  });

  test('grouped options are announced as labelled groups inside the listbox', async () => {
    const user = userEvent.setup();
    renderApp(
      <Select
        options={[
          { label: 'Citrus', options: [{ value: 'lemon', label: 'Lemon' }] },
          { label: 'Berries', options: [{ value: 'fig', label: 'Fig' }] },
        ]}
        ariaLabel="Fruit"
      />,
    );
    await open(user);

    expect(screen.getAllByRole('group').map((group) => group.getAttribute('aria-label'))).toEqual([
      'Citrus',
      'Berries',
    ]);
    expect(screen.getByRole('group', { name: 'Citrus' }).contains(screen.getByRole('option', { name: 'Lemon' }))).toBe(
      true,
    );
  });
});
