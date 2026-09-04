'use client';

import './radio-group.css';

import { useId, useRef, type CSSProperties, type FieldsetHTMLAttributes, type ReactNode } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { Motion } from '../../../motion/element';
import { GlidePill, useGlide } from '../../../motion/glide';
import { UIMotion } from '../../../tokens/motion-tokens';
import { Icon } from '../../internal/icon/Icon';
import { IconSlot } from '../../internal/icon/IconSlot';
import { cx } from '../../internal/utils/cx';
import { Collapse } from '../collapse/Collapse';
import type { FieldRequirementProps } from '../input/field-chrome';

const SM = UIMotion;
const LAYOUT_FLIP = { timing: SM.t.layout };

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

interface RadioGroupOwnProps extends FieldRequirementProps {
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

export function RadioGroup({
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
  const optionsRef = useRef<HTMLDivElement>(null);
  const glide = useGlide(optionsRef);

  const cls = cx(
    'zc-rg',
    variant === 'cards' && 'zc-rg--cards',
    orientation === 'horizontal' && 'zc-rg--horizontal',
    size === 'sm' && 'zc-rg--sm',
    error && 'zc-is-error',
    className,
  );

  return (
    <fieldset className={cls} style={style} aria-invalid={error ? true : undefined} {...htmlProps}>
      {label && (
        <legend className="zc-rg__label">
          {label}
          {required && (
            <span className="zc-rg__req" aria-hidden="true">
              *
            </span>
          )}
          {optional && <span className="zc-rg__optional">(optional)</span>}
        </legend>
      )}
      {label && helper && <p className="zc-rg__helper">{helper}</p>}

      <div className="zc-rg__options" ref={optionsRef} onPointerLeave={() => glide.leave()}>
        {variant === 'rows' && <GlidePill className="zc-rg__hover" glide={glide} />}
        {options.map((opt) => {
          const selected = opt.value === value;
          const isDisabled = disabled || opt.disabled;
          return (
            <label
              key={opt.value}
              className={cx('zc-rg-opt', selected && 'zc-is-selected', isDisabled && 'zc-is-disabled')}
              onPointerEnter={isDisabled || variant !== 'rows' ? undefined : (e) => glide.enter(e.currentTarget)}
            >
              <input
                className="zc-rg-opt__input"
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                required={required}
                disabled={isDisabled}
                onChange={() => onChange && onChange(opt.value)}
              />
              {variant === 'cards' && selected && (
                <Motion
                  as="span"
                  layoutId={groupId + ':card-fill'}
                  layoutTransition={LAYOUT_FLIP}
                  className="zc-rg__card-fill"
                  aria-hidden="true"
                />
              )}
              {variant === 'cards' && opt.icon && (
                <span className="zc-rg-opt__icon">
                  <IconSlot>{opt.icon}</IconSlot>
                </span>
              )}
              <span className="zc-rg-opt__control">
                <span className="zc-rg-opt__dot">
                  {selected && (
                    <Motion
                      as="span"
                      layoutId={groupId + ':marker'}
                      layoutTransition={LAYOUT_FLIP}
                      className="zc-rg__marker"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </span>
              <span className="zc-rg-opt__body">
                <span className="zc-rg-opt__label">{opt.label}</span>
                {opt.description && <span className="zc-rg-opt__desc">{opt.description}</span>}
              </span>
            </label>
          );
        })}
      </div>

      <Collapse open={!!error} fade className="zc-rg__msg-wrap">
        <div className="zc-rg__msg">
          <Icon name="warning-circle" size="sm" weight="fill" />
          {error}
        </div>
      </Collapse>
    </fieldset>
  );
}
