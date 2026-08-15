import { expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeField } from '@zyncat/ui/time-field';
import { renderApp, settle } from './harness';
import { lastReported } from './date-support';

const hours = (): HTMLElement => screen.getByRole('spinbutton', { name: 'Hours' });
const minutes = (): HTMLElement => screen.getByRole('spinbutton', { name: 'Minutes' });
const meridiem = (): HTMLElement => screen.getByRole('spinbutton', { name: 'AM or PM' });
const reading = (): string => `${hours().textContent}:${minutes().textContent}`;

test('an empty field reads as empty and reports nothing on mount', async () => {
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" onChange={onChange} />);
  await settle();

  expect(screen.getByRole('group', { name: 'Send at' })).toBeDefined();
  expect(hours().getAttribute('aria-valuetext')).toBe('Empty');
  expect(minutes().getAttribute('aria-valuetext')).toBe('Empty');
  expect(hours().getAttribute('aria-valuemin')).toBe('0');
  expect(hours().getAttribute('aria-valuemax')).toBe('23');
  expect(onChange).not.toHaveBeenCalled();
});

test('typing a full time reports it once in 24h form', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" onChange={onChange} />);

  await user.click(hours());
  await user.keyboard('1430');
  await settle();

  expect(reading()).toBe('14:30');
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual('14:30');
});

test('a half-typed time reports nothing until both segments are complete', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" onChange={onChange} />);

  await user.click(hours());
  await user.keyboard('1');
  await settle();
  expect(hours().textContent).toBe('01');
  expect(onChange).not.toHaveBeenCalled();

  await user.keyboard('4');
  await settle();
  expect(hours().textContent).toBe('14');
  expect(document.activeElement).toBe(minutes());
  expect(onChange).not.toHaveBeenCalled();

  await user.keyboard('3');
  await settle();
  expect(onChange).not.toHaveBeenCalled();

  await user.keyboard('0');
  await settle();
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual('14:30');
});

test('a digit that cannot start a two-digit hour completes the hour on its own', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" onChange={onChange} />);

  await user.click(hours());
  await user.keyboard('9');
  await settle();

  expect(hours().textContent).toBe('09');
  expect(document.activeElement).toBe(minutes());

  await user.keyboard('15');
  await settle();
  expect(lastReported(onChange)).toEqual('09:15');
});

test('letters are ignored by the segments', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" onChange={onChange} />);

  await user.click(hours());
  await user.keyboard('ab');
  await settle();

  expect(hours().getAttribute('aria-valuetext')).toBe('Empty');
  expect(onChange).not.toHaveBeenCalled();
});

test('the up arrow steps the minutes by minuteStep and wraps inside the hour', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" defaultValue="10:55" onChange={onChange} />);

  await user.click(minutes());
  await user.keyboard('{ArrowUp}');
  await settle();

  expect(reading()).toBe('10:00');
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual('10:00');
});

test('the up arrow wraps the hour from 23 back to 00', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" defaultValue="23:30" onChange={onChange} />);

  await user.click(hours());
  await user.keyboard('{ArrowUp}');
  await settle();

  expect(reading()).toBe('00:30');
  expect(lastReported(onChange)).toEqual('00:30');
});

test('minuteStep sizes the arrow steps in both directions', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" defaultValue="10:30" minuteStep={15} onChange={onChange} />);

  await user.click(minutes());
  await user.keyboard('{ArrowUp}');
  await settle();
  expect(reading()).toBe('10:45');

  await user.keyboard('{ArrowDown}{ArrowDown}');
  await settle();

  expect(reading()).toBe('10:15');
  expect(lastReported(onChange)).toEqual('10:15');
});

test('a time below min saturates to min instead of failing', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" min="09:00" onChange={onChange} />);

  await user.click(hours());
  await user.keyboard('0730');
  await settle();

  expect(reading()).toBe('09:00');
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual('09:00');
});

test('a time above max saturates to max instead of failing', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" max="17:00" onChange={onChange} />);

  await user.click(hours());
  await user.keyboard('1830');
  await settle();

  expect(reading()).toBe('17:00');
  expect(lastReported(onChange)).toEqual('17:00');
});

test('12h format shows a meridiem while the value stays 24h', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" format="12h" defaultValue="13:05" onChange={onChange} />);
  await settle();

  expect(reading()).toBe('01:05');
  expect(meridiem().textContent).toBe('PM');
  expect(hours().getAttribute('aria-valuenow')).toBe('1');
  expect(hours().getAttribute('aria-valuemin')).toBe('1');
  expect(hours().getAttribute('aria-valuemax')).toBe('12');

  await user.click(meridiem());
  await user.keyboard('a');
  await settle();

  expect(meridiem().textContent).toBe('AM');
  expect(reading()).toBe('01:05');
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual('01:05');
});

test('the arrow keys walk between the segments', async () => {
  const user = userEvent.setup();
  renderApp(<TimeField label="Send at" format="12h" defaultValue="13:05" />);

  await user.click(hours());
  await user.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(minutes());

  await user.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(meridiem());

  await user.keyboard('{ArrowLeft}{ArrowLeft}');
  expect(document.activeElement).toBe(hours());
});

test('a disabled field is out of the tab order and reports nothing', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(
    <div>
      <button type="button">before</button>
      <TimeField label="Send at" defaultValue="10:30" disabled onChange={onChange} />
    </div>,
  );
  await settle();

  expect(screen.getByRole('group', { name: 'Send at' }).getAttribute('aria-disabled')).toBe('true');
  expect(hours().tabIndex).toBe(-1);
  expect(minutes().tabIndex).toBe(-1);

  screen.getByRole('button', { name: 'before' }).focus();
  await user.tab();
  await user.keyboard('11');
  await settle();

  expect(document.activeElement).not.toBe(hours());
  expect(reading()).toBe('10:30');
  expect(onChange).not.toHaveBeenCalled();
});

test.fails('a controlled field snaps back to the value its consumer kept', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<TimeField label="Send at" value="09:00" onChange={onChange} />);

  await user.click(hours());
  await user.keyboard('1430');
  await settle();

  expect(lastReported(onChange)).toEqual('14:30');
  expect(reading()).toBe('09:00');
});
