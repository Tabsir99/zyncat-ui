import { describe, expect, test, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { Popover } from '@zyncat/ui/popover';
import { Probe, firstSighting, ledger, overlayRoots, renderApp, settle, type Ledger } from './harness';

interface Person {
  id: string;
  name: string;
  visits: number;
}

const PEOPLE: Person[] = [
  { id: 'a', name: 'Ada', visits: 12 },
  { id: 'b', name: 'Grace', visits: 3 },
  { id: 'c', name: 'Linus', visits: 27 },
];

function actionsColumn(onAction: (row: Person) => void, probe?: Ledger): TableColumn<Person> {
  return {
    key: 'actions',
    render: (row) => (
      <Popover trigger={<button type="button">Actions for {row.name}</button>}>
        <div role="menu" aria-label={`Actions for ${row.name}`}>
          <button type="button" role="menuitem" onClick={() => onAction(row)}>
            Rename {row.name}
          </button>
          {probe && row.id === 'a' ? <Probe on={probe}>panel content</Probe> : null}
        </div>
      </Popover>
    ),
  };
}

function columns(onAction: (row: Person) => void, probe?: Ledger): TableColumn<Person>[] {
  return [
    { key: 'name', label: 'Name' },
    { key: 'visits', label: 'Visits', sortable: true },
    actionsColumn(onAction, probe),
  ];
}

function peopleTable() {
  return screen.getByRole('table', { name: 'People' });
}

function geometry() {
  const root = peopleTable();
  return [root, ...within(root).getAllByRole('row')].map((element) => {
    const box = element.getBoundingClientRect();
    return [box.top, box.left, box.width, box.height];
  });
}

function trigger(name: string) {
  return screen.getByRole('button', { name: `Actions for ${name}` });
}

describe('Popover inside a table cell', () => {
  test('the panel paints outside the table and leaves the table geometry untouched', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE} />);
    await settle();

    const before = geometry();

    await user.click(trigger('Ada'));
    await settle();

    const panel = screen.getByRole('menu', { name: 'Actions for Ada' });
    expect(document.body.contains(panel)).toBe(true);
    expect(peopleTable().contains(panel)).toBe(false);
    expect(panel.getBoundingClientRect().height).toBeGreaterThan(0);
    expect(geometry()).toEqual(before);
    expect(within(peopleTable()).getAllByRole('row')).toHaveLength(4);
  });

  test('the trigger advertises the panel while it is open', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE} />);
    await settle();

    expect(trigger('Ada').getAttribute('aria-expanded')).toBe('false');
    expect(trigger('Ada').getAttribute('aria-haspopup')).toBe('true');
    expect(trigger('Ada').getAttribute('aria-controls')).toBeNull();

    await user.click(trigger('Ada'));
    await settle();

    const panel = screen.getByRole('menu', { name: 'Actions for Ada' });
    expect(trigger('Ada').getAttribute('aria-expanded')).toBe('true');

    const controlled = document.getElementById(trigger('Ada').getAttribute('aria-controls')!);
    expect(controlled, 'aria-controls points at nothing').not.toBeNull();
    expect(controlled!.contains(panel)).toBe(true);
  });

  test('a consumer ref inside the in-cell panel is connected, measurable and resolves tokens on first sight', async () => {
    const user = userEvent.setup();
    const on = ledger();
    renderApp(<Table<Person> ariaLabel="People" columns={columns(() => {}, on)} rows={PEOPLE} />);
    await settle();
    expect(on.sightings).toHaveLength(0);

    await user.click(trigger('Ada'));
    await settle();

    for (const phase of ['callback-ref', 'layout-effect', 'effect'] as const) {
      const sighting = firstSighting(on, phase);
      expect(sighting, `no sighting for ${phase}`).toBeDefined();
      expect(sighting!.connected, `detached during ${phase}`).toBe(true);
    }
    const first = firstSighting(on, 'callback-ref')!;
    expect(first.height).toBeGreaterThan(0);
    expect(first.tokens['--duration-base']).not.toBe('');
  });

  test('an action pressed inside the panel runs', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderApp(<Table<Person> ariaLabel="People" columns={columns(onAction)} rows={PEOPLE} />);
    await settle();

    await user.click(trigger('Grace'));
    await settle();
    await user.click(screen.getByRole('menuitem', { name: 'Rename Grace' }));
    await settle();

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(PEOPLE[1]);
  });

  test('Escape dismisses the panel without clicking the row or moving the sort', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    renderApp(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE} onRowClick={onRowClick} />);
    await settle();

    await user.click(trigger('Ada'));
    await settle();
    onRowClick.mockClear();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByRole('menu', { name: 'Actions for Ada' })).toBeNull();
    expect(onRowClick).not.toHaveBeenCalled();
    expect(
      within(peopleTable())
        .getAllByRole('columnheader')
        .map((th) => th.getAttribute('aria-sort')),
    ).toEqual([null, null, null]);
  });

  test('the trigger is reachable by Tab, opens on Enter, and takes focus back on Escape', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE} />);
    await settle();

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Visits' }));

    await user.tab();
    expect(document.activeElement).toBe(trigger('Ada'));

    await user.keyboard('{Enter}');
    await settle();
    expect(screen.getByRole('menu', { name: 'Actions for Ada' })).toBeDefined();

    await user.keyboard('{Escape}');
    await settle();
    expect(screen.queryByRole('menu', { name: 'Actions for Ada' })).toBeNull();
    expect(document.activeElement).toBe(trigger('Ada'));
  });

  test('a press outside the table dismisses the panel and still reaches what was pressed', async () => {
    const user = userEvent.setup();
    const onOutside = vi.fn();
    renderApp(
      <>
        <button type="button" onClick={onOutside}>
          Elsewhere
        </button>
        <Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE} />
      </>,
    );
    await settle();

    await user.click(trigger('Ada'));
    await settle();
    expect(screen.getByRole('menu', { name: 'Actions for Ada' })).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
    await settle();

    expect(screen.queryByRole('menu', { name: 'Actions for Ada' })).toBeNull();
    expect(onOutside).toHaveBeenCalledTimes(1);
  });

  test('opening a second row panel leaves only that one open', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE} />);
    await settle();

    await user.click(trigger('Ada'));
    await settle();
    await user.click(trigger('Grace'));
    await settle();

    expect(screen.queryByRole('menu', { name: 'Actions for Ada' })).toBeNull();
    expect(screen.getByRole('menu', { name: 'Actions for Grace' })).toBeDefined();
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });

  test('toggling a cell panel over and over leaves nothing mounted behind it', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE} />);
    await settle();

    for (let press = 0; press < 4; press++) await user.click(trigger('Ada'));
    await settle();

    expect(screen.queryByRole('menu')).toBeNull();
    expect(overlayRoots().every((host) => host.childElementCount === 0)).toBe(true);
  });
});

describe('Table row lifecycle with an open in-cell overlay', () => {
  test('removing the row while its panel is open takes the panel with it and orphans nothing', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE} />);
    await settle();

    await user.click(trigger('Ada'));
    await settle();
    expect(screen.getByRole('menu', { name: 'Actions for Ada' })).toBeDefined();

    view.rerender(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE.slice(1)} />);
    await settle();

    expect(screen.queryByRole('menu', { name: 'Actions for Ada' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Actions for Ada' })).toBeNull();
    expect(overlayRoots().every((host) => host.childElementCount === 0)).toBe(true);
    expect(within(peopleTable()).getAllByRole('row')).toHaveLength(3);
  });

  test('a panel in another row still opens and still dismisses after a row was torn down mid-open', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE} />);
    await settle();

    await user.click(trigger('Ada'));
    await settle();

    view.rerender(<Table<Person> ariaLabel="People" columns={columns(() => {})} rows={PEOPLE.slice(1)} />);
    await settle();

    await user.click(trigger('Linus'));
    await settle();
    expect(screen.getByRole('menu', { name: 'Actions for Linus' })).toBeDefined();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByRole('menu', { name: 'Actions for Linus' })).toBeNull();
    expect(overlayRoots().every((host) => host.childElementCount === 0)).toBe(true);
  });
});
