import { beforeEach, describe, expect, test } from 'vitest';
import { act, screen, within, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { Modal } from '@zyncat/ui/modal';
import { Toaster } from '@zyncat/ui/toast';
import { toast } from '@zyncat/ui/toast-store';
import { renderApp, settle } from './harness';
import { NEVER, cards, clearToasts, muteDetachedAnimationCommit, fire, mountToaster, stack } from './toast-support';

let user: UserEvent;

muteDetachedAnimationCommit();

beforeEach(() => {
  clearToasts();
  user = userEvent.setup();
});

function closeControl(): HTMLElement {
  return within(cards()[0]).getByRole('button', { name: 'Dismiss' });
}

describe('how a toast is announced', () => {
  test('the stack is a list with an accessible name and holds the cards', async () => {
    await mountToaster();
    await fire(() => {
      toast('hello there', { duration: NEVER });
    });
    await settle();

    const region = screen.getByRole('list', { name: 'Notifications' });
    expect(region.contains(cards()[0])).toBe(true);
  });

  test.each([
    { tone: 'error', raise: (m: string) => toast.error(m, { duration: NEVER }), role: 'alert', quiet: 'status' },
    { tone: 'success', raise: (m: string) => toast.success(m, { duration: NEVER }), role: 'status', quiet: 'alert' },
    { tone: 'warning', raise: (m: string) => toast.warning(m, { duration: NEVER }), role: 'status', quiet: 'alert' },
    { tone: 'info', raise: (m: string) => toast.info(m, { duration: NEVER }), role: 'status', quiet: 'alert' },
    { tone: 'plain', raise: (m: string) => toast(m, { duration: NEVER }), role: 'status', quiet: 'alert' },
  ])('a $tone toast is announced with the $role role', async ({ raise, role, quiet }) => {
    await mountToaster();
    await fire(() => {
      raise('announce me');
    });
    await settle();

    expect(within(stack()).queryAllByRole(role)).toHaveLength(1);
    expect(within(stack()).queryAllByRole(quiet)).toHaveLength(0);
  });

  test('a toast is announced as a whole rather than word by word', async () => {
    await mountToaster();
    await fire(() => {
      toast.success('Saved', { description: 'All five files', duration: NEVER });
    });
    await settle();

    expect(cards()[0].getAttribute('aria-atomic')).toBe('true');
  });
});

describe('operating a toast', () => {
  test('the dismiss control is named and takes its toast away when clicked', async () => {
    await mountToaster();
    await fire(() => {
      toast('dismiss me', { duration: NEVER });
    });
    await settle();

    await user.click(closeControl());
    await settle();

    expect(screen.queryByText('dismiss me')).toBeNull();
  });

  test.each(['{Enter}', ' '])('the dismiss control fires from the keyboard with %s', async (key) => {
    await mountToaster();
    await fire(() => {
      toast('key me', { duration: NEVER });
    });
    await settle();

    const close = closeControl();
    await act(async () => {
      close.focus();
    });
    expect(document.activeElement).toBe(close);

    await user.keyboard(key);
    await settle();

    expect(screen.queryByText('key me')).toBeNull();
  });

  test('Escape dismisses the toast that holds focus', async () => {
    await mountToaster();
    await fire(() => {
      toast('escapable', { duration: NEVER });
    });
    await settle();

    await act(async () => {
      closeControl().focus();
    });
    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText('escapable')).toBeNull();
  });

  test('the action sits before the dismiss control in the tab sequence', async () => {
    await mountToaster();
    await fire(() => {
      toast.error('Upload failed', { duration: NEVER, action: { label: 'Retry', onClick: () => {} } });
    });
    await settle();

    const retry = screen.getByRole('button', { name: 'Retry' });
    await act(async () => {
      retry.focus();
    });
    await user.tab();

    expect(document.activeElement).toBe(closeControl());
  });

  test('the action runs from the keyboard and closes its toast', async () => {
    const pressed: string[] = [];
    await mountToaster();
    await fire(() => {
      toast.error('Upload failed', {
        duration: NEVER,
        action: { label: 'Retry', onClick: () => pressed.push('retry') },
      });
    });
    await settle();

    await act(async () => {
      screen.getByRole('button', { name: 'Retry' }).focus();
    });
    await user.keyboard('{Enter}');
    await settle();

    expect(pressed).toEqual(['retry']);
    expect(screen.queryByText('Upload failed')).toBeNull();
  });
});

describe('toasts alongside an open modal', () => {
  function App({ open }: { open: boolean }) {
    return (
      <>
        <Toaster />
        <Modal open={open}>
          <div role="dialog" aria-label="Preferences">
            <button type="button">inside the modal</button>
          </div>
        </Modal>
      </>
    );
  }

  async function toastOverModal(): Promise<RenderResult> {
    const view = renderApp(<App open={false} />);
    await settle();
    view.rerender(<App open />);
    await settle();
    await fire(() => {
      toast('saved while the modal was open', { duration: NEVER });
    });
    await settle();
    return view;
  }

  test('the toast is on screen while the modal is open', async () => {
    await toastOverModal();
    expect(screen.getByText('saved while the modal was open')).toBeTruthy();
    expect(screen.getByRole('dialog', { name: 'Preferences' })).toBeTruthy();
  });

  test.fails('the modal does not make the notifications stack inert', async () => {
    await toastOverModal();
    expect(stack().hasAttribute('inert')).toBe(false);
  });

  test.fails('the toast paints in front of the scrim, not behind it', async () => {
    await toastOverModal();
    const close = closeControl();
    const box = close.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);

    expect(box.width).toBeGreaterThan(0);
    expect(close.contains(hit), `the topmost element there was ${hit?.className}`).toBe(true);
  });

  test('the toast can still be dismissed while the modal is open', async () => {
    await toastOverModal();
    await user.click(closeControl());
    await settle();

    expect(screen.queryByText('saved while the modal was open')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Preferences' })).toBeTruthy();
  });

  test('closing the modal leaves the stack interactive', async () => {
    const view = await toastOverModal();
    view.rerender(<App open={false} />);
    await settle();

    expect(stack().hasAttribute('inert')).toBe(false);
    expect(screen.getByText('saved while the modal was open')).toBeTruthy();
  });
});
