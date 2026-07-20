'use client';

/* The trigger button shared by both variants. The a11y wiring (ref, ids, expanded state,
   open/close) comes straight off the listbox brain; only the display bits - label text,
   leading icon, overflow count, disabled/invalid - are decided per variant. */
import type { ReactNode } from 'react';
import { Icon } from '../../../internal/icon/Icon';
import { IconSlot } from '../../../internal/icon/IconSlot';
import type { ListboxState } from './use-listbox';

export interface SelectTriggerProps {
  /** The listbox brain - supplies the trigger ref, ids, open state and the show/hide handlers. */
  lb: ListboxState;
  disabled?: boolean;
  invalid?: boolean;
  ariaLabel?: string;
  leading?: ReactNode;
  text?: string;
  isPlaceholder?: boolean;
  count?: number;
}

export function SelectTrigger({
  lb,
  disabled,
  invalid,
  ariaLabel,
  leading,
  text,
  isPlaceholder,
  count,
}: SelectTriggerProps) {
  const { triggerRef, baseId, open, adId, show, hide } = lb;
  return (
    <button
      type="button"
      ref={triggerRef}
      id={baseId + '-trigger'}
      className="select__trigger"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={baseId + '-list'}
      aria-activedescendant={adId}
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      onClick={() => (open ? hide() : show())}
      onKeyDown={(e) => {
        if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault();
          show();
        }
      }}
    >
      {leading && (
        <span className="select__leading">
          <IconSlot size="sm">{leading}</IconSlot>
        </span>
      )}
      <span className="select__value" data-placeholder={isPlaceholder ? 'true' : undefined}>
        {text}
      </span>
      {count != null && count > 0 && <span className="select__count">+{count}</span>}
      <span className="select__caret">
        <Icon name="caret-down" size="sm" />
      </span>
    </button>
  );
}
