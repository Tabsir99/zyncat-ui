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

describe('Dropdown keyboard navigation', () => {
  test('ArrowDown on the closed trigger opens the menu with the first row focused', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);

    await user.tab();
    expect(document.activeElement).toBe(trigger());

    await user.keyboard('{ArrowDown}');
    await settle();

    expect(isOpen()).toBe(true);
    expect(document.activeElement).toBe(item('Rename'));
  });

  test('ArrowUp on the closed trigger opens the menu with the last row focused', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);

    trigger().focus();
    await user.keyboard('{ArrowUp}');
    await settle();

    expect(document.activeElement).toBe(item('Delete'));
  });

  test('arrows wrap and skip disabled rows', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    expect(document.activeElement).toBe(item('Rename'));

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement, 'Duplicate is disabled and must be skipped').toBe(item('Move to'));

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(item('Delete'));

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement, 'the last row wraps to the first').toBe(item('Rename'));

    await user.keyboard('{ArrowUp}');
    expect(document.activeElement, 'the first row wraps to the last').toBe(item('Delete'));
  });

  test('Home and End jump to the first and last enabled rows', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    await user.keyboard('{End}');
    expect(document.activeElement).toBe(item('Delete'));

    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(item('Rename'));
  });

  test('typing letters moves to the first row that starts with the buffer', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    await user.keyboard('m');
    expect(document.activeElement).toBe(item('Move to'));

    await user.keyboard('{Escape}');
    await settle();
    await openMenu(user);

    await user.keyboard('de');
    expect(document.activeElement, 'a two-letter buffer narrows further').toBe(item('Delete'));
  });

  test('Enter commits the focused row once, closes the menu and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderApp(<Fixture onSelect={onSelect} />);
    await openMenu(user);

    await user.keyboard('{Enter}');
    await settle();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('rename', expect.objectContaining({ id: 'rename' }));
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger());
  });

  test('Space commits too, but extends a live typeahead buffer instead', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderApp(<Fixture onSelect={onSelect} />);
    await openMenu(user);

    await user.keyboard('{ }');
    await settle();
    expect(onSelect).toHaveBeenCalledWith('rename', expect.anything());

    await openMenu(user);
    await user.keyboard('Move');
    expect(document.activeElement, 'the space inside "Move to" must not commit').toBe(item('Move to'));
  });

  test('a disabled row cannot be committed by keyboard or pointer', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderApp(<Fixture onSelect={onSelect} />);
    await openMenu(user);

    await user.click(item('Duplicate'));
    await settle();

    expect(onSelect).not.toHaveBeenCalled();
    expect(isOpen()).toBe(true);
  });

  test('Escape closes the menu and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    await user.keyboard('{Escape}');
    await settle();

    expect(isOpen()).toBe(false);
    expect(screen.queryAllByRole('menu')).toHaveLength(0);
    expect(document.activeElement).toBe(trigger());
  });

  test('Tab closes every level and hands focus back rather than stranding it in the portal', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    await user.keyboard('{ArrowDown}{ArrowRight}');
    await settle();
    expect(screen.queryAllByRole('menu')).toHaveLength(2);

    await user.keyboard('{Tab}');
    await settle();

    expect(isOpen()).toBe(false);
    expect(screen.queryAllByRole('menu')).toHaveLength(0);
    expect(document.activeElement).toBe(trigger());
  });

  test('only the focused row is in the tab order', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    const tabbable = screen.getAllByRole('menuitem').filter((el) => el.getAttribute('tabindex') === '0');
    expect(tabbable).toEqual([item('Rename')]);
  });
});
