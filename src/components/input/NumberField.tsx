'use client';

// NumberField.tsx - numeric input: tabular figures, caret steppers, unit suffix, min/max clamp, arrow stepping.

import './input.css';
import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { Icon } from '../icon/Icon';

export interface NumberFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'onChange' | 'min' | 'max' | 'step'
> {
  /** Id wired to the input and the label's `htmlFor`. */
  id?: string;
  /** Label text (sentence case). */
  label?: ReactNode;
  /** Neutral helper text - shown below when there's no error. */
  helper?: ReactNode;
  /** Error message + error state. */
  error?: ReactNode;
  /** Unit suffix shown inside the field (e.g. "days", "%"). */
  unit?: string;
  /** Minimum value - typed and stepped values clamp up to this; the decrease stepper disables here. @default 0 */
  min?: number;
  /** Maximum value - typed and stepped values clamp down to this; the increase stepper disables here. @default Infinity */
  max?: number;
  /** Amount added/removed per ArrowUp/ArrowDown press and per caret stepper click. @default 1 */
  step?: number;
  /** Controlled numeric value. */
  value?: number | string;
  /** Called with the next clamped number. */
  onChange?: (value: number) => void;
  /** Control height: sm - md (default) - lg. */
  size?: 'sm' | 'md' | 'lg';
}

export function NumberField({
  id,
  label,
  helper,
  error,
  unit,
  min = 0,
  max = Infinity,
  step = 1,
  value,
  onChange,
  size,
  className = '',
  ...rest
}: NumberFieldProps) {
  const v = parseInt((value ?? 0) as any, 10) || 0;
  const set = (n: number) => onChange && onChange(Math.min(max, Math.max(min, n)));
  const cls = [
    'fld',
    'numf',
    unit ? 'numf--unit' : '',
    size === 'sm' ? 'fld--sm' : size === 'lg' ? 'fld--lg' : '',
    error ? 'is-error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {label && (
        <label className="fld__label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="fld__control">
        <input
          id={id}
          className="fld__input"
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            set(parseInt(e.target.value.replace(/[^\d]/g, '') || '0', 10))
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              set(v + step);
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              set(v - step);
            }
          }}
          {...rest}
        />
        {unit && <span className="numf__unit">{unit}</span>}
        <div className="numf__steppers">
          <button
            type="button"
            className="numf__step"
            aria-label="Increase"
            disabled={v >= max}
            onClick={() => set(v + step)}
          >
            <Icon name="caret-up" size="sm" />
          </button>
          <button
            type="button"
            className="numf__step"
            aria-label="Decrease"
            disabled={v <= min}
            onClick={() => set(v - step)}
          >
            <Icon name="caret-down" size="sm" />
          </button>
        </div>
      </div>
      {(error || helper) && (
        <div className="fld__msg">
          {error && <Icon name="warning-circle" size="sm" weight="fill" />}
          {error || helper}
        </div>
      )}
    </div>
  );
}
