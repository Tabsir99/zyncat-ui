import { expect, test, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateField } from '@zyncat/ui/date-field';
import { renderApp, settle } from './harness';
import {
  YEAR,
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

const selectedNames = (): (string | null)[] =>
  within(calendar())
    .getAllByRole('gridcell')
    .filter((cell) => cell.getAttribute('aria-selected') === 'true')
    .map((cell) => cell.getAttribute('aria-label'));

test('a seeded field shows its value and reports nothing on mount or on open', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} onChange={onChange} />);
  await settle();

  expect(onChange).not.toHaveBeenCalled();
  expect(fieldTrigger('Jan 15')).toBeDefined();

  await openPicker(user, 'Jan 15');
  expect(onChange).not.toHaveBeenCalled();
  expect(selectedNames()).toEqual([dayName(1, 15)]);
});

test('picking a day reports one ISO day and moves the trigger and the selection', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateField label="Due" onChange={onChange} />);
  await openPicker(user, 'Pick a date');

  const now = todayParts();
  await user.click(dayCell(calendar(), dayName(now.month, 20, now.year)));
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(isoDate(now.month, 20, now.year));
  expect(selectedNames()).toEqual([dayName(now.month, 20, now.year)]);
  expect(fieldTrigger(shortDate(now.month, 20))).toBeDefined();
});

test('a controlled field keeps the value its consumer gave it when a day is picked', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateField label="Due" value={isoDate(1, 15)} onChange={onChange} />);
  await openPicker(user, 'Jan 15');

  await user.click(dayCell(calendar(), dayName(1, 20)));
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(isoDate(1, 20));
  expect(selectedNames()).toEqual([dayName(1, 15)]);
  expect(fieldTrigger('Jan 15')).toBeDefined();
});

test('a controlled field follows the value its consumer sends back', async () => {
  const user = userEvent.setup();
  const view = renderApp(<DateField label="Due" value={isoDate(1, 15)} />);
  await openPicker(user, 'Jan 15');

  view.rerender(<DateField label="Due" value={isoDate(1, 20)} />);
  await settle();

  expect(selectedNames()).toEqual([dayName(1, 20)]);
  expect(fieldTrigger('Jan 20')).toBeDefined();
});

test('clearing a controlled field puts the placeholder back', async () => {
  const view = renderApp(<DateField label="Due" value={isoDate(1, 15)} placeholder="When?" />);
  await settle();
  expect(fieldTrigger('Jan 15')).toBeDefined();

  view.rerender(<DateField label="Due" value={null} placeholder="When?" />);
  await settle();

  expect(fieldTrigger('When?')).toBeDefined();
});

test('the trigger spells out the year only for a date outside the current year', async () => {
  renderApp(
    <div>
      <DateField label="Past" defaultValue={isoDate(3, 9, YEAR - 2)} />
      <DateField label="Current" defaultValue={isoDate(3, 9)} />
    </div>,
  );
  await settle();

  expect(fieldTrigger(`Mar 09, ${YEAR - 2}`)).toBeDefined();
  expect(fieldTrigger('Mar 09')).toBeDefined();
});

test('days outside min and max are disabled and cannot be clicked into the value', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(
    <DateField
      label="Due"
      defaultValue={isoDate(1, 15)}
      min={isoDate(1, 10)}
      max={isoDate(1, 20)}
      onChange={onChange}
    />,
  );
  await openPicker(user, 'Jan 15');

  expect(dayCell(calendar(), dayName(1, 9)).disabled).toBe(true);
  expect(dayCell(calendar(), dayName(1, 21)).disabled).toBe(true);
  expect(dayCell(calendar(), dayName(1, 10)).disabled).toBe(false);
  expect(dayCell(calendar(), dayName(1, 20)).disabled).toBe(false);

  dayCell(calendar(), dayName(1, 9)).click();
  await settle();

  expect(onChange).not.toHaveBeenCalled();
  expect(selectedNames()).toEqual([dayName(1, 15)]);
});

test('the keyboard cannot select a day below min either', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 10)} min={isoDate(1, 10)} onChange={onChange} />);
  await openPicker(user, 'Jan 10');

  await user.keyboard('{ArrowLeft}{Enter}');
  await settle();

  expect(onChange).not.toHaveBeenCalled();
  expect(selectedNames()).toEqual([dayName(1, 10)]);
});

test('month navigation stops at the months min and max allow', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} min={isoDate(1, 10)} max={isoDate(1, 20)} />);
  await openPicker(user, 'Jan 15');

  expect((screen.getByRole('button', { name: 'Previous month' }) as HTMLButtonElement).disabled).toBe(true);
  expect((screen.getByRole('button', { name: 'Next month' }) as HTMLButtonElement).disabled).toBe(true);
});

test('the next month button walks the calendar forward without changing the value', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} onChange={onChange} />);
  await openPicker(user, 'Jan 15');

  await user.click(screen.getByRole('button', { name: 'Next month' }));
  await settle();

  expect(within(calendar()).getByRole('gridcell', { name: dayName(2, 20) })).toBeDefined();
  expect(within(calendar()).queryByRole('gridcell', { name: dayName(1, 5) })).toBeNull();
  expect(onChange).not.toHaveBeenCalled();
  expect(fieldTrigger('Jan 15')).toBeDefined();
});

test('the trigger says whether the calendar is open and which element it controls', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" />);
  const trigger = fieldTrigger('Pick a date');

  expect(trigger.getAttribute('aria-haspopup')).toBe('true');
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(trigger.getAttribute('aria-controls')).toBeNull();

  await openPicker(user, 'Pick a date');

  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  const panel = document.getElementById(trigger.getAttribute('aria-controls') as string);
  expect(panel).not.toBeNull();
  expect(panel!.isConnected).toBe(true);
  expect(panel!.contains(calendar())).toBe(true);
});

test('the calendar is a dialog named after the field, or after its purpose when unlabelled', async () => {
  const user = userEvent.setup();
  const view = renderApp(<DateField label="Delivery date" />);
  await openPicker(user, 'Pick a date');
  expect(screen.getByRole('dialog', { name: 'Delivery date' })).toBeDefined();

  view.unmount();
  renderApp(<DateField />);
  await openPicker(user, 'Pick a date');

  expect(screen.getByRole('dialog', { name: 'Pick a date' })).toBeDefined();
});

test('every day carries its full date as its accessible name', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(7, 4)} />);
  await openPicker(user, 'Jul 04');

  expect(dayCell(calendar(), dayName(7, 4)).textContent).toBe('4');
  expect(dayCell(calendar(), dayName(8, 1))).toBeDefined();
});

test('a disabled field cannot be opened', async () => {
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} disabled />);
  await settle();

  expect(fieldTrigger('Jan 15').disabled).toBe(true);
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('Escape closes the calendar and hands focus back to the trigger', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} />);
  await openPicker(user, 'Jan 15');

  await user.keyboard('{Escape}');
  await settle();

  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(fieldTrigger('Jan 15'));
});

test('the Done button closes the calendar and hands focus back to the trigger', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={isoDate(1, 15)} />);
  await openPicker(user, 'Jan 15');

  await user.click(screen.getByRole('button', { name: 'Done' }));
  await settle();

  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(fieldTrigger('Jan 15'));
});

test('pressing somewhere else on the page closes the calendar', async () => {
  const user = userEvent.setup();
  renderApp(
    <div>
      <button type="button">elsewhere</button>
      <DateField label="Due" defaultValue={isoDate(1, 15)} />
    </div>,
  );
  await openPicker(user, 'Jan 15');

  await user.click(screen.getByRole('button', { name: 'elsewhere' }));
  await settle();

  expect(screen.queryByRole('dialog')).toBeNull();
});

test.fails('the field message is announced with the trigger it explains', async () => {
  renderApp(<DateField label="Due" invalid message="Pick a weekday" />);
  await settle();

  const trigger = fieldTrigger('Pick a date');
  expect(screen.getByText('Pick a weekday')).toBeDefined();

  const described = (trigger.getAttribute('aria-describedby') || '')
    .split(' ')
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent || '')
    .join(' ');
  expect(described).toContain('Pick a weekday');
});
