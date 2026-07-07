'use client';

/* Select - single-select custom listbox; committing closes the menu and returns focus. */
import './select.css';
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
import { GlidePill, useGlide } from '../motion/glide';
import { Icon } from '../icon/Icon';
import { IconSlot } from '../icon/IconSlot';

/* Option shapes belong to this subpath's public API; select-core is not an entry point. */
export type { SelectOption, SelectGroup } from './select-core';

export interface SelectProps {
  /** The choices - a flat `SelectOption[]`, or `SelectGroup[]` to render labeled sections. @default [] */
  options: SelectOption[] | SelectGroup[];
  /** Controlled value - matches an option's `value`, or `null` for none. Omit for uncontrolled (use `defaultValue`). */
  value?: string | null;
  /** Initial value when uncontrolled. @default null */
  defaultValue?: string | null;
  /** Fires on commit - gets the new `value` and its full `SelectOption`. Committing closes the menu. */
  onChange?: (value: string, option: SelectOption) => void;
  /** Trigger text when nothing is selected. @default 'Select an option' */
  placeholder?: string;
  /** Control height. @default 'default' */
  size?: 'sm' | 'default' | 'lg';
  /** Disabled - trigger is inert and the menu cannot open. @default false */
  disabled?: boolean;
  /** Danger ring + border. @default false */
  invalid?: boolean;
  /** Skeleton rows in the menu; trigger reads "Loading...". @default false */
  loading?: boolean;
  /** Type-to-filter field pinned above the list. @default false */
  searchable?: boolean;
  /** Placeholder for the `searchable` filter input. @default 'Filter options' */
  searchPlaceholder?: string;
  /** Your own icon node pinned before the trigger label; else the selected option's icon. */
  leadingIcon?: React.ReactNode;
  /** Base id for the trigger/menu/list ids and a11y wiring; auto-generated if omitted. */
  id?: string;
  /** Accessible name for the trigger and listbox - supply when there is no visible label. */
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
  const glide = useGlide(listRef);

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

  function commit(opt: SelectOption) {
    if (!opt || opt.disabled) return;
    setValue(opt.value, opt);
    hide();
    returnFocus();
  }

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

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

  // Drive the glide pill from the active row. It lives in the scroll list (not per-option), so it
  // is never clipped by the searchable rows' collapse wrapper and animates real size between rows.
  React.useLayoutEffect(() => {
    const list = listRef.current;
    const el =
      open &&
      activeIdx >= 0 &&
      list &&
      list.querySelector<HTMLElement>('[data-idx="' + activeIdx + '"]');
    if (el) glide.enter(el);
    else glide.leave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIdx, query]);

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
        text={loading ? 'Loading...' : isPlaceholder ? placeholder : selected.label}
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
          <GlidePill className="select__glide" rect={glide.rect} active={glide.active} />
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
                            <IconSlot size="sm">{opt.icon}</IconSlot>
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
