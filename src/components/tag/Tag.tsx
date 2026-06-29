'use client';

/* Tag.jsx — Tag (+ TagGroup): the removable, editable label.
   ─────────────────────────────────────────────────────────────────────────
   A Tag is user-owned metadata — an applied filter, a saved label,
   a value on a record. Stateless: the PARENT owns the list; `onRemove` just
   reports the click. Distinct from Badge (read-only status, mono, glass) —
   a Tag is a control: sans type, control chrome, focusable remove target.

   TagGroup is the choreography wrapper (CLAUDE.md §C — nothing teleports):
   it provides AnimatePresence so a removed tag plays its exit (fade + slight
   shrink, ease-exit) while the survivors FLIP into place (layout, t.layout).
   Inside a group, give every Tag a stable `key`. A standalone Tag (outside
   any group) renders a plain <span> — no Motion involved.

   Sibling `ToggleTag` (selection state) lives in ToggleTag.jsx per A9.
   All styling lives in tag.css; this file composes class names only. */

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';

/** Tag — the removable, editable label (stateless; the parent owns the list). */
export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The label. */
  children: React.ReactNode;
  /** Phosphor icon name or semantic alias, rendered via <Icon size="sm">. */
  icon?: string | null;
  /** Presence adds the × button; called on click — remove the item yourself. */
  onRemove?: (() => void) | null;
  /** Accessible label for the ×. Defaults to "Remove {label}" for string labels. */
  removeLabel?: string;
  /** 'md' = 28px (default) · 'sm' = 24px for dense rows. */
  size?: 'md' | 'sm';
  disabled?: boolean;
  className?: string;
}

/** TagGroup — wrapping flex row + removal/insertion choreography. */
export interface TagGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the group (role="group"). */
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

const TagGroupContext = React.createContext(false);

/* GOTCHA (fleet-wide, buildless pages): split props manually with a
   uniquely-named helper instead of object-rest. */
const TAG_OWN_PROPS: Record<string, number> = {
  children: 1,
  icon: 1,
  onRemove: 1,
  removeLabel: 1,
  size: 1,
  disabled: 1,
  className: 1,
};
function tagRestProps(props: Record<string, unknown>, own: Record<string, number>) {
  const rest: Record<string, unknown> = {};
  for (const k in props) {
    if (!own[k]) rest[k] = props[k];
  }
  return rest;
}

/* The × — drawn inline (path-level, per §D) so it can wind up on hover. */
function TagRemoveGlyph() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Tag(props: TagProps) {
  const {
    children, // the label
    icon = null, // Phosphor name or alias — rendered via <Icon>
    onRemove = null, // presence adds the × button; parent owns the list
    removeLabel, // a11y label for the ×; defaults from a string label
    size = 'md', // 'md' (28) | 'sm' (24)
    disabled = false,
    className = '',
  } = props;
  const rest = tagRestProps(props as unknown as Record<string, unknown>, TAG_OWN_PROPS);
  const grouped = React.useContext(TagGroupContext);
  const classes = ['tag', size === 'sm' ? 'tag--sm' : '', className].filter(Boolean).join(' ');

  const xLabel = removeLabel || (typeof children === 'string' ? 'Remove ' + children : 'Remove');

  const content = (
    <React.Fragment>
      {icon && (
        <span className="tag__icon">
          <Icon name={icon} size="sm" />
        </span>
      )}
      <span className="tag__label">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="tag__remove"
          aria-label={xLabel}
          disabled={disabled}
          onClick={onRemove}
        >
          <TagRemoveGlyph />
        </button>
      )}
    </React.Fragment>
  );

  if (!grouped) {
    return (
      <span className={classes} data-disabled={disabled ? 'true' : undefined} {...rest}>
        {content}
      </span>
    );
  }

  const { t } = UIMotion;
  return (
    <motion.span
      layout
      className={classes}
      data-disabled={disabled ? 'true' : undefined}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, transition: t.enter }}
      exit={{ opacity: 0, scale: 0.9, transition: t.exit }}
      transition={t.layout}
      {...rest}
    >
      {content}
    </motion.span>
  );
}

export function TagGroup(props: TagGroupProps) {
  const { label, className = '', children } = props;
  const rest = tagRestProps(props as unknown as Record<string, unknown>, {
    label: 1,
    className: 1,
    children: 1,
  });
  return (
    <div
      className={['tag-group', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
      {...rest}
    >
      <TagGroupContext.Provider value={true}>
        <AnimatePresence initial={false}>{children}</AnimatePresence>
      </TagGroupContext.Provider>
    </div>
  );
}
