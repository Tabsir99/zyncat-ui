'use client';

// Checkbox - checkbox primitive; on/off + indeterminate select-all.

import './checkbox.css';
import * as React from 'react';
import { CheckGlyph } from './check-glyph';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Controlled checked state. Omit for uncontrolled (use `defaultChecked`). */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  /** Indeterminate - the "some, not all" select-all state; visually wins over `checked`. @default false */
  indeterminate?: boolean;
  /** Single error state for consent gates ("you must agree"); also sets `aria-invalid`. @default false */
  invalid?: boolean;
  /** Disabled - inert and de-emphasized (distinct fill when checked). */
  disabled?: boolean;
  /** Box size: `md` 18px - `sm` 16px for dense table rows. @default 'md' */
  size?: 'sm' | 'md';
  /** Label text beside the box. */
  label?: React.ReactNode;
  /** Optional secondary line under the label (settings rows). */
  description?: React.ReactNode;
  /** Fires on toggle - read `e.target.checked`. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function Checkbox({
  checked,
  defaultChecked,
  indeterminate = false,
  invalid = false,
  disabled = false,
  size = 'md',
  label,
  description,
  className = '',
  onChange,
  ...rest
}: CheckboxProps) {
  const classes = [
    'cbx',
    size === 'sm' ? 'cbx--sm' : '',
    invalid ? 'cbx--invalid' : '',
    disabled ? 'cbx--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const controlled = checked !== undefined;
  const checkedProps = controlled ? { checked } : { defaultChecked };

  return (
    <label className={classes}>
      <CheckGlyph
        indeterminate={indeterminate}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={onChange}
        {...checkedProps}
        {...rest}
      />
      {label || description ? (
        <span className="cbx__text">
          {label ? <span className="cbx__label">{label}</span> : null}
          {description ? <span className="cbx__desc">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
