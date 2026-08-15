import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangeField, type DateRange } from '@zyncat/ui/date-range-field';
import { renderApp, settle } from './harness';
import {
  dayCell,
  dayName,
  fieldTrigger,
  focusedName,
  isoDate,
  lastReported,
  monthGrid,
  monthName,
  openPicker,
} from './date-support';

const SEEDED: DateRange = { start: isoDate(1, 5), end: isoDate(1, 9) };
const SEEDED_TRIGGER = 'Jan 05 - Jan 09';

const january = () => monthGrid(monthName(1));
const february = () => monthGrid(monthName(2));
const gridNames = (): (string | null)[] => screen.getAllByRole('grid').map((grid) => grid.getAttribute('aria-label'));
const selectedIn = (grid: HTMLElement): (string | null)[] =>
  within(grid)
    .getAllByRole('gridcell')
    .filter((cell) => cell.getAttribute('aria-selected') === 'true')
    .map((cell) => cell.getAttribute('aria-label'));

describe('two-month range picker', () => {
  beforeAll(async () => {
    await page.viewport(1280, 900);
  });
  afterAll(async () => {
    await page.viewport(414, 896);
  });

  test('opens on the seeded month and the month after it', async () => {
    const user = userEvent.setup();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} />);

    await openPicker(user, SEEDED_TRIGGER);

    expect(gridNames()).toEqual([monthName(1), monthName(2)]);
    expect(selectedIn(january())).toEqual([dayName(1, 5), dayName(1, 9)]);
  });

  test('picking a start then an end reports one complete range', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} onChange={onChange} />);
    await openPicker(user, SEEDED_TRIGGER);

    await user.click(dayCell(january(), dayName(1, 12)));
    await settle();
    expect(onChange).not.toHaveBeenCalled();

    await user.click(dayCell(january(), dayName(1, 16)));
    await settle();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(lastReported(onChange)).toEqual({ start: isoDate(1, 12), end: isoDate(1, 16) });
    expect(fieldTrigger('Jan 12 - Jan 16')).toBeDefined();
    expect(selectedIn(january())).toEqual([dayName(1, 12), dayName(1, 16)]);
  });

  test('picking the end before the start reports the range in calendar order', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} onChange={onChange} />);
    await openPicker(user, SEEDED_TRIGGER);

    await user.click(dayCell(january(), dayName(1, 20)));
    await user.click(dayCell(january(), dayName(1, 8)));
    await settle();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(lastReported(onChange)).toEqual({ start: isoDate(1, 8), end: isoDate(1, 20) });
    expect(fieldTrigger('Jan 08 - Jan 20')).toBeDefined();
  });

  test('a range can start in one month and end in the next', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} onChange={onChange} />);
    await openPicker(user, SEEDED_TRIGGER);

    await user.click(dayCell(january(), dayName(1, 28)));
    await user.click(dayCell(february(), dayName(2, 3)));
    await settle();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(lastReported(onChange)).toEqual({ start: isoDate(1, 28), end: isoDate(2, 3) });
  });

  test('a half-picked range reports nothing and leaves the trigger alone', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} onChange={onChange} />);
    await openPicker(user, SEEDED_TRIGGER);

    await user.click(dayCell(january(), dayName(1, 12)));
    await settle();

    expect(onChange).not.toHaveBeenCalled();
    expect(fieldTrigger(SEEDED_TRIGGER)).toBeDefined();
    expect(screen.getByText('- 1 day')).toBeDefined();
  });

  test('hovering after the first pick previews how long the range would be', async () => {
    const user = userEvent.setup();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} />);
    await openPicker(user, SEEDED_TRIGGER);

    await user.click(dayCell(january(), dayName(1, 12)));
    await user.hover(dayCell(january(), dayName(1, 16)));
    await settle();

    expect(screen.getByText('- 5 days')).toBeDefined();
  });

  test('Escape abandons a half-picked range and keeps the calendar open, a second Escape closes it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} onChange={onChange} />);
    await openPicker(user, SEEDED_TRIGGER);

    await user.click(dayCell(january(), dayName(1, 20)));
    await settle();
    expect(screen.getByText('- 1 day')).toBeDefined();

    await user.keyboard('{Escape}');
    await settle();
    expect(screen.getByRole('dialog', { name: 'Period' })).toBeDefined();
    expect(screen.getByText('- 5 days')).toBeDefined();
    expect(onChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');
    await settle();
    expect(screen.queryByRole('dialog', { name: 'Period' })).toBeNull();
  });

  test('a quick range preset reports a complete range', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} onChange={onChange} />);
    await openPicker(user, SEEDED_TRIGGER);

    await user.click(screen.getByRole('button', { name: 'Last 7 days' }));
    await settle();

    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(lastReported(onChange)).toEqual({
      start: isoDate(weekAgo.getMonth() + 1, weekAgo.getDate(), weekAgo.getFullYear()),
      end: isoDate(now.getMonth() + 1, now.getDate(), now.getFullYear()),
    });
  });

  test('days outside min and max cannot start a range', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(
      <DateRangeField
        label="Period"
        defaultValue={SEEDED}
        min={isoDate(1, 3)}
        max={isoDate(1, 20)}
        onChange={onChange}
      />,
    );
    await openPicker(user, SEEDED_TRIGGER);

    expect((dayCell(january(), dayName(1, 2)) as HTMLButtonElement).disabled).toBe(true);
    expect((dayCell(january(), dayName(1, 21)) as HTMLButtonElement).disabled).toBe(true);
    expect((dayCell(january(), dayName(1, 3)) as HTMLButtonElement).disabled).toBe(false);

    dayCell(january(), dayName(1, 2)).click();
    await settle();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('a controlled range field keeps the range its consumer gave it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<DateRangeField label="Period" value={SEEDED} onChange={onChange} />);
    await openPicker(user, SEEDED_TRIGGER);

    await user.click(dayCell(january(), dayName(1, 12)));
    await user.click(dayCell(january(), dayName(1, 16)));
    await settle();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(lastReported(onChange)).toEqual({ start: isoDate(1, 12), end: isoDate(1, 16) });
    expect(fieldTrigger(SEEDED_TRIGGER)).toBeDefined();
    expect(selectedIn(january())).toEqual([dayName(1, 5), dayName(1, 9)]);
  });

  test('the keyboard walks both months and two Enters commit a range', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} onChange={onChange} />);
    await openPicker(user, SEEDED_TRIGGER);
    expect(focusedName()).toBe(dayName(1, 5));

    await user.keyboard('{ArrowRight}{ArrowRight}{Enter}');
    await settle();
    expect(focusedName()).toBe(dayName(1, 7));
    expect(onChange).not.toHaveBeenCalled();

    await user.keyboard('{ArrowDown}{Enter}');
    await settle();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(lastReported(onChange)).toEqual({ start: isoDate(1, 7), end: isoDate(1, 14) });
  });

  test('paging past the last visible month brings the next pair of months into view', async () => {
    const user = userEvent.setup();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} />);
    await openPicker(user, SEEDED_TRIGGER);

    await user.keyboard('{PageDown}');
    await settle();
    expect(focusedName()).toBe(dayName(2, 5));
    expect(gridNames()).toEqual([monthName(1), monthName(2)]);

    await user.keyboard('{PageDown}');
    await settle();

    expect(focusedName()).toBe(dayName(3, 5));
    expect(gridNames()).toEqual([monthName(2), monthName(3)]);
  });

  test.fails('every day in the range calendar sits in a grid row', async () => {
    const user = userEvent.setup();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} />);
    await openPicker(user, SEEDED_TRIGGER);

    expect(within(january()).getAllByRole('row')).toHaveLength(6);
  });
});

describe('narrow viewport range picker', () => {
  beforeAll(async () => {
    await page.viewport(414, 896);
  });

  test('opens a single month and still commits a range', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<DateRangeField label="Period" defaultValue={SEEDED} onChange={onChange} />);
    await openPicker(user, SEEDED_TRIGGER);

    expect(gridNames()).toEqual([monthName(1)]);

    await user.click(dayCell(january(), dayName(1, 12)));
    await user.click(dayCell(january(), dayName(1, 16)));
    await settle();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(lastReported(onChange)).toEqual({ start: isoDate(1, 12), end: isoDate(1, 16) });
  });
});
