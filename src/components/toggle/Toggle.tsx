'use client';

// Toggle - binary on/off switch for an immediate setting (vs. Checkbox, which stages a choice).

import './toggle.css';
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
  /** Disabled - inert and de-emphasized (faded track, retains its position). */
  disabled?: boolean;
  /** Track size: `md` 36x20 - `sm` 28x16 for dense settings/table rows. @default 'md' */
  size?: 'sm' | 'md';
  /** Label text beside the track. */
  label?: React.ReactNode;
  /** Optional secondary line under the label (settings rows). */
  description?: React.ReactNode;
  /** Fires on flip - read `e.target.checked`. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function Toggle({
  checked,
  defaultChecked = false,
  disabled = false,
  size = 'md',
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
