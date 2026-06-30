'use client';

// Base badge chip - glass surface by default; the outline variant is flat (no glass classes).

import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status hue. @default 'neutral' */
  tone?: BadgeTone;
  /** Surface. @default 'glass' */
  variant?: 'glass' | 'outline';
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Leading status dot. */
  dot?: boolean;
  /** Dot pulses (implies dot) - for in-progress status. */
  live?: boolean;
  /** Fully-rounded shape. */
  pill?: boolean;
  /** Optional leading <Icon> (overrides dot if both set). */
  icon?: ReactNode;
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
  children,
  ...rest
}: BadgeProps) {
  const isGlass = variant !== 'outline';
  const classes = [
    isGlass ? 'glass glass--interactive' : '',
    'badge',
    `badge--${tone}`,
    variant === 'outline' ? 'badge--outline' : '',
    size !== 'md' ? `badge--${size}` : '',
    pill ? 'badge--pill' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const showDot = (dot || live) && !icon;

  return (
    <span className={classes} {...rest}>
      {showDot ? (
        <span className={`badge__dot${live ? ' badge__dot--live' : ''}`} aria-hidden="true" />
      ) : null}
      {icon ? (
        <span className="badge__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="badge__label">{children}</span>
    </span>
  );
}
