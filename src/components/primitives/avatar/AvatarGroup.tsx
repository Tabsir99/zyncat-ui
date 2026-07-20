'use client';

// AvatarGroup - stacks Avatars with overlap + a "+N" overflow chip; CSS drives the hover-spread.

import './avatar.css';
import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import type { AvatarSize } from './Avatar';

export interface AvatarGroupProps extends HTMLAttributes<HTMLSpanElement> {
  /** The `Avatar` elements to stack; each is cloned to force `size`, then sliced to `max`. */
  children: ReactNode;
  /** Max visible avatars before "+N" overflow chip. Default 5. */
  max?: number;
  /** Uniform size applied to all children. Default 'md'. */
  size?: AvatarSize;
}

export function AvatarGroup({ children, max = 5, size = 'md', className = '', ...rest }: AvatarGroupProps) {
  const items = Children.toArray(children);
  const visible = max > 0 ? items.slice(0, max) : items;
  const overflow = items.length - visible.length;

  return (
    <span className={['avatar-group', className].filter(Boolean).join(' ')} {...rest}>
      {visible.map((child, i) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<{ size?: AvatarSize }>, { size, key: child.key ?? i })
          : child,
      )}
      {overflow > 0 && (
        <span className={`avatar avatar--${size} avatar--overflow`} role="img" aria-label={`${overflow} more`}>
          <span className="avatar__face">
            <span className="avatar__initials">+{overflow}</span>
          </span>
        </span>
      )}
    </span>
  );
}
