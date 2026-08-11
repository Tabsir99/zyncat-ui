'use client';

import type { ReactNode } from 'react';
import { Icon } from '../../../internal/icon/Icon';
import { IconSlot } from '../../../internal/icon/IconSlot';
import type { ListboxState } from './use-listbox';
import { Button, ButtonProps } from '../../../primitives/button/Button';

export interface SelectTriggerProps extends ButtonProps {
  lb: ListboxState;
  invalid?: boolean;
  ariaLabel?: string;
  leading?: ReactNode;
  text?: ReactNode;
  isPlaceholder?: boolean;
  count?: number;
}

export function SelectTrigger({
  lb,
  invalid,
  ariaLabel,
  leading,
  text,
  isPlaceholder,
  count,
  htmlProps,
  ...rest
}: SelectTriggerProps) {
  const { triggerRef, baseId, open, adId, show, hide } = lb;
  return (
    <Button
      type="button"
      ref={triggerRef}
      variant="ghost"
      htmlProps={{
        id: baseId + '-trigger',
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-expanded': open,
        'aria-controls': baseId + '-list',
        'aria-activedescendant': adId,
        'aria-label': ariaLabel,
        'aria-invalid': invalid || undefined,
        onKeyDown: (e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            show();
          }
        },
        ...htmlProps,
      }}
      onClick={() => (open ? hide() : show())}
      iconRight={
        <span className="select__caret">
          <Icon name="caret-down" size="sm" />
        </span>
      }
      iconLeft={
        leading && (
          <span className="select__leading">
            <IconSlot size="sm">{leading}</IconSlot>
          </span>
        )
      }
      {...rest}
    >
      <span className="select__value" data-placeholder={isPlaceholder ? 'true' : undefined}>
        {text}
      </span>
      {count != null && count > 0 && <span className="select__count">+{count}</span>}
    </Button>
  );
}
