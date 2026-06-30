'use client';

/* Dialog — styled modal surface; a thin consumer of <Overlay mode="dialog">. */
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

/* Flag the body's scroll edges (data-scroll-top/-bottom) so dialog.css :has() can earn the header lift + footer divider. */
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
