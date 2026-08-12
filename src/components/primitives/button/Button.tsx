'use client';

import './button.css';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode, Ref } from 'react';
import type { DataAttributes } from '../../../dom-props';
import { cx } from '../../internal/utils/cx';

interface ButtonOwnProps {
  /** Visual weight / intent. `unstyled` emits base chrome only (sizing, focus ring,
   *  layout) with no skin - for local re-skins via `className`, e.g. Alert's tone action. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link' | 'unstyled';
  /** Forwarded to the underlying <button> (React 19 ref-as-prop). */
  ref?: Ref<HTMLButtonElement>;
  /** Control height. sm 28px - md 36px (default) - lg 40px. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'icon';
  /** `submit` / `reset` / `button`. @default 'button' */
  type?: 'button' | 'submit' | 'reset';
  /** Disable the control (also implied by `loading`). */
  disabled?: boolean;
  /** Loading - swaps content for a spinner and makes the button inert. */
  loading?: boolean;
  /** Leading icon node (e.g. a 16px <Icon>). Sized & aligned by the component. */
  iconLeft?: ReactNode;
  /** Trailing icon node. */
  iconRight?: ReactNode;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  /** Extra class(es) merged onto the button. */
  className?: string;
  /** Inline styles merged onto the button. */
  style?: CSSProperties;
  /** Button label. */
  children?: ReactNode;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Pointer handler */
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
}

type ButtonRestProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & DataAttributes;

export interface ButtonProps extends ButtonOwnProps, ButtonRestProps {
  /** Standard <button> attributes (onClick, name, form, aria-*, data-*, ...) forwarded verbatim.
   *  Bare `<button>` attributes also pass through directly; `htmlProps` wins on conflict. */
  htmlProps?: ButtonRestProps;
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  className = '',
  style,
  children,
  onClick,
  ref,
  onPointerDown,
  htmlProps,
  ...rest
}: ButtonProps) {
  const cls = cx(
    'btn',
    variant !== 'unstyled' && `btn--${variant}`,
    size !== 'md' && `btn--${size}`,
    fullWidth && 'btn--block',
    loading && 'is-loading',
    className,
  );

  return (
    <button
      type={type}
      ref={ref}
      className={cls}
      style={style}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      onPointerDown={onPointerDown}
      {...rest}
      {...htmlProps}
    >
      {iconLeft ? (
        <span className="btn__icon" aria-hidden="true">
          {iconLeft}
        </span>
      ) : null}
      <span className="btn__label">{children}</span>
      {iconRight ? (
        <span className="btn__icon" aria-hidden="true">
          {iconRight}
        </span>
      ) : null}
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
    </button>
  );
}
