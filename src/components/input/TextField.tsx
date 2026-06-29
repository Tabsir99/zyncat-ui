'use client';

// TextField.tsx — base text input.
// Label · control · message, with leading icon, optional clear action, sizes,
// and error/warning/success states. Styling lives in input.css; this composes
// classes only. Color/size come from tokens.

import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../icon/Icon';
import { IconSlot } from '../icon/IconSlot';
import { Collapse } from '../motion/Collapse';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field id, ties the label to the input. */
  id?: string;
  /** Label text (sentence case). */
  label?: ReactNode;
  /** Show a danger `*` after the label. */
  required?: boolean;
  /** Show a muted "(optional)" after the label. */
  optional?: boolean;
  /** Neutral helper text — shown when there's no validation message. */
  helper?: ReactNode;
  /** Error message — sets the error state (red border/ring + icon). Wins over warning/success/helper. */
  error?: ReactNode;
  /** Warning message — amber state. */
  warning?: ReactNode;
  /** Success message — green state. */
  success?: ReactNode;
  /** Leading icon — your own icon node (sized to the control). Decorative. */
  leadingIcon?: ReactNode;
  /** Show a clear (×) button when there's a value. */
  clearable?: boolean;
  /** Control height: sm 28 · md 36 (default) · lg 40. */
  size?: 'sm' | 'md' | 'lg';
}

export function TextField({
  id,
  label,
  required,
  optional,
  placeholder,
  helper,
  error,
  warning,
  success,
  leadingIcon,
  clearable,
  size,
  value,
  onChange,
  disabled,
  readOnly,
  type = 'text',
  className = '',
  ...rest
}: TextFieldProps) {
  const state = error ? 'is-error' : warning ? 'is-warning' : success ? 'is-success' : '';
  const msg = error || warning || success || helper;
  const msgIcon = error ? 'warning-circle' : warning ? 'warning' : success ? 'check-circle' : null;
  const showClear = clearable && value;
  const cls = [
    'fld',
    size === 'sm' ? 'fld--sm' : size === 'lg' ? 'fld--lg' : '',
    leadingIcon ? 'fld--has-lead' : '',
    showClear ? 'fld--has-action' : '',
    state,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {label && (
        <label className="fld__label" htmlFor={id}>
          {label}
          {required && (
            <span className="fld__req" aria-hidden="true">
              *
            </span>
          )}
          {optional && <span className="fld__optional">(optional)</span>}
        </label>
      )}
      <div className="fld__control">
        {leadingIcon && (
          <span className="fld__icon fld__icon--lead">
            <IconSlot>{leadingIcon}</IconSlot>
          </span>
        )}
        <input
          id={id}
          className="fld__input"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        {showClear && (
          <button
            type="button"
            className="fld__action"
            aria-label="Clear"
            onClick={() =>
              onChange && onChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
            }
          >
            <Icon name="close" />
          </button>
        )}
      </div>
      <Collapse open={!!msg} className="fld__msg-wrap">
        <div className="fld__msg">
          {msgIcon && <Icon name={msgIcon} size="sm" weight="fill" />}
          {msg}
        </div>
      </Collapse>
    </div>
  );
}
