'use client';

import './icon.css';
import type { ReactNode } from 'react';
import type { IconSize } from './Icon';

export function IconSlot({ size = 'md', children }: { size?: IconSize; children?: ReactNode }) {
  if (!children) return null;
  return <span className={`icon-slot icon-slot--${size}`}>{children}</span>;
}
