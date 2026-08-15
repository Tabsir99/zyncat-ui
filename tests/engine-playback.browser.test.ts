import { afterEach, expect, test } from 'vitest';
import { animate, set } from '../src/engine';

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

test('width and height take a percentage the same way x and y do', async () => {
  const parent = box();
  parent.style.width = '400px';
  parent.style.height = '300px';
  const child = document.createElement('div');
  parent.appendChild(child);

  set(child, { width: ['25%'], height: ['50%'] });

  const rect = child.getBoundingClientRect();
  expect(rect.width, 'width ignored the percentage').toBeCloseTo(100, 0);
  expect(rect.height, 'height ignored the percentage').toBeCloseTo(150, 0);
});

test('a percentage travel resolves against the element rather than the viewport', async () => {
  const wide = box();
  wide.style.width = '250px';
  const narrow = box();
  narrow.style.width = '50px';

  set(wide, { x: ['100%'] });
  set(narrow, { x: ['100%'] });

  expect(wide.getBoundingClientRect().left - narrow.getBoundingClientRect().left).toBeCloseTo(200, 0);
});

test('a finished animation keeps holding its property against a later style write', async () => {
  const el = box();
  await animate(el, { x: [0, 60], timing: { duration: 0.05 } }).finished;

  el.style.translate = '10px 0px';

  expect(getComputedStyle(el).translate).toBe('60px');
});

test('a released animation keeps its end value and hands the property back', async () => {
  const el = box();
  await animate(el, { x: [0, 60], timing: { duration: 0.05, release: true } }).finished;

  expect(getComputedStyle(el).translate, 'the end value was not kept').toBe('60px');
  expect(el.getAnimations(), 'the animation is still holding the property').toHaveLength(0);

  el.style.translate = '10px 0px';
  expect(getComputedStyle(el).translate, 'a plain style write was still overridden').toBe('10px');
});

test('set lands its value without waiting for a frame', async () => {
  const el = box();
  set(el, { x: [120], width: [200] });

  expect(getComputedStyle(el).translate).toBe('120px');
  expect(getComputedStyle(el).width).toBe('200px');
});

test('set wins over an animation already running on the same property', async () => {
  const el = box();
  animate(el, { x: [0, 500], timing: { duration: 5 } });

  set(el, { x: [120] });

  expect(running(el)).toHaveLength(0);
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(getComputedStyle(el).translate).toBe('120px');
});
