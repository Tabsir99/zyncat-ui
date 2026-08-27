'use client';

import './select.css';

import type { HTMLAttributes, ReactNode } from 'react';

import type { DataAttributes } from '../../../dom-props';
import type { DisableableAnimation } from '../../../motion/timing';
import { useControllable } from '../../internal/hooks/use-controllable';
import { cx } from '../../internal/utils/cx';
import {
  ListboxPanel,
  SelectTrigger,
  useListbox,
  type SelectGroup,
  type SelectOption,
  type SelectTriggerHtmlProps,
} from './core';

export type { SelectOption, SelectGroup } from './core';

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
  /** Your own icon node pinned before the trigger label; else the selected option's icon. */
  leadingIcon?: ReactNode;
  /** Base id for the trigger/menu/list ids and a11y wiring; auto-generated if omitted. */
  id?: string;
  /** Accessible name for the trigger and listbox - supply when there is no visible label. */
  ariaLabel?: string;
  /** Standard <div> attributes (className, style, data-*, ...) forwarded to the select root. */
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  /** Menu open/close timing - motion tokens only, or `null` to disable. @default duration 'base' + ease 'entrance'/'exit' */
  animation?: DisableableAnimation;
  /** Standard <button> attributes (className, style, aria-*, data-*, ...) merged onto the trigger.
   *  `onClick` and `onKeyDown` run before the built-in open/close and arrow-key handling, which
   *  cannot be replaced - the trigger is the combobox. */
  triggerProps?: SelectTriggerHtmlProps;
  /** Show check icon on selected value */
  showCheck?: boolean;
}

export function Select({
  options = [],
  value: controlledValue,
  defaultValue = null,
  onChange,
  placeholder = 'Select an option',
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
  triggerProps,
  showCheck = true,
}: SelectProps) {
  const [value, setValue] = useControllable<string | null, SelectOption>(controlledValue, defaultValue, onChange);

  const lb = useListbox({
    options,
    disabled,
    loading,
    searchable,
    id,
    idPrefix: 'select-',
    isSelected: (v) => v === value && value != null,
    onCommit: (opt) => setValue(opt.value, opt),
    closeOnCommit: true,
  });

  const selected = lb.flat.find((o) => o.value === value) || null;
  const isPlaceholder = !loading && !selected;

  return (
    <div
      {...htmlProps}
      className={cx('select', htmlProps?.className)}
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
        leading={leadingIcon || (selected && selected.icon) || null}
        text={loading ? 'Loading...' : isPlaceholder ? placeholder : selected.label}
        isPlaceholder={isPlaceholder}
        {...triggerProps}
      />
      <ListboxPanel
        lb={lb}
        loading={loading}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        ariaLabel={ariaLabel}
        animation={animation}
        {...(!showCheck && { check: () => null })}
      />
    </div>
  );
}
