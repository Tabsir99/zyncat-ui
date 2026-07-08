'use client';

/* Popover - an anchored, non-modal floating panel cloned onto its trigger.
   It joins the overlay stack for Escape + light dismiss and re-places itself
   on scroll/resize; focus returns to the opener on close but is never trapped,
   so the page behind stays live. Modal surfaces are Dialog and Sheet. */
import './popover.css';
import { Fragment, useId, useRef, type ReactElement, type ReactNode, type RefObject } from 'react';
import { AnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { useControllable } from '../use-controllable';
import { ovResolveChildren, ovCloneTrigger, useOverlayEntry, useOutsidePress, OverlayPortal } from '../overlay/layer';
import { useReturnFocus } from '../overlay/focus';
import { useAnchorPosition } from '../overlay/position';
import { ovPanelElement } from '../overlay/panel';

const SM = UIMotion;

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
  /** The ENTIRE surface - paint AND semantics. Function form receives { close }. */
  children: ReactNode | ((api: { close: () => void }) => ReactNode);
}

/* scales open from the anchored edge (transform-origin set in popover.css) */
const popoverVariants = {
  closed: { opacity: 0, scale: 0.96, transition: SM.t.exit },
  open: { opacity: 1, scale: 1, transition: SM.t.enter },
};

/* Panel - lifecycle hooks live here so dismiss/placement hold until exit ends. */
function PopoverPanel({
  panelId,
  side,
  align,
  arrow,
  dismissible,
  asChild,
  requestClose,
  triggerRef,
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
    motionProps: { id: panelId, variants: popoverVariants, initial: 'closed', animate: 'open', exit: 'closed' },
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
  children,
}: PopoverProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement>(null);
  const autoId = useId();
  const panelId = id || 'popover-' + autoId;
  const close = () => setOpen(false);

  return (
    <Fragment>
      {ovCloneTrigger(trigger, { open, onPress: () => setOpen(!open), panelId, haspopup: 'true', triggerRef })}
      <OverlayPortal>
        <AnimatePresence>
          {open && (
            <PopoverPanel
              panelId={panelId}
              side={side}
              align={align}
              arrow={arrow}
              dismissible={dismissible}
              asChild={asChild}
              requestClose={close}
              triggerRef={triggerRef}
            >
              {ovResolveChildren(children, close)}
            </PopoverPanel>
          )}
        </AnimatePresence>
      </OverlayPortal>
    </Fragment>
  );
}
