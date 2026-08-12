'use client';

import './input.css';
import { useRef } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/icon/Icon';
import { IconSlot } from '../../internal/icon/IconSlot';
import { FieldLabel, FieldMessage, resolveFieldMessage, type FieldMessagingProps } from './field-chrome';
import type { DataAttributes } from '../../../dom-props';
import { cx } from '../../internal/utils/cx';

/** The native <input> props TextField surfaces at the top level (the rest live in `htmlProps`). */
type TextFieldNative = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'placeholder'
  | 'value'
  | 'onChange'
  | 'disabled'
  | 'readOnly'
  | 'maxLength'
  | 'minLength'
  | 'hidden'
  | 'pattern'
  | 'onKeyDown'
>;

interface TextFieldOwnProps extends FieldMessagingProps, TextFieldNative {
  /** Leading icon - your own icon node (sized to the control). Decorative. */
  leadingIcon?: ReactNode;
  /** Show a clear button when there's a value. */
  clearable?: boolean;
  /** Control height: sm 28 - md 36 (default) - lg 40. */
  size?: 'sm' | 'md' | 'lg';
  /** Extra class(es) merged onto the field root. */
  className?: string;
  /** Inline styles merged onto the field root. */
  style?: CSSProperties;
  /** Available text like types */
  type?: 'text' | 'search' | 'email' | 'url' | 'password';
}

export interface TextFieldProps extends TextFieldOwnProps {
  /** Standard <input> attributes (name, autoComplete, maxLength, aria-*, ...) forwarded to the input. */
  htmlProps?: Omit<InputHTMLAttributes<HTMLInputElement>, keyof TextFieldOwnProps | 'size'> & DataAttributes;
}

export function TextField({
  label,
  helper,
  error,
  warning,
  success,
  leadingIcon,
  clearable,
  size,
  value,
  htmlProps,
  className,
  style,
  optional,
  ...rest
}: TextFieldProps) {
  const { state, msg, msgIcon } = resolveFieldMessage(error, warning, success, helper);
  const inputRef = useRef<HTMLInputElement>(null);
  const showClear = clearable && value;

  function clear() {
    const el = inputRef.current;
    if (!el) return;
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    setValue.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.focus();
  }
  const cls = cx(
    'fld',
    size === 'sm' ? 'fld--sm' : size === 'lg' ? 'fld--lg' : '',
    leadingIcon && 'fld--has-lead',
    showClear && 'fld--has-action',
    state,
    className,
  );

  return (
    <div className={cls} style={style}>
      <FieldLabel id={rest.id} label={label} required={rest.required} optional={optional} />
      <div className="fld__control">
        {leadingIcon && (
          <span className="fld__icon fld__icon--lead">
            <IconSlot size={size}>{leadingIcon}</IconSlot>
          </span>
        )}
        <input
          ref={inputRef}
          className="fld__input"
          value={value}
          aria-invalid={error ? true : undefined}
          {...rest}
          {...htmlProps}
        />
        {showClear && (
          <button type="button" className="fld__action" aria-label="Clear" onClick={clear}>
            <Icon name="close" size={size} />
          </button>
        )}
      </div>
      <FieldMessage message={msg} icon={msgIcon} />
    </div>
  );
}
