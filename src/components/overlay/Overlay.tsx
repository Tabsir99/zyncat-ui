'use client';

/* Overlay - one headless component, three modes: popover - dialog - sheet. */
import './overlay.css';
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
  /** Skin + modality. Default 'popover'. */
  mode?: 'popover' | 'dialog' | 'sheet';

  /** Controlled open state. Omit to stay uncontrolled. */
  open?: boolean;
  /** Initial state when uncontrolled. Default false. */
  defaultOpen?: boolean;
  /** Fires whenever the open state changes. Pair with `open` for controlled use. */
  onOpenChange?: (open: boolean) => void;

  /** Cloned to toggle (popover) / open (modal); required as the popover anchor. */
  trigger?: React.ReactElement | null;

  /** Popover side (default 'bottom', flips) / sheet edge (default 'right'). */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Popover only - cross-axis alignment. Default 'start'. */
  align?: 'start' | 'center' | 'end';
  /** Popover only - caret tracking the trigger center. */
  arrow?: boolean;

  /** Light/scrim + Esc dismissal (sheet adds drag-to-edge). Default true. */
  dismissible?: boolean;

  /** Render no wrapper - your DOM-element child becomes the panel. Default false. */
  asChild?: boolean;

  /** Base id for the panel; drives the trigger's `aria-controls`. Auto-generated when omitted. */
  id?: string;
  /** The ENTIRE surface - paint AND semantics. Function form receives { close }. */
  children: React.ReactNode | ((api: { close: () => void }) => React.ReactNode);
}

/* scales open from the anchored edge (transform-origin set in overlay.css) */
const popoverVariants = {
  closed: { opacity: 0, scale: 0.96, transition: SM.t.exit },
  open: { opacity: 1, scale: 1, transition: SM.t.enter },
};

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

/* entrance curve, not a spring - overshoot would show a gap behind the panel */
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

/* Popover panel - lifecycle hooks live here so dismiss/placement hold until exit ends. */
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

/* Sheet shell - owns the drag hook; slotRef must exist before the shell renders. */
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

export function Overlay({
  mode = 'popover',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger = null,
  side,
  align = 'start',
  arrow = false,
  dismissible = true,
  asChild = false,
  id,
  children,
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
