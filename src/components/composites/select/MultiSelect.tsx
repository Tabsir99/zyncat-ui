'use client';

import './select.css';
import type { HTMLAttributes, ReactNode } from 'react';
import { useControllable } from '../../internal/hooks/use-controllable';
import { CheckGlyph } from '../../primitives/checkbox/check-glyph';
import { useListbox, ListboxPanel, SelectTrigger, type SelectOption, type SelectGroup } from './core';
import type { DisableableAnimation } from '../../../motion/timing';
import type { DataAttributes } from '../../../dom-props';
import { cx } from '../../internal/utils/cx';

export type { SelectOption, SelectGroup } from './core';

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
  /** Control height. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
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
  /** Standard <div> attributes (className, style, data-*, ...) forwarded to the select root. */
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  /** Menu open/close timing - motion tokens only, or `null` to disable. @default duration 'base' + ease 'entrance'/'exit' */
  animation?: DisableableAnimation;
}

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
  size = 'md',
  disabled = false,
  invalid = false,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Filter options',
  leadingIcon = null,
  id,
  ariaLabel,
  htmlProps,
  animation,
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
      setValue(isSelected(opt.value) ? values.filter((v) => v !== opt.value) : [...values, opt.value], opt),
    closeOnCommit: false,
  });

  const selectedOptions = lb.flat.filter((o) => isSelected(o.value));
  const isPlaceholder = !loading && selectedOptions.length === 0;

  return (
    <div
      {...htmlProps}
      className={cx('select', htmlProps?.className)}
      data-multiple="true"
      data-size={size}
      data-open={lb.open ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      data-invalid={invalid ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
    >
      <SelectTrigger
        lb={lb}
        disabled={disabled}
        invalid={invalid}
        ariaLabel={ariaLabel}
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
        animation={animation}
        size={size}
        check={(sel) => <CheckboxTick checked={sel} />}
      />
    </div>
  );
}
