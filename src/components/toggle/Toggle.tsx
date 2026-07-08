'use client';

// Toggle - binary on/off switch for an immediate setting (vs. Checkbox, which stages a choice).

import './toggle.css';
import { useState, type ChangeEvent, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode } from 'react';
import { useControllable } from '../use-controllable';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Controlled checked state. Omit for uncontrolled (use `defaultChecked`). */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  /** Disabled - inert and de-emphasized (faded track, retains its position). */
  disabled?: boolean;
  /** Track size: `md` 36x20 - `sm` 28x16 for dense settings/table rows. @default 'md' */
  size?: 'sm' | 'md';
  /** Label text beside the track. */
  label?: ReactNode;
  /** Optional secondary line under the label (settings rows). */
  description?: ReactNode;
  /** Fires on flip - read `e.target.checked`. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
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
  /* public onChange keeps the DOM-event contract, so it forwards here instead of riding the hook */
  const [isOn, setOn] = useControllable(checked, !!defaultChecked);

  const classes = ['sw', size === 'sm' ? 'sw--sm' : '', disabled ? 'sw--disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  const [pressed, setPressed] = useState(false);
  function press(on: boolean) {
    return () => {
      if (!disabled) setPressed(on);
    };
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setOn(e.target.checked);
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
