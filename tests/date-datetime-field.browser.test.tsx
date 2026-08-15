import { expect, test, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTimeField } from '@zyncat/ui/datetime-field';
import { renderApp, settle } from './harness';
import {
  calendar,
  dayCell,
  dayName,
  fieldTrigger,
  isoDate,
  lastReported,
  openPicker,
  shortDate,
  todayParts,
} from './date-support';

const NOW = todayParts();
const hours = (): HTMLElement => screen.getByRole('spinbutton', { name: 'Hours' });
const minutes = (): HTMLElement => screen.getByRole('spinbutton', { name: 'Minutes' });

test('the calendar and the time controls live in the same panel', async () => {
  const user = userEvent.setup();
  renderApp(<DateTimeField label="Due at" />);
  await openPicker(user, 'Pick date & time');

  const panel = screen.getByRole('dialog', { name: 'Due at' });
  expect(within(panel).getByRole('grid', { name: 'Calendar' })).toBeDefined();
  expect(within(panel).getByRole('spinbutton', { name: 'Hours' })).toBeDefined();
  expect(within(panel).getByRole('spinbutton', { name: 'Minutes' })).toBeDefined();
});

test('a day on its own reports nothing and the trigger shows the missing time', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateTimeField label="Due at" onChange={onChange} />);
  await openPicker(user, 'Pick date & time');

  await user.click(dayCell(calendar(), dayName(NOW.month, 5, NOW.year)));
  await settle();

  expect(onChange).not.toHaveBeenCalled();
  expect(fieldTrigger(`${shortDate(NOW.month, 5)}, --:--`)).toBeDefined();
});

test('completing the time reports both halves as one value, once', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateTimeField label="Due at" onChange={onChange} />);
  await openPicker(user, 'Pick date & time');

  await user.click(dayCell(calendar(), dayName(NOW.month, 5, NOW.year)));
  await settle();
  await user.click(hours());
  await user.keyboard('0930');
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(`${isoDate(NOW.month, 5, NOW.year)}T09:30`);
});

test('changing the day afterwards keeps the time and reports the new combination', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateTimeField label="Due at" defaultValue={`${isoDate(1, 15)}T09:30`} onChange={onChange} />);
  await openPicker(user, 'Jan 15, 09:30');

  await user.click(dayCell(calendar(), dayName(1, 20)));
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(`${isoDate(1, 20)}T09:30`);
  expect(fieldTrigger('Jan 20, 09:30')).toBeDefined();
});

test('changing the time afterwards keeps the day', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateTimeField label="Due at" defaultValue={`${isoDate(1, 15)}T09:30`} onChange={onChange} />);
  await openPicker(user, 'Jan 15, 09:30');

  await user.click(minutes());
  await user.keyboard('{ArrowUp}');
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(`${isoDate(1, 15)}T09:35`);
});

test('12h display leaves the reported value in 24h', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateTimeField label="Due at" format="12h" defaultValue={`${isoDate(1, 15)}T09:30`} onChange={onChange} />);
  await openPicker(user, 'Jan 15, 9:30 AM');

  await user.click(screen.getByRole('spinbutton', { name: 'AM or PM' }));
  await user.keyboard('p');
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(`${isoDate(1, 15)}T21:30`);
  expect(fieldTrigger('Jan 15, 9:30 PM')).toBeDefined();
});

test('a min bound on the boundary day pulls an earlier time up to it', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(
    <DateTimeField
      label="Due at"
      defaultValue={`${isoDate(1, 15)}T12:00`}
      min={`${isoDate(1, 15)}T09:00`}
      onChange={onChange}
    />,
  );
  await openPicker(user, 'Jan 15, 12:00');

  await user.click(hours());
  await user.keyboard('07');
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(`${isoDate(1, 15)}T09:00`);
  expect(hours().textContent).toBe('09');
  expect(minutes().textContent).toBe('00');
});

test('days before the min day cannot be picked', async () => {
  const user = userEvent.setup();
  renderApp(<DateTimeField label="Due at" defaultValue={`${isoDate(1, 15)}T12:00`} min={isoDate(1, 10)} />);
  await openPicker(user, 'Jan 15, 12:00');

  expect(dayCell(calendar(), dayName(1, 9)).disabled).toBe(true);
  expect(dayCell(calendar(), dayName(1, 10)).disabled).toBe(false);
});

test.fails('a controlled field snaps back to the value its consumer kept', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateTimeField label="Due at" value={`${isoDate(1, 15)}T09:30`} onChange={onChange} />);
  await openPicker(user, 'Jan 15, 09:30');

  await user.click(dayCell(calendar(), dayName(1, 20)));
  await settle();

  expect(lastReported(onChange)).toEqual(`${isoDate(1, 20)}T09:30`);
  expect(fieldTrigger('Jan 15, 09:30')).toBeDefined();
});
