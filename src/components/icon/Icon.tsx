'use client';

// Icon.tsx — icon primitive (OPEN set, Phosphor only).
// ─────────────────────────────────────────────────────────────────────────
// Renders ANY Phosphor glyph by name — pass Phosphor's kebab name
// ("paper-plane-tilt") or one of the semantic aliases ("publish"). Phosphor is
// the ONLY source — if a name isn't in Phosphor, the component warns so we can
// flag it. Size maps to the --icon-* tokens (sm 16 · md 20 · lg 24); color is
// currentColor; Fill weight marks active/selected.

import type { ComponentType, SVGProps } from 'react';
import * as Phosphor from '@phosphor-icons/react';
import { aliases } from './aliases';

export type IconSize = 'sm' | 'md' | 'lg';
export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** Phosphor kebab name ("paper-plane-tilt") or a semantic alias ("publish"). */
  name: string;
  /** Token size: sm 16 · md 20 (default) · lg 24. */
  size?: IconSize;
  /** Phosphor weight. `fill` marks active/selected; Regular otherwise. */
  weight?: IconWeight;
  /** If set, the icon is meaningful and exposed to AT; omit for decorative. */
  label?: string;
}

const SIZE_PX: Record<IconSize, number> = { sm: 16, md: 20, lg: 24 };
const toPascal = (s: string) =>
  s.replace(/(^|[-_ ])([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());

export function Icon({
  name,
  size = 'md',
  weight = 'regular',
  label,
  className = '',
  ...rest
}: IconProps) {
  const exportName = aliases[name] || toPascal(String(name || ''));
  const Glyph = (
    Phosphor as unknown as Record<string, ComponentType<Record<string, unknown>> | undefined>
  )[exportName];
  if (!Glyph) {
    if (typeof console !== 'undefined') {
      console.warn(
        `<Icon>: "${name}" isn't in Phosphor — flag it so we can source an alternative.`,
      );
    }
    return null;
  }
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <Glyph
      size={SIZE_PX[size] || SIZE_PX.md}
      weight={weight}
      className={('icon ' + className).trim()}
      {...a11y}
      {...rest}
    />
  );
}
