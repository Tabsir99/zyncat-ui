'use client';

// IconSlot.tsx — sizes a CONSUMER-supplied icon node to the DS's icon tokens.
// ─────────────────────────────────────────────────────────────────────────
// Components take decorative/leading icons as ReactNode (bring-your-own — any
// source: a Phosphor glyph, lucide, a raw <svg>). This wrapper locks whatever
// is passed to --icon-* and currentColor, so the icon stays the right size and
// colour regardless of where it came from. Renders nothing for an empty slot.

import type { ReactNode } from 'react';
import type { IconSize } from './Icon';

export function IconSlot({ size = 'md', children }: { size?: IconSize; children?: ReactNode }) {
  if (!children) return null;
  return <span className={`icon-slot icon-slot--${size}`}>{children}</span>;
}
