import { useMemo, useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { Pagination } from '@zyncat/ui/pagination';
import { renderApp, settle } from './harness';

function nav(name = 'Pagination') {
  return screen.getByRole('navigation', { name });
}

function prevButton() {
  return screen.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement;
}

function nextButton() {
  return screen.getByRole('button', { name: 'Next page' }) as HTMLButtonElement;
}

describe('Pagination controls', () => {
  test('the navigation landmark is named by ariaLabel and falls back to Pagination', async () => {
    const view = renderApp(<Pagination range={[1, 25]} />);
    await settle();
    expect(nav()).toBeDefined();

    view.rerender(<Pagination ariaLabel="Invoices" range={[1, 25]} />);
    await settle();
    expect(nav('Invoices')).toBeDefined();
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).toBeNull();
  });

  test('the readout shows the current range, and a total only when one is given', async () => {
    const view = renderApp(<Pagination range={[26, 50]} total={312} />);
    await settle();

    expect(nav().textContent).toContain('26-50');
    expect(nav().textContent).toContain('of 312');

    view.rerender(<Pagination range={[26, 50]} />);
    await settle();

    expect(nav().textContent).toContain('26-50');
    expect(nav().textContent).not.toContain('of');
  });

  test('large numbers are grouped in the readout', async () => {
    renderApp(<Pagination range={[1, 25]} total={1234567} />);
    await settle();

    expect(nav().textContent).toMatch(/1\D234\D567/);
  });

  test('an arrow is disabled until its cursor exists', async () => {
    const view = renderApp(<Pagination range={[1, 25]} total={100} />);
    await settle();
    expect(prevButton().disabled).toBe(true);
    expect(nextButton().disabled).toBe(true);

    view.rerender(<Pagination range={[26, 50]} total={100} hasPrev hasNext />);
    await settle();
    expect(prevButton().disabled).toBe(false);
    expect(nextButton().disabled).toBe(false);
  });

  test('pressing an arrow fires its own callback once and neither fires on mount', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    renderApp(<Pagination range={[26, 50]} total={100} hasPrev hasNext onPrev={onPrev} onNext={onNext} />);
    await settle();

    expect(onPrev).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();

    await user.click(nextButton());
    await settle();
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).not.toHaveBeenCalled();

    await user.click(prevButton());
    await settle();
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  test('an arrow at the boundary does not fire when pressed', async () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    renderApp(<Pagination range={[1, 25]} total={25} onPrev={onPrev} onNext={onNext} />);
    await settle();

    await userEvent.setup().click(prevButton());
    await settle();

    expect(onPrev).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });

  test('a page fetch makes both arrows inert and marks the pressed one busy', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Pagination range={[26, 50]} total={100} hasPrev hasNext onNext={() => {}} />);
    await settle();

    await user.click(nextButton());
    view.rerender(<Pagination range={[26, 50]} total={100} hasPrev hasNext loading onNext={() => {}} />);

    expect(nav().getAttribute('aria-busy')).toBe('true');
    expect(nextButton().disabled).toBe(true);
    expect(prevButton().disabled).toBe(true);
    expect(nextButton().getAttribute('aria-busy')).toBe('true');
    expect(prevButton().getAttribute('aria-busy')).toBeNull();
  });

  test('the arrows are reachable by Tab and fire on Enter and on Space', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    renderApp(<Pagination range={[26, 50]} total={100} hasPrev hasNext onPrev={onPrev} onNext={onNext} />);
    await settle();

    await user.tab();
    expect(document.activeElement).toBe(prevButton());
    await user.keyboard('{Enter}');
    expect(onPrev).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(document.activeElement).toBe(nextButton());
    await user.keyboard(' ');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  test('focus is not stranded on the body when the pressed arrow goes disabled at the last page', async () => {
    const user = userEvent.setup();
    const view = renderApp(<Pagination range={[26, 50]} total={75} hasPrev hasNext onNext={() => {}} />);
    await settle();

    await user.click(nextButton());
    view.rerender(<Pagination range={[51, 75]} total={75} hasPrev onNext={() => {}} />);
    await settle();

    expect(document.activeElement).not.toBe(document.body);
    expect(document.activeElement).toBe(prevButton());
  });
});

interface Person {
  id: string;
  name: string;
  visits: number;
}

const VISITS = [5, 9, 1, 7, 3, 10, 2, 8, 4, 6];
const DATASET: Person[] = VISITS.map((visits, index) => ({ id: `p${index + 1}`, name: `Person ${index + 1}`, visits }));

const COLUMNS: TableColumn<Person>[] = [
  { key: 'name', label: 'Name' },
  { key: 'visits', label: 'Visits', sortable: true },
];

const PAGE_SIZE = 4;

function PagedPeople({ selectable = false }: { selectable?: boolean }) {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');

  const matching = useMemo(() => DATASET.filter((person) => person.name.includes(query)), [query]);
  const start = page * PAGE_SIZE;
  const pageRows = matching.slice(start, start + PAGE_SIZE);

  return (
    <>
      <input
        aria-label="Filter people"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(0);
        }}
      />
      <Table<Person>
        ariaLabel="People"
        columns={COLUMNS}
        rows={pageRows}
        selectable={selectable}
        footer={
          <Pagination
            ariaLabel="People rows"
            range={[matching.length === 0 ? 0 : start + 1, Math.min(start + PAGE_SIZE, matching.length)]}
            total={matching.length}
            hasPrev={page > 0}
            hasNext={start + PAGE_SIZE < matching.length}
            onPrev={() => setPage((current) => current - 1)}
            onNext={() => setPage((current) => current + 1)}
          />
        }
      />
    </>
  );
}

function peopleTable() {
  return screen.getByRole('table', { name: 'People' });
}

function shownNames(selectable = false) {
  return within(peopleTable())
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[selectable ? 1 : 0].textContent);
}

describe('Table paged by Pagination', () => {
  test('the footer arrows swap the rows on screen and move the readout with them', async () => {
    const user = userEvent.setup();
    renderApp(<PagedPeople />);
    await settle();

    expect(shownNames()).toEqual(['Person 1', 'Person 2', 'Person 3', 'Person 4']);
    expect(nav('People rows').textContent).toContain('1-4');
    expect(nav('People rows').textContent).toContain('of 10');
    expect(prevButton().disabled).toBe(true);

    await user.click(nextButton());
    await settle();

    expect(shownNames()).toEqual(['Person 5', 'Person 6', 'Person 7', 'Person 8']);
    expect(nav('People rows').textContent).toContain('5-8');
    expect(prevButton().disabled).toBe(false);
    expect(nextButton().disabled).toBe(false);
  });

  test('the last page shows the remainder and closes the next cursor', async () => {
    const user = userEvent.setup();
    renderApp(<PagedPeople />);
    await settle();

    await user.click(nextButton());
    await settle();
    await user.click(nextButton());
    await settle();

    expect(shownNames()).toEqual(['Person 9', 'Person 10']);
    expect(nav('People rows').textContent).toContain('9-10');
    expect(nextButton().disabled).toBe(true);
    expect(prevButton().disabled).toBe(false);

    await user.click(prevButton());
    await settle();
    await user.click(prevButton());
    await settle();

    expect(shownNames()).toEqual(['Person 1', 'Person 2', 'Person 3', 'Person 4']);
    expect(prevButton().disabled).toBe(true);
  });

  test('sorting orders the page on screen and stays put while paging', async () => {
    const user = userEvent.setup();
    renderApp(<PagedPeople />);
    await settle();

    await user.click(screen.getByRole('button', { name: 'Visits' }));
    await settle();

    expect(shownNames()).toEqual(['Person 3', 'Person 1', 'Person 4', 'Person 2']);

    await user.click(nextButton());
    await settle();

    expect(shownNames()).toEqual(['Person 7', 'Person 5', 'Person 8', 'Person 6']);
  });

  test('rows selected on one page are still selected when the page comes back', async () => {
    const user = userEvent.setup();
    renderApp(<PagedPeople selectable />);
    await settle();

    const boxes = () => within(peopleTable()).getAllByRole('checkbox', { name: 'Select row' }) as HTMLInputElement[];
    await user.click(boxes()[1]);
    await settle();
    expect(boxes().map((box) => box.checked)).toEqual([false, true, false, false]);

    await user.click(nextButton());
    await settle();
    expect(shownNames(true)).toEqual(['Person 5', 'Person 6', 'Person 7', 'Person 8']);
    expect(boxes().map((box) => box.checked)).toEqual([false, false, false, false]);

    await user.click(prevButton());
    await settle();
    expect(boxes().map((box) => box.checked)).toEqual([false, true, false, false]);
  });

  test('a filter that shrinks the data below the current page lands on the first page of what is left', async () => {
    const user = userEvent.setup();
    renderApp(<PagedPeople />);
    await settle();

    await user.click(nextButton());
    await settle();
    await user.click(nextButton());
    await settle();
    expect(shownNames()).toEqual(['Person 9', 'Person 10']);

    await user.type(screen.getByLabelText('Filter people'), 'Person 1');
    await settle();

    expect(shownNames()).toEqual(['Person 1', 'Person 10']);
    expect(nav('People rows').textContent).toContain('1-2');
    expect(nav('People rows').textContent).toContain('of 2');
    expect(prevButton().disabled).toBe(true);
    expect(nextButton().disabled).toBe(true);
  });

  test('a filter that matches nothing empties the table and closes both cursors', async () => {
    const user = userEvent.setup();
    renderApp(<PagedPeople />);
    await settle();

    await user.type(screen.getByLabelText('Filter people'), 'nobody');
    await settle();

    expect(within(peopleTable()).getAllByRole('cell')).toHaveLength(1);
    expect(screen.getByText('Nothing to show')).toBeDefined();
    expect(nav('People rows').textContent).toContain('of 0');
    expect(prevButton().disabled).toBe(true);
    expect(nextButton().disabled).toBe(true);
  });
});
