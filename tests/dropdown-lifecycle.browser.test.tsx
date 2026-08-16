import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown, type DropdownItem } from '@zyncat/ui/dropdown';
import { Dialog } from '@zyncat/ui/dialog';
import { Button } from '@zyncat/ui/button';
import { firstSighting, ledger, overlayRoots, renderApp, settle, type Ledger, Probe } from './harness';
import { ACTIONS, isOpen, item, menus, openMenu, trigger } from './dropdown-support';

function Fixture() {
  return <Dropdown items={ACTIONS} ariaLabel="Row actions" trigger={<Button>Actions</Button>} />;
}

function Controlled({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown
      items={ACTIONS}
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        setOpen(next);
      }}
      trigger={<Button>Actions</Button>}
    />
  );
}

describe('Dropdown lifecycle and observation', () => {
  test("a consumer's node inside the menu is connected, laid out and themed the first time it is seen", async () => {
    const user = userEvent.setup();
    const log: Ledger = ledger();
    const items: DropdownItem[] = [{ id: 'rename', label: <Probe on={log}>Rename</Probe>, searchText: 'Rename' }];
    renderApp(<Dropdown items={items} trigger={<Button>Actions</Button>} />);

    await openMenu(user);

    const first = firstSighting(log, 'callback-ref');
    expect(first, 'the consumer node must be seen at all').toBeTruthy();
    expect(first!.connected, 'it must already be in the document').toBe(true);
    expect(first!.height, 'and it must already have layout').toBeGreaterThan(0);
    expect(first!.tokens['--duration-base'], 'and resolve tokens off the root').toBeTruthy();
  });

  test('closing leaves no overlay root, no menu and no stuck focus behind', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp(<Fixture />);

    await openMenu(user);
    await user.keyboard('{ArrowDown}{ArrowRight}');
    await settle();
    expect(overlayRoots().length).toBeGreaterThan(0);

    await user.keyboard('{Escape}{Escape}');
    await settle();

    expect(menus()).toHaveLength(0);

    unmount();
    await settle();
    expect(overlayRoots()).toHaveLength(0);
  });

  test('unmounting while open tears the portal down', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp(<Fixture />);
    await openMenu(user);
    await user.keyboard('{ArrowDown}{ArrowRight}');
    await settle();

    unmount();
    await settle();

    expect(overlayRoots()).toHaveLength(0);
    expect(document.querySelectorAll('[role="menu"]')).toHaveLength(0);
  });

  test('rapid toggling settles closed with nothing left open', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);

    for (let i = 0; i < 4; i++) await user.click(trigger());
    await settle();

    expect(isOpen()).toBe(false);
    expect(menus()).toHaveLength(0);
  });

  test('a controlled Dropdown never opens itself and reports each change once', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(<Controlled onOpenChange={onOpenChange} />);

    expect(onOpenChange, 'no callback on mount').not.toHaveBeenCalled();

    await openMenu(user);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.keyboard('{Escape}');
    await settle();
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test('an open Dropdown that is not told to open stays shut', async () => {
    const user = userEvent.setup();
    renderApp(<Dropdown items={ACTIONS} open={false} trigger={<Button>Actions</Button>} />);

    await user.click(trigger());
    await settle();

    expect(menus()).toHaveLength(0);
  });

  test('pressing outside dismisses without dragging focus back to the trigger', async () => {
    const user = userEvent.setup();
    renderApp(
      <div>
        <Fixture />
        <button type="button">Elsewhere</button>
      </div>,
    );
    await openMenu(user);

    await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
    await settle();

    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Elsewhere' }));
  });

  test('inside a Dialog, Escape closes the menu first and leaves the dialog open', async () => {
    const user = userEvent.setup();
    renderApp(
      <Dialog open title="Project settings">
        <Fixture />
      </Dialog>,
    );
    await settle();

    await openMenu(user);
    expect(menus()).toHaveLength(1);

    await user.keyboard('{Escape}');
    await settle();

    expect(menus()).toHaveLength(0);
    expect(screen.getByRole('dialog'), 'the dialog underneath must survive').toBeTruthy();
  });

  test('two Dropdowns on one page open and close independently', async () => {
    const user = userEvent.setup();
    renderApp(
      <div>
        <Dropdown items={ACTIONS} ariaLabel="First" trigger={<Button>Actions</Button>} />
        <Dropdown items={ACTIONS} ariaLabel="Second" trigger={<Button>More</Button>} />
      </div>,
    );

    await openMenu(user, 'More');
    expect(screen.getByRole('menu', { name: 'Second' })).toBeTruthy();
    expect(isOpen('Actions')).toBe(false);

    await user.keyboard('{Escape}');
    await settle();
    expect(menus()).toHaveLength(0);
  });

  test('a menu opened, closed and reopened seeds focus afresh', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);

    await openMenu(user);
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(item('Delete'));

    await user.keyboard('{Escape}');
    await settle();
    await openMenu(user);

    expect(document.activeElement).toBe(item('Rename'));
  });
});
