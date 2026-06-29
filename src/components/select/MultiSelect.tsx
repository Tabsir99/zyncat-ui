'use client';

/* MultiSelect.tsx — MultiSelect (custom listbox, many-of).
   ─────────────────────────────────────────────────────────────────────────
   Pick SEVERAL options; committing TOGGLES a row and the menu stays open.
   Value is an array; the trigger summarises as "first label +N"; each row
   carries the real Checkbox VISUAL (components/checkbox/checkbox.css —
   same fill-spring + tick-draw, zero CSS duplicated; the row keeps listbox
   semantics, the checkbox is decorative). Optional type-to-filter.

   Sibling of <Select> (single) per CLAUDE.md A9: own state shape, own commit
   semantics, own indicator — shared listbox machinery from select-core.
   Styling is select.css ([data-multiple] block); classes + data-* flags only. */
import * as React from 'react';
import {
  useControllable as useMsControllable,
  normalize as msNormalize,
  matches as msMatches,
  useSelectMenu as useMsMenu,
  SelectTrigger as MsTrigger,
  SelectMenu as MsMenu,
  SearchField as MsSearchField,
  FilterRow as MsFilterRow,
  EmptyRow as MsEmptyRow,
  LoadingRows as MsLoadingRows,
  type SelectOption,
  type SelectGroup,
} from './select-core';
import { Icon } from '../icon/Icon';

export interface MultiSelectProps {
  options: SelectOption[] | SelectGroup[];
  /** Controlled value. */
  value?: string[];
  defaultValue?: string[];
  /** Fires with the NEXT array and the option that was toggled. */
  onChange?: (value: string[], toggled: SelectOption) => void;
  placeholder?: string;
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  leadingIcon?: string | null;
  id?: string;
  ariaLabel?: string;
}

/* The decorative tick — the Checkbox visual, driven by this row's selection. */
function CheckboxTick({ checked }: { checked: boolean }) {
  return (
    <span className="cbx" aria-hidden="true">
      <input type="checkbox" className="cbx__input" tabIndex={-1} checked={checked} readOnly />
      <span className="cbx__box">
        <svg className="cbx__mark" viewBox="0 0 16 16" fill="none">
          <path className="cbx__tick" d="M3.5 8.5 L6.75 11.5 L12.5 4.75" />
        </svg>
        <span className="cbx__dash"></span>
      </span>
    </span>
  );
}

export function MultiSelect({
  options = [],
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = 'Select options',
  size = 'default',
  disabled = false,
  invalid = false,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Filter options',
  leadingIcon = null,
  id,
  ariaLabel,
}: MultiSelectProps) {
  const { useState, useRef, useEffect, useId } = React;
  const [value, setValue] = useMsControllable<string[]>(
    controlledValue,
    defaultValue,
    onChange as ((next: string[], opt?: SelectOption) => void) | undefined,
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const triggerRef = useRef<HTMLButtonElement>(null),
    listRef = useRef<HTMLDivElement>(null),
    searchRef = useRef<HTMLInputElement>(null);
  const baseId = id || 'mselect-' + useId();
  const menuId = baseId + '-menu';
  const listId = baseId + '-list';

  const { groups, flat } = msNormalize(options);
  const values = Array.isArray(value) ? value : [];
  const isSelected = (v: string) => values.indexOf(v) !== -1;
  const selectedOptions = flat.filter((o) => isSelected(o.value));
  const navItems: SelectOption[] = [];
  groups.forEach((g) =>
    g.options.forEach((o) => {
      if (msMatches(o, query)) navItems.push(o);
    }),
  );

  const show = () => {
    if (!disabled && !loading) setOpen(true);
  };
  const hide = () => setOpen(false);
  const returnFocus = () => triggerRef.current && triggerRef.current.focus();

  // multi-select commit: TOGGLE the row, keep the menu open
  function commit(opt: SelectOption) {
    if (!opt || opt.disabled) return;
    const next = isSelected(opt.value)
      ? values.filter((v) => v !== opt.value)
      : [...values, opt.value];
    setValue(next, opt);
  }

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]); // filter resets on close

  const { activeIdx, setActiveIdx, onMenuKeyDown } = useMsMenu({
    open,
    close: hide,
    returnFocus,
    triggerRef,
    listRef,
    searchRef,
    menuId,
    navItems,
    isSelected,
    commit,
    searchable,
  });

  const isPlaceholder = !loading && selectedOptions.length === 0;
  const adId = open && activeIdx >= 0 ? baseId + '-opt-' + activeIdx : undefined;
  let vIdx = -1;

  return (
    <div
      className="select"
      data-multiple="true"
      data-size={size === 'default' ? undefined : size}
      data-open={open ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      data-invalid={invalid ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
    >
      <MsTrigger
        triggerRef={triggerRef}
        baseId={baseId}
        open={open}
        disabled={disabled}
        invalid={invalid}
        ariaLabel={ariaLabel}
        adId={adId}
        show={show}
        hide={hide}
        leading={leadingIcon || (selectedOptions.length === 1 && selectedOptions[0].icon) || null}
        text={loading ? 'Loading…' : isPlaceholder ? placeholder : selectedOptions[0].label}
        isPlaceholder={isPlaceholder}
        count={selectedOptions.length - 1}
      />

      <MsMenu open={open} menuId={menuId}>
        {searchable && !loading && (
          <MsSearchField
            searchRef={searchRef}
            query={query}
            onQuery={setQuery}
            onKeyDown={onMenuKeyDown}
            placeholder={searchPlaceholder}
            listId={listId}
            adId={adId}
          />
        )}

        <div
          className="select__list"
          ref={listRef}
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          tabIndex={-1}
          aria-label={ariaLabel}
          onKeyDown={searchable ? undefined : onMenuKeyDown}
        >
          {loading ? (
            <MsLoadingRows />
          ) : (
            <React.Fragment>
              {groups.map((g, gi) => (
                <div
                  className="select__group"
                  role="group"
                  aria-label={g.label || undefined}
                  key={gi}
                >
                  {g.label && g.options.some((o) => msMatches(o, query)) && (
                    <div className="select__group-label">{g.label}</div>
                  )}
                  {g.options.map((opt) => {
                    const visible = msMatches(opt, query);
                    const i = visible ? ((vIdx += 1), vIdx) : -1;
                    const isSel = isSelected(opt.value);
                    const row = (
                      <div
                        key={opt.value}
                        id={visible ? baseId + '-opt-' + i : undefined}
                        data-idx={visible ? i : undefined}
                        className="select__option"
                        role="option"
                        aria-selected={isSel}
                        aria-hidden={!visible || undefined}
                        aria-disabled={opt.disabled || undefined}
                        data-selected={isSel ? 'true' : undefined}
                        data-active={visible && i === activeIdx ? 'true' : undefined}
                        data-disabled={opt.disabled ? 'true' : undefined}
                        onMouseEnter={() => visible && !opt.disabled && setActiveIdx(i)}
                        onMouseDown={(e) => e.preventDefault() /* keep focus on list */}
                        onClick={() => visible && commit(opt)}
                      >
                        {opt.icon && (
                          <span className="select__option-icon">
                            <Icon name={opt.icon} size="sm" weight={isSel ? 'fill' : 'regular'} />
                          </span>
                        )}
                        <span className="select__option-text">
                          <span className="select__option-label">{opt.label}</span>
                          {opt.description && (
                            <span className="select__option-desc">{opt.description}</span>
                          )}
                        </span>
                        <span className="select__option-check">
                          <CheckboxTick checked={isSel} />
                        </span>
                      </div>
                    );
                    return searchable ? (
                      <MsFilterRow key={opt.value} visible={visible}>
                        {row}
                      </MsFilterRow>
                    ) : (
                      row
                    );
                  })}
                </div>
              ))}
              {navItems.length === 0 && <MsEmptyRow query={query} />}
            </React.Fragment>
          )}
        </div>
      </MsMenu>
    </div>
  );
}
