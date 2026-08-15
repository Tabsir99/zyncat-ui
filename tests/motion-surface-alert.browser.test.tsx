import { useRef, useState, type ReactNode } from 'react';
import { expect, test, vi } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { Alert, type AlertProps } from '@zyncat/ui/alert';
import { Probe, firstSighting, ledger, nextFrame, renderApp, settle, useOpenProbe, type Ledger } from './harness';

const heightOf = (el: HTMLElement) => el.getBoundingClientRect().height;
const scaleOf = (el: HTMLElement) => parseFloat(getComputedStyle(el).scale) || 1;
const host = () => screen.getByTestId('host');
const reference = () => screen.getByTestId('reference');

const press = (el: HTMLElement) =>
  act(async () => {
    await userEvent.click(el);
  });

const LONG_MESSAGE =
  'Your workspace exceeded its monthly build minutes, so queued deployments are paused until the next billing cycle begins.';

function Sized({
  open,
  title = 'Deploy finished',
  animation,
}: {
  open: boolean;
  title?: ReactNode;
  animation?: AlertProps['animation'];
}) {
  return (
    <div>
      <div data-testid="host">
        <Alert open={open} title={title} animation={animation} />
      </div>
      <div data-testid="reference">
        <Alert open title={title} />
      </div>
    </div>
  );
}

test('an alert that opens settles at the natural height of its message', async () => {
  const view = renderApp(<Sized open={false} />);
  await settle();
  expect(heightOf(host())).toBe(0);

  view.rerender(<Sized open />);
  await settle();

  const natural = heightOf(reference());
  expect(natural).toBeGreaterThan(0);
  expect(heightOf(host())).toBeCloseTo(natural, 0);
});

test('an alert that opens with a wrapping message settles at its wrapped height', async () => {
  const view = renderApp(<Sized open={false} title={LONG_MESSAGE} />);
  await settle();

  view.rerender(<Sized open title={LONG_MESSAGE} />);
  await settle();

  const wrapped = heightOf(reference());
  expect(heightOf(host())).toBeCloseTo(wrapped, 0);
});

test('dismissing an alert leaves no residual height behind', async () => {
  renderApp(
    <div data-testid="host">
      <Alert dismissible title="Deploy finished" />
    </div>,
  );
  await settle();
  expect(heightOf(host())).toBeGreaterThan(0);

  await press(within(host()).getByRole('button', { name: 'Dismiss' }));
  await settle();

  expect(within(host()).queryByRole('status')).toBeNull();
  expect(heightOf(host())).toBe(0);
});

test('onDismiss fires once for one dismissal and never on mount', async () => {
  const onDismiss = vi.fn();
  renderApp(
    <div data-testid="host">
      <Alert dismissible title="Deploy finished" onDismiss={onDismiss} />
    </div>,
  );
  await settle();
  expect(onDismiss).not.toHaveBeenCalled();

  await press(within(host()).getByRole('button', { name: 'Dismiss' }));
  await settle();

  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test('a controlled alert stays open until the parent flips the open prop', async () => {
  const onDismiss = vi.fn();

  function Controlled() {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <div data-testid="host">
          <Alert open={open} dismissible title="Deploy finished" onDismiss={onDismiss} />
        </div>
        <button type="button" onClick={() => setOpen(false)}>
          hide from the parent
        </button>
      </div>
    );
  }

  renderApp(<Controlled />);
  await settle();
  const natural = heightOf(host());

  await press(within(host()).getByRole('button', { name: 'Dismiss' }));
  await settle();

  expect(onDismiss).toHaveBeenCalledTimes(1);
  expect(within(host()).queryByRole('status')).not.toBeNull();
  expect(heightOf(host())).toBeCloseTo(natural, 0);

  await press(screen.getByRole('button', { name: 'hide from the parent' }));
  await settle();

  expect(within(host()).queryByRole('status')).toBeNull();
  expect(heightOf(host())).toBe(0);
});

test('a message that grows while the alert is open reflows to its new natural height', async () => {
  const view = renderApp(<Sized open={false} />);
  view.rerender(<Sized open />);
  await settle();
  const short = heightOf(host());

  view.rerender(<Sized open title={LONG_MESSAGE} />);
  await settle();

  const wrapped = heightOf(reference());
  expect(wrapped).toBeGreaterThan(short);
  expect(heightOf(host())).toBeCloseTo(wrapped, 0);
});

test('an alert re-opened while it is easing shut settles back fully opaque and unscaled', async () => {
  const slowClose = { duration: { close: 'slowest' } } as const;
  const view = renderApp(<Sized open animation={slowClose} title="Deploy finished" />);
  await settle();
  const natural = heightOf(reference());
  expect(heightOf(host())).toBeCloseTo(natural, 0);
  const shell = host().firstElementChild as HTMLElement;

  view.rerender(<Sized open={false} animation={slowClose} title="Deploy finished" />);
  await nextFrame();
  await waitFor(() => {
    const midExit = Number(getComputedStyle(shell).opacity);
    expect(midExit, 'the exit never started').toBeLessThan(1);
    expect(midExit, 'the exit finished before it could be interrupted').toBeGreaterThan(0);
    expect(scaleOf(shell), 'the exit did not scale the alert down').toBeLessThan(1);
  });

  view.rerender(<Sized open animation={slowClose} title="Deploy finished" />);

  await settle();
  expect(heightOf(host())).toBeCloseTo(natural, 0);
  expect(Number(getComputedStyle(shell).opacity)).toBe(1);
  expect(getComputedStyle(shell).scale).toBe('none');
});

test('a consumer effect keyed on open sees connected, measurable alert content with resolved tokens', async () => {
  function Watched({ open, on }: { open: boolean; on: Ledger }) {
    const bodyRef = useRef<HTMLSpanElement>(null);
    useOpenProbe(open, bodyRef, on);
    return (
      <Alert open={open} title="Deploy finished">
        <span ref={bodyRef}>
          <Probe on={on}>build 4192</Probe>
        </span>
      </Alert>
    );
  }

  const on = ledger();
  renderApp(<Watched open={false} on={on} />).rerender(<Watched open on={on} />);
  await settle();

  for (const phase of ['callback-ref', 'layout-effect', 'effect'] as const) {
    const sighting = firstSighting(on, phase);
    expect(sighting, `no sighting for ${phase}`).toBeDefined();
    expect(sighting.connected, `detached during ${phase}`).toBe(true);
    expect(sighting.height, `no layout during ${phase}`).toBeGreaterThan(0);
    expect(sighting.tokens['--duration-base'], `unresolved token during ${phase}`).not.toBe('');
    expect(sighting.tokens['--ease-entrance'], `unresolved token during ${phase}`).not.toBe('');
  }

  const fromOpenEffect = on.sightings.filter((sighting) => sighting.phase === 'effect');
  expect(fromOpenEffect.every((sighting) => sighting.height !== -1)).toBe(true);
  expect(fromOpenEffect.some((sighting) => sighting.connected && sighting.height > 0)).toBe(true);
});

test('polite tones are exposed as status and assertive tones as alert', async () => {
  renderApp(
    <div>
      <Alert tone="info" title="Info" />
      <Alert tone="success" title="Success" />
      <Alert tone="warning" title="Warning" />
      <Alert tone="danger" title="Danger" />
    </div>,
  );
  await settle();

  expect(screen.getAllByRole('status').map((el) => el.textContent)).toEqual(['Info', 'Success']);
  expect(screen.getAllByRole('alert').map((el) => el.textContent)).toEqual(['Warning', 'Danger']);
});

test('the action renders as a button and fires its onClick once per press', async () => {
  const onClick = vi.fn();
  renderApp(
    <div data-testid="host">
      <Alert title="Your trial ends in 5 days" action={{ label: 'Upgrade', onClick }} />
    </div>,
  );
  await settle();

  const upgrade = within(host()).getByRole('button', { name: 'Upgrade' });
  await press(upgrade);
  await settle();

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(within(host()).queryByRole('status')).not.toBeNull();
});

test('dismissing the first of two stacked alerts leaves the second at its natural height', async () => {
  renderApp(
    <div>
      <div data-testid="host">
        <Alert dismissible title="Deploy finished" />
        <Alert title="Cache warmed" />
      </div>
      <div data-testid="reference">
        <Alert title="Cache warmed" />
      </div>
    </div>,
  );
  await settle();
  const both = heightOf(host());
  const single = heightOf(reference());
  expect(both).toBeGreaterThan(single);

  await press(within(host()).getByRole('button', { name: 'Dismiss' }));
  await settle();

  expect(within(host()).getAllByRole('status')).toHaveLength(1);
  expect(heightOf(host())).toBeCloseTo(single, 0);
});
