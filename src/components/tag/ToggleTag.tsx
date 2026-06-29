'use client';

/* ToggleTag.jsx — ToggleTag: the on/off filter chip.
   ─────────────────────────────────────────────────────────────────────────
   A <button aria-pressed> for many-of-many filtering — content types,
   tags, saved segments. Sibling of <Tag> per CLAUDE.md A9:
   it OWNS selection state (controllable `selected` / `defaultSelected`),
   which the stateless removable Tag never does.

   Selected paint is the accent wash — and the indicator adapts:
     • no icon  → a tick slot slides open (the Collapse width mechanism,
       collapse.css classes reused directly — zero CSS duplicated) while the
       check DRAWS in (stroke-dashoffset, brand entrance curve).
     • icon     → no tick; both weights render stacked and the fill BLOOMS
       in over the regular glyph (crossfade + spring overshoot, CSS-only) —
       the system-wide "selected" mark (§D) without an instant font swap.
       No width change, nothing reflows.

   Counts are data → mono tabular, via the `count` prop (§E).
   All styling lives in tag.css; this file composes class names only. */

import * as React from 'react';
import { Icon } from '../icon/Icon';

/** ToggleTag — the on/off filter chip (<button aria-pressed>). */
export interface ToggleTagProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'children'
> {
  /** The label. */
  children: React.ReactNode;
  /** Controlled selected value. Omit for uncontrolled. */
  selected?: boolean;
  /** Uncontrolled initial value. */
  defaultSelected?: boolean;
  /** Fires with the next value on every toggle. */
  onChange?: (selected: boolean) => void;
  /** Phosphor icon name or alias; weight flips regular → fill when selected
   *  (replaces the tick — the icon IS the selected mark). */
  icon?: string | null;
  /** Optional result count — rendered mono/tabular. */
  count?: React.ReactNode;
  /** 'md' = 28px (default) · 'sm' = 24px for dense rows. */
  size?: 'md' | 'sm';
  disabled?: boolean;
  className?: string;
}

/* GOTCHA: split props manually instead of object-rest. */
const TOGGLE_TAG_OWN_PROPS: Record<string, number> = {
  children: 1,
  selected: 1,
  defaultSelected: 1,
  onChange: 1,
  icon: 1,
  count: 1,
  size: 1,
  disabled: 1,
  className: 1,
};
function toggleTagRestProps(props: Record<string, unknown>, own: Record<string, number>) {
  const rest: Record<string, unknown> = {};
  for (const k in props) {
    if (!own[k]) rest[k] = props[k];
  }
  return rest;
}

function ToggleTagTick({ selected }: { selected: boolean }) {
  /* collapse.css mechanism on spans — width 0fr ↔ 1fr, content clipped */
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

export function ToggleTag(props: ToggleTagProps) {
  const {
    children, // the label
    selected: controlledSelected, // controlled value (optional)
    defaultSelected = false, // uncontrolled initial value
    onChange, // (next: boolean) — fires on every toggle
    icon = null, // Phosphor name or alias — fill when selected
    count = null, // optional result count — mono tabular
    size = 'md', // 'md' (28) | 'sm' (24)
    disabled = false,
    className = '',
  } = props;
  const rest = toggleTagRestProps(
    props as unknown as Record<string, unknown>,
    TOGGLE_TAG_OWN_PROPS,
  );
  const [uncontrolled, setUncontrolled] = React.useState(defaultSelected);
  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : uncontrolled;

  function toggle() {
    const next = !selected;
    if (!isControlled) setUncontrolled(next);
    if (onChange) onChange(next);
  }

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
        <span className="tag__icon tag__icon--dual">
          <Icon name={icon} size="sm" weight="regular" />
          <Icon name={icon} size="sm" weight="fill" />
        </span>
      ) : (
        <ToggleTagTick selected={selected} />
      )}
      <span className="tag__label">{children}</span>
      {count != null && <span className="tag__count">{count}</span>}
    </button>
  );
}
