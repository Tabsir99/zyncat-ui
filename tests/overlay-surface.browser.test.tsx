import { useRef, type ReactElement, type ReactNode } from 'react';
import { describe, expect, test } from 'vitest';
import { Modal } from '@zyncat/ui/modal';
import { Dialog } from '@zyncat/ui/dialog';
import { Sheet } from '@zyncat/ui/sheet';
import { Popover } from '@zyncat/ui/popover';
import { Probe, firstSighting, ledger, renderApp, settle, useOpenProbe, type Ledger } from './harness';

interface SurfaceProps {
  open: boolean;
  children: ReactNode;
}

const SURFACES: { name: string; Surface: (props: SurfaceProps) => ReactElement }[] = [
  {
    name: 'Modal',
    Surface: ({ open, children }) => (
      <Modal open={open}>
        <div role="dialog" aria-label="surface">
          {children}
        </div>
      </Modal>
    ),
  },
  {
    name: 'Dialog',
    Surface: ({ open, children }) => (
      <Dialog open={open} title="surface">
        {children}
      </Dialog>
    ),
  },
  {
    name: 'Sheet',
    Surface: ({ open, children }) => (
      <Sheet open={open}>
        <div role="dialog" aria-label="surface">
          {children}
        </div>
      </Sheet>
    ),
  },
  {
    name: 'Popover',
    Surface: ({ open, children }) => (
      <Popover open={open} trigger={<button type="button">anchor</button>}>
        {children}
      </Popover>
    ),
  },
];

describe.each(SURFACES)('$name surface contract', ({ Surface }) => {
  function Consumer({ open, on }: { open: boolean; on: Ledger }) {
    const contentRef = useRef<HTMLDivElement>(null);
    useOpenProbe(open, contentRef, on);
    return (
      <Surface open={open}>
        <div ref={contentRef}>
          <Probe on={on}>surface content</Probe>
        </div>
      </Surface>
    );
  }

  test('content is in the document the first time a consumer ref fires', async () => {
    const on = ledger();
    renderApp(<Consumer open={false} on={on} />).rerender(<Consumer open on={on} />);
    await settle();

    const first = firstSighting(on, 'callback-ref');
    expect(first, 'callback ref never fired').toBeDefined();
    expect(first!.connected).toBe(true);
  });

  test('content is attached in every phase consumer code can run', async () => {
    const on = ledger();
    renderApp(<Consumer open={false} on={on} />).rerender(<Consumer open on={on} />);
    await settle();

    for (const phase of ['callback-ref', 'layout-effect', 'effect'] as const) {
      const sighting = firstSighting(on, phase);
      expect(sighting, `no sighting for ${phase}`).toBeDefined();
      expect(sighting!.connected, `detached during ${phase}`).toBe(true);
    }
  });

  test('design tokens resolve on the content element from the first sighting', async () => {
    const on = ledger();
    renderApp(<Consumer open={false} on={on} />).rerender(<Consumer open on={on} />);
    await settle();

    const first = on.sightings[0];
    expect(first.tokens['--duration-base']).not.toBe('');
    expect(first.tokens['--ease-entrance']).not.toBe('');
  });

  test('content is measurable from the first sighting', async () => {
    const on = ledger();
    renderApp(<Consumer open={false} on={on} />).rerender(<Consumer open on={on} />);
    await settle();

    expect(on.sightings[0].height).toBeGreaterThan(0);
  });

  test('an effect keyed on the open prop sees a live ref', async () => {
    const on = ledger();
    renderApp(<Consumer open={false} on={on} />).rerender(<Consumer open on={on} />);
    await settle();

    const fromOpenEffect = on.sightings.filter((s) => s.phase === 'effect');
    expect(
      fromOpenEffect.some((s) => s.connected),
      'the [open] effect never saw a live ref',
    ).toBe(true);
    expect(
      fromOpenEffect.every((s) => s.height !== -1),
      'the [open] effect saw a null ref',
    ).toBe(true);
  });

  test('content survives the exit animation, then unmounts', async () => {
    const on = ledger();
    const view = renderApp(<Consumer open={false} on={on} />);
    view.rerender(<Consumer open on={on} />);
    await settle();
    expect(document.querySelector('[data-probe]')).not.toBeNull();

    view.rerender(<Consumer open={false} on={on} />);
    expect(document.querySelector('[data-probe]'), 'unmounted before the exit ran').not.toBeNull();

    await settle();
    expect(document.querySelector('[data-probe]'), 'still mounted after the exit finished').toBeNull();
  });
});
