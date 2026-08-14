import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@zyncat/ui/modal';
import { Popover } from '@zyncat/ui/popover';
import { renderApp, settle } from './harness';

const LOWER = 'lower body';
const UPPER = 'upper body';

function button(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

function rootOf(panelId: string): HTMLElement {
  return document.getElementById(panelId)!.closest('[data-overlay-root]') as HTMLElement;
}

function TwoModals() {
  return (
    <div>
      <Modal defaultOpen id="lower-panel">
        <div role="dialog" aria-label="lower">
          <button type="button">lower action</button>
          <p>{LOWER}</p>
        </div>
      </Modal>
      <Modal defaultOpen id="upper-panel">
        <div role="dialog" aria-label="upper">
          <button type="button">upper action</button>
          <p>{UPPER}</p>
        </div>
      </Modal>
    </div>
  );
}

describe('two overlays open at once', () => {
  test('Escape closes the overlay on top and leaves the one underneath open', async () => {
    const user = userEvent.setup();
    renderApp(<TwoModals />);
    await settle();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText(UPPER)).toBeNull();
    expect(screen.getByText(LOWER)).toBeTruthy();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText(LOWER)).toBeNull();
  });

  test('clicking the empty area dismisses only the overlay on top', async () => {
    const user = userEvent.setup();
    renderApp(<TwoModals />);
    await settle();

    await user.click(document.elementFromPoint(4, 4) as HTMLElement);
    await settle();

    expect(screen.queryByText(UPPER)).toBeNull();
    expect(screen.getByText(LOWER)).toBeTruthy();
  });

  test('the overlay opened last is the one the pointer reaches', async () => {
    renderApp(<TwoModals />);
    await settle();

    const hit = document.elementFromPoint(4, 4) as HTMLElement;

    expect(rootOf('upper-panel').contains(hit), 'the newer overlay does not paint on top').toBe(true);
    expect(rootOf('lower-panel').contains(hit)).toBe(false);
  });

  test('a control in the overlay underneath cannot hold focus while a second one is open', async () => {
    renderApp(<TwoModals />);
    await settle();

    const underneath = button('lower action');
    underneath.focus();

    expect(document.activeElement).not.toBe(underneath);
    expect(document.getElementById('upper-panel')!.contains(document.activeElement)).toBe(true);
  });

  test('closing the overlay underneath first leaves the top one open and still dismissible', async () => {
    const user = userEvent.setup();
    function Pair({ lowerOpen }: { lowerOpen: boolean }) {
      return (
        <div>
          <Modal open={lowerOpen} id="lower-panel">
            <div role="dialog" aria-label="lower">
              {LOWER}
            </div>
          </Modal>
          <Modal defaultOpen id="upper-panel">
            <div role="dialog" aria-label="upper">
              {UPPER}
            </div>
          </Modal>
        </div>
      );
    }
    const view = renderApp(<Pair lowerOpen />);
    await settle();

    view.rerender(<Pair lowerOpen={false} />);
    await settle();

    expect(screen.queryByText(LOWER)).toBeNull();
    expect(screen.getByText(UPPER)).toBeTruthy();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText(UPPER)).toBeNull();
  });
});

describe('a modal opened from inside another modal', () => {
  function NestedModals({ onFirstAction }: { onFirstAction?: () => void }) {
    return (
      <Modal defaultOpen id="lower-panel">
        <div role="dialog" aria-label="first">
          <button type="button" onClick={onFirstAction}>
            first action
          </button>
          <p>{LOWER}</p>
          <Modal id="upper-panel" trigger={<button type="button">open second</button>}>
            <div role="dialog" aria-label="second">
              <button type="button">confirm</button>
              <p>{UPPER}</p>
            </div>
          </Modal>
        </div>
      </Modal>
    );
  }

  test('the second modal takes focus and Escape closes only it', async () => {
    const user = userEvent.setup();
    renderApp(<NestedModals />);
    await settle();

    await user.click(button('open second'));
    await settle();

    expect(screen.getByText(UPPER)).toBeTruthy();
    expect(document.activeElement, 'focus stayed in the first modal').toBe(button('confirm'));

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText(UPPER)).toBeNull();
    expect(screen.getByText(LOWER), 'Escape closed both modals at once').toBeTruthy();
  });

  test('the page stays locked and inert until both modals have closed', async () => {
    const user = userEvent.setup();
    renderApp(<NestedModals />);
    await settle();

    await user.click(button('open second'));
    await settle();
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    await settle();
    expect(document.body.style.overflow, 'the page unlocked while the first modal was still open').toBe('hidden');

    await user.keyboard('{Escape}');
    await settle();
    expect(document.body.style.overflow).toBe('');
  });

  test('the first modal is still usable once the second one has closed', async () => {
    const user = userEvent.setup();
    const onFirstAction = vi.fn();
    renderApp(<NestedModals onFirstAction={onFirstAction} />);
    await settle();

    await user.click(button('open second'));
    await settle();
    await user.keyboard('{Escape}');
    await settle();

    expect(button('first action').closest('[inert]'), 'the second modal left the first one inert').toBeNull();

    await user.click(button('first action'));
    expect(onFirstAction).toHaveBeenCalledTimes(1);

    await user.click(button('open second'));
    await settle();
    expect(screen.getByText(UPPER), 'the second modal could not be reopened').toBeTruthy();
  });
});

describe('a popover opened from another popover', () => {
  function NestedPopovers({ onDeepClick }: { onDeepClick?: () => void }) {
    return (
      <div>
        <button type="button">elsewhere</button>
        <Popover trigger={<button type="button">outer</button>}>
          <div>
            <p>{LOWER}</p>
            <Popover trigger={<button type="button">inner</button>}>
              <button type="button" onClick={onDeepClick}>
                deep action
              </button>
            </Popover>
          </div>
        </Popover>
      </div>
    );
  }

  async function openBoth(user: ReturnType<typeof userEvent.setup>) {
    await user.click(button('outer'));
    await settle();
    await user.click(button('inner'));
    await settle();
  }

  test('pressing inside the inner panel leaves both panels open', async () => {
    const user = userEvent.setup();
    const onDeepClick = vi.fn();
    renderApp(<NestedPopovers onDeepClick={onDeepClick} />);
    await openBoth(user);

    await user.click(button('deep action'));
    await settle();

    expect(onDeepClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'deep action' }), 'the inner panel closed itself').toBeTruthy();
    expect(screen.getByText(LOWER), 'the outer panel closed when its own child was pressed').toBeTruthy();
  });

  test('Escape closes the nested panels one level at a time', async () => {
    const user = userEvent.setup();
    renderApp(<NestedPopovers />);
    await openBoth(user);

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByRole('button', { name: 'deep action' })).toBeNull();
    expect(screen.getByText(LOWER)).toBeTruthy();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText(LOWER)).toBeNull();
  });

  test('pressing outside both panels closes both', async () => {
    const user = userEvent.setup();
    renderApp(<NestedPopovers />);
    await openBoth(user);

    await user.click(button('elsewhere'));
    await settle();

    expect(screen.queryByRole('button', { name: 'deep action' })).toBeNull();
    expect(screen.queryByText(LOWER)).toBeNull();
  });
});

describe('a popover opened from inside a modal', () => {
  function PopoverInModal({ onDeepClick }: { onDeepClick?: () => void }) {
    return (
      <Modal defaultOpen id="lower-panel">
        <div role="dialog" aria-label="host">
          <p>{LOWER}</p>
          <Popover trigger={<button type="button">menu</button>}>
            <button type="button" onClick={onDeepClick}>
              deep action
            </button>
          </Popover>
        </div>
      </Modal>
    );
  }

  test('the popover panel is reachable and its controls still fire while the modal holds the page inert', async () => {
    const user = userEvent.setup();
    const onDeepClick = vi.fn();
    renderApp(<PopoverInModal onDeepClick={onDeepClick} />);
    await settle();

    await user.click(button('menu'));
    await settle();

    const deep = button('deep action');
    expect(deep.closest('[inert]'), 'the modal made the popover panel inert').toBeNull();

    await user.click(deep);
    await settle();

    expect(onDeepClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText(LOWER), 'pressing inside the popover closed the modal').toBeTruthy();
  });

  test('Escape closes the popover before the modal that hosts it', async () => {
    const user = userEvent.setup();
    renderApp(<PopoverInModal />);
    await settle();

    await user.click(button('menu'));
    await settle();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByRole('button', { name: 'deep action' })).toBeNull();
    expect(screen.getByText(LOWER)).toBeTruthy();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText(LOWER)).toBeNull();
  });
});
