import { beforeEach, describe, expect, test } from 'vitest';
import { act, screen } from '@testing-library/react';
import { toast } from '@zyncat/ui/toast-store';
import { Probe, firstSighting, ledger, nextFrame, settle } from './harness';
import {
  NEVER,
  cards,
  clearToasts,
  muteDetachedAnimationCommit,
  fire,
  frames,
  messages,
  mountToaster,
  stack,
  stackOrNull,
  strayCards,
  wait,
} from './toast-support';

muteDetachedAnimationCommit();

beforeEach(() => {
  clearToasts();
});

describe('what a consumer ref inside a toast can see', () => {
  test('it is in the document the first time it fires', async () => {
    await mountToaster();
    const on = ledger();
    await fire(() => {
      toast.custom(<Probe on={on}>notification body</Probe>);
    });
    await settle();

    const first = firstSighting(on, 'callback-ref');
    expect(first, 'callback ref never fired').toBeDefined();
    expect(first.connected).toBe(true);
  });

  test('it is attached in every phase consumer code can run', async () => {
    await mountToaster();
    const on = ledger();
    await fire(() => {
      toast.custom(<Probe on={on}>notification body</Probe>);
    });
    await settle();

    for (const phase of ['callback-ref', 'layout-effect', 'effect'] as const) {
      const sighting = firstSighting(on, phase);
      expect(sighting, `no sighting for ${phase}`).toBeDefined();
      expect(sighting.connected, `detached during ${phase}`).toBe(true);
    }
  });

  test('it is measurable and resolves design tokens from its very first sighting', async () => {
    await mountToaster();
    const on = ledger();
    await fire(() => {
      toast.custom(<Probe on={on}>notification body</Probe>);
    });
    await settle();

    const first = on.sightings[0];
    expect(first.height).toBeGreaterThan(0);
    expect(first.width).toBeGreaterThan(0);
    expect(first.tokens['--duration-base']).not.toBe('');
    expect(first.tokens['--ease-entrance']).not.toBe('');
  });
});

describe('toasts interrupted mid-animation', () => {
  test('a toast dismissed and re-fired under the same id while it is still leaving comes back fully visible', async () => {
    await mountToaster();
    await fire(() => {
      toast('Reconnecting', { id: 'net', duration: NEVER });
    });
    await settle();

    await fire(() => {
      toast.dismiss('net');
    });
    await frames(1);
    await fire(() => {
      toast('Reconnecting', { id: 'net', duration: NEVER });
    });
    await settle();

    expect(cards()).toHaveLength(1);
    expect(screen.getByText('Reconnecting')).toBeTruthy();
    expect(getComputedStyle(cards()[0]).opacity).toBe('1');
  });

  test('a toast arriving while an earlier one is still easing out is left fully visible', async () => {
    await mountToaster();
    let first = '';
    await fire(() => {
      first = toast('first', { duration: NEVER });
    });
    await settle();

    await fire(() => {
      toast.dismiss(first);
    });
    await frames(1);
    await fire(() => {
      toast('second', { duration: NEVER });
    });
    await settle();

    expect(messages()).toEqual(['second']);
    expect(getComputedStyle(cards()[0]).opacity).toBe('1');
  });

  test('a burst of toasts dismissed mid-entrance leaves exactly the survivors on the stack', async () => {
    await mountToaster({ visibleToasts: 6 });
    const ids: string[] = [];
    await fire(() => {
      for (let i = 1; i <= 6; i += 1) ids.push(toast(`burst ${i}`, { duration: NEVER }));
    });
    await fire(() => {
      toast.dismiss(ids[0]);
      toast.dismiss(ids[2]);
      toast.dismiss(ids[4]);
    });
    await settle();

    expect(messages()).toEqual(['burst 2', 'burst 4', 'burst 6']);
    expect(cards().every((card) => getComputedStyle(card).opacity === '1')).toBe(true);
  });
});

describe('swipe to dismiss', () => {
  const centre = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const dragBy = async (card: HTMLElement, dx: number) => {
    const from = centre(card);
    await act(async () => {
      card.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: from.x, clientY: from.y }),
      );
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: from.x + dx, clientY: from.y }));
      await nextFrame();
    });
  };

  test('dragging a toast sideways carries the whole card, not just the text inside it', async () => {
    await mountToaster();
    await fire(() => {
      toast('Deploy finished', { duration: NEVER });
    });
    await settle();

    const card = cards()[0];
    const text = screen.getByText('Deploy finished');
    const cardBefore = card.getBoundingClientRect().left;
    const insetBefore = text.getBoundingClientRect().left - cardBefore;

    await dragBy(card, 100);

    const cardAfter = card.getBoundingClientRect().left;
    const insetAfter = text.getBoundingClientRect().left - cardAfter;

    expect(cardAfter - cardBefore, 'the card itself never moved').toBeGreaterThan(20);
    expect(insetAfter, 'the text slid within a stationary card').toBeCloseTo(insetBefore, 0);
  });

  test('a toast dragged sideways keeps the vertical offset its place in the stack gave it', async () => {
    await mountToaster();
    await fire(() => {
      toast('underneath', { duration: NEVER });
      toast('on top', { duration: NEVER });
    });
    await settle();

    const card = cards().find((c) => c.textContent?.includes('on top'))!;
    const topBefore = card.getBoundingClientRect().top;

    await dragBy(card, 100);

    expect(card.getBoundingClientRect().top, 'the drag reset the stack offset').toBeCloseTo(topBefore, 0);
  });
});

describe('cleanup', () => {
  test('a dismissed toast stays through its exit animation and then leaves', async () => {
    await mountToaster();
    await fire(() => {
      toast('leaving now', { duration: NEVER });
    });
    await settle();

    await fire(() => {
      toast.dismiss();
    });
    expect(screen.queryByText('leaving now'), 'unmounted before the exit ran').not.toBeNull();

    await settle();
    expect(screen.queryByText('leaving now'), 'still mounted after the exit finished').toBeNull();
  });

  test('dismissing every toast leaves nothing behind on the stack', async () => {
    await mountToaster();
    await fire(() => {
      for (let i = 1; i <= 3; i += 1) toast(`gone ${i}`, { duration: NEVER });
    });
    await settle();

    await fire(() => {
      toast.dismiss();
    });
    await settle();

    expect(cards()).toHaveLength(0);
    expect(stack().children).toHaveLength(0);
    expect(strayCards()).toHaveLength(0);
  });

  test('dismissing the same toast twice is harmless', async () => {
    await mountToaster();
    let doomed = '';
    await fire(() => {
      doomed = toast('doomed', { duration: NEVER });
      toast('bystander', { duration: NEVER });
    });
    await settle();

    await fire(() => {
      toast.dismiss(doomed);
      toast.dismiss(doomed);
    });
    await settle();

    expect(messages()).toEqual(['bystander']);
  });

  test('unmounting the Toaster with toasts still open takes the whole stack off the page', async () => {
    const view = await mountToaster();
    await fire(() => {
      toast('open one', { duration: NEVER });
      toast('open two', { duration: NEVER });
    });
    await settle();

    await act(async () => {
      view.unmount();
    });

    expect(stackOrNull()).toBeNull();
    expect(strayCards()).toHaveLength(0);
  });

  test('unmounting the Toaster while a toast is still animating raises nothing into the dead tree', async () => {
    const failures: string[] = [];
    const onError = (event: ErrorEvent) => failures.push(event.message);
    const onRejection = (event: PromiseRejectionEvent) => {
      failures.push(String(event.reason));
      event.preventDefault();
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    const view = await mountToaster();
    await fire(() => {
      toast('short lived', { duration: 120 });
    });
    await frames();
    await act(async () => {
      view.unmount();
    });
    await wait(600);
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);

    expect(failures).toEqual([]);
  });

  test('a countdown left running when the Toaster unmounts still clears its toast from the store', async () => {
    const view = await mountToaster();
    let id = '';
    await fire(() => {
      id = toast('short lived', { duration: NEVER });
    });
    await settle();
    await fire(() => {
      toast.update(id, { duration: 200 });
    });
    await act(async () => {
      view.unmount();
    });
    await wait(600);

    await mountToaster();
    expect(cards()).toHaveLength(0);
    expect(screen.queryByText('short lived')).toBeNull();
  });

  test('a toast fired after the Toaster unmounts renders nothing', async () => {
    const view = await mountToaster();
    await act(async () => {
      view.unmount();
    });

    await fire(() => {
      toast('into the void', { duration: NEVER });
    });
    await frames();

    expect(strayCards()).toHaveLength(0);
    expect(screen.queryByText('into the void')).toBeNull();
  });

  test('StrictMode mounts exactly one notifications region', async () => {
    await mountToaster();
    await fire(() => {
      toast('only once', { duration: NEVER });
    });
    await settle();

    expect(screen.getAllByRole('list', { name: 'Notifications' })).toHaveLength(1);
    expect(cards()).toHaveLength(1);
  });

  test('remounting the Toaster after everything was dismissed starts from an empty stack', async () => {
    const view = await mountToaster();
    await fire(() => {
      toast('temporary', { duration: NEVER });
    });
    await settle();
    await fire(() => {
      toast.dismiss();
    });
    await settle();
    await act(async () => {
      view.unmount();
    });

    await mountToaster();
    expect(cards()).toHaveLength(0);
    expect(screen.queryByText('temporary')).toBeNull();
  });
});
