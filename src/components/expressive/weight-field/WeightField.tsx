import './weight-field.css';

import type { CSSProperties, HTMLAttributes } from 'react';

import type { DataAttributes } from '../../../dom-props';
import type { WeightFieldStyle } from '../../../tokens/component-styles.generated';
import { cx } from '../../internal/utils/cx';

const SPACE = ' ';
const NO_BREAK_SPACE = '\u00A0';

export interface WeightFieldOwnProps {
  /** The headline the field is built from. Every character becomes its own hover unit, spaces included. */
  text: string;
  /** Multiplies the ramp rate - 2 halves the settle, 0.5 doubles it. @default 1 */
  speed?: number;
  /** Extra class(es) merged onto the root. */
  className?: string;
  /** Inline styles merged onto the root. */
  style?: WeightFieldStyle;
}

export interface WeightFieldProps extends WeightFieldOwnProps {
  /** Standard <span> attributes (aria-*, data-*, title, ...) forwarded to the root. */
  htmlProps?: Omit<HTMLAttributes<HTMLSpanElement>, keyof WeightFieldOwnProps> & DataAttributes;
}

export function WeightField({ text, speed = 1, className = '', style, htmlProps }: WeightFieldProps) {
  const ramp = { ...style, '--weight-field-speed': speed } as CSSProperties;

  return (
    <span className={cx('weight-field', className)} style={ramp} {...htmlProps}>
      {[...text].map((glyph, index) => (
        <span key={index} className="weight-field__unit" aria-hidden="true">
          {glyph === SPACE ? NO_BREAK_SPACE : glyph}
        </span>
      ))}
      <span className="weight-field__label">{text}</span>
    </span>
  );
}
