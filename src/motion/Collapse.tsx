'use client';

import './collapse.css';
import type { CSSProperties, HTMLAttributes, JSX, ReactNode } from 'react';
import type { DataAttributes } from '../dom-props';
import type { DurationToken, EaseToken } from '../tokens/motion-scale';
import { timingVars, type AnimationTiming, type DisableableAnimation, type Timing, type TimingProps } from './timing';

/** Motion-scale duration tokens - the only values Collapse timing accepts. */
export type CollapseDuration = DurationToken;
/** Motion-scale ease tokens - the only values Collapse timing accepts. */
export type CollapseEase = EaseToken;
/** One token for both directions, or split per direction; an omitted direction keeps its default. */
export type CollapseTiming<Token extends string> = Timing<Token>;
/** Grouped `{ duration, ease }` timing for the size/fade transition. */
export type CollapseAnimation = AnimationTiming;

interface CollapseOwnProps extends TimingProps {
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
   *  `null` disables the transition (open/close snap instantly).
   *  @default duration 'slow' + ease 'entrance' (fade-out: 'base' + 'standard') */
  animation?: DisableableAnimation;
  /**
   * What html tag to render as
   */
  As?: keyof JSX.IntrinsicElements;
  /** Extra class(es) merged onto the root. */
  className?: string;
  /** Inline styles merged onto the root (composed with the timing custom properties). */
  style?: CSSProperties;
  /** The collapsing content. */
  children?: ReactNode;
}

export interface CollapseProps extends CollapseOwnProps {
  /** Standard <div> attributes (aria-*, data-*, ...) forwarded to the root. */
  htmlProps?: Omit<HTMLAttributes<HTMLDivElement>, keyof CollapseOwnProps> & DataAttributes;
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
  htmlProps,
}: CollapseProps) {
  const classes = ['collapse', fade ? 'collapse--fade' : '', className].filter(Boolean).join(' ');

  const vars = timingVars('collapse', animation);

  return (
    <div
      className={classes}
      data-open={open ? 'true' : 'false'}
      data-axis={axis}
      style={vars || style ? ({ ...style, ...vars } as CSSProperties) : undefined}
      {...htmlProps}
    >
      <As className={'collapse__inner ' + innerClassName} style={vars}>
        {children}
      </As>
    </div>
  );
}
