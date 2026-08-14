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
  joined: string;
}

const PEOPLE: Person[] = [
  { id: 'b', name: 'Grace', role: 'Admiral', visits: 3, joined: '2019-04-02' },
  { id: 'c', name: 'Linus', role: 'Maintainer', visits: 27, joined: '2016-11-30' },
  { id: 'a', name: 'Ada', role: 'Engineer', visits: 12, joined: '2021-01-15' },
];

const COLUMNS: TableColumn<Person>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'visits', label: 'Visits', align: 'end', sortable: true },
];

function table() {
  return screen.getByRole('table', { name: 'People' });
}

function bodyRows() {
  return within(table()).getAllByRole('row').slice(1);
}

function columnText(index = 0) {
  return bodyRows().map((row) => within(row).getAllByRole('cell')[index].textContent);
}

function header(label: string) {
  return within(table())
    .getAllByRole('columnheader')
    .find((th) => th.textContent === label)!;
}

function sortStates() {
  return within(table())
    .getAllByRole('columnheader')
    .map((th) => th.getAttribute('aria-sort'));
}

describe('Table sorting', () => {
  test('a sortable header is a button carrying the column label, a plain header is not', async () => {
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    expect(screen.getByRole('button', { name: 'Name' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Visits' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Role' })).toBeNull();
  });

  test('no column claims a sort direction until one is asked for', async () => {
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    expect(sortStates()).toEqual([null, null, null]);
    expect(columnText()).toEqual(['Grace', 'Linus', 'Ada']);
  });

  test('clicking a sortable header cycles ascending then descending, never back to unsorted', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await settle();
    expect(columnText()).toEqual(['Ada', 'Grace', 'Linus']);
    expect(header('Name').getAttribute('aria-sort')).toBe('ascending');

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await settle();
    expect(columnText()).toEqual(['Linus', 'Grace', 'Ada']);
    expect(header('Name').getAttribute('aria-sort')).toBe('descending');

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await settle();
    expect(columnText()).toEqual(['Ada', 'Grace', 'Linus']);
    expect(header('Name').getAttribute('aria-sort')).toBe('ascending');
  });

  test('only the column being sorted is marked with aria-sort', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Visits' }));
    await settle();

    expect(sortStates()).toEqual([null, null, 'ascending']);
  });

  test('a header that is not sortable ignores clicks', async () => {
    const onSortChange = vi.fn();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} onSortChange={onSortChange} />);
    await settle();

    await userEvent.setup().click(header('Role'));
    await settle();

    expect(columnText()).toEqual(['Grace', 'Linus', 'Ada']);
    expect(sortStates()).toEqual([null, null, null]);
    expect(onSortChange).not.toHaveBeenCalled();
  });

  test('defaultSort orders the first render and reports no change of its own', async () => {
    const onSortChange = vi.fn();
    renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={PEOPLE}
        defaultSort={{ key: 'visits', dir: 'desc' }}
        onSortChange={onSortChange}
      />,
    );
    await settle();

    expect(columnText(2)).toEqual(['27', '12', '3']);
    expect(header('Visits').getAttribute('aria-sort')).toBe('descending');
    expect(onSortChange).not.toHaveBeenCalled();
  });

  test('onSortChange fires once per click with the column and the new direction', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} onSortChange={onSortChange} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await settle();
    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', dir: 'asc' });

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await settle();
    expect(onSortChange).toHaveBeenCalledTimes(2);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', dir: 'desc' });
  });

  test('switching to another column starts that column at ascending', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} onSortChange={onSortChange} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await user.click(screen.getByRole('button', { name: 'Name' }));
    await settle();
    expect(header('Name').getAttribute('aria-sort')).toBe('descending');

    await user.click(screen.getByRole('button', { name: 'Visits' }));
    await settle();

    expect(sortStates()).toEqual([null, null, 'ascending']);
    expect(columnText(2)).toEqual(['3', '12', '27']);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'visits', dir: 'asc' });
  });

  test('sortBy sorts on a property other than the column key', async () => {
    const user = userEvent.setup();
    const columns: TableColumn<Person>[] = [
      { key: 'person', label: 'Person', sortable: true, sortBy: 'name', render: (row) => `${row.name} (${row.role})` },
    ];
    renderApp(<Table<Person> ariaLabel="People" columns={columns} rows={PEOPLE} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Person' }));
    await settle();

    expect(columnText()).toEqual(['Ada (Engineer)', 'Grace (Admiral)', 'Linus (Maintainer)']);
  });

  test('sortBy as a function sorts on the value it computes', async () => {
    const user = userEvent.setup();
    const columns: TableColumn<Person>[] = [
      { key: 'name', label: 'Name' },
      { key: 'joined', label: 'Joined', sortable: true, sortBy: (row) => Date.parse(row.joined) },
    ];
    renderApp(<Table<Person> ariaLabel="People" columns={columns} rows={PEOPLE} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Joined' }));
    await settle();
    expect(columnText()).toEqual(['Linus', 'Grace', 'Ada']);

    await user.click(screen.getByRole('button', { name: 'Joined' }));
    await settle();
    expect(columnText()).toEqual(['Ada', 'Grace', 'Linus']);
  });

  test('a numeric column orders by value rather than by the text of the number', async () => {
    const user = userEvent.setup();
    const rows: Person[] = [
      { ...PEOPLE[0], visits: 9 },
      { ...PEOPLE[1], visits: 10 },
      { ...PEOPLE[2], visits: 2 },
    ];
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={rows} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Visits' }));
    await settle();

    expect(columnText(2)).toEqual(['2', '9', '10']);
  });

  test('a later defaultSort does not override the sort the user chose', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await settle();
    expect(columnText()).toEqual(['Ada', 'Grace', 'Linus']);

    view.rerender(
      <Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} defaultSort={{ key: 'visits', dir: 'desc' }} />,
    );
    await settle();

    expect(columnText()).toEqual(['Ada', 'Grace', 'Linus']);
    expect(sortStates()).toEqual(['ascending', null, null]);
  });

  test('rows arriving after the sort was chosen land in the sorted position', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await settle();

    const grown = [...PEOPLE, { id: 'd', name: 'Barbara', role: 'Scientist', visits: 8, joined: '2020-06-01' }];
    view.rerender(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={grown} />);
    await settle();

    expect(columnText()).toEqual(['Ada', 'Barbara', 'Grace', 'Linus']);
  });

  test('the sort control is reachable by Tab and cycles on Enter and on Space', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Name' }));

    await user.keyboard('{Enter}');
    await settle();
    expect(columnText()).toEqual(['Ada', 'Grace', 'Linus']);
    expect(header('Name').getAttribute('aria-sort')).toBe('ascending');

    await user.keyboard(' ');
    await settle();
    expect(columnText()).toEqual(['Linus', 'Grace', 'Ada']);
    expect(header('Name').getAttribute('aria-sort')).toBe('descending');

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Visits' }));
  });

  test('rows come to rest in the sorted order with nothing left offset by the reorder animation', async () => {
    const user = userEvent.setup();
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await settle();

    const tops = bodyRows().map((row) => row.getBoundingClientRect().top);
    expect(columnText()).toEqual(['Ada', 'Grace', 'Linus']);
    for (let i = 1; i < tops.length; i++) {
      expect(tops[i], 'a row is painted out of its document order').toBeGreaterThan(tops[i - 1]);
    }
  });
});
