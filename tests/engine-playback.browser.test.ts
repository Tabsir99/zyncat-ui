import { afterEach, expect, test } from 'vitest';
import { animate } from '../src/engine';

const mounted: HTMLElement[] = [];

function box(height = 40): HTMLElement {
  const el = document.createElement('div');
  el.style.width = '80px';
  el.style.height = `${height}px`;
  el.style.background = 'black';
  document.body.appendChild(el);
  mounted.push(el);
  return el;
}

const running = (el: HTMLElement) => el.getAnimations().filter((a) => a.playState === 'running');

const settledWithin = (ms: number) => new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), ms));

afterEach(() => {
  for (const el of mounted.splice(0)) el.remove();
});

test('finished settles instead of rejecting when the target stops being rendered mid-flight', async () => {
  const el = box();
  const play = animate(el, { height: [0, 'auto'], timing: { duration: 0.05 } });

  el.style.display = 'none';

  await expect(Promise.race([play.finished, settledWithin(2000)])).resolves.not.toBe('timeout');
});

test('finished settles instead of rejecting when the target is detached mid-flight', async () => {
  const el = box();
  const play = animate(el, { height: [0, 'auto'], timing: { duration: 0.05 } });

  el.remove();

  await expect(Promise.race([play.finished, settledWithin(2000)])).resolves.not.toBe('timeout');
});

test('animating a second property leaves the first one running', async () => {
  const el = box();
  animate(el, { opacity: [0, 1], timing: { duration: 1 } });
  animate(el, { x: [0, 50], timing: { duration: 1 } });

  expect(running(el)).toHaveLength(2);
});

test('animating the same property again replaces it, and the newer value is the one that lands', async () => {
  const el = box();
  animate(el, { opacity: [0, 1], timing: { duration: 1 } });
  const second = animate(el, { opacity: [0, 0.25], timing: { duration: 0.05 } });

  expect(running(el)).toHaveLength(1);

  await second.finished;
  expect(Number(getComputedStyle(el).opacity)).toBeCloseTo(0.25, 2);
});

test("a composite 'add' layer does not evict the element's own animation of the same property", async () => {
  const el = box();
  animate(el, { x: [0, 50], timing: { duration: 1 } });
  animate(el, { x: [20, 0], timing: { duration: 1 }, composite: 'add' });

  expect(running(el)).toHaveLength(2);
});
