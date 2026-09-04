'use client';

import './input.css';

import { useId, useState } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { useControllable } from '../../internal/hooks/use-controllable';
import { Icon } from '../../internal/icon/Icon';
import { cx } from '../../internal/utils/cx';
import {
  FieldLabel,
  FieldMessage,
  fieldMessageId,
  joinIds,
  type FieldCoreMessagingProps,
  type FieldIdProps,
} from './field-chrome';

interface NumberFieldOwnProps extends FieldIdProps, FieldCoreMessagingProps {
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
  /** Disabled - the input and both steppers go inert. */
  disabled?: boolean;
  /** Control height: sm - md (default) - lg. */
  size?: 'sm' | 'md' | 'lg';
  /** Extra class(es) merged onto the field root. */
  className?: string;
  /** Inline styles merged onto the field root. */
  style?: CSSProperties;
}

export interface NumberFieldProps extends NumberFieldOwnProps {
  /** Standard <input> attributes (name, aria-*, ...) forwarded to the input. */
  htmlProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    keyof NumberFieldOwnProps | 'size' | 'value' | 'onChange' | 'min' | 'max' | 'step'
  > &
    DataAttributes;
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
  disabled,
  size,
  className = '',
  style,
  htmlProps,
}: NumberFieldProps) {
  const autoId = useId();
  const message = error || helper;
  const msgId = fieldMessageId(id ?? autoId, message);
  const resolvedValue = value === undefined ? undefined : typeof value === 'number' ? value : parseFloat(value) || 0;
  const [num, setNum] = useControllable<number>(resolvedValue, defaultValue, onChange);
  const [draft, setDraft] = useState<string | null>(null);
  const v = draft !== null ? parseFloat(draft) || 0 : num;
  const snap = (n: number) => parseFloat(n.toFixed(10));
  const clamp = (n: number) => Math.min(max, Math.max(min, snap(n)));
  const commit = (n: number) => {
    setDraft(null);
    setNum(clamp(n));
  };
  const cls = cx(
    'zc-fld',
    'zc-numf',
    unit && 'zc-numf--unit',
    size === 'sm' ? 'zc-fld--sm' : size === 'lg' ? 'zc-fld--lg' : '',
    error && 'zc-is-error',
    className,
  );

  return (
    <div className={cls} style={style}>
      <FieldLabel id={id} label={label} />
      <div className="zc-fld__control">
        <input
          id={id}
          className="zc-fld__input"
          type="text"
          inputMode="decimal"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          value={draft !== null ? draft : String(num)}
          onChange={(e) => {
            const text = e.target.value.replace(/[^\d.-]/g, '');
            setDraft(text);
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
          {...htmlProps}
          aria-describedby={joinIds(msgId, htmlProps?.['aria-describedby'])}
        />
        {unit && <span className="zc-numf__unit">{unit}</span>}
        <div className="zc-numf__steppers">
          <button
            type="button"
            className="zc-numf__step"
            aria-label="Increase"
            disabled={disabled || v >= max}
            onClick={() => commit(v + step)}
          >
            <Icon name="caret-up" size="sm" />
          </button>
          <button
            type="button"
            className="zc-numf__step"
            aria-label="Decrease"
            disabled={disabled || v <= min}
            onClick={() => commit(v - step)}
          >
            <Icon name="caret-down" size="sm" />
          </button>
        </div>
      </div>
      <FieldMessage id={msgId} message={message} icon={error ? 'warning-circle' : null} />
    </div>
  );
}
