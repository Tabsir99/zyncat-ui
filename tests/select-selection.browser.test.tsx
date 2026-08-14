import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { Select, type SelectOption } from '@zyncat/ui/select';
import { MultiSelect } from '@zyncat/ui/multi-select';
import { renderApp, settle } from './harness';

const FRUITS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function trigger(): HTMLElement {
  return screen.getByRole('combobox');
}

function Held({ value }: { value: string | null }) {
  return <Select options={FRUITS} value={value} placeholder="Pick a fruit" ariaLabel="Fruit" />;
}

function selectedOptionNames(): string[] {
  return screen
    .getAllByRole('option')
    .filter((option) => option.getAttribute('aria-selected') === 'true')
    .map((option) => option.textContent ?? '');
}

async function pick(user: UserEvent, name: string): Promise<void> {
  await user.click(trigger());
  await settle();
  await user.click(screen.getByRole('option', { name }));
  await settle();
}

async function pickWhileOpen(user: UserEvent, name: string): Promise<void> {
  await user.click(screen.getByRole('option', { name }));
  await settle();
}

describe('Select selection', () => {
  test('an uncontrolled Select shows its placeholder, then the option the user picked', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} placeholder="Pick a fruit" ariaLabel="Fruit" />);

    expect(trigger().textContent).toContain('Pick a fruit');

    await pick(user, 'Cherry');

    expect(trigger().textContent).toContain('Cherry');
    expect(trigger().textContent).not.toContain('Pick a fruit');
  });

  test('an uncontrolled Select starts on defaultValue and moves off it on the next pick', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} defaultValue="banana" ariaLabel="Fruit" />);

    expect(trigger().textContent).toContain('Banana');

    await pick(user, 'Apple');

    expect(trigger().textContent).toContain('Apple');
  });

  test('a controlled Select never moves on its own - only the consumer changes it', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Held value="apple" />);

    await pick(user, 'Cherry');
    expect(trigger().textContent).toContain('Apple');

    view.rerender(<Held value="cherry" />);
    expect(trigger().textContent).toContain('Cherry');
  });

  test('a controlled Select set back to null shows the placeholder again', async () => {
    const view = renderApp(<Held value="cherry" />);
    expect(trigger().textContent).toContain('Cherry');

    view.rerender(<Held value={null} />);
    expect(trigger().textContent).toContain('Pick a fruit');
  });

  test('onChange fires once per commit with the new value and the full option', async () => {
    const user = userEvent.setup();
    const calls: [string, SelectOption][] = [];
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" onChange={(value, option) => calls.push([value, option])} />);

    await pick(user, 'Cherry');

    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toBe('cherry');
    expect(calls[0][1]).toEqual({ value: 'cherry', label: 'Cherry' });
  });

  test('onChange does not fire on mount, nor for opening and dismissing the menu', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    renderApp(
      <Select options={FRUITS} defaultValue="banana" ariaLabel="Fruit" onChange={(value) => calls.push(value)} />,
    );

    expect(calls).toEqual([]);

    await user.click(trigger());
    await settle();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Escape}');
    await settle();

    expect(calls).toEqual([]);
  });

  test('committing the option that is already selected reports it once and closes the menu', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    renderApp(
      <Select options={FRUITS} defaultValue="cherry" ariaLabel="Fruit" onChange={(value) => calls.push(value)} />,
    );

    await pick(user, 'Cherry');

    expect(calls).toEqual(['cherry']);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  test('a consumer that stores the reported value drives the trigger and the checked row', async () => {
    const user = userEvent.setup();
    function Bound() {
      const [value, setValue] = useState<string | null>(null);
      return <Select options={FRUITS} value={value} onChange={setValue} ariaLabel="Fruit" />;
    }
    renderApp(<Bound />);

    await pick(user, 'Banana');
    expect(trigger().textContent).toContain('Banana');

    await user.click(trigger());
    await settle();
    expect(selectedOptionNames()).toEqual(['Banana']);
  });

  test('a loading Select says so on the trigger and refuses to open', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} loading ariaLabel="Fruit" />);

    expect(trigger().textContent).toContain('Loading...');

    await user.click(trigger());
    await settle();

    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('clicking a disabled option commits nothing and leaves the menu open', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    renderApp(
      <Select
        options={[
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana', disabled: true },
        ]}
        ariaLabel="Fruit"
        onChange={(value) => calls.push(value)}
      />,
    );

    await pick(user, 'Banana');

    expect(calls).toEqual([]);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().textContent).toContain('Select an option');
  });
});

describe('MultiSelect selection', () => {
  test('an uncontrolled MultiSelect adds each picked option and keeps the menu open', async () => {
    const user = userEvent.setup();
    renderApp(<MultiSelect options={FRUITS} placeholder="Pick some" ariaLabel="Fruit" />);

    expect(trigger().textContent).toContain('Pick some');

    await user.click(trigger());
    await settle();
    await pickWhileOpen(user, 'Apple');
    expect(trigger().getAttribute('aria-expanded')).toBe('true');

    await pickWhileOpen(user, 'Cherry');

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(selectedOptionNames()).toEqual(['Apple', 'Cherry']);
    expect(trigger().textContent).toContain('Apple');
    expect(trigger().textContent).toContain('+1');
  });

  test('picking a selected option again removes it, and clearing them all restores the placeholder', async () => {
    const user = userEvent.setup();
    renderApp(
      <MultiSelect options={FRUITS} defaultValue={['apple', 'cherry']} placeholder="Pick some" ariaLabel="Fruit" />,
    );

    expect(trigger().textContent).toContain('Apple');
    expect(trigger().textContent).toContain('+1');

    await user.click(trigger());
    await settle();
    await pickWhileOpen(user, 'Apple');

    expect(selectedOptionNames()).toEqual(['Cherry']);
    expect(trigger().textContent).toContain('Cherry');
    expect(trigger().textContent).not.toContain('+1');

    await pickWhileOpen(user, 'Cherry');

    expect(selectedOptionNames()).toEqual([]);
    expect(trigger().textContent).toContain('Pick some');
  });

  test('onChange reports the next array and the option that was toggled, once per toggle', async () => {
    const user = userEvent.setup();
    const calls: [string[], string][] = [];
    renderApp(
      <MultiSelect
        options={FRUITS}
        defaultValue={['apple']}
        ariaLabel="Fruit"
        onChange={(value, toggled) => calls.push([value, toggled.value])}
      />,
    );

    await user.click(trigger());
    await settle();
    await pickWhileOpen(user, 'Cherry');
    await pickWhileOpen(user, 'Apple');

    expect(calls).toEqual([
      [['apple', 'cherry'], 'cherry'],
      [['cherry'], 'apple'],
    ]);
  });

  test('a controlled MultiSelect keeps its own selection until the consumer sends a new array', async () => {
    const user = userEvent.setup();
    const calls: string[][] = [];
    const view = renderApp(
      <MultiSelect options={FRUITS} value={[]} ariaLabel="Fruit" onChange={(value) => calls.push(value)} />,
    );

    await user.click(trigger());
    await settle();
    await pickWhileOpen(user, 'Banana');

    expect(calls).toEqual([['banana']]);
    expect(selectedOptionNames()).toEqual([]);
    expect(trigger().textContent).toContain('Select options');

    view.rerender(<MultiSelect options={FRUITS} value={['banana']} ariaLabel="Fruit" />);
    expect(selectedOptionNames()).toEqual(['Banana']);
    expect(trigger().textContent).toContain('Banana');
  });

  test('a consumer that stores the reported array can select and clear the whole set', async () => {
    const user = userEvent.setup();
    function Bound() {
      const [value, setValue] = useState<string[]>([]);
      return (
        <>
          <MultiSelect options={FRUITS} value={value} onChange={setValue} ariaLabel="Fruit" />
          <button type="button" onClick={() => setValue([])}>
            clear
          </button>
        </>
      );
    }
    renderApp(<Bound />);

    await user.click(trigger());
    await settle();
    await pickWhileOpen(user, 'Apple');
    await pickWhileOpen(user, 'Banana');
    expect(selectedOptionNames()).toEqual(['Apple', 'Banana']);

    await user.click(screen.getByRole('button', { name: 'clear' }));
    await settle();

    expect(trigger().textContent).toContain('Select options');
  });
});
