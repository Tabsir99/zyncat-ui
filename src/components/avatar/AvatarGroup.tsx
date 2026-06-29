'use client';

// AvatarGroup.jsx — stacks <Avatar> components with overlap + overflow count.
// ─────────────────────────────────────────────────────────────────────────
// Clones each child with the given `size` so all members are uniform.
// The CSS drives the hover-spread interaction (margin-left transition on
// --ease-entrance); no JS required for that behaviour.
// Shows a mono "+N" chip for any avatars beyond `max`.
//
// Usage:
//   <AvatarGroup max={4} size="sm">
//     <Avatar name="Nadia Petrov" />
//     <Avatar name="Marcus Kim" />
//     <Avatar name="Lena Sørensen" />
//     <Avatar name="Tomás Ruiz" />
//     <Avatar name="Yuki Tanaka" />   ← becomes "+1"
//   </AvatarGroup>

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
  max = 5, // max visible avatars before "+N" overflow chip
  size = 'md', // uniform size applied to all children
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
