import { describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from '@zyncat/ui/dropdown';
import { Button } from '@zyncat/ui/button';
import { renderApp, settle } from './harness';
import { ACTIONS, SECTIONS, item, openMenu, trigger } from './dropdown-support';

function Fixture() {
  return <Dropdown items={ACTIONS} ariaLabel="Row actions" trigger={<Button>Actions</Button>} />;
}

describe('Dropdown accessibility contract', () => {
  test('the trigger advertises a menu and wires itself to the open panel', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);

    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().getAttribute('aria-controls')).toBe(null);

    await openMenu(user);

    const menu = screen.getByRole('menu', { name: 'Row actions' });
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(menu.id);
  });

  test('a parent row advertises its submenu and tracks whether it is open', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    const parent = item('Move to');
    expect(parent.getAttribute('aria-haspopup')).toBe('menu');
    expect(parent.getAttribute('aria-expanded')).toBe('false');
    expect(item('Rename').getAttribute('aria-haspopup'), 'a leaf row must not claim a popup').toBe(null);

    await user.keyboard('{ArrowDown}{ArrowRight}');
    await settle();

    const submenu = screen.getAllByRole('menu')[1];
    expect(parent.getAttribute('aria-expanded')).toBe('true');
    expect(parent.getAttribute('aria-controls')).toBe(submenu.id);
  });

  test('a submenu takes its accessible name from the row that opens it', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);
    await user.keyboard('{ArrowDown}{ArrowRight}');
    await settle();

    expect(screen.getByRole('menu', { name: 'Move to' })).toBeTruthy();
  });

  test('a disabled row is announced disabled rather than removed', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    expect(item('Duplicate').getAttribute('aria-disabled')).toBe('true');
  });

  test('a shortcut hint is exposed as a key shortcut, not as part of the row name', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    expect(item('Rename').getAttribute('aria-keyshortcuts')).toBe('R');
  });

  test('grouped items render labelled groups inside the menu', async () => {
    const user = userEvent.setup();
    renderApp(<Dropdown items={SECTIONS} ariaLabel="Row actions" trigger={<Button>Actions</Button>} />);
    await openMenu(user);

    const groups = screen.getAllByRole('group');
    expect(groups.map((g) => g.getAttribute('aria-label'))).toEqual(['Edit', 'Danger zone']);
  });

  test('an ungrouped menu holds its rows directly, with no empty group in between', async () => {
    const user = userEvent.setup();
    renderApp(<Fixture />);
    await openMenu(user);

    expect(screen.queryAllByRole('group')).toHaveLength(0);
  });
});
