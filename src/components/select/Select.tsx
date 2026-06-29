'use client';

/* Select.tsx — Select, SINGLE-select (custom listbox).
   ─────────────────────────────────────────────────────────────────────────
   Pick ONE option; committing closes the menu and returns focus. Optional
   type-to-filter (`searchable`). For picking SEVERAL, use <MultiSelect>
   (same domain, own component — CLAUDE.md A9): different value shape, commit
   semantics, trigger summary and row indicator, so it is not a flag here.

   All listbox machinery (keyboard model, placement, dismiss, focus seeding)
   comes from select-core — this file owns only single-selection state and
   the menu markup. Styling is select.css; classes + data-* flags only. */
import * as React from 'react';
import {
  useControllable,
  normalize,
  matches,
  useSelectMenu,
  SelectTrigger,
  SelectMenu,
  SearchField,
  FilterRow,
  EmptyRow,
  LoadingRows,
  type SelectOption,
  type SelectGroup,
} from './select-core';
import { Icon } from '../icon/Icon';

export interface SelectProps {
  options: SelectOption[] | SelectGroup[];
  /** Controlled value. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string, option: SelectOption) => void;
  placeholder?: string;
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  /** Danger ring + border. */
  invalid?: boolean;
  /** Skeleton rows in the menu; trigger reads "Loading…". */
  loading?: boolean;
  /** Type-to-filter field pinned above the list. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Phosphor / alias glyph pinned before the trigger label (otherwise the
      selected option's own icon shows). */
  leadingIcon?: string | null;
  id?: string;
  ariaLabel?: string;
}

export function Select({
  options = [],
  value: controlledValue,
  defaultValue = null,
  onChange,
  placeholder = 'Select an option',
  size = 'default',
  disabled = false,
  invalid = false,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Filter options',
  leadingIcon = null,
  id,
  ariaLabel,
}: SelectProps) {
  const { useState, useRef, useEffect, useId } = React;
  const [value, setValue] = useControllable<string | null>(
    controlledValue,
    defaultValue,
    onChange as ((next: string | null, opt?: SelectOption) => void) | undefined,
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const triggerRef = useRef<HTMLButtonElement>(null),
    listRef = useRef<HTMLDivElement>(null),
    searchRef = useRef<HTMLInputElement>(null);
  const baseId = id || 'select-' + useId();
  const menuId = baseId + '-menu';
  const listId = baseId + '-list';

  const { groups, flat } = normalize(options);
  const selected = flat.find((o) => o.value === value) || null;
  const isSelected = (v: string) => v === value && value != null;
  const navItems: SelectOption[] = [];
  groups.forEach((g) =>
    g.options.forEach((o) => {
      if (matches(o, query)) navItems.push(o);
    }),
  );

  const show = () => {
    if (!disabled && !loading) setOpen(true);
  };
  const hide = () => setOpen(false);
  const returnFocus = () => triggerRef.current && triggerRef.current.focus();

  // single-select commit: set, close, hand focus back
  function commit(opt: SelectOption) {
    if (!opt || opt.disabled) return;
    setValue(opt.value, opt);
    hide();
    returnFocus();
  }

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]); // filter resets on close

  const { activeIdx, setActiveIdx, onMenuKeyDown } = useSelectMenu({
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

  const isPlaceholder = !loading && !selected;
  const adId = open && activeIdx >= 0 ? baseId + '-opt-' + activeIdx : undefined;
  let vIdx = -1;

  return (
    <div
      className="select"
      data-size={size === 'default' ? undefined : size}
      data-open={open ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      data-invalid={invalid ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
    >
      <SelectTrigger
        triggerRef={triggerRef}
        baseId={baseId}
        open={open}
        disabled={disabled}
        invalid={invalid}
        ariaLabel={ariaLabel}
        adId={adId}
        show={show}
        hide={hide}
        leading={leadingIcon || (selected && selected.icon) || null}
        text={loading ? 'Loading…' : isPlaceholder ? placeholder : selected.label}
        isPlaceholder={isPlaceholder}
      />

      <SelectMenu open={open} menuId={menuId}>
        {searchable && !loading && (
          <SearchField
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
          tabIndex={-1}
          aria-label={ariaLabel}
          onKeyDown={searchable ? undefined : onMenuKeyDown}
        >
          {loading ? (
            <LoadingRows />
          ) : (
            <React.Fragment>
              {groups.map((g, gi) => (
                <div
                  className="select__group"
                  role="group"
                  aria-label={g.label || undefined}
                  key={gi}
                >
                  {g.label && g.options.some((o) => matches(o, query)) && (
                    <div className="select__group-label">{g.label}</div>
                  )}
                  {g.options.map((opt) => {
                    const visible = matches(opt, query);
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
                          {isSel && <Icon key="on" name="check" size="sm" weight="bold" />}
                        </span>
                      </div>
                    );
                    // filterable rows ease out via Collapse; plain lists skip the wrapper
                    return searchable ? (
                      <FilterRow key={opt.value} visible={visible}>
                        {row}
                      </FilterRow>
                    ) : (
                      row
                    );
                  })}
                </div>
              ))}
              {navItems.length === 0 && <EmptyRow query={query} />}
            </React.Fragment>
          )}
        </div>
      </SelectMenu>
    </div>
  );
}
