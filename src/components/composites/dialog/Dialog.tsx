'use client';

import './dialog.css';
import { Fragment, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { Presence } from '../../../motion/presence';
import { resolveMotionTiming } from '../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../motion/timing';
import { useControllable } from '../../internal/hooks/use-controllable';
import { ovCloneTrigger, OverlayPortal } from '../../internal/overlay/layer';
import { ModalShell } from '../../internal/overlay/modal';
import { Icon } from '../../internal/icon/Icon';
import { IconSlot } from '../../internal/icon/IconSlot';
import { useScrollEdges } from '../../internal/hooks/use-scroll-edges';
import type { DataAttributes } from '../../../dom-props';
import { cx } from '../../internal/utils/cx';

const DIALOG_TIMING = {
  open: { duration: 'slow', ease: 'entrance' },
  close: { duration: 'base', ease: 'standard' },
} as const;

export interface DialogProps {
  /** Controlled open state. Omit for uncontrolled (use defaultOpen + trigger). */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Fires whenever the open state changes. Pair with `open` for controlled use. */
  onOpenChange?: (open: boolean) => void;
  /** Optional element cloned to open the dialog on click (uncontrolled ergonomics). */
  trigger?: ReactElement | null;
  /** Header title - rendered as the `<h2>` and wired to `aria-labelledby`. */
  title?: ReactNode;
  /** Subtext under the title - wired to `aria-describedby`. @default null */
  description?: ReactNode;
  /** Panel width. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** 'danger' tints the header icon badge + is the convention for destructive confirms. */
  tone?: 'default' | 'danger';
  /** Your own icon node for the header badge (alert dialogs). */
  icon?: ReactNode;
  /** Close button + backdrop/Esc dismissal. Default true. */
  dismissible?: boolean;
  /** Center inside this element instead of the viewport - it must be positioned (`position: relative` or similar).
   *  Scrim, scroll lock and inert scope to it; the rest of the page stays interactive. */
  container?: HTMLElement | null;
  /** Action row - a node, or a render fn `(close) => node` so uncontrolled dialogs can dismiss. */
  footer?: ReactNode | ((close: () => void) => ReactNode);
  /** Dialog body - scrolls when tall; its scroll edges flag the header lift + footer divider. */
  children?: ReactNode;
  /** Base id for the panel; drives the trigger's `aria-controls` and the title/desc aria ids.
   *  Auto-generated when omitted. */
  id?: string;
  /** Standard attributes (className, style, data-*, ...) forwarded to the dialog `<section>`. */
  htmlProps?: HTMLAttributes<HTMLElement> & DataAttributes;
  /** Open/close timing - motion tokens only, or `null` to disable. @default open 'slow'/'entrance', close 'base'/'standard' */
  animation?: DisableableAnimation;
}

interface DialogSurfaceProps {
  panelId: string;
  size: 'sm' | 'md' | 'lg';
  tone: 'default' | 'danger';
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  dismissible: boolean;
  footerContent: ReactNode;
  requestClose: () => void;
  htmlProps?: HTMLAttributes<HTMLElement> & DataAttributes;
  children?: ReactNode;
}

function DialogSurface({
  panelId,
  size,
  tone,
  icon,
  title,
  description,
  dismissible,
  footerContent,
  requestClose,
  htmlProps,
  children,
}: DialogSurfaceProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const titleId = panelId + '-title';
  const descId = panelId + '-desc';

  useScrollEdges(bodyRef, (edges, el) => {
    el.toggleAttribute('data-scroll-top', edges.top);
    el.toggleAttribute('data-scroll-bottom', edges.bottom);
  });

  return (
    <section
      {...htmlProps}
      className={cx('dialog', htmlProps?.className)}
      role="dialog"
      aria-modal="true"
      data-size={size === 'md' ? undefined : size}
      data-tone={tone === 'default' ? undefined : tone}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
    >
      {(icon || title || description || dismissible) && (
        <header className="dialog__header">
          {icon && (
            <span className="dialog__icon">
              <IconSlot size="md">{icon}</IconSlot>
            </span>
          )}
          <div className="dialog__heading">
            {title && (
              <h2 className="dialog__title" id={titleId}>
                {title}
              </h2>
            )}
            {description && (
              <p className="dialog__desc" id={descId}>
                {description}
              </p>
            )}
          </div>
          {dismissible && (
            <button type="button" className="dialog__close" aria-label="Close dialog" onClick={requestClose}>
              <Icon name="x" size="sm" weight="bold" />
            </button>
          )}
        </header>
      )}

      <div className="dialog__body" ref={bodyRef}>
        {children}
      </div>

      {footerContent && <footer className="dialog__footer">{footerContent}</footer>}
    </section>
  );
}

export function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger = null,
  title,
  description = null,
  size = 'md',
  tone = 'default',
  icon = null,
  dismissible = true,
  container = null,
  footer = null,
  children,
  id,
  htmlProps,
  animation,
}: DialogProps) {
  const autoId = useId();
  const panelId = id || 'dialog-' + autoId;
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement>(null);
  const close = () => setOpen(false);

  const timings = resolveMotionTiming(animation, DIALOG_TIMING);

  return (
    <Fragment>
      {ovCloneTrigger(trigger, { open, onPress: () => setOpen(true), panelId, haspopup: 'dialog', triggerRef })}
      <OverlayPortal container={container}>
        <Presence>
          {open && (
            <ModalShell
              key="dialog"
              animate={{ y: [6, 0], scale: [0.98, 1], opacity: [0, 1], timing: timings.open }}
              exit={{ y: [6], scale: [0.98], opacity: [0], timing: timings.close }}
              layerClass="overlay-layer--dialog"
              panelClass="overlay-panel--dialog"
              panelId={panelId}
              dismissible={dismissible}
              container={container}
              requestClose={close}
            >
              <DialogSurface
                panelId={panelId}
                size={size}
                tone={tone}
                icon={icon}
                title={title}
                description={description}
                dismissible={dismissible}
                footerContent={typeof footer === 'function' ? footer(close) : footer}
                requestClose={close}
                htmlProps={htmlProps}
              >
                {children}
              </DialogSurface>
            </ModalShell>
          )}
        </Presence>
      </OverlayPortal>
    </Fragment>
  );
}
