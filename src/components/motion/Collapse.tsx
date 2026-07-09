'use client';

// Collapse - open/closed layout transition via grid-fr; toggles data-attrs, styling in collapse.css.

import './collapse.css';
import type { CSSProperties, HTMLAttributes } from 'react';
import type { DurationToken, EaseToken } from '../../tokens/motion-scale';
import { timingVars, type Timing } from './timing';

/** Motion-scale duration tokens - the only values Collapse timing accepts. */
export type CollapseDuration = DurationToken;
/** Motion-scale ease tokens - the only values Collapse timing accepts. */
export type CollapseEase = EaseToken;
/** One token for both directions, or split per direction; an omitted direction keeps its default. */
export type CollapseTiming<Token extends string> = Timing<Token>;

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /** Open/closed state. Closed content is also removed from the tab order, the accessibility
   *  tree and hit-testing once the exit transition completes; reopening restores it before
   *  the entrance runs. */
  open?: boolean;
  /** Axis to animate. @default 'height' */
  axis?: 'height' | 'width';
  /** Also cross-fade contents while resizing; follows `duration` / `ease`. */
  fade?: boolean;
  /** Class applied to the inner measured wrapper - the clipping element (overflow: hidden).
   *  Content whose focus ring sits flush to its edge needs padding there, or the ring clips. */
  innerClassName?: string;
  /** Size (and fade) duration - motion tokens only, one for both directions or
   *  `{ open, close }`. @default 'slow' (fade-out defaults to 'base') */
  duration?: CollapseTiming<CollapseDuration>;
  /** Easing curve - motion tokens only, one for both directions or `{ open, close }`.
   *  @default 'entrance' (fade-out defaults to 'standard') */
  ease?: CollapseTiming<CollapseEase>;
}

export function Collapse({
  open = false,
  axis = 'height',
  fade = false,
  duration,
  ease,
  className = '',
  innerClassName = '',
  style,
  children,
  ...rest
}: CollapseProps) {
  const classes = ['collapse', fade ? 'collapse--fade' : '', className].filter(Boolean).join(' ');

  /* Timing props become the -open/-close custom properties the collapse.css transitions read.
     They are registered non-inheriting, so they are set on both elements that read them: the
     root (size transition) and the inner wrapper (fade). */
  const vars = timingVars('collapse', duration, ease);

  return (
    <div
      className={classes}
      data-open={open ? 'true' : 'false'}
      data-axis={axis}
      style={vars || style ? ({ ...style, ...vars } as CSSProperties) : undefined}
      {...rest}
    >
      <div className={'collapse__inner ' + innerClassName} style={vars}>
        {children}
      </div>
    </div>
  );
}
