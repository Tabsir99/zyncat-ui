'use client';

// Toggle.tsx — switch.
// ─────────────────────────────────────────────────────────────────────────
// A binary on/off control for an IMMEDIATE setting — flipping it actuates state
// now (enable sync, archive an item, mute alerts). For a choice you stage
// and submit later, that's a Checkbox.
//
// MOTION — the thumb's travel and press-stretch are a CSS spring transition on
// `transform` (toggle.css), driven by React-set hooks on the track:
//   • data-on      → slides the thumb across (translateX 0 → TRAVEL)
//   • data-pressed → momentary scaleX while held
// Position is owned SOLELY by data-on (a React render), so there's no competing
// CSS `:has(:checked)` flip to move the thumb out from under the transition and
// make it snap. The brand's decelerate-and-settle comes from --ease-spring;
// reduced motion collapses the duration automatically (tokens/motion.css). This
// is a small, fixed transform — the same pure-CSS class as Input / Button — so
// it stays off the Motion engine and out of its dev tooling.
//
// The native <input type="checkbox"> stays (focus, keyboard, form value); the
// component mirrors checked state into React so a render drives the transition.

import * as React from 'react';

const { useState } = React;

export interface ToggleProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Controlled checked state. Omit for uncontrolled (use `defaultChecked`). */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  /** Disabled — inert and de-emphasized (faded track, retains its position). */
  disabled?: boolean;
  /**
   * Track size. `md` 36×20 (default) · `sm` 28×16 for dense settings/table rows.
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /** Label text beside the track. */
  label?: React.ReactNode;
  /** Optional secondary line under the label (settings rows). */
  description?: React.ReactNode;
  /** Fires on flip — read `e.target.checked`. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function Toggle({
  checked, // controlled; omit for uncontrolled
  defaultChecked = false,
  disabled = false,
  size = 'md', // 'sm' | 'md'
  label,
  description,
  className = '',
  onChange,
  ...rest
}: ToggleProps) {
  const controlled = checked !== undefined;
  const [internal, setInternal] = useState(!!defaultChecked);
  const isOn = controlled ? !!checked : internal;

  const classes = ['sw', size === 'sm' ? 'sw--sm' : '', disabled ? 'sw--disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  const [pressed, setPressed] = useState(false);
  function press(on: boolean) {
    return () => {
      if (!disabled) setPressed(on);
    };
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!controlled) setInternal(e.target.checked);
    if (onChange) onChange(e);
  }

  return (
    <label
      className={classes}
      onPointerDown={press(true)}
      onPointerUp={press(false)}
      onPointerLeave={press(false)}
      onPointerCancel={press(false)}
    >
      <input
        type="checkbox"
        role="switch"
        className="sw__input"
        disabled={disabled}
        checked={isOn}
        onChange={handleChange}
        {...rest}
        defaultChecked={undefined}
      />
      <span
        className="sw__track"
        data-on={isOn ? 'true' : undefined}
        data-pressed={pressed ? 'true' : undefined}
        aria-hidden="true"
      >
        <span className="sw__thumb"></span>
      </span>
      {label || description ? (
        <span className="sw__text">
          {label ? <span className="sw__label">{label}</span> : null}
          {description ? <span className="sw__desc">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
