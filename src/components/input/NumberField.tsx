'use client';

// NumberField.tsx - numeric input: tabular figures, caret steppers, unit suffix, min/max clamp, arrow stepping.

import './input.css';
import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../icon/Icon';
import { FieldLabel, FieldMessage } from './field-chrome';
import { useControllable } from '../use-controllable';

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
  /** Minimum value - steps and committed typing clamp up to this; the decrease stepper disables here. @default 0 */
  min?: number;
  /** Maximum value - steps and committed typing clamp down to this; the increase stepper disables here. @default Infinity */
  max?: number;
  /** Amount added/removed per ArrowUp/ArrowDown press and per caret stepper click. Decimals work. @default 1 */
  step?: number;
  /** Controlled numeric value. Omit for uncontrolled (use `defaultValue`). */
  value?: number | string;
  /** Uncontrolled initial value. Use instead of `value`. @default 0 */
  defaultValue?: number;
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
  defaultValue = 0,
  onChange,
  size,
  className = '',
  ...rest
}: NumberFieldProps) {
  const controlled =
    value === undefined ? undefined : typeof value === 'number' ? value : parseFloat(value) || 0;
  const [num, setNum] = useControllable<number>(controlled, defaultValue, onChange);
  /* free-typing draft: clamping every keystroke makes "50" untypable under min=10, so the
     raw text lives here while focused; commits (blur / Enter / any step) clamp and clear it. */
  const [draft, setDraft] = useState<string | null>(null);
  const v = draft !== null ? parseFloat(draft) || 0 : num;
  const snap = (n: number) => parseFloat(n.toFixed(10)); /* kill float drift on decimal steps */
  const clamp = (n: number) => Math.min(max, Math.max(min, snap(n)));
  const commit = (n: number) => {
    setDraft(null);
    setNum(clamp(n));
  };
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
      <FieldLabel id={id} label={label} />
      <div className="fld__control">
        <input
          id={id}
          className="fld__input"
          type="text"
          inputMode="decimal"
          value={draft !== null ? draft : String(num)}
          onChange={(e) => {
            const text = e.target.value.replace(/[^\d.-]/g, '');
            setDraft(text);
            /* live (clamped) for controlled parents; the visible text stays on the draft */
            setNum(clamp(parseFloat(text) || 0));
          }}
          onBlur={() => commit(v)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              commit(v + step);
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              commit(v - step);
            }
            if (e.key === 'Enter') commit(v);
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
            onClick={() => commit(v + step)}
          >
            <Icon name="caret-up" size="sm" />
          </button>
          <button
            type="button"
            className="numf__step"
            aria-label="Decrease"
            disabled={v <= min}
            onClick={() => commit(v - step)}
          >
            <Icon name="caret-down" size="sm" />
          </button>
        </div>
      </div>
      <FieldMessage message={error || helper} icon={error ? 'warning-circle' : null} />
    </div>
  );
}
