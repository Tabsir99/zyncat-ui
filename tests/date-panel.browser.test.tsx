import { useLayoutEffect, useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateField } from '@zyncat/ui/date-field';
import { Modal } from '@zyncat/ui/modal';
import { Probe, firstSighting, ledger, overlayRoots, renderApp, settle, useOpenProbe, type Ledger } from './harness';
import {
  calendar,
  dayCell,
  dayName,
  fieldTrigger,
  inspect,
  isoDate,
  lastReported,
  openPicker,
  unreachable,
} from './date-support';

const SEED = isoDate(1, 15);
const SEED_TRIGGER = 'Jan 15';

function PanelWatcher({ on }: { on: Ledger }) {
  const [opens, setOpens] = useState(0);
  const fieldRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (opens === 0) return;
    const controls = fieldRef.current?.querySelector('button')?.getAttribute('aria-controls');
    const panel = controls ? document.getElementById(controls) : null;
    panelRef.current = panel;
    on.sightings.push(panel ? inspect(panel, 'layout-effect') : unreachable('layout-effect'));
  }, [opens, on]);

  useOpenProbe(opens > 0, panelRef, on);

  return (
    <div ref={fieldRef} onClickCapture={() => setOpens((count) => count + 1)}>
      <DateField label="Due" defaultValue={SEED} />
    </div>
  );
}

function ModalWithField({ open, on }: { open: boolean; on?: Ledger }) {
  return (
    <Modal open={open}>
      <div role="dialog" aria-label="Booking">
        {on ? (
          <Probe on={on}>
            <DateField label="Due" defaultValue={SEED} />
          </Probe>
        ) : (
          <DateField label="Due" defaultValue={SEED} />
        )}
      </div>
    </Modal>
  );
}

function DismissableModalWithField({ onChange }: { onChange?: (value: string) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <div role="dialog" aria-label="Booking">
        <DateField label="Due" defaultValue={SEED} onChange={onChange} />
      </div>
    </Modal>
  );
}

test('the panel a consumer reaches through aria-controls is attached and measurable in a layout effect', async () => {
  const user = userEvent.setup();
  const on = ledger();
  renderApp(<PanelWatcher on={on} />);

  await openPicker(user, SEED_TRIGGER);

  const sighting = firstSighting(on, 'layout-effect');
  expect(sighting, 'the panel was never reachable from a layout effect').toBeDefined();
  expect(sighting!.connected, 'the panel was detached when the layout effect ran').toBe(true);
  expect(sighting!.height, 'the panel had no layout when the layout effect ran').toBeGreaterThan(0);
});

test('design tokens resolve on the panel the first time a consumer reads them', async () => {
  const user = userEvent.setup();
  const on = ledger();
  renderApp(<PanelWatcher on={on} />);

  await openPicker(user, SEED_TRIGGER);

  const sighting = firstSighting(on, 'layout-effect');
  expect(sighting!.tokens['--duration-base']).not.toBe('');
  expect(sighting!.tokens['--ease-entrance']).not.toBe('');
});

test('an effect keyed on the opening sees the same live panel', async () => {
  const user = userEvent.setup();
  const on = ledger();
  renderApp(<PanelWatcher on={on} />);

  await openPicker(user, SEED_TRIGGER);

  const sighting = firstSighting(on, 'effect');
  expect(sighting, 'the open-keyed effect never ran').toBeDefined();
  expect(sighting!.connected, 'the open-keyed effect saw a detached panel').toBe(true);
  expect(sighting!.height, 'the open-keyed effect saw a null or unlaid-out panel').toBeGreaterThan(0);
});

test('the day the calendar focuses on open is attached and has layout', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={SEED} />);

  await openPicker(user, SEED_TRIGGER);

  const focused = document.activeElement as HTMLElement;
  expect(focused.getAttribute('aria-label')).toBe(dayName(1, 15));
  expect(focused.isConnected).toBe(true);
  expect(focused.offsetHeight).toBeGreaterThan(0);
});

test('unmounting while the calendar is open leaves no overlay root, scroll lock or inert page', async () => {
  const user = userEvent.setup();
  const view = renderApp(<DateField label="Due" defaultValue={SEED} />);
  await openPicker(user, SEED_TRIGGER);
  expect(screen.getByRole('dialog', { name: 'Due' })).toBeDefined();

  view.unmount();
  await settle();

  expect(overlayRoots()).toHaveLength(0);
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.body.style.overflow).toBe('');
  expect(Array.from(document.body.children).some((child) => (child as HTMLElement).inert)).toBe(false);
});

test('opening, closing and opening again leaves exactly one calendar', async () => {
  const user = userEvent.setup();
  renderApp(<DateField label="Due" defaultValue={SEED} />);
  const trigger = fieldTrigger(SEED_TRIGGER);

  await user.click(trigger);
  await user.click(trigger);
  await user.click(trigger);
  await settle();

  expect(screen.getAllByRole('dialog')).toHaveLength(1);
  expect(screen.getAllByRole('grid')).toHaveLength(1);
  expect(overlayRoots()).toHaveLength(1);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  expect(dayCell(calendar(), dayName(1, 15)).getAttribute('aria-selected')).toBe('true');
});

test('a remounted field opens a working calendar again', async () => {
  const user = userEvent.setup();
  const view = renderApp(<DateField label="Due" defaultValue={SEED} />);
  await openPicker(user, SEED_TRIGGER);
  view.unmount();
  await settle();

  renderApp(<DateField label="Due" defaultValue={SEED} />);
  await openPicker(user, SEED_TRIGGER);

  expect(screen.getAllByRole('dialog')).toHaveLength(1);
  expect(document.activeElement).toBe(dayCell(calendar(), dayName(1, 15)));
});

test('a consumer ref wrapping a date field inside a modal is attached and measurable at every phase', async () => {
  const on = ledger();
  const view = renderApp(<ModalWithField open={false} on={on} />);
  view.rerender(<ModalWithField open on={on} />);
  await settle();

  for (const phase of ['callback-ref', 'layout-effect', 'effect'] as const) {
    const sighting = firstSighting(on, phase);
    expect(sighting, `no sighting for ${phase}`).toBeDefined();
    expect(sighting!.connected, `detached during ${phase}`).toBe(true);
  }
  expect(on.sightings[0].height).toBeGreaterThan(0);
  expect(on.sightings[0].tokens['--duration-base']).not.toBe('');
});

test('inside a modal, Escape closes the calendar first and the modal second', async () => {
  const user = userEvent.setup();
  renderApp(<DismissableModalWithField />);
  await settle();

  await openPicker(user, SEED_TRIGGER);
  expect(screen.getAllByRole('dialog').map((d) => d.getAttribute('aria-label'))).toContain('Due');

  await user.keyboard('{Escape}');
  await settle();
  expect(screen.queryByRole('dialog', { name: 'Due' })).toBeNull();
  expect(screen.getByRole('dialog', { name: 'Booking' })).toBeDefined();

  await user.keyboard('{Escape}');
  await settle();
  expect(screen.queryByRole('dialog', { name: 'Booking' })).toBeNull();
});

test('a date field inside a modal still commits a pick', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderApp(<DismissableModalWithField onChange={onChange} />);
  await settle();

  await openPicker(user, SEED_TRIGGER);
  await user.click(dayCell(calendar(), dayName(1, 22)));
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(lastReported(onChange)).toEqual(isoDate(1, 22));
});

test('opening a second date field closes the first', async () => {
  const user = userEvent.setup();
  renderApp(
    <div>
      <DateField label="From" defaultValue={isoDate(1, 15)} />
      <DateField label="To" defaultValue={isoDate(2, 20)} />
    </div>,
  );

  await openPicker(user, 'Jan 15');
  expect(screen.getAllByRole('dialog').map((d) => d.getAttribute('aria-label'))).toEqual(['From']);

  await openPicker(user, 'Feb 20');

  const dialogs = screen.getAllByRole('dialog');
  expect(dialogs).toHaveLength(1);
  expect(dialogs[0].getAttribute('aria-label')).toBe('To');
  expect(fieldTrigger('Jan 15').getAttribute('aria-expanded')).toBe('false');
});
