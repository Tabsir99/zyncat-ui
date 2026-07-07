'use client';

/* ToggleTag - on/off filter chip (<button aria-pressed>); owns its selection state. */

import './tag.css';
/* The tick clip renders .collapse classes - collapse.css must ride along. */
import '../motion/collapse.css';
import * as React from 'react';
import { IconSlot } from '../icon/IconSlot';
import { useControllable } from '../use-controllable';

/** ToggleTag - the on/off filter chip (<button aria-pressed>). */
export interface ToggleTagProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'children'
> {
  /** Chip content; the label shown beside the tick or `icon`. */
  children: React.ReactNode;
  /** Controlled selected value. Omit for uncontrolled. */
  selected?: boolean;
  /** Uncontrolled initial value. */
  defaultSelected?: boolean;
  /** Fires with the next value on every toggle. */
  onChange?: (selected: boolean) => void;
  /** Your own icon node; replaces the tick. Selected state reads from the wash. */
  icon?: React.ReactNode | null;
  /** Optional result count - rendered mono/tabular. */
  count?: React.ReactNode;
  /** 'md' = 28px (default) - 'sm' = 24px for dense rows. */
  size?: 'md' | 'sm';
  /** Disable the button, blocking toggles. @default false */
  disabled?: boolean;
  /** Extra class(es) merged onto the root element. */
  className?: string;
}

function ToggleTagTick({ selected }: { selected: boolean }) {
  /* collapse.css mechanism on spans - width 0fr and 1fr, content clipped */
  return (
    <span
      className="tag__check collapse"
      data-axis="width"
      data-open={selected ? 'true' : 'false'}
      aria-hidden="true"
    >
      <span className="collapse__inner">
        <svg viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.5 L5 9 L9.5 3.5"
            pathLength="1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}

export function ToggleTag({
  children,
  selected: selectedProp,
  defaultSelected = false,
  onChange,
  icon = null,
  count = null,
  size = 'md',
  disabled = false,
  className = '',
  ...rest
}: ToggleTagProps) {
  const [selected, setSelected] = useControllable(selectedProp, defaultSelected, onChange);
  const toggle = () => setSelected(!selected);

  const classes = ['tag', 'tag--toggle', size === 'sm' ? 'tag--sm' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected}
      disabled={disabled}
      onClick={toggle}
      {...rest}
    >
      {icon ? (
        <span className="tag__icon">
          <IconSlot size="sm">{icon}</IconSlot>
        </span>
      ) : (
        <ToggleTagTick selected={selected} />
      )}
      <span className="tag__label">{children}</span>
      {count != null && <span className="tag__count">{count}</span>}
    </button>
  );
}
