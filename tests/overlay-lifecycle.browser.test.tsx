import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@zyncat/ui/modal';
import { Dialog } from '@zyncat/ui/dialog';
import { overlayRoots, renderApp, settle } from './harness';

const BODY = 'surface body';
const PANEL_ID = 'surface-under-test';

let drive: (open: boolean) => void = () => {};

function App({ startOpen = false }: { startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  drive = setOpen;
  return (
    <div>
      <button type="button">page control</button>
      <Modal open={open} onOpenChange={setOpen} id={PANEL_ID}>
        <div role="dialog" aria-label="surface">
          <button type="button">inside</button>
          <p>{BODY}</p>
        </div>
      </Modal>
    </div>
  );
}

async function setOpen(next: boolean) {
  await act(async () => {
    drive(next);
  });
}

function panel(): HTMLElement | null {
  return document.getElementById(PANEL_ID);
}

function escapeWatcher(): { seen: boolean[]; stop: () => void } {
  const seen: boolean[] = [];
  const listener = (event: KeyboardEvent) => {
    if (event.key === 'Escape') seen.push(event.defaultPrevented);
  };
  document.addEventListener('keydown', listener);
  return { seen, stop: () => document.removeEventListener('keydown', listener) };
}

describe('unmounting an overlay that is still open', () => {
  test('takes the surface off the page and hands scrolling back', async () => {
    const view = renderApp(<App startOpen />);
    await settle();
    expect(document.body.style.overflow).toBe('hidden');

    view.unmount();
    await settle();

    expect(screen.queryByText(BODY)).toBeNull();
    expect(overlayRoots(), 'an overlay host was left in the document').toHaveLength(0);
    expect(document.body.style.overflow, 'the page was left locked').toBe('');
    expect(view.container.hasAttribute('inert'), 'the page was left inert').toBe(false);
  });

  test('stops the surface swallowing the page keyboard', async () => {
    const user = userEvent.setup();
    const view = renderApp(<App startOpen />);
    await settle();

    const watcher = escapeWatcher();
    try {
      view.unmount();
      await user.keyboard('{Escape}');

      expect(watcher.seen, 'Escape never reached the page').toHaveLength(1);
      expect(watcher.seen[0], 'the unmounted surface still consumed Escape').toBe(false);
    } finally {
      watcher.stop();
    }
  });

  test('leaves nothing behind when it happens midway through the closing animation', async () => {
    const view = renderApp(<App startOpen />);
    await settle();

    await setOpen(false);
    expect(panel(), 'the surface unmounted before its exit animation ran').not.toBeNull();

    view.unmount();
    await settle();

    expect(overlayRoots()).toHaveLength(0);
    expect(document.body.style.overflow).toBe('');
  });

  test('lets the same surface be mounted and used again', async () => {
    const user = userEvent.setup();
    const first = renderApp(<App startOpen />);
    await settle();
    first.unmount();

    renderApp(<App startOpen />);
    await settle();

    expect(screen.getByText(BODY)).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText(BODY)).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });
});

describe('the page keyboard', () => {
  test('only loses Escape for as long as a surface is open', async () => {
    const user = userEvent.setup();
    renderApp(<App startOpen />);
    await settle();

    const watcher = escapeWatcher();
    try {
      await user.keyboard('{Escape}');
      await settle();
      await user.keyboard('{Escape}');

      expect(watcher.seen, 'Escape reached the page a different number of times than it was pressed').toHaveLength(2);
      expect(watcher.seen[0], 'the open surface let Escape through to the page').toBe(true);
      expect(watcher.seen[1], 'the closed surface still consumed Escape').toBe(false);
    } finally {
      watcher.stop();
    }
  });
});

describe('interrupted transitions', () => {
  test('closing before the opening animation has finished still removes the surface', async () => {
    renderApp(<App />);

    await setOpen(true);
    await setOpen(false);
    await settle();

    expect(screen.queryByText(BODY)).toBeNull();
    expect(
      overlayRoots().some((root) => root.childElementCount > 0),
      'the surface was left mounted',
    ).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  test('reopening before the closing animation has finished leaves the surface visible', async () => {
    renderApp(<App startOpen />);
    await settle();

    await setOpen(false);
    await setOpen(true);
    await settle();

    expect(panel(), 'the surface unmounted even though it was reopened').not.toBeNull();
    expect(getComputedStyle(panel()!).opacity, 'the reopened surface stayed invisible').toBe('1');
  });

  test('a surface toggled open, closed and open again ends up open and dismissible', async () => {
    const user = userEvent.setup();
    renderApp(<App />);

    await setOpen(true);
    await setOpen(false);
    await setOpen(true);
    await settle();

    expect(screen.getByText(BODY)).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText(BODY)).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  test('a dialog opened and closed twice behaves the same both times', async () => {
    const user = userEvent.setup();
    function Cycled() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen} title="Settings" trigger={<button type="button">open</button>}>
          <p>{BODY}</p>
        </Dialog>
      );
    }
    renderApp(<Cycled />);

    for (const round of [1, 2]) {
      await user.click(screen.getByRole('button', { name: 'open' }));
      await settle();
      expect(screen.getByText(BODY), `round ${round} never opened`).toBeTruthy();
      expect(document.activeElement, `round ${round} did not take focus`).toBe(
        screen.getByRole('button', { name: 'Close dialog' }),
      );

      await user.keyboard('{Escape}');
      await settle();
      expect(screen.queryByText(BODY), `round ${round} never closed`).toBeNull();
      expect(document.body.style.overflow, `round ${round} left the page locked`).toBe('');
    }
  });
});
