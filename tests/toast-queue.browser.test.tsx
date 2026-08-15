import { beforeEach, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { Toaster } from '@zyncat/ui/toast';
import { toast, type ToastPosition } from '@zyncat/ui/toast-store';
import { settle } from './harness';
import {
  NEVER,
  bottoms,
  cards,
  clearToasts,
  muteDetachedAnimationCommit,
  fire,
  messages,
  mountToaster,
  onStack,
  stack,
} from './toast-support';

let user: UserEvent;

muteDetachedAnimationCommit();

beforeEach(() => {
  clearToasts();
  user = userEvent.setup();
});

async function raise(count: number, label = 'note'): Promise<void> {
  await fire(() => {
    for (let i = 1; i <= count; i += 1) toast(`${label} ${i}`, { duration: NEVER });
  });
  await settle();
}

function boxes(): DOMRect[] {
  return cards().map((card) => card.getBoundingClientRect());
}

function expectNoOverlap(): void {
  const laid = boxes();
  for (let i = 0; i + 1 < laid.length; i += 1) {
    expect(laid[i].bottom, `card ${i} overlaps card ${i + 1}`).toBeLessThanOrEqual(laid[i + 1].top + 1);
  }
}

test('only the newest visibleToasts cards stay on the stack', async () => {
  await mountToaster({ visibleToasts: 2 });
  await raise(4);
  expect(onStack()).toEqual(['note 3', 'note 4']);
});

test('the oldest toasts leave the document once enough newer ones arrive', async () => {
  await mountToaster({ visibleToasts: 2 });
  await raise(6);
  expect(screen.queryByText('note 1')).toBeNull();
  expect(screen.getByText('note 6')).toBeTruthy();
  expect(onStack()).toEqual(['note 5', 'note 6']);
});

test('cards keep the order they were fired in, with the newest nearest the edge', async () => {
  await mountToaster();
  await raise(3);
  expect(messages()).toEqual(['note 1', 'note 2', 'note 3']);

  const edges = bottoms();
  expect(edges[0]).toBeLessThan(edges[1]);
  expect(edges[1]).toBeLessThan(edges[2]);
});

test('dismissing the front toast slides the one behind it into the front slot', async () => {
  await mountToaster();
  let front = '';
  await fire(() => {
    toast('behind', { duration: NEVER });
    front = toast('in front', { duration: NEVER });
  });
  await settle();
  const frontEdge = bottoms()[1];

  await fire(() => {
    toast.dismiss(front);
  });
  await settle();

  expect(messages()).toEqual(['behind']);
  expect(Math.abs(bottoms()[0] - frontEdge)).toBeLessThan(1.5);
});

test('a toast leaving the middle of the stack re-flows the ones above it', async () => {
  await mountToaster({ gap: 16 });
  let middle = '';
  await fire(() => {
    toast('oldest', { duration: NEVER });
    middle = toast('middle', { duration: NEVER });
    toast('newest', { duration: NEVER });
  });
  await settle();
  const before = bottoms();

  await fire(() => {
    toast.dismiss(middle);
  });
  await settle();

  expect(messages()).toEqual(['oldest', 'newest']);
  const after = bottoms();
  expect(Math.abs(after[1] - before[2])).toBeLessThan(1.5);
  expect(Math.abs(after[0] - before[0] - 16)).toBeLessThan(1.5);
});

test('the gap prop sets the distance between stacked cards', async () => {
  const view = await mountToaster({ gap: 8 });
  await fire(() => {
    toast('under', { duration: NEVER });
    toast('over', { duration: NEVER });
  });
  await settle();
  const tight = bottoms();
  expect(Math.abs(tight[1] - tight[0] - 8)).toBeLessThan(1.5);

  view.rerender(<Toaster gap={32} />);
  await settle();
  const airy = bottoms();
  expect(Math.abs(airy[1] - airy[0] - 32)).toBeLessThan(1.5);
});

test('hovering the stack expands it so every card is readable and none overlap', async () => {
  await mountToaster();
  await raise(3);
  expect(onStack()).toEqual(['note 1', 'note 2', 'note 3']);

  await user.hover(cards()[2]);
  await settle();

  expectNoOverlap();
  expect(cards().every((card) => getComputedStyle(card).opacity === '1')).toBe(true);
});

test('the expand prop lays the stack out expanded without any hovering', async () => {
  await mountToaster({ expand: true });
  await raise(3);
  expectNoOverlap();
});

test.each([
  { position: 'top-left' as ToastPosition, atTop: true, atLeft: true },
  { position: 'bottom-right' as ToastPosition, atTop: false, atLeft: false },
])('the position prop anchors the stack to the $position corner', async ({ position, atTop, atLeft }) => {
  await mountToaster({ position });
  await raise(1, 'anchored');

  const box = stack().getBoundingClientRect();
  if (atTop) expect(box.top).toBeLessThan(window.innerHeight / 2);
  else expect(box.bottom).toBeGreaterThan(window.innerHeight / 2);
  if (atLeft) expect(box.left).toBeLessThan(window.innerWidth / 2);
  else expect(box.right).toBeGreaterThan(window.innerWidth / 2);
});

test('the offset prop moves the stack away from the edge', async () => {
  await mountToaster({ position: 'top-right', offset: 96 });
  await raise(1, 'inset');

  expect(Math.abs(stack().getBoundingClientRect().top - 96)).toBeLessThan(1.5);
});
