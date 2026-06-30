'use client';

/* Tag (+ TagGroup) - removable/editable label; stateless, the parent owns the list. */

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { IconSlot } from '../icon/IconSlot';

/** Tag - the removable, editable label (stateless; the parent owns the list). */
export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The label. */
  children: React.ReactNode;
  /** Your own icon node, sized small and tinted to the tag's text. */
  icon?: React.ReactNode | null;
  /** Presence adds the remove button; called on click - remove the item yourself. */
  onRemove?: (() => void) | null;
  /** Accessible label for the remove button. Defaults to "Remove {label}" for string labels. */
  removeLabel?: string;
  /** 'md' = 28px (default) - 'sm' = 24px for dense rows. */
  size?: 'md' | 'sm';
  disabled?: boolean;
  className?: string;
}

/** TagGroup - wrapping flex row + removal/insertion choreography. */
export interface TagGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the group (role="group"). */
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

const TagGroupContext = React.createContext(false);

/* GOTCHA (buildless pages): split props manually, not object-rest. */
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

/* The remove glyph - drawn inline (path-level, per section D) so it can wind up on hover. */
function TagRemoveGlyph() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Tag(props: TagProps) {
  const {
    children,
    icon = null,
    onRemove = null,
    removeLabel,
    size = 'md',
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
          <IconSlot size="sm">{icon}</IconSlot>
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
