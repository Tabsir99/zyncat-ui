'use client';

import './popover.css';
import { Fragment, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode, type RefObject } from 'react';
import { Presence } from '../../../motion/presence';
import { resolveMotionTiming } from '../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../motion/timing';
import { useControllable } from '../../internal/hooks/use-controllable';
import {
  ovResolveChildren,
  ovCloneTrigger,
  useOverlayEntry,
  useOutsidePress,
  OverlayPortal,
} from '../../internal/overlay/layer';
import { useReturnFocus } from '../../internal/overlay/focus';
import { useAnchorPosition } from '../../internal/overlay/position';
import { ovPanelElement } from '../../internal/overlay/panel';
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

  /** Render no wrapper - your DOM-element child becomes the panel. Default false. */
  asChild?: boolean;

  /** Base id for the panel; drives the trigger's `aria-controls`. Auto-generated when omitted. */
  id?: string;
  /** Standard attributes (className, style, data-*, ...) forwarded to the popover panel. */
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  /** Open/close timing - motion tokens only, or `null` to disable. @default open 'base'/'entrance', close 'fast'/'exit' */
  animation?: DisableableAnimation;
  /** The ENTIRE surface - paint AND semantics. Function form receives { close }. */
  children: ReactNode | ((api: { close: () => void }) => ReactNode);
}

function PopoverPanel({
  panelId,
  side,
  align,
  arrow,
  dismissible,
  asChild,
  requestClose,
  triggerRef,
  htmlProps,
  children,
}: {
  panelId: string;
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
  arrow: boolean;
  dismissible: boolean;
  asChild: boolean;
  requestClose: () => void;
  triggerRef: RefObject<HTMLElement>;
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const entry = useOverlayEntry({ nodeRef: panelRef, dismissible, requestClose });
  useReturnFocus(panelRef);
  useAnchorPosition({ side, align, arrow, triggerRef, panelRef });
  useOutsidePress({ entry, refs: [triggerRef, panelRef], enabled: dismissible, onPress: requestClose });
  return ovPanelElement({
    asChild,
    children,
    prepend: arrow ? <span key="arrow" className="overlay-popover__arrow" aria-hidden="true"></span> : null,
    nodeRef: panelRef,
    className: 'overlay-popover',
    panelProps: { ...htmlProps, id: panelId },
  });
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
  asChild = false,
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
        <Presence
          style={{ display: 'contents' }}
          enter={{ opacity: [0, 1], scale: [0.96, 1], timing: timings.open }}
          exit={{ opacity: [0], scale: [0.96], timing: timings.close }}
        >
          {open && (
            <PopoverPanel
              key="panel"
              panelId={panelId}
              side={side}
              align={align}
              arrow={arrow}
              dismissible={dismissible}
              asChild={asChild}
              requestClose={close}
              triggerRef={triggerRef}
              htmlProps={htmlProps}
            >
              {ovResolveChildren(children, close)}
            </PopoverPanel>
          )}
        </Presence>
      </OverlayPortal>
    </Fragment>
  );
}
