import { describe, expect, test, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { renderApp, settle } from './harness';

interface Person {
  id: string;
  name: string;
  role: string;
  visits: number;
}

const PEOPLE: Person[] = [
  { id: 'a', name: 'Ada', role: 'Engineer', visits: 12 },
  { id: 'b', name: 'Grace', role: 'Admiral', visits: 3 },
  { id: 'c', name: 'Linus', role: 'Maintainer', visits: 27 },
];

const COLUMNS: TableColumn<Person>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'visits', label: 'Visits', sortable: true },
];

function table() {
  return screen.getByRole('table', { name: 'People' });
}

function selectAll() {
  return within(table()).getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement;
}

function rowBoxes(name = 'Select row') {
  return within(table()).getAllByRole('checkbox', { name }) as HTMLInputElement[];
}

function bulkBar() {
  return screen.queryByRole('toolbar', { name: 'Selection actions' });
}

function names() {
  return within(table())
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[1].textContent);
}

describe('Table selection', () => {
  test('selectable adds a checkbox to every row plus a select-all in the header', async () => {
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} selectable />);
    await settle();

    expect(within(table()).getAllByRole('columnheader')).toHaveLength(4);
    expect(rowBoxes()).toHaveLength(3);
    expect(selectAll().checked).toBe(false);
    expect(selectAll().indeterminate).toBe(false);
  });

  test('without selectable there are no checkboxes and no extra column', async () => {
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    expect(within(table()).getAllByRole('columnheader')).toHaveLength(3);
    expect(within(table()).queryAllByRole('checkbox')).toHaveLength(0);
  });

  test('checking one row reports only that row key, once', async () => {
    const onSelectionChange = vi.fn();
    renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={PEOPLE}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await settle();

    await userEvent.setup().click(rowBoxes()[1]);
    await settle();

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['b']);
    expect(rowBoxes().map((box) => box.checked)).toEqual([false, true, false]);
  });

  test('the select-all is mixed while some rows are checked and checked once they all are', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} selectable />);
    await settle();

    await user.click(rowBoxes()[0]);
    await settle();
    expect(selectAll().indeterminate).toBe(true);
    expect(selectAll().checked).toBe(false);

    await user.click(rowBoxes()[1]);
    await user.click(rowBoxes()[2]);
    await settle();
    expect(selectAll().checked).toBe(true);
    expect(selectAll().indeterminate).toBe(false);
  });

  test('the select-all checks every row and reports every key, then clears them all', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={PEOPLE}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await settle();

    await user.click(selectAll());
    await settle();
    expect(rowBoxes().map((box) => box.checked)).toEqual([true, true, true]);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(new Set(onSelectionChange.mock.calls[0][0])).toEqual(new Set(['a', 'b', 'c']));

    await user.click(selectAll());
    await settle();
    expect(rowBoxes().map((box) => box.checked)).toEqual([false, false, false]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  test('the bulk bar appears with the live count while a selection exists and leaves when it is cleared', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} selectable />);
    await settle();

    expect(bulkBar()).toBeNull();

    await user.click(rowBoxes()[0]);
    await user.click(rowBoxes()[2]);
    await settle();

    const bar = bulkBar();
    expect(bar).not.toBeNull();
    expect(within(bar!).getByLabelText('2')).toBeDefined();
    expect(within(bar!).getByText('selected')).toBeDefined();

    await user.click(within(bar!).getByRole('button', { name: 'Clear' }));
    await settle();

    expect(bulkBar()).toBeNull();
    expect(rowBoxes().map((box) => box.checked)).toEqual([false, false, false]);
  });

  test('the built-in Clear reports an empty selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={PEOPLE}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await settle();

    await user.click(rowBoxes()[0]);
    await settle();
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    await settle();

    expect(onSelectionChange).toHaveBeenCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  test('bulkActions receives the selected keys and a clear that empties the selection', async () => {
    const user = userEvent.setup();
    const seen: Array<Array<string | number>> = [];
    renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={PEOPLE}
        selectable
        bulkActions={(keys, clear) => {
          seen.push(keys);
          return (
            <button type="button" onClick={clear}>
              Archive {keys.length}
            </button>
          );
        }}
      />,
    );
    await settle();

    await user.click(rowBoxes()[1]);
    await user.click(rowBoxes()[2]);
    await settle();

    const archive = screen.getByRole('button', { name: 'Archive 2' });
    expect(new Set(seen[seen.length - 1])).toEqual(new Set(['b', 'c']));

    await user.click(archive);
    await settle();

    expect(rowBoxes().map((box) => box.checked)).toEqual([false, false, false]);
    expect(bulkBar()).toBeNull();
  });

  test('selectionLabel names each row checkbox', async () => {
    renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={PEOPLE}
        selectable
        selectionLabel={(row) => `Select ${row.name}`}
      />,
    );
    await settle();

    expect(within(table()).getByRole('checkbox', { name: 'Select Grace' })).toBeDefined();
    expect(within(table()).queryAllByRole('checkbox', { name: 'Select row' })).toHaveLength(0);
  });

  test('the checkbox cell is excluded from row clicks while the rest of the row is not', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} selectable onRowClick={onRowClick} />);
    await settle();

    await user.click(rowBoxes()[0]);
    await settle();
    expect(onRowClick).not.toHaveBeenCalled();
    expect(rowBoxes()[0].checked).toBe(true);

    const firstRow = within(table()).getAllByRole('row')[1];
    await user.click(within(firstRow).getAllByRole('cell')[1]);
    await settle();
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(PEOPLE[0]);
  });

  test('a data refresh that keeps the same keys keeps the same rows checked and reports nothing new', async () => {
    const onSelectionChange = vi.fn();
    const view = renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={PEOPLE}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await settle();

    await userEvent.setup().click(rowBoxes()[1]);
    await settle();

    const refreshed = PEOPLE.map((person) => ({ ...person, visits: person.visits + 1 }));
    view.rerender(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={refreshed}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await settle();

    expect(rowBoxes().map((box) => box.checked)).toEqual([false, true, false]);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  test('sorting keeps the same rows checked and moves the ticks with them', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} selectable />);
    await settle();

    await user.click(rowBoxes()[0]);
    await settle();
    expect(names()).toEqual(['Ada', 'Grace', 'Linus']);

    await user.click(screen.getByRole('button', { name: 'Visits' }));
    await settle();

    expect(names()).toEqual(['Grace', 'Ada', 'Linus']);
    expect(rowBoxes().map((box) => box.checked)).toEqual([false, true, false]);
    expect(selectAll().indeterminate).toBe(true);
  });

  test('the select-all covers exactly the rows it was given', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={PEOPLE.slice(0, 2)}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await settle();

    await user.click(selectAll());
    await settle();

    expect(new Set(onSelectionChange.mock.calls[0][0])).toEqual(new Set(['a', 'b']));
  });

  test('a row checkbox is reachable by Tab and toggles on Space', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const plain: TableColumn<Person>[] = [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
    ];
    renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={plain}
        rows={PEOPLE}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await settle();

    await user.tab();
    expect(document.activeElement).toBe(selectAll());

    await user.tab();
    expect(document.activeElement).toBe(rowBoxes()[0]);

    await user.keyboard(' ');
    await settle();

    expect(rowBoxes()[0].checked).toBe(true);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['a']);
  });
});
