'use client';

// Button - primitive; composes button.css classes, renders icons, manages loading.

import './button.css';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight / intent. `unstyled` emits base chrome only (sizing, focus ring,
   *  layout) with no skin - for local re-skins via `className`, e.g. Alert's tone action. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link' | 'unstyled';
  /** Forwarded to the underlying <button> (React 19 ref-as-prop). */
  ref?: Ref<HTMLButtonElement>;
  /** Control height. sm 28px - md 36px (default) - lg 40px. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Loading - swaps content for a spinner and makes the button inert. */
  loading?: boolean;
  /** Leading icon node (e.g. a 16px <Icon>). Sized & aligned by the component. */
  iconLeft?: ReactNode;
  /** Trailing icon node. */
  iconRight?: ReactNode;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
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
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    variant !== 'unstyled' ? `btn--${variant}` : '',
    size !== 'md' ? `btn--${size}` : '',
    fullWidth ? 'btn--block' : '',
    loading ? 'is-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
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
