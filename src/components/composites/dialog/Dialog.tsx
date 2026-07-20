'use client';

/* Dialog - styled modal surface on the shared ModalShell: header (icon, title,
   description, close), a scroll-edged body, and a footer action row. */
import './dialog.css';
import { Fragment, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { resolveMotionTiming } from '../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../motion/timing';
import { useControllable } from '../../internal/hooks/use-controllable';
import { ovCloneTrigger, OverlayPortal } from '../../internal/overlay/layer';
import { ModalShell } from '../../internal/overlay/modal';
import { Icon } from '../../internal/icon/Icon';
import { IconSlot } from '../../internal/icon/IconSlot';
import { useScrollEdges } from '../../internal/hooks/use-scroll-edges';
import type { DataAttributes } from '../../../dom-props';

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
  /** Action row - a node, or a render fn `(close) => node` so uncontrolled dialogs can dismiss. */
  footer?: ReactNode | ((close: () => void) => ReactNode);
  /** Dialog body - scrolls when tall; its scroll edges flag the header lift + footer divider. */
  children?: ReactNode;
  /** Base id for the surface + its title/desc aria ids. Auto-generated when omitted. */
  id?: string;
  /** Standard attributes (className, style, data-*, ...) forwarded to the dialog `<section>`. */
  htmlProps?: HTMLAttributes<HTMLElement> & DataAttributes;
  /** Open/close timing - motion tokens only, or `null` to disable. @default open 'slow'/'entrance', close 'base'/'standard' */
  animation?: DisableableAnimation;
}

interface DialogSurfaceProps {
  baseId: string;
  size: 'sm' | 'md' | 'lg';
  tone: 'default' | 'danger';
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  dismissible: boolean;
  footerContent: ReactNode;
  onRequestClose: () => void;
  htmlProps?: HTMLAttributes<HTMLElement> & DataAttributes;
  children?: ReactNode;
}

function DialogSurface({
  baseId,
  size,
  tone,
  icon,
  title,
  description,
  dismissible,
  footerContent,
  onRequestClose,
  htmlProps,
  children,
}: DialogSurfaceProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const titleId = baseId + '-title';
  const descId = baseId + '-desc';

  /* data-scroll-top/-bottom on the body - dialog.css :has() earns the header lift + footer divider */
  useScrollEdges(bodyRef, (edges, el) => {
    el.toggleAttribute('data-scroll-top', edges.top);
    el.toggleAttribute('data-scroll-bottom', edges.bottom);
  });

  return (
    <section
      {...htmlProps}
      className={htmlProps?.className ? 'dialog ' + htmlProps.className : 'dialog'}
      role="dialog"
      aria-modal="true"
      data-size={size === 'md' ? undefined : size}
      data-tone={tone === 'default' ? undefined : tone}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
    >
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
          <button type="button" className="dialog__close" aria-label="Close dialog" onClick={onRequestClose}>
            <Icon name="x" size="sm" weight="bold" />
          </button>
        )}
      </header>

      <div className="dialog__body" ref={bodyRef}>
        {children}
      </div>

      {footerContent && <footer className="dialog__footer">{footerContent}</footer>}
    </section>
  );
}

export function Dialog({
  open,
  defaultOpen = false,
  onOpenChange,
  trigger = null,
  title,
  description = null,
  size = 'md',
  tone = 'default',
  icon = null,
  dismissible = true,
  footer = null,
  children,
  id,
  htmlProps,
  animation,
}: DialogProps) {
  const autoId = useId();
  const baseId = id || 'dialog-' + autoId;
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement>(null);
  const close = () => setOpen(false);

  const timings = resolveMotionTiming(animation, DIALOG_TIMING);
  const dialogVariants = {
    closed: { opacity: 0, y: 6, scale: 0.98, transition: timings.close },
    open: { opacity: 1, y: 0, scale: 1, transition: timings.open },
  };

  return (
    <Fragment>
      {ovCloneTrigger(trigger, {
        open: isOpen,
        onPress: () => setOpen(true),
        panelId: baseId,
        haspopup: 'dialog',
        triggerRef,
      })}
      <OverlayPortal>
        <AnimatePresence>
          {isOpen && (
            <ModalShell
              layerClass="overlay-layer--dialog"
              slotClass="overlay-slot--dialog"
              slotVariants={dialogVariants}
              panelId={baseId}
              dismissible={dismissible}
              requestClose={close}
            >
              <DialogSurface
                baseId={baseId}
                size={size}
                tone={tone}
                icon={icon}
                title={title}
                description={description}
                dismissible={dismissible}
                footerContent={typeof footer === 'function' ? footer(close) : footer}
                onRequestClose={close}
                htmlProps={htmlProps}
              >
                {children}
              </DialogSurface>
            </ModalShell>
          )}
        </AnimatePresence>
      </OverlayPortal>
    </Fragment>
  );
}
