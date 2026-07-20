'use client';

/* Sheet - an edge-docked modal panel (right or bottom). Modality (scrim, focus
   trap, scroll lock, inert page) comes from the shared ModalShell; the
   drag-to-dismiss physics live in use-sheet-drag. */
import './sheet.css';
import { Fragment, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { resolveMotionTiming, type MotionTimings } from '../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../motion/timing';
import { useControllable } from '../../internal/hooks/use-controllable';
import { ovResolveChildren, ovCloneTrigger, OverlayPortal } from '../../internal/overlay/layer';
import { ModalShell } from '../../internal/overlay/modal';
import { useSheetDrag } from './use-sheet-drag';
import type { DataAttributes } from '../../../dom-props';

const SHEET_TIMING = {
  open: { duration: 'slow', ease: 'entrance' },
  close: { duration: 'base', ease: 'exit' },
} as const;

export interface SheetProps {
  /** Controlled open state. Omit to stay uncontrolled. */
  open?: boolean;
  /** Initial state when uncontrolled. Default false. */
  defaultOpen?: boolean;
  /** Fires whenever the open state changes. Pair with `open` for controlled use. */
  onOpenChange?: (open: boolean) => void;

  /** Cloned to open the sheet on click. */
  trigger?: ReactElement | null;

  /** Edge the sheet slides in from. Default 'right'. */
  side?: 'right' | 'bottom';

  /** Scrim/Esc dismissal + drag-to-edge. Default true. */
  dismissible?: boolean;

  /** Render no wrapper - your DOM-element child becomes the panel. Default false. */
  asChild?: boolean;

  /** Base id for the panel; drives the trigger's `aria-controls`. Auto-generated when omitted. */
  id?: string;
  /** Standard attributes (className, style, data-*, ...) forwarded to the sheet panel. */
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  /** Open/close timing - motion tokens only, or `null` to disable. @default open 'slow'/'entrance', close 'base'/'exit' */
  animation?: DisableableAnimation;
  /** The ENTIRE surface - paint AND semantics. Function form receives { close }. */
  children: ReactNode | ((api: { close: () => void }) => ReactNode);
}

/* entrance curve, not a spring - overshoot would show a gap behind the panel */
function sheetVariants(side: 'right' | 'bottom', timings: MotionTimings) {
  const axis = side === 'bottom' ? 'y' : 'x';
  return { closed: { [axis]: '100%', transition: timings.close }, open: { [axis]: 0, transition: timings.open } };
}

/* The shell owns the drag hook; slotRef must exist before the shell renders. */
function SheetShell({
  side,
  panelId,
  dismissible,
  asChild,
  requestClose,
  htmlProps,
  animation,
  children,
}: {
  side: 'right' | 'bottom';
  panelId: string;
  dismissible: boolean;
  asChild: boolean;
  requestClose: () => void;
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  animation?: DisableableAnimation;
  children: ReactNode;
}) {
  const slotRef = useRef<HTMLElement>(null);
  const { slotProps, scrimOpacity } = useSheetDrag({ side, slotRef, enabled: dismissible, requestClose });
  return (
    <ModalShell
      layerClass={'overlay-layer--sheet-' + side}
      slotClass={'overlay-slot--sheet-' + side}
      slotVariants={sheetVariants(side, resolveMotionTiming(animation, SHEET_TIMING))}
      panelId={panelId}
      dismissible={dismissible}
      requestClose={requestClose}
      asChild={asChild}
      slotRef={slotRef}
      slotProps={{ ...htmlProps, ...slotProps }}
      scrimOpacity={scrimOpacity}
    >
      {children}
    </ModalShell>
  );
}

export function Sheet({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger = null,
  side = 'right',
  dismissible = true,
  asChild = false,
  id,
  htmlProps,
  animation,
  children,
}: SheetProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement>(null);
  const autoId = useId();
  const panelId = id || 'sheet-' + autoId;
  const close = () => setOpen(false);

  return (
    <Fragment>
      {ovCloneTrigger(trigger, { open, onPress: () => setOpen(true), panelId, haspopup: 'dialog', triggerRef })}
      <OverlayPortal>
        <AnimatePresence>
          {open && (
            <SheetShell
              side={side}
              panelId={panelId}
              dismissible={dismissible}
              asChild={asChild}
              requestClose={close}
              htmlProps={htmlProps}
              animation={animation}
            >
              {ovResolveChildren(children, close)}
            </SheetShell>
          )}
        </AnimatePresence>
      </OverlayPortal>
    </Fragment>
  );
}
