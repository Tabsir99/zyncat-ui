import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from '@zyncat/ui/dropdown';
import { Button } from '@zyncat/ui/button';
import { renderApp, settle } from './harness';
import { ACTIONS, isOpen, item, openMenu, trigger } from './dropdown-support';

function Fixture({ onSelect }: { onSelect?: (id: string) => void }) {
  return <Dropdown items={ACTIONS} ariaLabel="Row actions" trigger={<Button>Actions</Button>} onSelect={onSelect} />;
}

async function openSubmenu(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await openMenu(user);
  await user.keyboard('{ArrowDown}{ArrowRight}');
  await settle();
}

describe('Dropdown submenus', () => {
  test('ArrowRight opens the submenu and moves focus into its first row', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openSubmenu(user);

    expect(screen.queryAllByRole('menu')).toHaveLength(2);
    expect(document.activeElement).toBe(item('Drafts'));
  });

  test('Enter on a parent row opens the submenu instead of committing it', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderApp(<Fixture onSelect={onSelect} />);
    await openMenu(user);

    await user.keyboard('{ArrowDown}{Enter}');
    await settle();

    expect(onSelect).not.toHaveBeenCalled();
    expect(isOpen()).toBe(true);
    expect(document.activeElement).toBe(item('Drafts'));
  });

  test('ArrowLeft closes just the submenu and puts focus back on its parent row', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openSubmenu(user);

    await user.keyboard('{ArrowLeft}');
    await settle();

    expect(screen.queryAllByRole('menu')).toHaveLength(1);
    expect(isOpen(), 'the root menu must survive').toBe(true);
    expect(document.activeElement).toBe(item('Move to'));
  });

  test('Escape unwinds one level at a time', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openSubmenu(user);

    await user.keyboard('{ArrowDown}{ArrowRight}');
    await settle();
    expect(screen.queryAllByRole('menu'), 'three levels are open').toHaveLength(3);

    await user.keyboard('{Escape}');
    await settle();
    expect(screen.queryAllByRole('menu')).toHaveLength(2);

    await user.keyboard('{Escape}');
    await settle();
    expect(screen.queryAllByRole('menu')).toHaveLength(1);

    await user.keyboard('{Escape}');
    await settle();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger());
  });

  test('moving to another row by keyboard closes the open submenu', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openSubmenu(user);

    await user.keyboard('{ArrowLeft}{ArrowDown}');
    await settle();

    expect(screen.queryAllByRole('menu')).toHaveLength(1);
    expect(document.activeElement).toBe(item('Delete'));
  });

  test('committing deep inside a submenu closes every level and returns focus once', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderApp(<Fixture onSelect={onSelect} />);
    await openSubmenu(user);

    await user.keyboard('{ArrowDown}{ArrowRight}');
    await settle();
    await user.click(item('Q1'));
    await settle();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('q1', expect.objectContaining({ id: 'q1' }));
    expect(screen.queryAllByRole('menu')).toHaveLength(0);
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger());
  });

  test("an item's own onSelect fires alongside the menu's, before it closes", async () => {
    const user = userEvent.setup();
    const own = vi.fn();
    const onSelect = vi.fn();
    renderApp(
      <Dropdown
        items={[{ id: 'rename', label: 'Rename', onSelect: own }]}
        trigger={<Button>Actions</Button>}
        onSelect={onSelect}
      />,
    );
    await openMenu(user);
    await user.click(item('Rename'));
    await settle();

    expect(own).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test('hovering a parent row opens its submenu without taking focus off the parent', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    await user.hover(item('Move to'));
    await vi.waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(2));
    await settle();

    expect(document.activeElement, 'hover must not steal focus into the submenu').toBe(item('Move to'));
  });

  test('a hover-opened submenu still accepts ArrowRight to move focus into it', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    await user.hover(item('Move to'));
    await vi.waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(2));
    await settle();

    await user.keyboard('{ArrowRight}');
    await settle();

    expect(document.activeElement).toBe(item('Drafts'));
  });

  test('closing from inside a submenu animates every level out, not just the root', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openSubmenu(user);

    const [root, sub] = screen.getAllByRole('menu');

    await user.click(item('Drafts'));

    expect(root.getAnimations().length, 'the root plays its exit').toBeGreaterThan(0);
    expect(sub.getAnimations().length, 'and so does the submenu, instead of being dropped').toBeGreaterThan(0);

    await settle();
    expect(screen.queryAllByRole('menu')).toHaveLength(0);
  });

  test('moving the pointer to an unrelated row closes the submenu on the move, not on a timer', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    await user.hover(item('Move to'));
    await vi.waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(2));
    await settle();

    await user.hover(item('Rename'));
    await settle();

    expect(screen.queryAllByRole('menu')).toHaveLength(1);
  });

  test('a submenu is anchored to its own row, not to the trigger', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openSubmenu(user);

    const [root, sub] = screen.getAllByRole('menu');
    const rootBox = root.getBoundingClientRect();
    const subBox = sub.getBoundingClientRect();
    const rowBox = item('Move to').getBoundingClientRect();

    expect(subBox.left, 'the submenu sits beside the root panel').toBeGreaterThanOrEqual(rootBox.left);
    expect(Math.abs(subBox.top - rowBox.top), 'and starts level with its row').toBeLessThan(2);
  });
});
