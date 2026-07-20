'use client';

// TextField.tsx - text input: label - control - message, leading icon, clear action, sizes, validation states.

import './input.css';
import { useRef } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/icon/Icon';
import { IconSlot } from '../../internal/icon/IconSlot';
import { FieldLabel, FieldMessage, resolveFieldMessage, type FieldMessagingProps } from './field-chrome';
import type { DataAttributes } from '../../../dom-props';

/** The native <input> props TextField surfaces at the top level (the rest live in `htmlProps`). */
type TextFieldNative = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'placeholder' | 'value' | 'onChange' | 'disabled' | 'readOnly' | 'type'
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
}

export interface TextFieldProps extends TextFieldOwnProps {
  /** Standard <input> attributes (name, autoComplete, maxLength, aria-*, ...) forwarded to the input. */
  htmlProps?: Omit<InputHTMLAttributes<HTMLInputElement>, keyof TextFieldOwnProps | 'size'> & DataAttributes;
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
  style,
  htmlProps,
}: TextFieldProps) {
  const { state, msg, msgIcon } = resolveFieldMessage(error, warning, success, helper);
  const inputRef = useRef<HTMLInputElement>(null);
  const showClear = clearable && value;

  /* Clear by writing the input through the native value setter and dispatching a real
     `input` event - React synthesizes a genuine ChangeEvent (currentTarget, preventDefault
     and friends all real, unlike a hand-built {target:{value}} object). Focus returns to
     the input since this button unmounts the moment the value empties. */
  function clear() {
    const el = inputRef.current;
    if (!el) return;
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    setValue.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.focus();
  }
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
    <div className={cls} style={style}>
      <FieldLabel id={id} label={label} required={required} optional={optional} />
      <div className="fld__control">
        {leadingIcon && (
          <span className="fld__icon fld__icon--lead">
            <IconSlot>{leadingIcon}</IconSlot>
          </span>
        )}
        <input
          id={id}
          ref={inputRef}
          className="fld__input"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          {...htmlProps}
        />
        {showClear && (
          <button type="button" className="fld__action" aria-label="Clear" onClick={clear}>
            <Icon name="close" />
          </button>
        )}
      </div>
      <FieldMessage message={msg} icon={msgIcon} />
    </div>
  );
}
