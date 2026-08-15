import type { ReactNode } from 'react';
import { beforeEach, expect, test } from 'vitest';
import { act, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { Tooltip } from '@zyncat/ui/tooltip';
import { Modal } from '@zyncat/ui/modal';
import { Popover } from '@zyncat/ui/popover';
import { Probe, ledger, nextFrame, renderApp, settle } from './harness';

const WARM_WINDOW = 400;

const wait = (ms: number) =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });

const hover = (el: HTMLElement) =>
  act(async () => {
    await userEvent.hover(el);
  });

const unhover = (el: HTMLElement) =>
  act(async () => {
    await userEvent.unhover(el);
  });

const tab = () =>
  act(async () => {
    await userEvent.tab();
  });

const pressEscape = () =>
  act(async () => {
    await userEvent.keyboard('{Escape}');
  });

function stackingOrder(el: HTMLElement): number {
  for (let node = el; node && node !== document.body; node = node.parentElement) {
    const z = getComputedStyle(node).zIndex;
    if (z !== 'auto') return Number(z);
  }
  return 0;
}

function Hinted({
  content = 'Saves the draft',
  openDelay,
  closeDelay,
  disabled,
}: {
  content?: ReactNode;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
}) {
  return (
    <div>
      <Tooltip content={content} openDelay={openDelay} closeDelay={closeDelay} disabled={disabled}>
        <button type="button">Save</button>
      </Tooltip>
    </div>
  );
}

const trigger = () => screen.getByRole('button', { name: 'Save' });
const bubble = () => screen.queryByRole('tooltip');

function LowPair() {
  return (
    <div style={{ paddingTop: 240 }}>
      <Tooltip content="Saves the draft" openDelay={0} closeDelay={0}>
        <button type="button">Save</button>
      </Tooltip>
      <Tooltip content="Publishes the draft" openDelay={0} closeDelay={0}>
        <button type="button">Publish</button>
      </Tooltip>
    </div>
  );
}

const publish = () => screen.getByRole('button', { name: 'Publish' });
const topOf = (el: HTMLElement) => el.getBoundingClientRect().top;

beforeEach(() => wait(WARM_WINDOW));

test('a cold hover opens the tooltip only once the open delay has elapsed', async () => {
  renderApp(<Hinted openDelay={300} />);

  await hover(trigger());
  await wait(120);
  expect(bubble(), 'the tooltip opened before its delay').toBeNull();

  await wait(300);
  expect(bubble().textContent).toContain('Saves the draft');

  await unhover(trigger());
});

test('leaving before the open delay elapses never opens the tooltip', async () => {
  renderApp(<Hinted openDelay={300} />);

  await hover(trigger());
  await wait(120);
  await unhover(trigger());
  await wait(500);

  expect(bubble()).toBeNull();
});

test('keyboard focus opens the tooltip without waiting for the hover delay', async () => {
  renderApp(<Hinted openDelay={4000} />);

  await tab();
  expect(document.activeElement).toBe(trigger());
  await settle();

  expect(bubble(), 'focus did not open the tooltip').not.toBeNull();
  expect(bubble().textContent).toContain('Saves the draft');
});

test('Escape dismisses the tooltip and leaves focus on the trigger', async () => {
  renderApp(<Hinted openDelay={4000} />);

  await tab();
  await settle();
  expect(bubble()).not.toBeNull();

  await pressEscape();
  await settle();

  expect(bubble()).toBeNull();
  expect(document.activeElement).toBe(trigger());
});

test('the tooltip lingers for the close delay after the pointer leaves, then closes', async () => {
  renderApp(<Hinted openDelay={0} closeDelay={300} />);

  await hover(trigger());
  await wait(80);
  expect(bubble()).not.toBeNull();

  await unhover(trigger());
  await wait(60);
  expect(bubble(), 'the tooltip closed before its close delay').not.toBeNull();

  await wait(500);
  expect(bubble()).toBeNull();
});

test('tabbing off a focus-opened trigger closes the tooltip', async () => {
  renderApp(
    <div>
      <Hinted openDelay={4000} closeDelay={0} />
      <button type="button">Publish</button>
    </div>,
  );

  await tab();
  await settle();
  expect(bubble()).not.toBeNull();

  await tab();
  await wait(200);

  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Publish' }));
  expect(bubble()).toBeNull();
});

test('the open tooltip is wired to its trigger through aria-describedby', async () => {
  renderApp(<Hinted openDelay={4000} />);

  await tab();
  await settle();

  const described = trigger().getAttribute('aria-describedby');
  expect(described).toBeTruthy();
  expect(document.getElementById(described)).toBe(bubble());
  expect(bubble().textContent).toContain('Saves the draft');
});

test('a dismissed trigger is never left describing another control tooltip', async () => {
  renderApp(
    <div>
      <Hinted openDelay={4000} />
      <Tooltip content="Publishes the draft" openDelay={0}>
        <button type="button">Publish</button>
      </Tooltip>
    </div>,
  );

  await tab();
  await settle();
  expect(trigger().getAttribute('aria-describedby')).toBeTruthy();

  await pressEscape();
  await settle();

  const publish = screen.getByRole('button', { name: 'Publish' });
  await hover(publish);
  await wait(120);
  expect(bubble().textContent).toContain('Publishes the draft');

  const staleDescription = trigger().getAttribute('aria-describedby');
  const described = staleDescription ? document.getElementById(staleDescription) : null;
  expect(described?.textContent ?? '', 'Save is described by the tooltip belonging to Publish').not.toContain(
    'Publishes the draft',
  );

  await unhover(publish);
});

test('a dismissed tooltip eases out from where it stood, not from the viewport origin', async () => {
  renderApp(<LowPair />);

  await hover(trigger());
  await wait(150);
  const settled = topOf(bubble());
  expect(settled, 'the fixture never moved the tooltip away from the origin').toBeGreaterThan(80);

  await unhover(trigger());
  await nextFrame();
  await nextFrame();

  const leaving = bubble();
  expect(leaving, 'the tooltip left before it could ease out').not.toBeNull();
  expect(Math.abs(topOf(leaving) - settled), 'the tooltip jumped before playing its exit').toBeLessThan(12);
});

test('a tooltip dismissed after moving to a second trigger still plays its exit', async () => {
  renderApp(<LowPair />);

  await hover(trigger());
  await wait(150);
  await hover(publish());
  await wait(150);
  const settled = topOf(bubble());
  expect(bubble().textContent).toContain('Publishes the draft');

  await unhover(publish());
  await nextFrame();
  await nextFrame();

  const leaving = bubble();
  expect(leaving, 'the moved tooltip vanished instead of easing out').not.toBeNull();
  expect(Number(getComputedStyle(leaving).opacity), 'the moved tooltip never faded').toBeLessThan(1);
  expect(Math.abs(topOf(leaving) - settled), 'the moved tooltip jumped before playing its exit').toBeLessThan(12);
});

test('a disabled tooltip never opens, however long the pointer rests on the trigger', async () => {
  renderApp(<Hinted openDelay={50} disabled />);

  await hover(trigger());
  await wait(500);

  expect(bubble()).toBeNull();
  expect(trigger().getAttribute('aria-describedby')).toBeNull();

  await unhover(trigger());
});

test('a warm hover opens the next tooltip without serving the delay again', async () => {
  renderApp(
    <div>
      <Hinted openDelay={4000} />
      <Tooltip content="Publishes the draft" openDelay={4000}>
        <button type="button">Publish</button>
      </Tooltip>
    </div>,
  );

  await tab();
  await settle();
  expect(bubble().textContent).toContain('Saves the draft');

  await pressEscape();
  await hover(screen.getByRole('button', { name: 'Publish' }));
  await settle();

  expect(bubble(), 'a warm hover was made to wait for the open delay').not.toBeNull();
  expect(bubble().textContent).toContain('Publishes the draft');

  await unhover(screen.getByRole('button', { name: 'Publish' }));
});

test('content inside the portalled tooltip is connected, measurable and has resolved tokens', async () => {
  const on = ledger();
  renderApp(<Hinted openDelay={4000} content={<Probe on={on}>Saves the draft</Probe>} />);

  await tab();
  await settle();
  expect(bubble()).not.toBeNull();

  expect(on.sightings.length, 'no consumer ref inside the tooltip ever fired').toBeGreaterThan(0);
  for (const sighting of on.sightings) {
    expect(sighting.connected, `detached during ${sighting.phase}`).toBe(true);
    expect(sighting.height, `no layout during ${sighting.phase}`).toBeGreaterThan(0);
    expect(sighting.tokens['--duration-base'], `unresolved token during ${sighting.phase}`).not.toBe('');
    expect(sighting.tokens['--ease-entrance'], `unresolved token during ${sighting.phase}`).not.toBe('');
  }
});

test('a tooltip raised from inside a modal paints above the dialog and is never inert', async () => {
  renderApp(
    <Modal open>
      <div role="dialog" aria-label="settings">
        <Hinted openDelay={0} />
      </div>
    </Modal>,
  );
  await settle();

  await hover(trigger());
  await wait(120);

  const tip = bubble();
  expect(tip, 'the tooltip never opened inside the modal').not.toBeNull();
  expect(tip.closest('[inert]'), 'the tooltip was left inert by the modal').toBeNull();
  expect(stackingOrder(tip)).toBeGreaterThan(stackingOrder(screen.getByRole('dialog')));

  await unhover(trigger());
});

test('a tooltip raised from inside a popover paints above the popover panel', async () => {
  renderApp(
    <Popover open trigger={<button type="button">Actions</button>}>
      <div>
        <Hinted openDelay={0} />
      </div>
    </Popover>,
  );
  await settle();

  await hover(trigger());
  await wait(120);

  const tip = bubble();
  expect(tip, 'the tooltip never opened inside the popover').not.toBeNull();
  expect(tip.closest('[inert]')).toBeNull();
  expect(stackingOrder(tip)).toBeGreaterThan(stackingOrder(trigger()));

  await unhover(trigger());
});

test('unmounting the trigger while the tooltip is open takes the bubble with it', async () => {
  const view = renderApp(<Hinted openDelay={0} />);

  await hover(trigger());
  await wait(120);
  const openedId = bubble().id;
  expect(openedId).toBeTruthy();

  view.unmount();
  await wait(200);

  expect(screen.queryByRole('tooltip')).toBeNull();
  expect(document.getElementById(openedId)).toBeNull();
});
