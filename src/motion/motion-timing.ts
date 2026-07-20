/* motion-timing - the JS/Motion counterpart to timing.ts's CSS `timingVars`. Components whose
   open/close motion runs through Motion variants (not a stylesheet transition) resolve the shared
   `animation` prop here: token names become real seconds/curves from UIMotion, per direction, and
   `null` collapses the transition to instant. Kept out of timing.ts so the non-motion subpaths that
   only need `timingVars` (Collapse, the fields) never pull in the UIMotion DOM read. */

import { UIMotion, type MotionTransition } from '../tokens/motion-tokens';
import type { DurationToken, EaseToken } from '../tokens/motion-scale';
import { resolveDirection, type DisableableAnimation } from './timing';

/** A component's built-in timing for one direction, in token names. */
export interface DirectionDefault {
  duration: DurationToken;
  ease: EaseToken;
}

/** The open + close defaults a component falls back to when `animation` omits a field. */
export interface MotionTimingDefaults {
  open: DirectionDefault;
  close: DirectionDefault;
}

/** Resolved Motion transitions for both directions. */
export interface MotionTimings {
  open: MotionTransition;
  close: MotionTransition;
}

/** Resolve the `animation` prop against a component's token defaults into Motion `transition`
 *  objects. `undefined` yields the defaults unchanged; `null` yields `{ duration: 0 }` (instant);
 *  a partial object overrides only the tokens it names, per direction. */
export function resolveMotionTiming(
  animation: DisableableAnimation | undefined,
  defaults: MotionTimingDefaults,
): MotionTimings {
  if (animation === null) return { open: { duration: 0 }, close: { duration: 0 } };

  const build = (dir: 'open' | 'close'): MotionTransition => {
    const durToken = (animation && resolveDirection(animation.duration, dir)) || defaults[dir].duration;
    const easeToken = (animation && resolveDirection(animation.ease, dir)) || defaults[dir].ease;
    return { duration: UIMotion.dur[durToken], ease: UIMotion.ease[easeToken] };
  };

  return { open: build('open'), close: build('close') };
}
