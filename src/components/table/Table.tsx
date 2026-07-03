'use client';

/* Table - opinionated data table: columns + rows in; owns sort, selection, sticky header, pinned column, motion. */

import './table.css';
import * as React from 'react';
import { motion } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';

const { useState, useRef, useEffect, useMemo } = React;

export type TableAlign = 'start' | 'end' | 'center';
export type TableHideBelow = 'sm' | 'md';

export interface TableColumn<Row = any> {
  /** Unique column id; also the default data accessor (row[key]). */
  key: string;
  label?: React.ReactNode;
  /** Cell + header alignment. Default 'start'. */
  align?: TableAlign;
  /** Mono + tabular numerals (timestamps, counts, IDs - section E). */
  mono?: boolean;
  /** Identity emphasis: strong text, medium weight. */
  strong?: boolean;
  /** The one greedy column - absorbs slack width. Others size to content. */
  grow?: boolean;
  /** Header becomes a sort control. Sort is local; asc - desc, no third state. */
  sortable?: boolean;
  /** Sort accessor: a row property name, or a function. Defaults to row[key]. */
  sortBy?: string | ((row: Row) => unknown);
  /** Collapse this column below a container breakpoint (30rem / 42rem). */
  hideBelow?: TableHideBelow;
  /** Custom cell renderer. Defaults to row[key]. */
  render?: (row: Row) => React.ReactNode;
}

export interface TableSort {
  key: string;
  dir: 'asc' | 'desc';
}

export interface TableProps<Row = any> {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** Row identity property. Default 'id'. Must be unique and stable. */
  rowKey?: string;
  /** aria-label for the <table>. */
  label?: string;

  /** Checkbox column + bulk bar. Selection is a Set of row keys, owned here. */
  selectable?: boolean;
  onSelectionChange?: (keys: Array<string | number>) => void;
  /** Rendered in the bulk bar between the count and the built-in Clear. */
  bulkActions?: (keys: Array<string | number>, clear: () => void) => React.ReactNode;
  /** Per-row checkbox aria-label. Default 'Select row'. */
  selectionLabel?: (row: Row) => string;

  /** Initial sort; sorting stays local and uncontrolled after that. */
  defaultSort?: TableSort | null;
  /** Notification only - fires after the local sort updates. */
  onSortChange?: (sort: TableSort) => void;

  /** Row rhythm. Default 'cozy' (46px rows); 'compact' is 38px. */
  density?: 'cozy' | 'compact';
  /** Pin checkbox + first column under horizontal overflow. Default true. */
  pinFirst?: boolean;

  /** Rows recede and go inert (list-fetch convention). */
  loading?: boolean;
  /** Shown when rows is empty and not loading. Default 'Nothing to show'. */
  empty?: React.ReactNode;
  /** Footer strip - pagination, summaries. */
  footer?: React.ReactNode;

  /** Makes rows clickable (checkbox cell excluded). */
  onRowClick?: (row: Row) => void;
  /** Size the table here - the internal scroller absorbs the constraint. */
  className?: string;
}

/* numbers compare numerically, else natural-order text; null/undefined sink to the end */
function tblCompare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

interface TblCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  ariaLabel?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

/* the Checkbox primitive's exact DOM minus label - its CSS state machine paints it */
function TblCheckbox({ checked, indeterminate, ariaLabel, onChange, onClick }: TblCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate, checked]);
  return (
    <label className="cbx tbl__cbx">
      <input
        ref={ref}
        type="checkbox"
        className="cbx__input"
        checked={checked}
        aria-label={ariaLabel}
        onChange={onChange}
        onClick={onClick}
      />
      <span className="cbx__box" aria-hidden="true">
        <svg className="cbx__mark" viewBox="0 0 16 16" fill="none">
          <path className="cbx__tick" d="M3.5 8.5 L6.75 11.5 L12.5 4.75"></path>
        </svg>
        <span className="cbx__dash"></span>
      </span>
    </label>
  );
}

/* count odometer - reuses badge.css's .odo vocabulary: each digit clips a 0-9 strip */
const TBL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function TblOdo({ value }: { value: number }) {
  const str = String(value);
  return (
    <span className="odo" role="text" aria-label={str}>
      {str.split('').map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="odo__col" aria-hidden="true">
            <span className={'odo__strip odo__strip--' + ch}>
              {TBL_DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} className="odo__fixed" aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export function Table<Row = any>({
  columns = [],
  rows = [],
  rowKey = 'id',
  label,
  selectable = false,
  onSelectionChange,
  bulkActions,
  selectionLabel,
  defaultSort = null,
  onSortChange,
  density = 'cozy',
  pinFirst = true,
  loading = false,
  empty,
  footer,
  onRowClick,
  className = '',
}: TableProps<Row>) {
  const [sort, setSort] = useState<TableSort | null>(defaultSort);
  const [selected, setSelected] = useState<Set<string | number>>(() => new Set());
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastIdxRef = useRef(-1); // anchor for shift-click ranges
  const shiftRef = useRef(false); // shift held on the click that fired change
  const lastCountRef = useRef(0); // freezes the bulk count during its exit fade

  const keyOf = (row: Row): string | number => (row as Record<string, string | number>)[rowKey];

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const get =
      typeof col.sortBy === 'function'
        ? col.sortBy
        : col.sortBy
          ? (r: Row) => (r as Record<string, unknown>)[col.sortBy as string]
          : (r: Row) => (r as Record<string, unknown>)[col.key];
    const dir = sort.dir === 'desc' ? -1 : 1;
    return rows.slice().sort((a, b) => dir * tblCompare(get(a), get(b)));
  }, [rows, columns, sort]);

  function cycleSort(col: TableColumn<Row>) {
    const next: TableSort =
      sort && sort.key === col.key
        ? { key: col.key, dir: sort.dir === 'asc' ? 'desc' : 'asc' }
        : { key: col.key, dir: 'asc' };
    setSort(next);
    if (onSortChange) onSortChange(next);
  }

  const allSelected = sortedRows.length > 0 && sortedRows.every((r) => selected.has(keyOf(r)));
  const someSelected = selected.size > 0 && !allSelected;

  function commitSelection(next: Set<string | number>) {
    setSelected(next);
    if (onSelectionChange) onSelectionChange(Array.from(next));
  }
  function clearSelection() {
    lastIdxRef.current = -1;
    commitSelection(new Set());
  }
  function toggleAll() {
    const next = new Set<string | number>();
    if (!allSelected) sortedRows.forEach((r) => next.add(keyOf(r)));
    commitSelection(next);
  }
  function toggleRow(idx: number) {
    const next = new Set(selected);
    const on = !next.has(keyOf(sortedRows[idx]));
    if (shiftRef.current && lastIdxRef.current >= 0 && lastIdxRef.current !== idx) {
      const lo = Math.min(lastIdxRef.current, idx);
      const hi = Math.max(lastIdxRef.current, idx);
      for (let i = lo; i <= hi; i++) {
        const k = keyOf(sortedRows[i]);
        if (on) next.add(k);
        else next.delete(k);
      }
    } else if (on) {
      next.add(keyOf(sortedRows[idx]));
    } else {
      next.delete(keyOf(sortedRows[idx]));
    }
    lastIdxRef.current = idx;
    shiftRef.current = false;
    commitSelection(next);
  }

  /* live scroll - data attrs that CSS reads for header elevation, pin cast, edge fades */
  useEffect(() => {
    const el = scrollRef.current;
    const w = wrapRef.current;
    if (!el || !w) return;
    const set = (attr: string, on: boolean) => {
      if (on) w.setAttribute(attr, '');
      else w.removeAttribute(attr);
    };
    const sync = () => {
      set('data-scrolled', el.scrollTop > 0);
      set('data-x-back', el.scrollLeft > 1);
      set('data-x-more', el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', sync);
      ro.disconnect();
    };
  }, []);

  function cellMods(col: TableColumn<Row>, i: number) {
    const a: string[] = [];
    if (col.align === 'end') a.push('tbl__cell--end');
    if (col.align === 'center') a.push('tbl__cell--center');
    if (col.grow) a.push('tbl__cell--grow');
    if (col.hideBelow) a.push('tbl__cell--hide-' + col.hideBelow);
    if (pinFirst && i === 0) {
      a.push('tbl__cell--pin', 'tbl__cell--pinEdge');
      if (selectable) a.push('tbl__cell--pinOff');
    }
    return a;
  }

  const t = UIMotion.t;
  const colCount = columns.length + (selectable ? 1 : 0);
  const showEmpty = !loading && sortedRows.length === 0;
  const checkCellCls = 'tbl__cell--check' + (pinFirst ? ' tbl__cell--pin' : '');

  /* one persistent node, CSS open/close - AnimatePresence ghosted here; count frozen so exit doesn't roll to 0 */
  const bulkOpen = selectable && selected.size > 0;
  if (selected.size > 0) lastCountRef.current = selected.size;

  const rootCls = [
    'tbl',
    density === 'compact' ? 'tbl--compact' : '',
    pinFirst ? 'tbl--pin' : '',
    loading ? 'tbl--loading' : '',
    onRowClick ? 'tbl--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={wrapRef} className={rootCls}>
      {selectable ? (
        <div
          className="tbl__bulk"
          data-open={bulkOpen ? '' : undefined}
          aria-hidden={bulkOpen ? undefined : true}
          role="toolbar"
          aria-label="Selection actions"
        >
          <TblCheckbox
            checked={allSelected}
            indeterminate={someSelected}
            ariaLabel="Select all rows"
            onChange={toggleAll}
          />
          <span className="tbl__bulkCount" aria-live="polite" aria-atomic="true">
            <TblOdo value={bulkOpen ? selected.size : lastCountRef.current} />
            <span> selected</span>
          </span>
          <span className="tbl__bulkSpacer"></span>
          {bulkActions ? bulkActions(Array.from(selected), clearSelection) : null}
          <button type="button" className="btn btn--ghost btn--sm" onClick={clearSelection}>
            Clear
          </button>
        </div>
      ) : null}

      <div className="tbl__viewport">
        <div className="tbl__scroll" ref={scrollRef}>
          <table className="tbl__table" aria-label={label} aria-busy={loading || undefined}>
            <thead>
              <tr>
                {selectable ? (
                  <th scope="col" className={checkCellCls}>
                    <TblCheckbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      ariaLabel="Select all rows"
                      onChange={toggleAll}
                    />
                  </th>
                ) : null}
                {columns.map((c, i) => {
                  const active = sort && sort.key === c.key;
                  const cls = (c.sortable ? ['tbl__cell--sortable'] : []).concat(cellMods(c, i));
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      className={cls.join(' ')}
                      aria-sort={
                        active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined
                      }
                    >
                      {c.sortable ? (
                        <button type="button" className="tbl__sort" onClick={() => cycleSort(c)}>
                          <span className="tbl__sortLbl">{c.label}</span>
                          <span
                            className={
                              'tbl__sortIcon' +
                              (active ? ' is-on' : '') +
                              (active && sort.dir === 'desc' ? ' is-desc' : '')
                            }
                            aria-hidden="true"
                          >
                            <Icon name="arrow-up" size="sm" />
                          </span>
                        </button>
                      ) : c.label != null ? (
                        <span className="tbl__hLbl">{c.label}</span>
                      ) : null}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {showEmpty ? (
                <tr>
                  <td colSpan={colCount} className="tbl__emptyCell">
                    {empty != null ? empty : 'Nothing to show'}
                  </td>
                </tr>
              ) : (
                sortedRows.map((row, idx) => {
                  const k = keyOf(row);
                  const isSel = selected.has(k);
                  return (
                    <motion.tr
                      key={k}
                      layout="position"
                      transition={t.layout}
                      className="tbl__row"
                      data-selected={isSel ? '' : undefined}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {selectable ? (
                        <td className={checkCellCls} onClick={(e) => e.stopPropagation()}>
                          <TblCheckbox
                            checked={isSel}
                            ariaLabel={selectionLabel ? selectionLabel(row) : 'Select row'}
                            onClick={(e) => {
                              shiftRef.current = e.shiftKey;
                            }}
                            onChange={() => toggleRow(idx)}
                          />
                        </td>
                      ) : null}
                      {columns.map((c, i) => (
                        <td
                          key={c.key}
                          className={cellMods(c, i)
                            .concat(c.mono ? ['tbl__cell--mono'] : [])
                            .concat(c.strong ? ['tbl__cell--strong'] : [])
                            .join(' ')}
                        >
                          {c.render
                            ? c.render(row)
                            : (row as Record<string, React.ReactNode>)[c.key]}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="tbl__edge tbl__edge--l" aria-hidden="true"></div>
        <div className="tbl__edge tbl__edge--r" aria-hidden="true"></div>
      </div>

      {footer ? <div className="tbl__foot">{footer}</div> : null}
    </div>
  );
}
