'use client';

import './popover.css';
import { Fragment, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode, type RefObject } from 'react';
import { Presence } from '../../../motion/presence';
import { useMotion, type MotionSpecs } from '../../../motion/use-motion';
import { resolveMotionTiming } from '../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../motion/timing';
import { useControllable } from '../../internal/hooks/use-controllable';
import { ovCloneTrigger, useOverlayEntry, useOutsidePress, OverlayPortal } from '../../internal/overlay/layer';
import { useReturnFocus } from '../../internal/overlay/focus';
import { useAnchorPosition } from '../../internal/overlay/position';
import type { DataAttributes } from '../../../dom-props';

const POPOVER_TIMING = {
  open: { duration: 'base', ease: 'entrance' },
  close: { duration: 'fast', ease: 'exit' },
} as const;

export interface PopoverProps {
  /** Controlled open state. Omit to stay uncontrolled. */
  open?: boolean;
  /** Initial state when uncontrolled. Default false. */
  defaultOpen?: boolean;
  /** Fires whenever the open state changes. Pair with `open` for controlled use. */
  onOpenChange?: (open: boolean) => void;

  /** Cloned to toggle the panel; required as the anchor. */
  trigger?: ReactElement | null;

  /** Preferred side; flips to the opposite side when cramped. Default 'bottom'. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Cross-axis alignment against the trigger. Default 'start'. */
  align?: 'start' | 'center' | 'end';
  /** Caret tracking the trigger center. Default false. */
  arrow?: boolean;

  /** Esc + outside-press dismissal. Default true. */
  dismissible?: boolean;

  /** Base id for the panel; drives the trigger's `aria-controls`. Auto-generated when omitted. */
  id?: string;
  /** Standard attributes (className, style, data-*, ...) forwarded to the popover panel. */
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  /** Open/close timing - motion tokens only, or `null` to disable. @default open 'base'/'entrance', close 'fast'/'exit' */
  animation?: DisableableAnimation;
  /** The ENTIRE surface - paint AND semantics. Drive dismissal with `open`/`onOpenChange`. */
  children: ReactNode;
}

function PopoverPanel({
  panelId,
  side,
  align,
  arrow,
  dismissible,
  requestClose,
  triggerRef,
  htmlProps,
  animate,
  exit,
  children,
}: {
  panelId: string;
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
  arrow: boolean;
  dismissible: boolean;
  requestClose: () => void;
  triggerRef: RefObject<HTMLElement>;
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  children: ReactNode;
} & MotionSpecs) {
  const panelRef = useRef<HTMLElement>(null);
  const entry = useOverlayEntry({ nodeRef: panelRef, dismissible, requestClose });
  useMotion(panelRef, { animate, exit });
  useReturnFocus(panelRef);
  useAnchorPosition({ side, align, arrow, triggerRef, panelRef });
  useOutsidePress({ entry, refs: [triggerRef, panelRef], enabled: dismissible, onPress: requestClose });
  return (
    <div
      {...htmlProps}
      id={panelId}
      ref={panelRef as RefObject<HTMLDivElement>}
      className={['overlay-popover', htmlProps?.className].filter(Boolean).join(' ')}
    >
      {arrow && <span className="overlay-popover__arrow" aria-hidden="true"></span>}
      {children}
    </div>
  );
}

export function Popover({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger = null,
  side = 'bottom',
  align = 'start',
  arrow = false,
  dismissible = true,
  id,
  htmlProps,
  animation,
  children,
}: PopoverProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement>(null);
  const autoId = useId();
  const panelId = id || 'popover-' + autoId;
  const close = () => setOpen(false);
  const timings = resolveMotionTiming(animation, POPOVER_TIMING);

  return (
    <Fragment>
      {ovCloneTrigger(trigger, { open, onPress: () => setOpen(!open), panelId, haspopup: 'true', triggerRef })}
      <OverlayPortal>
        <Presence>
          {open && (
            <PopoverPanel
              key="panel"
              animate={{ opacity: [0, 1], scale: [0.96, 1], timing: timings.open }}
              exit={{ opacity: [0], scale: [0.96], timing: timings.close }}
              panelId={panelId}
              side={side}
              align={align}
              arrow={arrow}
              dismissible={dismissible}
              requestClose={close}
              triggerRef={triggerRef}
              htmlProps={htmlProps}
            >
              {children}
            </PopoverPanel>
          )}
        </Presence>
      </OverlayPortal>
    </Fragment>
  );
}
