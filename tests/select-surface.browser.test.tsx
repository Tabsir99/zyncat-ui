import { useRef, useState } from 'react';
import { describe, expect, test } from 'vitest';
import { act, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { Select, type SelectOption } from '@zyncat/ui/select';
import { MultiSelect } from '@zyncat/ui/multi-select';
import {
  Probe,
  firstSighting,
  ledger,
  nextFrame,
  overlayRoots,
  renderApp,
  settle,
  useOpenProbe,
  type Ledger,
} from './harness';

const FRUITS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const LATER: SelectOption[] = [
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
];

function trigger(): HTMLElement {
  return screen.getByRole('combobox');
}

function isOpen(): boolean {
  return trigger().getAttribute('aria-expanded') === 'true';
}

function optionLabels(): (string | null)[] {
  return screen.getAllByRole('option').map((option) => option.textContent);
}

function ProbedSelect({ on }: { on: Ledger }) {
  return (
    <Select
      ariaLabel="Fruit"
      options={[
        { value: 'apple', label: <Probe on={on}>Apple</Probe> },
        { value: 'cherry', label: 'Cherry' },
      ]}
    />
  );
}

function OpenTrackedSelect({ on }: { on: Ledger }) {
  const [open, setOpen] = useState(false);
  const optionRef = useRef<HTMLSpanElement>(null);
  useOpenProbe(open, optionRef, on);
  return (
    <Select
      ariaLabel="Fruit"
      htmlProps={{ onClick: () => setOpen(true) }}
      options={[{ value: 'apple', label: <span ref={optionRef}>Apple</span> }]}
    />
  );
}

function OptionsSwapped({ options }: { options: SelectOption[] }) {
  return <Select options={options} ariaLabel="Fruit" />;
}

async function open(user: UserEvent): Promise<void> {
  await user.click(trigger());
  await settle();
}

describe('Select panel observation contract', () => {
  test('a consumer node inside the menu is in the document the first time its ref fires', async () => {
    const user = userEvent.setup();
    const on = ledger();
    renderApp(<ProbedSelect on={on} />);
    await open(user);

    const first = firstSighting(on, 'callback-ref');
    expect(first, 'callback ref never fired').toBeDefined();
    expect(first!.connected).toBe(true);
  });

  test('a consumer node inside the menu is attached in every phase consumer code can run', async () => {
    const user = userEvent.setup();
    const on = ledger();
    renderApp(<ProbedSelect on={on} />);
    await open(user);

    for (const phase of ['callback-ref', 'layout-effect', 'effect'] as const) {
      const sighting = firstSighting(on, phase);
      expect(sighting, `no sighting for ${phase}`).toBeDefined();
      expect(sighting!.connected, `detached during ${phase}`).toBe(true);
    }
  });

  test('design tokens resolve on a consumer node inside the menu from its first sighting', async () => {
    const user = userEvent.setup();
    const on = ledger();
    renderApp(<ProbedSelect on={on} />);
    await open(user);

    const first = on.sightings[0];
    expect(first.tokens['--duration-base']).not.toBe('');
    expect(first.tokens['--ease-entrance']).not.toBe('');
  });

  test('a consumer node inside the menu is measurable from its first sighting', async () => {
    const user = userEvent.setup();
    const on = ledger();
    renderApp(<ProbedSelect on={on} />);
    await open(user);

    expect(on.sightings[0].height).toBeGreaterThan(0);
    expect(on.sightings[0].width).toBeGreaterThan(0);
  });

  test('an effect keyed on the consumer state that opened the menu sees a live node inside it', async () => {
    const user = userEvent.setup();
    const on = ledger();
    renderApp(<OpenTrackedSelect on={on} />);
    await open(user);

    const fromOpenEffect = on.sightings.filter((sighting) => sighting.phase === 'effect');
    expect(fromOpenEffect.length, 'the open-keyed effect never ran').toBeGreaterThan(0);
    expect(
      fromOpenEffect.every((sighting) => sighting.height !== -1),
      'the open-keyed effect saw a null ref',
    ).toBe(true);
    expect(
      fromOpenEffect.every((sighting) => sighting.connected),
      'the open-keyed effect saw a detached node',
    ).toBe(true);
    expect(fromOpenEffect.every((sighting) => sighting.height > 0)).toBe(true);
  });

  test('menu content survives the exit animation, then unmounts', async () => {
    const user = userEvent.setup();
    const on = ledger();
    renderApp(<ProbedSelect on={on} />);
    await open(user);
    expect(document.querySelector('[data-probe]')).not.toBeNull();

    await user.keyboard('{Escape}');
    expect(document.querySelector('[data-probe]'), 'unmounted before the exit ran').not.toBeNull();

    await settle();
    expect(document.querySelector('[data-probe]'), 'still mounted after the exit finished').toBeNull();
  });
});

describe('Select outside interaction', () => {
  test('pressing outside the menu closes it and selects nothing', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    renderApp(
      <>
        <button type="button">elsewhere</button>
        <Select options={FRUITS} ariaLabel="Fruit" onChange={(value) => calls.push(value)} />
      </>,
    );
    await open(user);

    await user.click(screen.getByRole('button', { name: 'elsewhere' }));
    await settle();

    expect(isOpen()).toBe(false);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(calls).toEqual([]);
    expect(trigger().textContent).toContain('Select an option');
  });

  test('clicking the trigger while the menu is open closes it instead of reopening it', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await open(user);

    await user.click(trigger());
    await settle();

    expect(isOpen()).toBe(false);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('a MultiSelect menu closes on an outside press and keeps what was toggled', async () => {
    const user = userEvent.setup();
    renderApp(
      <>
        <button type="button">elsewhere</button>
        <MultiSelect options={FRUITS} ariaLabel="Fruit" />
      </>,
    );
    await open(user);
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    await settle();

    await user.click(screen.getByRole('button', { name: 'elsewhere' }));
    await settle();

    expect(isOpen()).toBe(false);
    expect(trigger().textContent).toContain('Cherry');
  });
});

describe('Select lifecycle', () => {
  test('unmounting while the menu is open removes the menu and leaves no overlay root behind', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await open(user);
    expect(screen.getByRole('listbox')).toBeTruthy();

    view.unmount();
    await settle();

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(overlayRoots()).toEqual([]);
    expect(document.body.style.overflow).toBe('');
    expect(Array.from(document.body.children).some((child) => (child as HTMLElement).inert)).toBe(false);
  });

  test('toggling faster than the animation settles closed with nothing left mounted', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);

    await user.click(trigger());
    await user.click(trigger());
    await user.click(trigger());
    await user.click(trigger());
    await settle();

    expect(isOpen()).toBe(false);
    expect(screen.queryByRole('listbox')).toBeNull();

    await open(user);
    expect(isOpen()).toBe(true);
    expect(optionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  test('remounting a Select gives a working menu again', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Select options={FRUITS} ariaLabel="Fruit" />);
    await open(user);
    view.unmount();
    await settle();

    renderApp(<Select options={FRUITS} defaultValue="banana" ariaLabel="Fruit" />);
    await open(user);

    expect(optionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
    expect(screen.getByRole('option', { name: 'Banana' }).getAttribute('aria-selected')).toBe('true');
  });

  test('replacing the options while the menu is open swaps the rows and keeps them usable', async () => {
    const user = userEvent.setup();
    const view = renderApp(<OptionsSwapped options={FRUITS} />);
    await open(user);
    expect(optionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);

    view.rerender(<OptionsSwapped options={LATER} />);
    await settle();

    expect(isOpen()).toBe(true);
    expect(optionLabels()).toEqual(['Fig', 'Grape']);

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    await settle();

    expect(trigger().textContent).toMatch(/Fig|Grape/);
    expect(isOpen()).toBe(false);
  });

  test('with animation disabled the menu is gone within a few frames of closing', async () => {
    const user = userEvent.setup();
    renderApp(<Select options={FRUITS} animation={null} ariaLabel="Fruit" />);
    await open(user);
    expect(screen.getByRole('listbox')).toBeTruthy();

    await user.keyboard('{Escape}');
    await act(async () => {
      await nextFrame();
      await nextFrame();
      await nextFrame();
    });

    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('a menu left open across an options change still commits by pointer', async () => {
    const user = userEvent.setup();
    const view = renderApp(<OptionsSwapped options={FRUITS} />);
    await open(user);

    view.rerender(<OptionsSwapped options={LATER} />);
    await settle();

    await user.click(screen.getByRole('option', { name: 'Grape' }));
    await settle();

    expect(trigger().textContent).toContain('Grape');
    expect(isOpen()).toBe(false);
  });
});
