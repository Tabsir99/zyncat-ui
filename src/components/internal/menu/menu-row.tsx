'use client';

import './menu-surface.css';

import type { HTMLAttributes, ReactNode, Ref } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { IconSlot } from '../icon/IconSlot';
import { cx } from '../utils/cx';

export interface MenuRowProps extends HTMLAttributes<HTMLDivElement>, DataAttributes {
  ref?: Ref<HTMLDivElement>;
  icon?: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
}

export function MenuRow({ ref, icon, label, description, trailing, className, ...rest }: MenuRowProps) {
  return (
    <div ref={ref} className={cx('menu-row', className)} {...rest}>
      {icon && (
        <span className="menu-row__icon">
          <IconSlot size="sm">{icon}</IconSlot>
        </span>
      )}
      <span className="menu-row__text">
        <span className="menu-row__label">{label}</span>
        {description && <span className="menu-row__desc">{description}</span>}
      </span>
      {trailing}
    </div>
  );
}
