'use client';

// RadioGroup - single-select rows or cards. The rows' hover fill is a shared glide pill
// (../motion/glide); the marker dot and the cards' fill/hover glide between options via
// Motion layoutId (kept inside each card - its own bg/transform layering needs them there).

import './radio-group.css';
import { useId, useRef, useState, type CSSProperties, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { Icon } from '../../internal/icon/Icon';
import { IconSlot } from '../../internal/icon/IconSlot';
import { Collapse } from '../../../motion/Collapse';
import { GlidePill, useGlide, useLayoutSelfHeal } from '../../../motion/glide';
import { UIMotion } from '../../../tokens/motion-tokens';
import type { DataAttributes } from '../../../dom-props';

const SM = UIMotion;

export interface RadioOption {
  /** The stored value - what `onChange` returns and `value` matches. */
  value: string;
  /** Visible label (sentence case). */
  label: ReactNode;
  /** Optional secondary line (muted) explaining the choice. */
  description?: ReactNode;
  /** Leading icon - your own node. CARDS only; ignored for rows. */
  icon?: ReactNode;
  /** Disable just this option. */
  disabled?: boolean;
}

interface RadioGroupOwnProps {
  /** Shared radio name - ties the options into one keyboard group. Required. */
  name: string;
  /** The selected value (controlled). */
  value?: string;
  /** Called with the chosen option's `value`. */
  onChange?: (value: string) => void;
  /** Group label / legend (sentence case). */
  label?: ReactNode;
  /** Persistent context shown under the legend, before the options. */
  helper?: ReactNode;
  /** Group-level error (e.g. required). Sets the error state + reveals the message. */
  error?: ReactNode;
  /** Show a danger `*` after the label. */
  required?: boolean;
  /** Show a muted "(optional)" after the label. */
  optional?: boolean;
  /** Skin: quiet rows (default) or selectable cards. */
  variant?: 'rows' | 'cards';
  /** Lay options out in a line instead of a stack. */
  orientation?: 'vertical' | 'horizontal';
  /** Control size: sm (dot 16) - md (default, dot 18). */
  size?: 'sm' | 'md';
  /** Disable the whole group. */
  disabled?: boolean;
  /** The options to choose between. */
  options: RadioOption[];
  /** Extra class(es) merged onto the root element. */
  className?: string;
  /** Inline styles merged onto the root element. */
  style?: CSSProperties;
}

export interface RadioGroupProps extends RadioGroupOwnProps {
  /** Standard <fieldset> attributes (aria-*, data-*, ...) forwarded to the root. */
  htmlProps?: Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, keyof RadioGroupOwnProps> & DataAttributes;
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
  style,
  htmlProps,
}: RadioGroupProps) {
  const groupId = useId();
  /* cards keep hovered state for their layoutId spans; rows drive the glide pill directly */
  const [hovered, setHovered] = useState<string | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const glide = useGlide(optionsRef);
  const healMarker = useLayoutSelfHeal<HTMLSpanElement>();
  const healFill = useLayoutSelfHeal<HTMLSpanElement>();
  const healHover = useLayoutSelfHeal<HTMLSpanElement>();

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
    <fieldset className={cls} style={style} aria-invalid={error ? true : undefined} {...htmlProps}>
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
        <div
          className="rg__options"
          ref={optionsRef}
          onPointerLeave={() => {
            glide.leave();
            setHovered(null);
          }}
        >
          {variant === 'rows' && <GlidePill className="rg__hover" rect={glide.rect} active={glide.active} />}
          {options.map((opt) => {
            const selected = opt.value === value;
            const isDisabled = disabled || opt.disabled;
            return (
              <label
                key={opt.value}
                className={['rg-opt', selected ? 'is-selected' : '', isDisabled ? 'is-disabled' : '']
                  .filter(Boolean)
                  .join(' ')}
                onPointerEnter={
                  isDisabled
                    ? undefined
                    : variant === 'rows'
                      ? (e) => glide.enter(e.currentTarget)
                      : () => setHovered(opt.value)
                }
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
                {variant === 'cards' && hovered === opt.value && !selected && (
                  <motion.span
                    className="rg__card-hover"
                    layoutId="card-hover"
                    layout="position"
                    transition={SM.t.layout}
                    aria-hidden="true"
                    ref={healHover.ref}
                    onLayoutAnimationComplete={healHover.onLayoutAnimationComplete}
                  ></motion.span>
                )}
                {variant === 'cards' && selected && (
                  <motion.span
                    className="rg__card-fill"
                    layoutId="card-fill"
                    transition={SM.t.layout}
                    aria-hidden="true"
                    ref={healFill.ref}
                    onLayoutAnimationComplete={healFill.onLayoutAnimationComplete}
                  ></motion.span>
                )}
                {variant === 'cards' && opt.icon && (
                  <span className="rg-opt__icon">
                    <IconSlot>{opt.icon}</IconSlot>
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
                        ref={healMarker.ref}
                        onLayoutAnimationComplete={healMarker.onLayoutAnimationComplete}
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

      <Collapse open={!!error} fade className="rg__msg-wrap">
        <div className="rg__msg">
          <Icon name="warning-circle" size="sm" weight="fill" />
          {error}
        </div>
      </Collapse>
    </fieldset>
  );
}

export { RadioGroup };
