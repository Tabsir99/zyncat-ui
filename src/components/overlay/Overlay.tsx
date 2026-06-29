'use client';

/* Overlay.tsx — ONE headless component, three modes. Overlay domain.
   ─────────────────────────────────────────────────────────────────────────
     <Overlay mode="popover|dialog|sheet" trigger={…}>{({ close }) => …}</Overlay>

   All modes share the same state shape — one open boolean, same trigger
   cloning, same Motion-owned existence (exit always plays before unmount),
   same stack (Esc topmost-first, z by depth, full nesting). `mode` switches
   only geometry + modality:

     popover   anchored to the trigger (side/align/flip/clamp, optional
               arrow), light dismiss, focus never stolen
     dialog    centered, scrim, hard focus trap, inert page, scroll lock
     sheet     same modality, docked to an edge (side: right|bottom), with
               drag-to-dismiss / coupled scrim / rubber-band / scroll
               handoff when dismissible (sheet-drag.tsx)

   FULLY headless: paints nothing but the scrim, sets no role and no label —
   your child is the entire surface AND its semantics (put role="dialog"
   aria-modal="true" + a label on your own panel for modal content).
   `asChild` removes the panel wrapper entirely: your single DOM-element
   child becomes the animated panel itself.

   Mechanics live in overlay-core.tsx + sheet-drag.tsx (A9: variant-blind
   hooks + chrome). */
import * as React from 'react';
import {
  OvAnimatePresence as AnimatePresence,
  ovSM as SM,
  useControllable,
  ovResolveChildren,
  ovCloneTrigger,
  useOverlayEntry,
  useOutsidePress,
  useReturnFocus,
  useAnchorPosition,
  OverlayPortal,
  ModalShell,
  ovPanelElement,
} from './overlay-core';
import { useSheetDrag } from './sheet-drag';

const { useRef, useId } = React;

export interface OverlayProps {
  /** Skin + modality. Default 'popover'.
   *  popover — anchored to trigger, light dismiss, no scrim, focus untouched
   *  dialog  — centered modal: scrim, hard focus trap, inert page, scroll lock
   *  sheet   — same modality, docked to an edge */
  mode?: 'popover' | 'dialog' | 'sheet';

  /** Controlled open state. Omit to stay uncontrolled. */
  open?: boolean;
  /** Initial state when uncontrolled. Default false. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Cloned: toggles (popover) or opens (modal) on click; gets
   *  aria-haspopup/-expanded/-controls; your ref on it is preserved.
   *  REQUIRED for mode="popover" — it is the anchor. */
  trigger?: React.ReactElement | null;

  /** popover: 'top'|'bottom'|'left'|'right' (default 'bottom'; flips when out
   *  of room). sheet: 'right'|'bottom' (default 'right'). Ignored by dialog. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Popover only — cross-axis alignment. Default 'start'. */
  align?: 'start' | 'center' | 'end';
  /** Popover only — caret tracking the trigger center. */
  arrow?: boolean;

  /** popover: outside press + Esc · dialog: scrim press + Esc · sheet: scrim
   *  press + Esc + drag toward the docked edge. Default true. */
  dismissible?: boolean;

  /** Render NO panel wrapper: your single DOM-element child becomes the
   *  animated panel itself. Default false. */
  asChild?: boolean;

  id?: string;
  /** The ENTIRE surface — paint AND semantics. Function form receives { close }. */
  children: React.ReactNode | ((api: { close: () => void }) => React.ReactNode);
}

/* ── per-mode motion ── all tokens via the bridge, never hardcoded ──────*/

/* popover scales open from the anchored edge (transform-origin set by
   data-side/data-align in overlay.css) */
const popoverVariants = {
  closed: { opacity: 0, scale: 0.96, transition: SM.t.exit },
  open: { opacity: 1, scale: 1, transition: SM.t.enter },
};

/* the brand surface arrival: slow + entrance in, soft dissolve out */
const dialogVariants = {
  closed: {
    opacity: 0,
    y: 6,
    scale: 0.98,
    transition: { duration: SM.dur.base, ease: SM.ease.standard },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: SM.dur.slow, ease: SM.ease.entrance },
  },
};

/* full-distance travel on the entrance curve — a bouncy spring would
   overshoot past the edge and show a gap behind the panel */
function sheetVariants(side: 'right' | 'bottom') {
  const axis = side === 'bottom' ? 'y' : 'x';
  return {
    closed: { [axis]: '100%', transition: { duration: SM.dur.base, ease: SM.ease.exit } },
    open: { [axis]: 0, transition: { duration: SM.dur.slow, ease: SM.ease.entrance } },
  };
}

interface PanelShared {
  panelId: string;
  dismissible: boolean;
  asChild: boolean;
  requestClose: () => void;
}

/* ── popover panel ── mounted only while open (or exiting); lifecycle
   hooks live here so dismiss/placement hold until the exit finishes ─────*/
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
}: PanelShared & {
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
  arrow: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const entry = useOverlayEntry({ nodeRef: panelRef, dismissible, requestClose });
  useReturnFocus(panelRef);
  useAnchorPosition({ side, align, arrow, triggerRef, panelRef });
  useOutsidePress({
    entry,
    refs: [triggerRef, panelRef],
    enabled: dismissible,
    onPress: requestClose,
  });
  return ovPanelElement({
    asChild,
    children,
    prepend: arrow ? (
      <span key="arrow" className="overlay-popover__arrow" aria-hidden="true"></span>
    ) : null,
    nodeRef: panelRef,
    className: 'overlay-popover',
    motionProps: {
      id: panelId,
      variants: popoverVariants,
      initial: 'closed',
      animate: 'open',
      exit: 'closed',
    },
  });
}

/* ── sheet shell ── owns the drag hook (slotRef must exist before the
   shell renders); everything else is the shared ModalShell ──────────────*/
function SheetShell({
  side,
  panelId,
  dismissible,
  asChild,
  requestClose,
  children,
}: PanelShared & {
  side: 'right' | 'bottom';
  children: React.ReactNode;
}) {
  const slotRef = useRef<HTMLElement>(null);
  const { slotProps, scrimOpacity } = useSheetDrag({
    side,
    slotRef,
    enabled: dismissible,
    requestClose,
  });
  return (
    <ModalShell
      layerClass={'overlay-layer--sheet-' + side}
      slotClass={'overlay-slot--sheet-' + side}
      slotVariants={sheetVariants(side)}
      panelId={panelId}
      dismissible={dismissible}
      requestClose={requestClose}
      asChild={asChild}
      slotRef={slotRef}
      slotProps={slotProps}
      scrimOpacity={scrimOpacity}
    >
      {children}
    </ModalShell>
  );
}

/* ── the one component ──────────────────────────────────────────────────*/
export function Overlay({
  mode = 'popover', // 'popover' | 'dialog' | 'sheet'
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger = null, // element; cloned to open (modal) / toggle (popover).
  // REQUIRED for popover — it is the anchor.
  side, // popover: 'top|bottom|left|right' (default bottom)
  // sheet:   'right|bottom'          (default right)
  align = 'start', // popover only: 'start' | 'center' | 'end'
  arrow = false, // popover only: caret tracking the trigger center
  dismissible = true, // popover: outside press + Esc · dialog: scrim + Esc
  // sheet: scrim + Esc + drag toward the edge
  asChild = false, // no wrapper: your single DOM-element child IS the panel
  id,
  children, // node OR ({ close }) => node — the ENTIRE surface
}: OverlayProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement>(null);
  const panelId = id || 'overlay-' + useId();
  const close = () => setOpen(false);
  const modal = mode !== 'popover';
  const s = side || (mode === 'sheet' ? 'right' : 'bottom');
  const content = ovResolveChildren(children, close);
  const shared: PanelShared = { panelId, dismissible, asChild, requestClose: close };

  return (
    <React.Fragment>
      {ovCloneTrigger(trigger, {
        open,
        onPress: () => setOpen(modal ? true : !open),
        panelId,
        haspopup: modal ? 'dialog' : 'true',
        triggerRef,
      })}
      <OverlayPortal>
        <AnimatePresence>
          {open &&
            (mode === 'popover' ? (
              <PopoverPanel
                key="panel"
                {...shared}
                side={s}
                align={align}
                arrow={arrow}
                triggerRef={triggerRef}
              >
                {content}
              </PopoverPanel>
            ) : mode === 'sheet' ? (
              <SheetShell key="shell" {...shared} side={s as 'right' | 'bottom'}>
                {content}
              </SheetShell>
            ) : (
              <ModalShell
                key="shell"
                {...shared}
                layerClass="overlay-layer--dialog"
                slotClass="overlay-slot--dialog"
                slotVariants={dialogVariants}
              >
                {content}
              </ModalShell>
            ))}
        </AnimatePresence>
      </OverlayPortal>
    </React.Fragment>
  );
}
