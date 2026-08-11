'use client';

import './sheet.css';
import { Fragment, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import type { Vec } from '../../../engine';
import { Presence } from '../../../motion/presence';
import { resolveMotionTiming } from '../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../motion/timing';
import { useControllable } from '../../internal/hooks/use-controllable';
import { ovResolveChildren, ovCloneTrigger, OverlayPortal } from '../../internal/overlay/layer';
import { ModalShell, ovModalPlays } from '../../internal/overlay/modal';
import { useSheetDrag, sheetSpan } from './use-sheet-drag';
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

function sheetSlotSpan(layer: HTMLElement, side: 'right' | 'bottom'): Vec {
  const slot = layer.querySelector<HTMLElement>('.overlay-slot');
  const span = slot ? sheetSpan(slot, side) : 0;
  return side === 'bottom' ? [0, span] : [span, 0];
}

function SheetShell({
  side,
  panelId,
  dismissible,
  asChild,
  requestClose,
  htmlProps,
  children,
}: {
  side: 'right' | 'bottom';
  panelId: string;
  dismissible: boolean;
  asChild: boolean;
  requestClose: () => void;
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  children: ReactNode;
}) {
  const slotRef = useRef<HTMLElement>(null);
  const slotProps = useSheetDrag({ side, slotRef, enabled: dismissible, requestClose });
  return (
    <ModalShell
      layerClass={'overlay-layer--sheet-' + side}
      slotClass={'overlay-slot--sheet-' + side}
      panelId={panelId}
      dismissible={dismissible}
      requestClose={requestClose}
      asChild={asChild}
      slotRef={slotRef}
      slotProps={{ ...htmlProps, ...slotProps }}
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
  const timings = resolveMotionTiming(animation, SHEET_TIMING);

  return (
    <Fragment>
      {ovCloneTrigger(trigger, { open, onPress: () => setOpen(true), panelId, haspopup: 'dialog', triggerRef })}
      <OverlayPortal>
        <Presence
          style={{ display: 'contents' }}
          enter={(el) => {
            const plays = ovModalPlays(el, 'open', [
              { translate: [sheetSlotSpan(el, side), [0, 0]], timing: timings.open },
            ]);
            for (const play of plays) play.finished.then(() => play.stop());
            return plays;
          }}
          exit={(el) => ovModalPlays(el, 'close', [{ translate: [sheetSlotSpan(el, side)], timing: timings.close }])}
        >
          {open && (
            <SheetShell
              key="sheet"
              side={side}
              panelId={panelId}
              dismissible={dismissible}
              asChild={asChild}
              requestClose={close}
              htmlProps={htmlProps}
            >
              {ovResolveChildren(children, close)}
            </SheetShell>
          )}
        </Presence>
      </OverlayPortal>
    </Fragment>
  );
}
