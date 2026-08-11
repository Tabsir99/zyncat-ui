'use client';

import './avatar.css';
import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { AvatarSize } from './Avatar';
import type { DataAttributes } from '../../../dom-props';

interface AvatarGroupOwnProps {
  /** The `Avatar` elements to stack; each is cloned to force `size`, then sliced to `max`. */
  children: ReactNode;
  /** Max visible avatars before "+N" overflow chip. Default 5. */
  max?: number;
  /** Uniform size applied to all children. Default 'md'. */
  size?: AvatarSize;
  /** Extra class(es) merged onto the group wrapper. */
  className?: string;
  /** Inline styles merged onto the group wrapper. */
  style?: CSSProperties;
}

export interface AvatarGroupProps extends AvatarGroupOwnProps {
  /** Standard <span> attributes forwarded to the group wrapper. */
  htmlProps?: Omit<HTMLAttributes<HTMLSpanElement>, keyof AvatarGroupOwnProps> & DataAttributes;
}

export function AvatarGroup({ children, max = 5, size = 'md', className = '', style, htmlProps }: AvatarGroupProps) {
  const items = Children.toArray(children);
  const visible = max > 0 ? items.slice(0, max) : items;
  const overflow = items.length - visible.length;

  return (
    <span className={['avatar-group', className].filter(Boolean).join(' ')} style={style} {...htmlProps}>
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
