'use client';

// RadioGroup.tsx — single-select.
// Pick exactly one of a small, closed set. Two skins share one anatomy:
//   variant="rows"  (default) — quiet dot + label (+ optional description)
//   variant="cards"           — bordered selectable tiles (+ optional icon)
//
// Built on native <input type="radio">, so the browser gives roving tabindex +
// arrow-key cycling for free; we only compose class names + the icon weight.
// All styling lives in radio-group.css. A constrained-choice control carries
// only a single group-level `error` (required) + disabled — no warning/success
// (CLAUDE.md A4). Numbers in labels/descriptions should be --font-mono.
//
// SELECTION + MOTION: a group has exactly ONE selection, so the filled centre
// is a SINGLE marker that GLIDES from the old dot to the new — "nothing
// teleports." This was a hand-rolled FLIP (rect capture + WAAPI tween); it is
// now ONE Motion `layoutId` — Motion does the measure/invert/play, scoped per
// group by <LayoutGroup id>. The marker still rests dead-centre by pure CSS
// (inset:0 + margin:auto), so if the tween never runs it's still concentric.
// The .is-selected class (React-rendered) drives the highlight — NOT CSS
// :checked/:has(), which radios don't reliably invalidate on the implicit
// sibling-uncheck. The native input stays for semantics, focus & keyboard.

import * as React from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { Icon } from '../icon/Icon';
import { UIMotion } from '../../tokens/motion-tokens';

const SM = UIMotion;

export interface RadioOption {
  /** The stored value — what `onChange` returns and `value` matches. */
  value: string;
  /** Visible label (sentence case). */
  label: React.ReactNode;
  /** Optional secondary line (muted) explaining the choice. */
  description?: React.ReactNode;
  /** Leading icon — an <Icon> name. CARDS only; ignored for rows. Fill weight when selected. */
  icon?: string;
  /** Disable just this option. */
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange'
> {
  /** Shared radio name — ties the options into one keyboard group. Required. */
  name: string;
  /** The selected value (controlled). */
  value?: string;
  /** Called with the chosen option's `value`. */
  onChange?: (value: string) => void;
  /** Group label / legend (sentence case). */
  label?: React.ReactNode;
  /** Persistent context shown under the legend, before the options. */
  helper?: React.ReactNode;
  /** Group-level error (e.g. required). Sets the error state + reveals the message. */
  error?: React.ReactNode;
  /** Show a danger `*` after the label. */
  required?: boolean;
  /** Show a muted "(optional)" after the label. */
  optional?: boolean;
  /** Skin: quiet rows (default) or selectable cards. */
  variant?: 'rows' | 'cards';
  /** Lay options out in a line instead of a stack. */
  orientation?: 'vertical' | 'horizontal';
  /** Control size: sm (dot 16) · md (default, dot 18). */
  size?: 'sm' | 'md';
  /** Disable the whole group. */
  disabled?: boolean;
  /** The options to choose between. */
  options: RadioOption[];
  className?: string;
}

function RadioGroup({
  name,
  value,
  onChange,
  label,
  helper,
  error,
  required,
  optional,
  variant = 'rows',
  orientation = 'vertical',
  size = 'md',
  disabled,
  options = [],
  className = '',
  ...rest
}: RadioGroupProps) {
  const groupId = React.useId();

  const cls = [
    'rg',
    variant === 'cards' ? 'rg--cards' : '',
    orientation === 'horizontal' ? 'rg--horizontal' : '',
    size === 'sm' ? 'rg--sm' : '',
    error ? 'is-error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <fieldset className={cls} aria-invalid={error ? true : undefined} {...rest}>
      {label && (
        <div className="rg__head">
          <legend className="rg__label">
            {label}
            {required && (
              <span className="rg__req" aria-hidden="true">
                *
              </span>
            )}
            {optional && <span className="rg__optional">(optional)</span>}
          </legend>
          {helper && <p className="rg__helper">{helper}</p>}
        </div>
      )}

      <LayoutGroup id={groupId}>
        <div className="rg__options">
          {options.map((opt) => {
            const selected = opt.value === value;
            const isDisabled = disabled || opt.disabled;
            return (
              <label
                key={opt.value}
                className={[
                  'rg-opt',
                  selected ? 'is-selected' : '',
                  isDisabled ? 'is-disabled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  className="rg-opt__input"
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={selected}
                  disabled={isDisabled}
                  onChange={() => onChange && onChange(opt.value)}
                />
                {variant === 'cards' && opt.icon && (
                  <span className="rg-opt__icon">
                    <Icon name={opt.icon} weight={selected ? 'fill' : 'regular'} />
                  </span>
                )}
                <span className="rg-opt__control">
                  <span className="rg-opt__dot">
                    {selected && (
                      <motion.span
                        className="rg__marker"
                        layoutId="marker"
                        transition={SM.t.layout}
                        aria-hidden="true"
                      ></motion.span>
                    )}
                  </span>
                </span>
                <span className="rg-opt__body">
                  <span className="rg-opt__label">{opt.label}</span>
                  {opt.description && <span className="rg-opt__desc">{opt.description}</span>}
                </span>
              </label>
            );
          })}
        </div>
      </LayoutGroup>

      <div
        className={'collapse collapse--fade rg__msg-wrap'}
        data-open={error ? 'true' : 'false'}
        data-axis="height"
      >
        <div className="collapse__inner">
          <div className="rg__msg">
            <Icon name="failed" size="sm" weight="fill" />
            {error}
          </div>
        </div>
      </div>
    </fieldset>
  );
}

export { RadioGroup };
