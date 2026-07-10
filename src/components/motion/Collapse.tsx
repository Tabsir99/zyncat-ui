'use client';

// Collapse - open/closed layout transition via grid-fr; toggles data-attrs, styling in collapse.css.

import './collapse.css';
import type { CSSProperties, HTMLAttributes, JSX } from 'react';
import type { DurationToken, EaseToken } from '../../tokens/motion-scale';
import { timingVars, type AnimationTiming, type Timing, type TimingProps } from './timing';

/** Motion-scale duration tokens - the only values Collapse timing accepts. */
export type CollapseDuration = DurationToken;
/** Motion-scale ease tokens - the only values Collapse timing accepts. */
export type CollapseEase = EaseToken;
/** One token for both directions, or split per direction; an omitted direction keeps its default. */
export type CollapseTiming<Token extends string> = Timing<Token>;
/** Grouped `{ duration, ease }` timing for the size/fade transition. */
export type CollapseAnimation = AnimationTiming;

export interface CollapseProps extends HTMLAttributes<HTMLDivElement>, TimingProps {
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
  /** Size (and fade) transition timing - motion tokens only, each field one token or
   *  `{ open, close }`, e.g. `{ duration: { close: 'fast' }, ease: { close: 'exit' } }`.
   *  @default duration 'slow' + ease 'entrance' (fade-out: 'base' + 'standard') */
  animation?: AnimationTiming;
  /**
   * What html tag to render as
   */
  As: keyof JSX.IntrinsicElements;
}

export function Collapse({
  open = false,
  axis = 'height',
  fade = false,
  animation,
  className = '',
  innerClassName = '',
  style,
  children,
  As = 'div',
  ...rest
}: CollapseProps) {
  const classes = ['collapse', fade ? 'collapse--fade' : '', className].filter(Boolean).join(' ');

  /* Timing props become the -open/-close custom properties the collapse.css transitions read.
     They are registered non-inheriting, so they are set on both elements that read them: the
     root (size transition) and the inner wrapper (fade). */
  const vars = timingVars('collapse', animation);

  return (
    <div
      className={classes}
      data-open={open ? 'true' : 'false'}
      data-axis={axis}
      style={vars || style ? ({ ...style, ...vars } as CSSProperties) : undefined}
      {...rest}
    >
      <As className={'collapse__inner ' + innerClassName} style={vars}>
        {children}
      </As>
    </div>
  );
}
