'use client';

import './checkbox.css';
import type { ChangeEventHandler, CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import { CheckGlyph } from './check-glyph';
import type { DataAttributes } from '../../../dom-props';
import { cx } from '../../internal/utils/cx';

interface CheckboxOwnProps {
  /** Controlled checked state. Omit for uncontrolled (use `defaultChecked`). */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  /** Indeterminate - the "some, not all" select-all state; visually wins over `checked`. @default false */
  indeterminate?: boolean;
  /** Single error state for consent gates ("you must agree"); also sets `aria-invalid`. @default false */
  error?: boolean;
  /** Disabled - inert and de-emphasized (distinct fill when checked). */
  disabled?: boolean;
  /** Box size: `md` 18px - `sm` 16px for dense table rows. @default 'md' */
  size?: 'sm' | 'md';
  /** Label text beside the box. */
  label?: ReactNode;
  /** Optional secondary line under the label (settings rows). */
  description?: ReactNode;
  /** Fires on toggle - read `e.target.checked`. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Extra class(es) merged onto the root label. */
  className?: string;
  /** Inline styles merged onto the root label. */
  style?: CSSProperties;
}

export interface CheckboxProps extends CheckboxOwnProps {
  /** Standard <input> attributes (name, value, required, aria-*, ...) forwarded to the checkbox input. */
  htmlProps?: Omit<InputHTMLAttributes<HTMLInputElement>, keyof CheckboxOwnProps | 'type'> & DataAttributes;
}

export function Checkbox({
  checked,
  defaultChecked,
  indeterminate = false,
  error = false,
  disabled = false,
  size = 'md',
  label,
  description,
  className = '',
  style,
  onChange,
  htmlProps,
}: CheckboxProps) {
  const cls = cx('cbx', size === 'sm' && 'cbx--sm', error && 'cbx--error', disabled && 'cbx--disabled', className);

  const controlled = checked !== undefined;
  const checkedProps = controlled ? { checked } : { defaultChecked };

  return (
    <label className={cls} style={style}>
      <CheckGlyph
        indeterminate={indeterminate}
        disabled={disabled}
        aria-invalid={error || undefined}
        onChange={onChange}
        {...checkedProps}
        {...htmlProps}
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
