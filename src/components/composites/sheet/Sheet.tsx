'use client';

/* Sheet - an edge-docked modal panel (right or bottom). Modality (scrim, focus
   trap, scroll lock, inert page) comes from the shared ModalShell; the
   drag-to-dismiss physics live in use-sheet-drag. */
import './sheet.css';
import { Fragment, useId, useRef, type ReactElement, type ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { UIMotion } from '../../../tokens/motion-tokens';
import { useControllable } from '../../internal/hooks/use-controllable';
import { ovResolveChildren, ovCloneTrigger, OverlayPortal } from '../../internal/overlay/layer';
import { ModalShell } from '../../internal/overlay/modal';
import { useSheetDrag } from './use-sheet-drag';

const SM = UIMotion;

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
  /** The ENTIRE surface - paint AND semantics. Function form receives { close }. */
  children: ReactNode | ((api: { close: () => void }) => ReactNode);
}

/* entrance curve, not a spring - overshoot would show a gap behind the panel */
function sheetVariants(side: 'right' | 'bottom') {
  const axis = side === 'bottom' ? 'y' : 'x';
  return {
    closed: { [axis]: '100%', transition: { duration: SM.dur.base, ease: SM.ease.exit } },
    open: { [axis]: 0, transition: { duration: SM.dur.slow, ease: SM.ease.entrance } },
  };
}

/* The shell owns the drag hook; slotRef must exist before the shell renders. */
function SheetShell({
  side,
  panelId,
  dismissible,
  asChild,
  requestClose,
  children,
}: {
  side: 'right' | 'bottom';
  panelId: string;
  dismissible: boolean;
  asChild: boolean;
  requestClose: () => void;
  children: ReactNode;
}) {
  const slotRef = useRef<HTMLElement>(null);
  const { slotProps, scrimOpacity } = useSheetDrag({ side, slotRef, enabled: dismissible, requestClose });
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

export function Sheet({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger = null,
  side = 'right',
  dismissible = true,
  asChild = false,
  id,
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
            <SheetShell side={side} panelId={panelId} dismissible={dismissible} asChild={asChild} requestClose={close}>
              {ovResolveChildren(children, close)}
            </SheetShell>
          )}
        </AnimatePresence>
      </OverlayPortal>
    </Fragment>
  );
}
