'use client';

import './badge.css';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { cx } from '../../internal/utils/cx';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

interface BadgeOwnProps {
  /** Status hue. @default 'neutral' */
  tone?: BadgeTone;
  /** Surface. @default 'glass' */
  variant?: 'glass' | 'outline';
  /** Chip density - `sm` tightens the vertical padding for inline use. @default 'md' */
  size?: 'sm' | 'md';
  /** Leading status dot. */
  dot?: boolean;
  /** Dot pulses (implies dot) - for in-progress status. */
  live?: boolean;
  /** Fully-rounded shape. */
  pill?: boolean;
  /** Optional leading <Icon> (overrides dot if both set). */
  icon?: ReactNode;
  /** Extra class(es) merged onto the chip. */
  className?: string;
  /** Inline styles merged onto the chip. */
  style?: CSSProperties;
  /** Chip label. */
  children?: ReactNode;
}

export interface BadgeProps extends BadgeOwnProps {
  /** Standard <span> attributes (aria-*, data-*, title, ...) forwarded to the chip. */
  htmlProps?: Omit<HTMLAttributes<HTMLSpanElement>, keyof BadgeOwnProps> & DataAttributes;
}

export function Badge({
  tone = 'neutral',
  variant = 'glass',
  size = 'md',
  dot = false,
  live = false,
  pill = false,
  icon = null,
  className = '',
  style,
  children,
  htmlProps,
}: BadgeProps) {
  const isGlass = variant !== 'outline';
  const cls = cx(
    isGlass && 'glass glass--interactive',
    'badge',
    `badge--${tone}`,
    variant === 'outline' && 'badge--outline',
    size !== 'md' && `badge--${size}`,
    pill && 'badge--pill',
    className,
  );

  const showDot = (dot || live) && !icon;

  return (
    <span className={cls} style={style} {...htmlProps}>
      {showDot ? <span className={`badge__dot${live ? ' badge__dot--live' : ''}`} aria-hidden="true" /> : null}
      {icon ? (
        <span className="badge__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="badge__label">{children}</span>
    </span>
  );
}
