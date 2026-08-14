import { describe, expect, test, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { Probe, firstSighting, ledger, renderApp, settle } from './harness';

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
  { key: 'name', label: 'Name', strong: true },
  { key: 'role', label: 'Role' },
  { key: 'visits', label: 'Visits', align: 'end', mono: true },
];

function table(name = 'People') {
  return screen.getByRole('table', { name });
}

function headerLabels(name?: string) {
  return within(table(name))
    .getAllByRole('columnheader')
    .map((th) => th.textContent);
}

function bodyRows(name?: string) {
  return within(table(name)).getAllByRole('row').slice(1);
}

function rowText(row: HTMLElement) {
  return within(row)
    .getAllByRole('cell')
    .map((td) => td.textContent);
}

function firstColumn(name?: string) {
  return bodyRows(name).map((row) => within(row).getAllByRole('cell')[0].textContent);
}

describe('Table column and row rendering', () => {
  test('renders one header cell per column and one row per record, cells in column order', async () => {
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} />);
    await settle();

    expect(headerLabels()).toEqual(['Name', 'Role', 'Visits']);
    expect(bodyRows()).toHaveLength(3);
    expect(rowText(bodyRows()[0])).toEqual(['Ada', 'Engineer', '12']);
    expect(rowText(bodyRows()[2])).toEqual(['Linus', 'Maintainer', '27']);
  });

  test('a column with no label still occupies a header cell so the columns stay aligned', async () => {
    const columns: TableColumn<Person>[] = [
      ...COLUMNS,
      { key: 'actions', render: (row) => <button type="button">Edit {row.name}</button> },
    ];
    renderApp(<Table<Person> ariaLabel="People" columns={columns} rows={PEOPLE} />);
    await settle();

    expect(headerLabels()).toEqual(['Name', 'Role', 'Visits', '']);
    expect(rowText(bodyRows()[0])).toEqual(['Ada', 'Engineer', '12', 'Edit Ada']);
  });

  test('a custom cell renderer replaces the default accessor and is given the row object itself', async () => {
    const seen = vi.fn();
    const columns: TableColumn<Person>[] = [
      {
        key: 'name',
        label: 'Name',
        render: (row) => {
          seen(row);
          return <em>{row.name.toUpperCase()}</em>;
        },
      },
      { key: 'visits', label: 'Visits' },
    ];
    renderApp(<Table<Person> ariaLabel="People" columns={columns} rows={PEOPLE} />);
    await settle();

    expect(firstColumn()).toEqual(['ADA', 'GRACE', 'LINUS']);

    const rowsPassed = new Set(seen.mock.calls.map((call) => call[0]));
    expect(rowsPassed).toEqual(new Set(PEOPLE));
  });

  test('a column key that no row carries renders an empty cell rather than text', async () => {
    const columns: TableColumn<Person>[] = [
      { key: 'name', label: 'Name' },
      { key: 'nickname', label: 'Nickname' },
    ];
    renderApp(<Table<Person> ariaLabel="People" columns={columns} rows={PEOPLE} />);
    await settle();

    expect(rowText(bodyRows()[0])).toEqual(['Ada', '']);
  });

  test('the empty message replaces the rows when there is no data and spans every column', async () => {
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={[]} />);
    await settle();

    const cells = within(table()).getAllByRole('cell');
    expect(cells).toHaveLength(1);
    expect(cells[0].textContent).toBe('Nothing to show');
    expect(cells[0].getAttribute('colspan')).toBe('3');
  });

  test('a custom empty node replaces the default message', async () => {
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={[]} empty={<span>No people yet</span>} />);
    await settle();

    expect(screen.getByText('No people yet')).toBeDefined();
    expect(screen.queryByText('Nothing to show')).toBeNull();
  });

  test('an empty table that is loading shows no empty message and reports itself busy', async () => {
    const view = renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={[]} loading />);
    await settle();

    expect(screen.queryByText('Nothing to show')).toBeNull();
    expect(table().getAttribute('aria-busy')).toBe('true');

    view.rerender(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={[]} />);
    await settle();

    expect(screen.getByText('Nothing to show')).toBeDefined();
    expect(table().getAttribute('aria-busy')).toBeNull();
  });

  test('loading rows go inert to pointer input and become clickable again when it clears', async () => {
    const onRowClick = vi.fn();
    const view = renderApp(
      <Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} loading onRowClick={onRowClick} />,
    );
    await settle();

    expect(getComputedStyle(bodyRows()[0]).pointerEvents).toBe('none');

    view.rerender(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} onRowClick={onRowClick} />);
    await settle();

    expect(getComputedStyle(bodyRows()[0]).pointerEvents).not.toBe('none');
    await userEvent.setup().click(within(bodyRows()[0]).getAllByRole('cell')[1]);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(PEOPLE[0]);
  });

  test('reordering the data moves rows without scrambling the state living inside their cells', async () => {
    const user = userEvent.setup();
    const columns: TableColumn<Person>[] = [
      { key: 'name', label: 'Name' },
      { key: 'note', label: 'Note', render: (row) => <input aria-label={`note for ${row.name}`} /> },
    ];
    const view = renderApp(<Table<Person> ariaLabel="People" columns={columns} rows={PEOPLE} />);
    await settle();

    await user.type(screen.getByLabelText('note for Ada'), 'follow up');
    const adaRow = bodyRows()[0];

    view.rerender(<Table<Person> ariaLabel="People" columns={columns} rows={[...PEOPLE].reverse()} />);
    await settle();

    expect(firstColumn()).toEqual(['Linus', 'Grace', 'Ada']);
    expect(bodyRows()[2]).toBe(adaRow);
    expect((screen.getByLabelText('note for Ada') as HTMLInputElement).value).toBe('follow up');
    expect((screen.getByLabelText('note for Linus') as HTMLInputElement).value).toBe('');
  });

  test('rowKey names the identity property when the rows are not keyed by id', async () => {
    interface Part {
      sku: string;
      name: string;
    }
    const parts: Part[] = [
      { sku: 'x-1', name: 'Bolt' },
      { sku: 'x-2', name: 'Nut' },
    ];
    const columns: TableColumn<Part>[] = [
      { key: 'name', label: 'Name' },
      { key: 'note', label: 'Note', render: (row) => <input aria-label={`note for ${row.name}`} /> },
    ];
    const view = renderApp(<Table<Part> ariaLabel="Parts" rowKey="sku" columns={columns} rows={parts} />);
    await settle();

    await userEvent.setup().type(screen.getByLabelText('note for Bolt'), 'ok');
    view.rerender(<Table<Part> ariaLabel="Parts" rowKey="sku" columns={columns} rows={[...parts].reverse()} />);
    await settle();

    expect(firstColumn('Parts')).toEqual(['Nut', 'Bolt']);
    expect((screen.getByLabelText('note for Bolt') as HTMLInputElement).value).toBe('ok');
  });

  test('the accessible name of the table comes from ariaLabel and htmlProps reach the wrapper', async () => {
    renderApp(
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={PEOPLE}
        htmlProps={{ id: 'people-wrapper', 'data-region': 'directory' }}
      />,
    );
    await settle();

    const wrapper = document.getElementById('people-wrapper');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.getAttribute('data-region')).toBe('directory');
    expect(wrapper!.contains(table())).toBe(true);
  });

  test('footer content renders below the rows', async () => {
    renderApp(<Table<Person> ariaLabel="People" columns={COLUMNS} rows={PEOPLE} footer={<span>3 of 3 shown</span>} />);
    await settle();

    const footer = screen.getByText('3 of 3 shown');
    const lastRow = bodyRows()[2];
    expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(lastRow.getBoundingClientRect().bottom);
  });

  test('compact density gives shorter rows than cozy', async () => {
    renderApp(
      <>
        <Table<Person> ariaLabel="Cozy" columns={COLUMNS} rows={PEOPLE} />
        <Table<Person> ariaLabel="Compact" columns={COLUMNS} rows={PEOPLE} density="compact" />
      </>,
    );
    await settle();

    const cozy = bodyRows('Cozy')[0].getBoundingClientRect().height;
    const compact = bodyRows('Compact')[0].getBoundingClientRect().height;
    expect(cozy).toBeGreaterThan(0);
    expect(compact).toBeLessThan(cozy);
  });
});

describe('Table observation contract', () => {
  test('a consumer ref inside a cell is connected, measurable and resolves tokens the first time it fires', async () => {
    const on = ledger();
    const columns: TableColumn<Person>[] = [
      { key: 'name', label: 'Name' },
      { key: 'probe', label: 'Probe', render: (row) => (row.id === 'a' ? <Probe on={on}>watched</Probe> : null) },
    ];
    renderApp(<Table<Person> ariaLabel="People" columns={columns} rows={PEOPLE} />);
    await settle();

    const first = firstSighting(on, 'callback-ref');
    expect(first, 'callback ref never fired inside a cell').toBeDefined();
    expect(first!.connected).toBe(true);
    expect(first!.height).toBeGreaterThan(0);
    expect(first!.tokens['--duration-base']).not.toBe('');
    expect(first!.tokens['--ease-entrance']).not.toBe('');
  });

  test('a row added by a later data change is live for consumer refs too', async () => {
    const on = ledger();
    const columns: TableColumn<Person>[] = [
      { key: 'name', label: 'Name' },
      { key: 'probe', label: 'Probe', render: (row) => (row.id === 'd' ? <Probe on={on}>watched</Probe> : null) },
    ];
    const view = renderApp(<Table<Person> ariaLabel="People" columns={columns} rows={PEOPLE} />);
    await settle();
    expect(on.sightings).toHaveLength(0);

    const grown = [...PEOPLE, { id: 'd', name: 'Margaret', role: 'Pilot', visits: 5 }];
    view.rerender(<Table<Person> ariaLabel="People" columns={columns} rows={grown} />);
    await settle();

    for (const phase of ['callback-ref', 'layout-effect', 'effect'] as const) {
      const sighting = firstSighting(on, phase);
      expect(sighting, `no sighting for ${phase}`).toBeDefined();
      expect(sighting!.connected, `detached during ${phase}`).toBe(true);
    }
    expect(firstSighting(on, 'callback-ref')!.height).toBeGreaterThan(0);
  });
});
