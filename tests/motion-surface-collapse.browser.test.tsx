import { useRef, type ReactNode } from 'react';
import { expect, test } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { cdp } from 'vitest/browser';
import { Collapse, type CollapseProps } from '@zyncat/ui/collapse';
import { Modal } from '@zyncat/ui/modal';
import { Probe, firstSighting, ledger, nextFrame, renderApp, settle, useOpenProbe, type Ledger } from './harness';

const heightOf = (el: HTMLElement) => el.getBoundingClientRect().height;
const widthOf = (el: HTMLElement) => el.getBoundingClientRect().width;

const emulate = (features: { name: string; value: string }[]) =>
  (cdp() as unknown as { send(method: string, params?: unknown): Promise<unknown> }).send(
    'Emulation.setEmulatedMedia',
    { features },
  );

function Rows({ count }: { count: number }) {
  return (
    <div style={{ font: '14px/20px system-ui' }}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} style={{ height: 20 }}>
          row {index}
        </div>
      ))}
    </div>
  );
}

function Measured({
  open,
  rows = 4,
  animation,
  children,
}: {
  open: boolean;
  rows?: number;
  animation?: CollapseProps['animation'];
  children?: ReactNode;
}) {
  return (
    <div>
      <div data-testid="host">
        <Collapse open={open} animation={animation}>
          {children ?? <Rows count={rows} />}
        </Collapse>
      </div>
      <div data-testid="reference">{children ?? <Rows count={rows} />}</div>
    </div>
  );
}

const host = () => screen.getByTestId('host');
const reference = () => screen.getByTestId('reference');

test('an open collapse occupies exactly the natural height of its content', async () => {
  const view = renderApp(<Measured open={false} />);
  expect(heightOf(host())).toBe(0);

  view.rerender(<Measured open />);
  await settle();

  const natural = heightOf(reference());
  expect(natural).toBeGreaterThan(0);
  expect(heightOf(host())).toBeCloseTo(natural, 0);
});

test('closing a collapse gives back every pixel it occupied', async () => {
  const view = renderApp(<Measured open />);
  await settle();
  expect(heightOf(host())).toBeGreaterThan(0);

  view.rerender(<Measured open={false} />);
  await settle();

  expect(heightOf(host())).toBe(0);
});

test('content that grows while the collapse is open reflows to the new natural height', async () => {
  const view = renderApp(<Measured open rows={2} />);
  await settle();
  const short = heightOf(reference());
  expect(heightOf(host())).toBeCloseTo(short, 0);

  view.rerender(<Measured open rows={8} />);
  await settle();

  const tall = heightOf(reference());
  expect(tall).toBeGreaterThan(short);
  expect(heightOf(host())).toBeCloseTo(tall, 0);
});

test('re-opening while the closing transition is still running settles at the full natural height', async () => {
  const slowClose = { duration: { close: 'slowest' } } as const;
  const view = renderApp(<Measured open animation={slowClose} />);
  await settle();
  const natural = heightOf(reference());

  view.rerender(<Measured open={false} animation={slowClose} />);
  await nextFrame();
  await nextFrame();
  const midClose = heightOf(host());
  expect(midClose, 'the close never started').toBeLessThan(natural);
  expect(midClose, 'the close finished before it could be interrupted').toBeGreaterThan(0);

  view.rerender(<Measured open animation={slowClose} />);
  await settle();

  await waitFor(() => expect(heightOf(host())).toBeCloseTo(natural, 0));
});

test('the reduced-motion path still lands on the natural height', async () => {
  await emulate([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  try {
    const view = renderApp(<Measured open={false} />);
    view.rerender(<Measured open />);
    await settle();

    const natural = heightOf(reference());
    expect(natural).toBeGreaterThan(0);
    expect(heightOf(host())).toBeCloseTo(natural, 0);

    view.rerender(<Measured open={false} />);
    await settle();
    expect(heightOf(host())).toBe(0);
  } finally {
    await emulate([]);
  }
});

test('a disabled animation snaps to the natural height within a frame', async () => {
  function Snapped({ open }: { open: boolean }) {
    return (
      <div>
        <div data-testid="host">
          <Collapse open={open} animation={null}>
            <Rows count={5} />
          </Collapse>
        </div>
        <div data-testid="reference">
          <Rows count={5} />
        </div>
      </div>
    );
  }

  const view = renderApp(<Snapped open={false} />);
  view.rerender(<Snapped open />);
  await nextFrame();

  expect(heightOf(host())).toBeCloseTo(heightOf(reference()), 0);
});

test('closed content is out of the accessibility tree and out of the tab order', async () => {
  const view = renderApp(
    <Measured open>
      <button type="button">Rename</button>
    </Measured>,
  );
  await settle();
  expect(screen.getAllByRole('button', { name: 'Rename' })).toHaveLength(2);

  view.rerender(
    <Measured open={false}>
      <button type="button">Rename</button>
    </Measured>,
  );
  await settle();

  await waitFor(() => expect(screen.getAllByRole('button', { name: 'Rename' })).toHaveLength(1));
  const hidden = host().querySelector('button');
  hidden.focus();
  expect(document.activeElement).not.toBe(hidden);
});

test('re-opened content is focusable before the entrance has finished', async () => {
  const view = renderApp(
    <Measured open={false}>
      <button type="button">Rename</button>
    </Measured>,
  );
  await settle();

  view.rerender(
    <Measured open>
      <button type="button">Rename</button>
    </Measured>,
  );

  const revealed = host().querySelector('button');
  revealed.focus();
  expect(document.activeElement).toBe(revealed);
  expect(screen.getAllByRole('button', { name: 'Rename' })).toHaveLength(2);
});

test('the width axis settles at the natural width of its content', async () => {
  function SideBySide({ open }: { open: boolean }) {
    const content = <div style={{ width: 180, height: 20 }}>panel</div>;
    return (
      <div style={{ display: 'flex' }}>
        <div data-testid="host">
          <Collapse open={open} axis="width">
            {content}
          </Collapse>
        </div>
        <div data-testid="reference" style={{ display: 'flex' }}>
          {content}
        </div>
      </div>
    );
  }

  const view = renderApp(<SideBySide open={false} />);
  expect(widthOf(host())).toBe(0);

  view.rerender(<SideBySide open />);
  await settle();

  expect(widthOf(host())).toBeCloseTo(widthOf(reference()), 0);
});

test('a consumer effect keyed on open sees connected, measurable content with resolved tokens', async () => {
  function Watched({ open, on }: { open: boolean; on: Ledger }) {
    const bodyRef = useRef<HTMLDivElement>(null);
    useOpenProbe(open, bodyRef, on);
    return (
      <Collapse open={open}>
        <div ref={bodyRef}>
          <Probe on={on}>revealed</Probe>
        </div>
      </Collapse>
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
  expect(fromOpenEffect.some((sighting) => sighting.connected && sighting.height > 0)).toBe(true);
});

test('a collapse inside an open modal measures the natural height of its content', async () => {
  function InModal({ expanded }: { expanded: boolean }) {
    return (
      <Modal open>
        <div role="dialog" aria-label="settings">
          <div data-testid="host">
            <Collapse open={expanded}>
              <Rows count={6} />
            </Collapse>
          </div>
          <div data-testid="reference">
            <Rows count={6} />
          </div>
        </div>
      </Modal>
    );
  }

  const view = renderApp(<InModal expanded={false} />);
  await settle();
  expect(heightOf(host())).toBe(0);

  view.rerender(<InModal expanded />);
  await settle();

  const natural = heightOf(reference());
  expect(natural).toBeGreaterThan(0);
  expect(heightOf(host())).toBeCloseTo(natural, 0);
});
