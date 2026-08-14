import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberField } from '@zyncat/ui/number-field';
import { renderApp, settle } from './harness';

interface FixtureProps {
  onValue?: (value: number) => void;
  initial?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

function ControlledSeats({ onValue, initial = 5, ...props }: FixtureProps) {
  const [seats, setSeats] = useState(initial);
  return (
    <NumberField
      id="seats"
      label="Seats"
      value={seats}
      onChange={(next) => {
        setSeats(next);
        onValue?.(next);
      }}
      {...props}
    />
  );
}

function seatsInput(): HTMLInputElement {
  return screen.getByRole('textbox', { name: 'Seats' }) as HTMLInputElement;
}

function increaseButton(): HTMLButtonElement {
  return screen.getByRole('button', { name: /increase/i }) as HTMLButtonElement;
}

function decreaseButton(): HTMLButtonElement {
  return screen.getByRole('button', { name: /decrease/i }) as HTMLButtonElement;
}

describe('NumberField value contract', () => {
  test('an uncontrolled field starts at its default value and steps from there', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<NumberField id="seats" label="Seats" defaultValue={5} onChange={onChange} />);

    expect(seatsInput().value).toBe('5');
    expect(onChange).not.toHaveBeenCalled();

    await user.click(increaseButton());

    expect(seatsInput().value).toBe('6');
    expect(onChange.mock.calls.map((call) => call[0])).toEqual([6]);
  });

  test('a field whose value prop is pinned reports the step but keeps showing the pinned number', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<NumberField id="seats" label="Seats" value={5} onChange={onChange} />);

    await user.click(increaseButton());

    expect(onChange.mock.calls.map((call) => call[0])).toEqual([6]);
    expect(seatsInput().value).toBe('5');
  });

  test('typing a number shows exactly what was typed and reports it as a number', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledSeats onValue={onValue} min={1} max={50} />);

    const input = seatsInput();
    await user.clear(input);
    await user.type(input, '25');

    expect(input.value).toBe('25');
    expect(onValue.mock.lastCall).toEqual([25]);
    for (const [value] of onValue.mock.calls) expect(Number.isNaN(value)).toBe(false);
  });

  test('letters and symbols never make it into the field', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledSeats onValue={onValue} min={0} max={999} />);

    const input = seatsInput();
    await user.clear(input);
    await user.type(input, 'a1b2c');

    expect(input.value).toBe('12');
    expect(onValue.mock.lastCall).toEqual([12]);
  });

  test('a number typed above the maximum is reported clamped and snaps back when the field is left', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledSeats onValue={onValue} min={1} max={50} />);

    const input = seatsInput();
    await user.clear(input);
    await user.type(input, '99');
    expect(onValue.mock.lastCall).toEqual([50]);

    await user.tab();
    expect(input.value).toBe('50');
  });

  test('a number typed below the minimum is raised to it when the field is left', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledSeats min={10} max={50} initial={20} />);

    const input = seatsInput();
    await user.clear(input);
    await user.type(input, '3');
    await user.tab();

    expect(input.value).toBe('10');
  });

  test('emptying the field reports a number rather than nothing, and resolves to one on blur', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledSeats onValue={onValue} min={1} max={50} />);

    const input = seatsInput();
    await user.clear(input);

    expect(input.value).toBe('');
    expect(onValue.mock.lastCall).toEqual([1]);

    await user.tab();
    expect(input.value).toBe('1');
  });

  test('a half typed entry keeps what was typed on screen and never reports NaN', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledSeats onValue={onValue} min={0} max={100} />);

    const input = seatsInput();
    await user.clear(input);
    await user.type(input, '-');
    expect(input.value).toBe('-');

    await user.type(input, '.');
    expect(input.value).toBe('-.');

    for (const [value] of onValue.mock.calls) expect(Number.isNaN(value)).toBe(false);
  });

  test('Enter commits the typed number at once', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledSeats min={1} max={50} />);

    const input = seatsInput();
    await user.clear(input);
    await user.type(input, '99{Enter}');

    expect(input.value).toBe('50');
    expect(document.activeElement).toBe(input);
  });
});

describe('NumberField stepping', () => {
  test('the caret steppers add and remove one step per click', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledSeats initial={5} min={0} max={10} />);

    await user.click(increaseButton());
    await user.click(increaseButton());
    expect(seatsInput().value).toBe('7');

    await user.click(decreaseButton());
    expect(seatsInput().value).toBe('6');
  });

  test('ArrowUp and ArrowDown step the value from the keyboard', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledSeats onValue={onValue} initial={5} min={0} max={10} />);

    const input = seatsInput();
    await user.click(input);
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowDown}');

    expect(input.value).toBe('6');
    expect(onValue.mock.calls).toEqual([[6], [7], [6]]);
  });

  test('a decimal step lands on exact decimals instead of floating point noise', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledSeats onValue={onValue} initial={0} min={0} max={1} step={0.1} />);

    await user.click(increaseButton());
    await user.click(increaseButton());
    await user.click(increaseButton());

    expect(seatsInput().value).toBe('0.3');
    expect(onValue.mock.calls).toEqual([[0.1], [0.2], [0.3]]);
  });

  test('stepping stops at the bounds and the stepper for that direction goes inert', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledSeats initial={9} min={1} max={10} />);

    await user.click(increaseButton());
    expect(seatsInput().value).toBe('10');
    expect(increaseButton().disabled).toBe(true);
    expect(decreaseButton().disabled).toBe(false);

    await user.click(seatsInput());
    await user.keyboard('{ArrowUp}');
    expect(seatsInput().value).toBe('10');
  });

  test('the decrease stepper is inert at the minimum and the value never drops below it', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledSeats initial={1} min={1} max={10} />);

    expect(decreaseButton().disabled).toBe(true);

    await user.click(seatsInput());
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(seatsInput().value).toBe('1');
  });

  test('stepping from a number typed but not yet committed continues from that number', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledSeats min={0} max={100} />);

    const input = seatsInput();
    await user.clear(input);
    await user.type(input, '40');
    await user.keyboard('{ArrowUp}');

    expect(input.value).toBe('41');
  });
});

describe('NumberField accessibility and state', () => {
  test('the label names the input and both steppers carry a name of their own', () => {
    renderApp(<NumberField id="seats" label="Seats" defaultValue={1} />);

    expect(seatsInput()).toBeInstanceOf(HTMLInputElement);
    expect(increaseButton()).toBeInstanceOf(HTMLButtonElement);
    expect(decreaseButton()).toBeInstanceOf(HTMLButtonElement);
  });

  test('a disabled field refuses typing and both steppers', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<NumberField id="seats" label="Seats" defaultValue={5} disabled onChange={onChange} />);

    const input = seatsInput();
    await user.click(input);
    await user.keyboard('7{ArrowUp}');

    expect(input.value).toBe('5');
    expect(increaseButton().disabled).toBe(true);
    expect(decreaseButton().disabled).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('an error marks the input invalid and shows its message', async () => {
    const view = renderApp(<NumberField id="seats" label="Seats" defaultValue={5} helper="How many people." />);
    expect(seatsInput().getAttribute('aria-invalid')).toBeNull();
    expect(screen.getByText('How many people.')).toBeInstanceOf(HTMLElement);

    view.rerender(
      <NumberField id="seats" label="Seats" defaultValue={5} helper="How many people." error="Too many." />,
    );
    await settle();

    expect(seatsInput().getAttribute('aria-invalid')).toBe('true');
    expect(getComputedStyle(screen.getByText('Too many.')).visibility).toBe('visible');
    expect(screen.queryByText('How many people.')).toBeNull();
  });

  test('the unit suffix is shown beside the number', () => {
    renderApp(<NumberField id="seats" label="Seats" unit="users" defaultValue={5} />);

    expect(screen.getByText('users')).toBeInstanceOf(HTMLElement);
  });

  test('a value given as a string is treated as the number it spells', () => {
    renderApp(<NumberField id="seats" label="Seats" value="12" onChange={() => {}} />);

    expect(seatsInput().value).toBe('12');
  });
});
