/* Motion timing props - the shared vocabulary for components that expose a token-typed
   `animation` prop (Collapse today; any transition component tomorrow). Values are motion
   tokens ONLY - no ms numbers, no raw CSS - each field one token for both directions or
   per-direction { open, close }. timingVars() turns the object into the --<prefix>-dur- and
   --<prefix>-ease- open/close custom properties the component's stylesheet transitions read
   (register those non-inheriting there, so timing never leaks into a nested instance).
   Tokens map to the --duration-<token> and --ease-<token> custom properties, never literal
   ms, so the global reduced-motion collapse keeps applying. */

import type { CSSProperties } from 'react';
import type { DurationToken, EaseToken } from '../tokens/motion-scale';

export type TimingDirection = 'open' | 'close';
/** One token for both directions, or split per direction; an omitted direction keeps its default. */
export type Timing<Token extends string> = Token | { [D in TimingDirection]?: Token };

/** Timing of an open/close transition, constrained to the motion token vocabulary -
 *  see DurationToken / EaseToken for what each token means. */
export interface AnimationTiming {
  /** Duration token(s); an omitted field or direction keeps the component's default. */
  duration?: Timing<DurationToken>;
  /** Ease token(s); an omitted field or direction keeps the component's default. */
  ease?: Timing<EaseToken>;
}

/** The `animation` prop shape: tokens to retime, omit for the component's defaults, or
 *  `null` to disable the transition entirely (it plays instantly). */
export type DisableableAnimation = AnimationTiming | null;

/** Extend this to expose the timing API on a component; redeclare `animation`
 *  to document the component's own default tokens. */
export interface TimingProps {
  /** Transition timing - motion tokens only, each field a single token or { open, close };
   *  `null` disables the transition (it plays instantly). */
  animation?: DisableableAnimation;
}

/** Pick a single direction out of a `Timing` value (one token, or `{ open, close }`). */
export function resolveDirection<Token extends string>(
  timing: Timing<Token> | undefined,
  dir: TimingDirection,
): Token | undefined {
  return typeof timing === 'object' ? timing[dir] : timing;
}

/** Inline style carrying `--<prefix>-dur-open/close` and `--<prefix>-ease-open/close`. Tokens
 *  become `var(--duration-*)` / `var(--ease-*)`; `null` pins both durations to `0ms` so the
 *  transition plays instantly; `undefined` yields `undefined`, so callers skip the style. */
export function timingVars(prefix: string, animation: DisableableAnimation | undefined): CSSProperties | undefined {
  if (animation === undefined) return undefined;
  if (animation === null) {
    return { [`--${prefix}-dur-open`]: '0ms', [`--${prefix}-dur-close`]: '0ms' } as CSSProperties;
  }
  const vars: Record<string, string> = {};
  for (const dir of ['open', 'close'] as const) {
    const d = resolveDirection(animation.duration, dir);
    const e = resolveDirection(animation.ease, dir);
    if (d) vars[`--${prefix}-dur-${dir}`] = `var(--duration-${d})`;
    if (e) vars[`--${prefix}-ease-${dir}`] = `var(--ease-${e})`;
  }
  return Object.keys(vars).length ? (vars as CSSProperties) : undefined;
}
