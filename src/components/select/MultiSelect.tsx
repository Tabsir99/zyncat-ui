'use client';

/* MultiSelect - many-of custom listbox; committing toggles a row, the menu stays open. */
import './select.css';
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
import { GlidePill, useGlide } from '../motion/glide';
import { IconSlot } from '../icon/IconSlot';

/* Option shapes belong to this subpath's public API; select-core is not an entry point. */
export type { SelectOption, SelectGroup } from './select-core';

export interface MultiSelectProps {
  /** The choices - a flat `SelectOption[]`, or `SelectGroup[]` to render labeled sections. @default [] */
  options: SelectOption[] | SelectGroup[];
  /** Controlled value - the array of selected option `value`s. Omit for uncontrolled (use `defaultValue`). */
  value?: string[];
  /** Initial selection when uncontrolled. @default [] */
  defaultValue?: string[];
  /** Fires with the NEXT array and the option that was toggled. Committing keeps the menu open. */
  onChange?: (value: string[], toggled: SelectOption) => void;
  /** Trigger text when nothing is selected. @default 'Select options' */
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
  /** Your own icon node pinned before the trigger label; else the sole selected option's icon. */
  leadingIcon?: React.ReactNode;
  /** Base id for the trigger/menu/list ids and a11y wiring; auto-generated if omitted. */
  id?: string;
  /** Accessible name for the trigger and listbox - supply when there is no visible label. */
  ariaLabel?: string;
}

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
  const glide = useGlide(listRef);

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

  function commit(opt: SelectOption) {
    if (!opt || opt.disabled) return;
    const next = isSelected(opt.value)
      ? values.filter((v) => v !== opt.value)
      : [...values, opt.value];
    setValue(next, opt);
  }

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

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

  // Glide pill lives in the scroll list (not per-option), so the searchable rows' collapse wrapper
  // never clips it; it tracks the active row and animates real size between rows.
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
        text={loading ? 'Loading...' : isPlaceholder ? placeholder : selectedOptions[0].label}
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
          <GlidePill className="select__glide" rect={glide.rect} active={glide.active} />
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
