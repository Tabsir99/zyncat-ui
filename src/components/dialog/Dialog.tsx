'use client';

/* Dialog.tsx — styled modal: a thin consumer of <Overlay mode="dialog">.
   ─────────────────────────────────────────────────────────────────────────
   The overlay primitive owns ALL machinery — portal, scrim, Motion existence
   (enter/exit + unmount-after-exit), hard focus trap, inert page, scroll
   lock, Esc-topmost, stacking. This file owns only the dialog
   SURFACE: header (icon · title · description · close), scrollable body with
   earned dividers, footer actions — and the semantics (role="dialog",
   aria-modal, labelled-by), per the headless contract.

   The native <dialog> era is over: no showModal(), no ::backdrop hack, no
   AnimatePresence plumbing here. Public API is unchanged from the previous
   stable Dialog — callers notice nothing. */
import * as React from 'react';
import { Overlay } from '../overlay/Overlay';
import { Icon } from '../icon/Icon';
import { IconSlot } from '../icon/IconSlot';

const { useRef: dlgUseRef, useEffect: dlgUseEffect, useId: dlgUseId } = React;

export interface DialogProps {
  /** Controlled open state. Omit for uncontrolled (use defaultOpen + trigger). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional element cloned to open the dialog on click (uncontrolled ergonomics). */
  trigger?: React.ReactElement | null;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** 'danger' tints the header icon badge + is the convention for destructive confirms. */
  tone?: 'default' | 'danger';
  /** Your own icon node for the header badge (alert dialogs). */
  icon?: React.ReactNode;
  /** Close button + backdrop/Esc dismissal. Default true. */
  dismissible?: boolean;
  /** Action row — a node, or a render fn `(close) => node` so uncontrolled dialogs can dismiss. */
  footer?: React.ReactNode | ((close: () => void) => React.ReactNode);
  children?: React.ReactNode;
  id?: string;
}

/* Flags the scrollable body when scrolled off the top / has more below, so the
   header gains a divider+lift and the footer a divider only when they earn it.
   :has() in dialog.css turns these into the visible chrome. */
function useScrollEdges(ref: React.RefObject<HTMLElement>) {
  dlgUseEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      el.toggleAttribute('data-scroll-top', el.scrollTop > 1);
      el.toggleAttribute(
        'data-scroll-bottom',
        el.scrollTop + el.clientHeight < el.scrollHeight - 1,
      );
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [ref]);
}

interface DialogSurfaceProps {
  baseId: string;
  size: 'sm' | 'md' | 'lg';
  tone: 'default' | 'danger';
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  dismissible: boolean;
  footerContent: React.ReactNode;
  onRequestClose: () => void;
  children?: React.ReactNode;
}

/* The visible panel — a plain <section> inside Overlay's centered slot. */
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
  children,
}: DialogSurfaceProps) {
  const bodyRef = dlgUseRef<HTMLDivElement>(null);
  const titleId = baseId + '-title';
  const descId = baseId + '-desc';

  useScrollEdges(bodyRef);

  return (
    <section
      className="dialog"
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
          <button
            type="button"
            className="dialog__close"
            aria-label="Close dialog"
            onClick={onRequestClose}
          >
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
  trigger = null, // optional element; cloned to open on click
  title,
  description = null,
  size = 'md', // 'sm' | 'md' | 'lg'
  tone = 'default', // 'default' | 'danger' → header icon + accent
  icon = null, // optional header badge icon node (alert dialogs)
  dismissible = true, // close button + scrim/Esc dismiss
  footer = null, // node OR (close) => node
  children,
  id,
}: DialogProps) {
  const autoId = dlgUseId();
  const baseId = id || 'dialog-' + autoId;

  return (
    <Overlay
      mode="dialog"
      id={baseId}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      trigger={trigger}
      dismissible={dismissible}
    >
      {({ close }) => (
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
        >
          {children}
        </DialogSurface>
      )}
    </Overlay>
  );
}
