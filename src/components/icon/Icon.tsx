'use client';

// Icon - internal, curated glyph set; statically imported so the bundle ships only these (tree-shaking).

import './icon.css';
import {
  ArrowUp,
  Calendar,
  CalendarDot,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check,
  CheckCircle,
  Clock,
  Globe,
  Info,
  MagnifyingGlass,
  Warning,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';

type Glyph = typeof X;

const REGISTRY = {
  x: X,
  close: X,
  check: Check,
  'arrow-up': ArrowUp,
  'caret-up': CaretUp,
  'caret-down': CaretDown,
  'caret-left': CaretLeft,
  'caret-right': CaretRight,
  'magnifying-glass': MagnifyingGlass,
  calendar: Calendar,
  'calendar-dot': CalendarDot,
  clock: Clock,
  globe: Globe,
  info: Info,
  warning: Warning,
  'warning-circle': WarningCircle,
  'check-circle': CheckCircle,
} satisfies Record<string, Glyph>;

export type IconName = keyof typeof REGISTRY;
export type IconSize = 'sm' | 'md' | 'lg';
export type { IconWeight };

export interface IconProps {
  /** A curated glyph name (see the registry in this file). */
  name: IconName;
  /** Token size: sm 16 - md 20 (default) - lg 24. */
  size?: IconSize;
  /** `fill` marks active/selected; Regular otherwise. */
  weight?: IconWeight;
  /** If set, the icon is meaningful and exposed to AT; omit for decorative. */
  label?: string;
  /** Extra class(es) merged onto the root element. */
  className?: string;
}

const SIZE_PX: Record<IconSize, number> = { sm: 16, md: 20, lg: 24 };

export function Icon({ name, size = 'md', weight = 'regular', label, className = '' }: IconProps) {
  const Glyph = REGISTRY[name];
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <Glyph
      size={SIZE_PX[size]}
      weight={weight}
      className={('icon ' + className).trim()}
      {...a11y}
    />
  );
}
