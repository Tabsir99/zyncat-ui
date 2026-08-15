import { expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateField } from '@zyncat/ui/date-field';
import { renderApp, settle } from './harness';
import {
  YEAR,
  calendar,
  dayCell,
  dayName,
  dayNames,
  fieldTrigger,
  focusedName,
  isoDate,
  lastReported,
  openPicker,
  tabbableDays,
  todayParts,
} from './date-support';

const weekdayOf = (name: string | null): number => new Date(name as string).getDay();

test('opening the calendar puts keyboard focus on the day that is already selected', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} />);

  await openPicker(user, 'Jan 15');

  expect(focusedName()).toBe(dayName(1, 15));
});

test('opening an empty calendar puts keyboard focus on today', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" />);

  await openPicker(user, 'Pick a date');

  const now = todayParts();
  expect(focusedName()).toBe(dayName(now.month, now.dayOfMonth, now.year));
});

test('the calendar shows six weeks that each start on a Monday', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(2, 10)} />);
  await openPicker(user, 'Feb 10');

  const names = dayNames(calendar());
  expect(names).toHaveLength(42);
  expect(screen.getAllByRole('row')).toHaveLength(6);
  for (let week = 0; week < 6; week++) expect(weekdayOf(names[week * 7])).toBe(1);

  const lastOfMonth = new Date(YEAR, 2, 0).getDate();
  for (let d = 1; d <= lastOfMonth; d++) expect(names).toContain(dayName(2, d));
});

test('arrow keys walk the calendar one day and one week at a time', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} />);
  await openPicker(user, 'Jan 15');

  await user.keyboard('{ArrowRight}');
  expect(focusedName()).toBe(dayName(1, 16));

  await user.keyboard('{ArrowDown}');
  expect(focusedName()).toBe(dayName(1, 23));

  await user.keyboard('{ArrowLeft}');
  expect(focusedName()).toBe(dayName(1, 22));

  await user.keyboard('{ArrowUp}');
  expect(focusedName()).toBe(dayName(1, 15));
});

test('arrowing past the last day of a month brings the next month into view', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 31)} />);
  await openPicker(user, 'Jan 31');

  await user.keyboard('{ArrowRight}');
  await settle();

  expect(focusedName()).toBe(dayName(2, 1));
  const names = dayNames(calendar());
  expect(names).toContain(dayName(2, 15));
  expect(names).not.toContain(dayName(1, 5));
});

test('arrowing above the first week brings the previous month into view', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(2, 3)} />);
  await openPicker(user, 'Feb 03');

  await user.keyboard('{ArrowUp}');
  await settle();

  expect(focusedName()).toBe(dayName(1, 27));
  const names = dayNames(calendar());
  expect(names).toContain(dayName(1, 15));
  expect(names).not.toContain(dayName(2, 25));
});

test('a leap year offers 29 February between the 28th and 1 March', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue="2024-02-28" />);
  await openPicker(user, 'Feb 28, 2024');

  await user.keyboard('{ArrowRight}');
  expect(focusedName()).toBe(dayName(2, 29, 2024));

  await user.keyboard('{ArrowRight}');
  await settle();
  expect(focusedName()).toBe(dayName(3, 1, 2024));
});

test('a common year steps from 28 February straight to 1 March', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue="2023-02-28" />);
  await openPicker(user, 'Feb 28, 2023');

  await user.keyboard('{ArrowRight}');
  await settle();

  expect(focusedName()).toBe(dayName(3, 1, 2023));
  expect(dayNames(calendar())).not.toContain('February 29, 2023');
});

test('Home and End jump to the Monday and the Sunday of the focused week', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} />);
  await openPicker(user, 'Jan 15');

  await user.keyboard('{Home}');
  const monday = focusedName();
  const distanceFromThe15th = new Date(dayName(1, 15)).getTime() - new Date(monday as string).getTime();
  expect(weekdayOf(monday)).toBe(1);
  expect(distanceFromThe15th).toBeGreaterThanOrEqual(0);
  expect(distanceFromThe15th).toBeLessThan(7 * 86400000);

  await user.keyboard('{End}');
  const sunday = focusedName();
  expect(weekdayOf(sunday)).toBe(0);
  expect(new Date(sunday as string).getTime() - new Date(monday as string).getTime()).toBe(6 * 86400000);
});

test('PageDown and PageUp move a month at a time and keep the day of the month', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} />);
  await openPicker(user, 'Jan 15');

  await user.keyboard('{PageDown}');
  await settle();
  expect(focusedName()).toBe(dayName(2, 15));

  await user.keyboard('{PageUp}');
  await settle();
  expect(focusedName()).toBe(dayName(1, 15));

  await user.keyboard('{PageUp}');
  await settle();
  expect(focusedName()).toBe(dayName(12, 15, YEAR - 1));
  expect(dayNames(calendar())).toContain(dayName(12, 31, YEAR - 1));
});

test.fails('paging by month from the 31st stays inside the month it paged to', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 31)} />);
  await openPicker(user, 'Jan 31');

  await user.keyboard('{PageDown}');
  await settle();
  expect(focusedName()).toMatch(/^February /);

  await user.keyboard('{PageUp}');
  await settle();
  expect(focusedName()).toMatch(/^January /);
});

test('Enter selects the focused day and reports it exactly once', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} onChange={onChange} />);
  await openPicker(user, 'Jan 15');

  await user.keyboard('{ArrowRight}{Enter}');
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(isoDate(1, 16));
  expect(dayCell(calendar(), dayName(1, 16)).getAttribute('aria-selected')).toBe('true');
});

test('Space selects the focused day and reports it exactly once', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} onChange={onChange} />);
  await openPicker(user, 'Jan 15');

  await user.keyboard('{ArrowDown} ');
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(isoDate(1, 22));
});

test('moving the focus around the calendar never reports a selection on its own', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} onChange={onChange} />);
  await openPicker(user, 'Jan 15');

  await user.keyboard('{ArrowRight}{ArrowDown}{PageDown}{Home}{End}');
  await settle();

  expect(onChange).not.toHaveBeenCalled();
  expect(dayCell(calendar(), focusedName() as string).getAttribute('aria-selected')).toBeNull();
  expect(fieldTrigger('Jan 15')).toBeDefined();
});

test('exactly one day is in the tab order, and it is the day the arrows moved to', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} />);
  await openPicker(user, 'Jan 15');

  expect(tabbableDays(calendar())).toHaveLength(1);

  await user.keyboard('{ArrowRight}{ArrowDown}');
  await settle();

  const tabbable = tabbableDays(calendar());
  expect(tabbable).toHaveLength(1);
  expect(tabbable[0].getAttribute('aria-label')).toBe(dayName(1, 23));
});

test('the calendar stays open after a selection so another day can be picked', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} onChange={onChange} />);
  await openPicker(user, 'Jan 15');

  await user.keyboard('{ArrowRight}{Enter}');
  await settle();
  expect(screen.getByRole('dialog', { name: 'Due' })).toBeDefined();

  await user.keyboard('{ArrowRight}{Enter}');
  await settle();

  expect(onChange).toHaveBeenCalledTimes(2);
  expect(lastReported(onChange)).toEqual(isoDate(1, 17));
});
