'use client';

// AvatarGroup — stacks Avatars with overlap + a "+N" overflow chip; CSS drives the hover-spread.

import * as React from 'react';
import type { AvatarSize } from './Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Max visible avatars before "+N" overflow chip. Default 5. */
  max?: number;
  /** Uniform size applied to all children. Default 'md'. */
  size?: AvatarSize;
}

export function AvatarGroup({
  children,
  max = 5,
  size = 'md',
  className = '',
  ...rest
}: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visible = max > 0 ? items.slice(0, max) : items;
  const overflow = items.length - visible.length;

  return (
    <span className={['avatar-group', className].filter(Boolean).join(' ')} {...rest}>
      {visible.map((child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ size?: AvatarSize }>, {
              size,
              key: child.key ?? i,
            })
          : child,
      )}
      {overflow > 0 && (
        <span
          className={`avatar avatar--${size} avatar--overflow`}
          role="img"
          aria-label={`${overflow} more`}
        >
          <span className="avatar__face">
            <span className="avatar__initials">+{overflow}</span>
          </span>
        </span>
      )}
    </span>
  );
}
