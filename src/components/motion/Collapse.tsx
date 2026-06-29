'use client';

// Collapse.tsx — layout-transition primitive.
// Smoothly animates a region open/closed without ever touching `auto`, using
// the grid-fr trick (0fr ↔ 1fr). This is how the system keeps layout shifts from
// being abrupt — wrap anything that appears, disappears, or resizes in it.
// All motion lives in collapse.css via --transition-layout; reduced motion is
// honored there. This component just toggles the data-attributes.

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
