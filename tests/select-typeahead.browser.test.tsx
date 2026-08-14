import { describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { Select, type SelectOption } from '@zyncat/ui/select';
import { MultiSelect } from '@zyncat/ui/multi-select';
import { renderApp, settle } from './harness';

const BERRIES: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'blackberry', label: 'Blackberry' },
];

const LABELLED_BY_CODE: SelectOption[] = [
  { value: 'opt-1', label: 'Apple' },
  { value: 'opt-2', label: 'Banana' },
  { value: 'opt-3', label: 'Cherry' },
];

const TYPEAHEAD_TIMEOUT_MS = 800;

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

function visibleOptionLabels(): (string | null)[] {
  return screen.getAllByRole('option').map((option) => option.textContent);
}

async function openMenu(user: UserEvent): Promise<void> {
  await user.click(trigger());
  await settle();
}

async function waitOutTypeaheadBuffer(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, TYPEAHEAD_TIMEOUT_MS));
}

describe('Select typeahead', () => {
  test('a single character jumps to the first option beginning with it', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={BERRIES} ariaLabel="Berry" />);
    await openMenu(user);

    expect(activeOptionLabel()).toBe('Apple');
    await user.keyboard('b');
    expect(activeOptionLabel()).toBe('Banana');
  });

  test('characters typed in quick succession narrow to the option matching the whole sequence', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={BERRIES} ariaLabel="Berry" />);
    await openMenu(user);

    await user.keyboard('bl');
    expect(activeOptionLabel()).toBe('Blueberry');

    await waitOutTypeaheadBuffer();
    await user.keyboard('bla');
    expect(activeOptionLabel()).toBe('Blackberry');
  });

  test('the typed buffer is dropped after the timeout so the next character starts a new search', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={BERRIES} ariaLabel="Berry" />);
    await openMenu(user);

    await user.keyboard('bl');
    expect(activeOptionLabel()).toBe('Blueberry');

    await waitOutTypeaheadBuffer();
    await user.keyboard('a');
    expect(activeOptionLabel()).toBe('Apple');
  });

  test('a character that matches nothing leaves the active option untouched', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={BERRIES} ariaLabel="Berry" />);
    await openMenu(user);

    await user.keyboard('bla');
    expect(activeOptionLabel()).toBe('Blackberry');

    await user.keyboard('zzz');
    expect(activeOptionLabel()).toBe('Blackberry');
  });

  test('typeahead skips a disabled option and lands on the next selectable match', async () => {
    const user = userEvent.setup();
    renderApp(
      <Select
        options={[
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana', disabled: true },
          { value: 'blueberry', label: 'Blueberry' },
        ]}
        ariaLabel="Berry"
      />,
    );
    await openMenu(user);

    await user.keyboard('b');
    expect(activeOptionLabel()).toBe('Blueberry');
  });

  test('typeahead only moves the active option - it never commits or closes', async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    renderApp(<Select options={BERRIES} ariaLabel="Berry" onChange={(value) => seen.push(value)} />);
    await openMenu(user);

    await user.keyboard('bla');
    await settle();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().textContent).toContain('Select an option');
    expect(seen).toEqual([]);
  });

  test('typeahead moves the active option in a MultiSelect too', async () => {
    const user = userEvent.setup();
    renderApp(<MultiSelect options={BERRIES} ariaLabel="Berry" />);
    await openMenu(user);

    await user.keyboard('bla');
    expect(activeOptionLabel()).toBe('Blackberry');
  });

  test.fails('typeahead matches the option label the user can read, not its stored value', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={LABELLED_BY_CODE} ariaLabel="Fruit" />);
    await openMenu(user);

    await user.keyboard('c');
    expect(activeOptionLabel()).toBe('Cherry');
  });
});

describe('Select searchable filtering', () => {
  test('typing in the filter field narrows the listbox to the matching options', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={BERRIES} searchable ariaLabel="Berry" />);
    await openMenu(user);

    expect(document.activeElement).toBe(screen.getByRole('textbox'));

    await user.keyboard('black');
    await settle();

    expect(visibleOptionLabels()).toEqual(['Blackberry']);
  });

  test('the filter matches an option description as well as its label', async () => {
    const user = userEvent.setup();
    renderApp(
      <Select
        options={[
          { value: 'apple', label: 'Apple', description: 'grown in Kent' },
          { value: 'banana', label: 'Banana', description: 'shipped green' },
        ]}
        searchable
        ariaLabel="Fruit"
      />,
    );
    await openMenu(user);

    await user.keyboard('Kent');
    await settle();

    expect(visibleOptionLabels()).toEqual(['Applegrown in Kent']);
  });

  test('a filter with no matches shows the empty state and quotes what was typed', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={BERRIES} searchable ariaLabel="Berry" />);
    await openMenu(user);

    await user.keyboard('zzz');
    await settle();

    expect(screen.queryAllByRole('option')).toEqual([]);
    expect(screen.getByRole('listbox').textContent).toContain('No matches for "zzz"');
  });

  test('arrow keys still navigate the filtered list while focus stays in the filter field', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={BERRIES} searchable ariaLabel="Berry" />);
    await openMenu(user);

    await user.keyboard('b');
    await settle();
    expect(visibleOptionLabels()).toEqual(['Banana', 'Blueberry', 'Blackberry']);

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('textbox'));
    expect(activeOptionLabel()).toBe('Blueberry');

    await user.keyboard('{Enter}');
    await settle();
    expect(trigger().textContent).toContain('Blueberry');
  });

  test('the filter is cleared when the menu closes, so reopening shows every option', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={BERRIES} searchable ariaLabel="Berry" />);
    await openMenu(user);

    await user.keyboard('black');
    await settle();
    expect(visibleOptionLabels()).toEqual(['Blackberry']);

    await user.keyboard('{Escape}');
    await settle();
    await openMenu(user);

    expect(visibleOptionLabels()).toEqual(['Apple', 'Banana', 'Blueberry', 'Blackberry']);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
  });

  test.fails('Enter commits the sole remaining match after filtering from a later option', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={BERRIES} searchable ariaLabel="Berry" />);
    await openMenu(user);

    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(activeOptionLabel()).toBe('Blackberry');

    await user.keyboard('apple');
    await settle();
    expect(visibleOptionLabels()).toEqual(['Apple']);

    await user.keyboard('{Enter}');
    await settle();

    expect(trigger().textContent).toContain('Apple');
  });
});
