/* Motion timing props - the shared vocabulary for components that expose token-typed
   duration/ease props (Collapse today; any transition component tomorrow). Values are motion
   tokens ONLY - no ms numbers, no raw CSS - one token for both directions or per-direction
   { open, close }. timingVars() turns them into the --<prefix>-dur-* / --<prefix>-ease-*
   custom properties the component's stylesheet transitions read (register those
   non-inheriting there, so timing never leaks into a nested instance). Tokens map to the
   --duration-<token> and --ease-<token> custom properties, never literal ms, so the global
   reduced-motion collapse keeps applying. */

import type { CSSProperties } from 'react';
import type { DurationToken, EaseToken } from '../../tokens/motion-scale';

export type TimingDirection = 'open' | 'close';
/** One token for both directions, or split per direction; an omitted direction keeps its default. */
export type Timing<Token extends string> = Token | { [D in TimingDirection]?: Token };

function resolve<Token extends string>(timing: Timing<Token> | undefined, dir: TimingDirection): Token | undefined {
  return typeof timing === 'object' ? timing[dir] : timing;
}

/** Inline style carrying `--<prefix>-dur-open/close` and `--<prefix>-ease-open/close` for the
 *  directions actually given; undefined when none are, so callers can skip the style attribute. */
export function timingVars(
  prefix: string,
  duration: Timing<DurationToken> | undefined,
  ease: Timing<EaseToken> | undefined,
): CSSProperties | undefined {
  const vars: Record<string, string> = {};
  for (const dir of ['open', 'close'] as const) {
    const d = resolve(duration, dir);
    const e = resolve(ease, dir);
    if (d) vars[`--${prefix}-dur-${dir}`] = `var(--duration-${d})`;
    if (e) vars[`--${prefix}-ease-${dir}`] = `var(--ease-${e})`;
  }
  return Object.keys(vars).length ? (vars as CSSProperties) : undefined;
}
