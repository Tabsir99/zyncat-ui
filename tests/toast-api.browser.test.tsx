import { beforeEach, describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { toast } from '@zyncat/ui/toast-store';
import { settle } from './harness';
import {
  NEVER,
  cards,
  clearToasts,
  muteDetachedAnimationCommit,
  fire,
  frames,
  mountToaster,
  untilGone,
  wait,
} from './toast-support';

let user: UserEvent;

muteDetachedAnimationCommit();

beforeEach(() => {
  clearToasts();
  user = userEvent.setup();
});

describe('a clean store for every test', () => {
  test('the stack is empty when a test mounts its own Toaster', async () => {
    await mountToaster();
    expect(cards()).toHaveLength(0);
  });

  test('leaves a toast open and the countdown paused when it finishes', async () => {
    await mountToaster();
    await fire(() => {
      toast('left behind by the previous test', { duration: 400 });
    });
    await frames();
    await user.hover(cards()[0]);
    await wait(400);
    expect(screen.getByText('left behind by the previous test')).toBeTruthy();
  });

  test('starts from an empty stack whose countdowns run again', async () => {
    await mountToaster();
    expect(cards()).toHaveLength(0);
    expect(screen.queryByText('left behind by the previous test')).toBeNull();

    await fire(() => {
      toast('fresh', { duration: 150 });
    });
    await frames();
    expect(screen.getByText('fresh')).toBeTruthy();
    await untilGone('fresh');
  });
});

describe('the imperative toast API', () => {
  test('toast() puts its message on the stack', async () => {
    await mountToaster();
    await fire(() => {
      toast('Profile updated', { duration: NEVER });
    });
    await settle();
    expect(screen.getByText('Profile updated')).toBeTruthy();
    expect(cards()).toHaveLength(1);
  });

  test('a toast fired before the Toaster mounts appears as soon as it does', async () => {
    await fire(() => {
      toast('early bird', { duration: NEVER });
    });
    expect(document.querySelector('[role="status"]')).toBeNull();

    await mountToaster();
    expect(screen.getByText('early bird')).toBeTruthy();
  });

  test.each([
    { name: 'success', raise: (m: string) => toast.success(m, { duration: NEVER }) },
    { name: 'error', raise: (m: string) => toast.error(m, { duration: NEVER }) },
    { name: 'warning', raise: (m: string) => toast.warning(m, { duration: NEVER }) },
    { name: 'info', raise: (m: string) => toast.info(m, { duration: NEVER }) },
    { name: 'loading', raise: (m: string) => toast.loading(m) },
  ])('toast.$name renders the message it was given', async ({ raise }) => {
    await mountToaster();
    await fire(() => {
      raise('the message');
    });
    await settle();
    expect(screen.getByText('the message')).toBeTruthy();
    expect(cards()).toHaveLength(1);
  });

  test('the description renders alongside the message', async () => {
    await mountToaster();
    await fire(() => {
      toast.success('Changes saved', { description: 'Synced to the cloud', duration: NEVER });
    });
    await settle();
    expect(screen.getByText('Changes saved')).toBeTruthy();
    expect(screen.getByText('Synced to the cloud')).toBeTruthy();
  });

  test('the action button runs its handler and takes the toast away', async () => {
    const pressed: string[] = [];
    await mountToaster();
    await fire(() => {
      toast.success('Deleted', { duration: NEVER, action: { label: 'Undo', onClick: () => pressed.push('undo') } });
    });
    await settle();

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    await settle();

    expect(pressed).toEqual(['undo']);
    expect(screen.queryByText('Deleted')).toBeNull();
  });

  test('the id it returns dismisses exactly that toast', async () => {
    await mountToaster();
    let keep = '';
    let drop = '';
    await fire(() => {
      keep = toast('keep me', { duration: NEVER });
      drop = toast('drop me', { duration: NEVER });
    });
    await settle();
    expect(keep).not.toBe(drop);

    await fire(() => {
      toast.dismiss(drop);
    });
    await settle();

    expect(screen.queryByText('drop me')).toBeNull();
    expect(screen.getByText('keep me')).toBeTruthy();
  });

  test('firing a toast under an id already on the stack replaces it instead of stacking a second card', async () => {
    await mountToaster();
    await fire(() => {
      toast('Uploading', { id: 'upload', duration: NEVER });
    });
    await settle();
    await fire(() => {
      toast.success('Uploaded', { id: 'upload', duration: NEVER });
    });
    await settle();

    expect(cards()).toHaveLength(1);
    expect(screen.queryByText('Uploading')).toBeNull();
    expect(screen.getByText('Uploaded')).toBeTruthy();
  });

  test('toast.update rewrites the message of a toast already on the stack', async () => {
    await mountToaster();
    let id = '';
    await fire(() => {
      id = toast.loading('Working');
    });
    await settle();

    await fire(() => {
      toast.update(id, { message: 'Almost there' });
    });
    await settle();

    expect(cards()).toHaveLength(1);
    expect(screen.getByText('Almost there')).toBeTruthy();
    expect(screen.queryByText('Working')).toBeNull();
  });

  test('the identical toast fired twice collapses into one card carrying a count', async () => {
    await mountToaster();
    await fire(() => {
      toast.info('Copied to clipboard', { duration: NEVER });
    });
    await settle();
    await fire(() => {
      toast.info('Copied to clipboard', { duration: NEVER });
    });
    await settle();

    expect(cards()).toHaveLength(1);
    expect(cards()[0].textContent).toContain('2');
  });

  test('toast.dismiss() with no argument clears the whole stack', async () => {
    await mountToaster();
    await fire(() => {
      toast('one', { duration: NEVER });
      toast('two', { duration: NEVER });
      toast('three', { duration: NEVER });
    });
    await settle();
    expect(cards()).toHaveLength(3);

    await fire(() => {
      toast.dismiss();
    });
    await settle();
    expect(cards()).toHaveLength(0);
  });

  test('toast.custom renders the node it was given and stays put', async () => {
    await mountToaster();
    await fire(() => {
      toast.custom(
        <p>
          build finished <b>in 4s</b>
        </p>,
      );
    });
    await settle();

    expect(screen.getByText('in 4s')).toBeTruthy();
    await wait(300);
    expect(screen.getByText('in 4s')).toBeTruthy();
  });

  test('toast.promise shows the loading message and then the resolved one', async () => {
    await mountToaster();
    let finish!: (value: { count: number }) => void;
    const work = new Promise<{ count: number }>((resolve) => {
      finish = resolve;
    });

    await fire(() => {
      toast.promise(work, { loading: 'Saving...', success: (value) => `Saved ${value.count} rows` });
    });
    await frames();
    expect(screen.getByText('Saving...')).toBeTruthy();

    await fire(() => {
      finish({ count: 3 });
    });
    await frames();

    expect(screen.getByText('Saved 3 rows')).toBeTruthy();
    expect(screen.queryByText('Saving...')).toBeNull();
    expect(cards()).toHaveLength(1);
  });

  test('toast.promise shows the rejection message when the promise fails', async () => {
    await mountToaster();
    let fail!: (reason: unknown) => void;
    const work = new Promise<never>((_resolve, reject) => {
      fail = reject;
    });
    work.catch(() => {});

    await fire(() => {
      toast.promise(work, { loading: 'Sending...', error: (e) => `Failed: ${(e as Error).message}` });
    });
    await frames();
    expect(screen.getByText('Sending...')).toBeTruthy();

    await fire(() => {
      fail(new Error('offline'));
    });
    await frames();

    expect(screen.getByText('Failed: offline')).toBeTruthy();
    expect(cards()).toHaveLength(1);
  });
});
