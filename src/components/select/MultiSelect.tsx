'use client';

/* MultiSelect - many-of custom listbox; committing toggles a row, the menu stays open. */
import './select.css';
import type { ReactNode } from 'react';
import { useControllable } from '../use-controllable';
import { CheckGlyph } from '../checkbox/check-glyph';
import {
  useListbox,
  ListboxPanel,
  SelectTrigger,
  type SelectOption,
  type SelectGroup,
} from './select-core';

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
  leadingIcon?: ReactNode;
  /** Base id for the trigger/menu/list ids and a11y wiring; auto-generated if omitted. */
  id?: string;
  /** Accessible name for the trigger and listbox - supply when there is no visible label. */
  ariaLabel?: string;
}

/* Decorative row tick - CheckGlyph carries checkbox.css into this graph. */
function CheckboxTick({ checked }: { checked: boolean }) {
  return (
    <span className="cbx" aria-hidden="true">
      <CheckGlyph checked={checked} readOnly tabIndex={-1} />
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
  const [value, setValue] = useControllable<string[], SelectOption>(
    controlledValue,
    defaultValue,
    onChange as ((next: string[], opt?: SelectOption) => void) | undefined,
  );
  const values = Array.isArray(value) ? value : [];
  const isSelected = (v: string) => values.indexOf(v) !== -1;

  const lb = useListbox({
    options,
    disabled,
    loading,
    searchable,
    id,
    idPrefix: 'mselect-',
    isSelected,
    onCommit: (opt) =>
      setValue(
        isSelected(opt.value) ? values.filter((v) => v !== opt.value) : [...values, opt.value],
        opt,
      ),
    closeOnCommit: false,
  });

  const selectedOptions = lb.flat.filter((o) => isSelected(o.value));
  const isPlaceholder = !loading && selectedOptions.length === 0;

  return (
    <div
      className="select"
      data-multiple="true"
      data-size={size === 'default' ? undefined : size}
      data-open={lb.open ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      data-invalid={invalid ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
    >
      <SelectTrigger
        triggerRef={lb.triggerRef}
        baseId={lb.baseId}
        open={lb.open}
        disabled={disabled}
        invalid={invalid}
        ariaLabel={ariaLabel}
        adId={lb.adId}
        show={lb.show}
        hide={lb.hide}
        leading={leadingIcon || (selectedOptions.length === 1 && selectedOptions[0].icon) || null}
        text={loading ? 'Loading...' : isPlaceholder ? placeholder : selectedOptions[0].label}
        isPlaceholder={isPlaceholder}
        count={selectedOptions.length - 1}
      />
      <ListboxPanel
        lb={lb}
        loading={loading}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        ariaLabel={ariaLabel}
        multiple
        check={(sel) => <CheckboxTick checked={sel} />}
      />
    </div>
  );
}
