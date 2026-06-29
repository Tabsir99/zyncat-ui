'use client';

// Checkbox.tsx — checkbox primitive.
// ─────────────────────────────────────────────────────────────────────────
// All visual polish + motion live in checkbox.css. This wrapper composes the
// token class vocabulary, renders the bespoke stroked tick + indeterminate
// dash, and bridges `indeterminate` (a DOM PROPERTY, not an attribute — it can
// only be set imperatively) onto the real <input>.
//
// Consumes ONLY the design-system token classes — no inline styles, no CSS-in-JS.
//
//   <Checkbox label="Enable notifications" defaultChecked />
//   <Checkbox label="Select all" indeterminate onChange={toggleAll} />
//   <Checkbox label="I agree to the terms" invalid required />
//   <Checkbox size="sm" label="Remember this device" description="Stays signed in on this browser." />

import * as React from 'react';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Controlled checked state. Omit for uncontrolled (use `defaultChecked`). */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  /**
   * Indeterminate — the "some, not all" state for a select-all parent. This is
   * a DOM property (not an attribute); the component sets it on the node for you.
   * Visually wins over `checked`.
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Single error state, for genuine consent gates ("you must agree"). NOT the
   * warning/success triad of a text field — a binary control carries no
   * free-text validation. Also sets `aria-invalid`.
   * @default false
   */
  invalid?: boolean;
  /** Disabled — inert and de-emphasized (distinct fill when checked). */
  disabled?: boolean;
  /**
   * Box size. `md` 18px (default) · `sm` 16px for dense table rows.
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /** Label text beside the box. */
  label?: React.ReactNode;
  /** Optional secondary line under the label (settings rows). */
  description?: React.ReactNode;
  /** Fires on toggle — read `e.target.checked`. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function Checkbox({
  checked, // controlled; omit for uncontrolled
  defaultChecked,
  indeterminate = false, // DOM property — set via ref
  invalid = false,
  disabled = false,
  size = 'md', // 'sm' | 'md'
  label,
  description,
  className = '',
  onChange,
  ...rest
}: CheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  // `indeterminate` is not an HTML attribute — push it onto the node directly.
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate, checked]);

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
      <input
        ref={ref}
        type="checkbox"
        className="cbx__input"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={onChange}
        {...checkedProps}
        {...rest}
      />
      <span className="cbx__box" aria-hidden="true">
        <svg className="cbx__mark" viewBox="0 0 16 16" fill="none">
          <path className="cbx__tick" d="M3.5 8.5 L6.75 11.5 L12.5 4.75" />
        </svg>
        <span className="cbx__dash" />
      </span>
      {label || description ? (
        <span className="cbx__text">
          {label ? <span className="cbx__label">{label}</span> : null}
          {description ? <span className="cbx__desc">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
