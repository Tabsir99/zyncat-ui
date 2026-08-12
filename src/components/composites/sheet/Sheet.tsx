'use client';

import './sheet.css';
import { Fragment, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { animate, type Layer } from '../../../engine';
import { Presence } from '../../../motion/presence';
import type { MotionSpecs } from '../../../motion/use-motion';
import { resolveMotionTiming } from '../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../motion/timing';
import { useControllable } from '../../internal/hooks/use-controllable';
import { ovCloneTrigger, OverlayPortal } from '../../internal/overlay/layer';
import { ModalShell } from '../../internal/overlay/modal';
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

  /** Base id for the panel; drives the trigger's `aria-controls`. Auto-generated when omitted. */
  id?: string;
  /** Standard attributes (className, style, data-*, ...) forwarded to the sheet panel. */
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  /** Open/close timing - motion tokens only, or `null` to disable. @default open 'slow'/'entrance', close 'base'/'exit' */
  animation?: DisableableAnimation;
  /** The ENTIRE surface - paint AND semantics. Drive dismissal with `open`/`onOpenChange`. */
  children: ReactNode;
}

function sheetSlide(slot: HTMLElement, side: 'right' | 'bottom', at: number[]): Layer {
  const frames = at.map((ratio) => ratio * sheetSpan(slot, side));
  return side === 'bottom' ? { y: frames } : { x: frames };
}

function SheetShell({
  side,
  panelId,
  dismissible,
  requestClose,
  htmlProps,
  animate,
  exit,
  children,
}: {
  side: 'right' | 'bottom';
  panelId: string;
  dismissible: boolean;
  requestClose: () => void;
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  children: ReactNode;
} & MotionSpecs) {
  const panelRef = useRef<HTMLElement>(null);
  const dragProps = useSheetDrag({ side, panelRef, enabled: dismissible, requestClose });
  return (
    <ModalShell
      animate={animate}
      exit={exit}
      layerClass={'overlay-layer--sheet-' + side}
      panelClass={'overlay-panel--sheet-' + side}
      panelId={panelId}
      dismissible={dismissible}
      requestClose={requestClose}
      panelRef={panelRef}
      panelProps={{ ...htmlProps, ...dragProps }}
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
        <Presence>
          {open && (
            <SheetShell
              key="sheet"
              animate={(slot) => {
                const play = animate(slot, { ...sheetSlide(slot, side, [1, 0]), timing: timings.open });
                play.finished.then(() => play.stop());
                return play;
              }}
              exit={(slot) => animate(slot, { ...sheetSlide(slot, side, [1]), timing: timings.close })}
              side={side}
              panelId={panelId}
              dismissible={dismissible}
              requestClose={close}
              htmlProps={htmlProps}
            >
              {children}
            </SheetShell>
          )}
        </Presence>
      </OverlayPortal>
    </Fragment>
  );
}
