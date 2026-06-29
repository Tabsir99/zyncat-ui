'use client';

// Glass.tsx — the pure frosted-glass surface as a component.
// Composes the .glass class vocabulary ONLY. The TINT and content color are set
// by the consumer's own class through the CSS custom properties --glass-tint /
// --glass-fg — so Glass stays tone-agnostic and any element can become glass.

import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

export interface GlassProps {
  /** Element/tag to render as a glass surface. @default 'div' */
  as?: ElementType;
  /** Hover lift + sheen catch (chips, buttons). */
  interactive?: boolean;
  /** The larger blur, for big surfaces. */
  strong?: boolean;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export function Glass({
  as: Tag = 'div',
  interactive = false,
  strong = false,
  className = '',
  children,
  ...rest
}: GlassProps) {
  const classes = [
    'glass',
    interactive ? 'glass--interactive' : '',
    strong ? 'glass--strong' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...(rest as ComponentPropsWithoutRef<ElementType>)}>
      {children}
    </Tag>
  );
}
