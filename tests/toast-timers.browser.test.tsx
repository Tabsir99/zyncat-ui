import { beforeEach, expect, test } from 'vitest';
import { act, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { Toaster } from '@zyncat/ui/toast';
import { toast } from '@zyncat/ui/toast-store';
import { renderApp, settle } from './harness';
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

test('a toast takes itself off the stack once its duration has elapsed', async () => {
  await mountToaster();
  await fire(() => {
    toast('Link copied', { duration: 200 });
  });
  await frames();
  expect(screen.getByText('Link copied')).toBeTruthy();

  await untilGone('Link copied');
  expect(cards()).toHaveLength(0);
});

test('a longer-lived toast outlives a shorter one', async () => {
  await mountToaster();
  await fire(() => {
    toast('the patient one', { duration: 1500 });
    toast('the hasty one', { duration: 200 });
  });
  await frames();

  await untilGone('the hasty one');
  expect(screen.getByText('the patient one')).toBeTruthy();

  await untilGone('the patient one');
  expect(cards()).toHaveLength(0);
});

test('a toast with an infinite duration never dismisses itself', async () => {
  await mountToaster();
  await fire(() => {
    toast('pinned until you say otherwise', { duration: NEVER });
  });
  await frames();

  await wait(500);
  expect(screen.getByText('pinned until you say otherwise')).toBeTruthy();
});

test('toast.loading stays until it is dismissed by hand', async () => {
  await mountToaster();
  let id = '';
  await fire(() => {
    id = toast.loading('Uploading files');
  });
  await frames();

  await wait(500);
  expect(screen.getByText('Uploading files')).toBeTruthy();

  await fire(() => {
    toast.dismiss(id);
  });
  await untilGone('Uploading files');
});

test('dismissing by hand before the timer fires does not take down a later toast reusing the id', async () => {
  await mountToaster();
  await fire(() => {
    toast('first save', { id: 'save', duration: 150 });
  });
  await frames();
  await fire(() => {
    toast.dismiss('save');
  });
  await fire(() => {
    toast('second save', { id: 'save', duration: NEVER });
  });
  await frames();

  await wait(600);
  expect(screen.getByText('second save')).toBeTruthy();
});

test('the countdown pauses while the pointer is over the stack and resumes when it leaves', async () => {
  await mountToaster();
  await fire(() => {
    toast('read me first', { duration: 300 });
  });
  await frames();

  await user.hover(cards()[0]);
  await wait(900);
  expect(screen.getByText('read me first')).toBeTruthy();

  await user.unhover(cards()[0]);
  await untilGone('read me first');
});

test('the countdown pauses while a toast control holds focus and resumes when focus leaves', async () => {
  renderApp(
    <>
      <button type="button">elsewhere</button>
      <Toaster />
    </>,
  );
  await settle();
  await fire(() => {
    toast('keyboard reader', { duration: 300 });
  });
  await frames();

  const close = within(cards()[0]).getByRole('button', { name: 'Dismiss' });
  await act(async () => {
    close.focus();
  });
  await wait(900);
  expect(screen.getByText('keyboard reader')).toBeTruthy();

  const elsewhere = screen.getByRole('button', { name: 'elsewhere' });
  await act(async () => {
    elsewhere.focus();
  });
  await untilGone('keyboard reader');
});

test('re-firing the same toast restarts its countdown', async () => {
  await mountToaster();
  await fire(() => {
    toast('retry in progress', { duration: 600 });
  });
  await frames();

  await wait(400);
  await fire(() => {
    toast('retry in progress', { duration: 600 });
  });

  await wait(400);
  expect(screen.getByText('retry in progress')).toBeTruthy();

  await untilGone('retry in progress');
});
