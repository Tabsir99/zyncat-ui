'use client';

// Collapse — open/closed layout transition via grid-fr; toggles data-attrs, styling in collapse.css.

import type { HTMLAttributes } from 'react';

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /** Open/closed state. */
  open?: boolean;
  /** Axis to animate. @default 'height' */
  axis?: 'height' | 'width';
  /** Also cross-fade contents while resizing. */
  fade?: boolean;
  /** Class applied to the inner measured wrapper. */
  innerClassName?: string;
}

export function Collapse({
  open = false,
  axis = 'height',
  fade = false,
  className = '',
  innerClassName = '',
  children,
  ...rest
}: CollapseProps) {
  const classes = ['collapse', fade ? 'collapse--fade' : '', className].filter(Boolean).join(' ');
  return (
    <div className={classes} data-open={open ? 'true' : 'false'} data-axis={axis} {...rest}>
      <div className={'collapse__inner ' + innerClassName}>{children}</div>
    </div>
  );
}
