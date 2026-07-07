'use client';

/* Tag (+ TagGroup) - removable/editable label; stateless, the parent owns the list. */

import './tag.css';
import { createContext, useContext, Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { IconSlot } from '../icon/IconSlot';

/** Tag - the removable, editable label (stateless; the parent owns the list). */
export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Tag content; a string label also seeds the default remove-button `aria-label`. */
  children: ReactNode;
  /** Your own icon node, sized small and tinted to the tag's text. */
  icon?: ReactNode | null;
  /** Presence adds the remove button; called on click - remove the item yourself. */
  onRemove?: (() => void) | null;
  /** Accessible label for the remove button. Defaults to "Remove {label}" for string labels. */
  removeLabel?: string;
  /** 'md' = 28px (default) - 'sm' = 24px for dense rows. */
  size?: 'md' | 'sm';
  /** Set `data-disabled` on the tag and disable its remove button. @default false */
  disabled?: boolean;
  /** Extra class(es) merged onto the root element. */
  className?: string;
}

/** TagGroup - wrapping flex row + removal/insertion choreography. */
export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the group (role="group"). */
  label?: string;
  /** The `Tag`s; wrapped in `AnimatePresence` so adds/removes animate. */
  children?: ReactNode;
  /** Extra class(es) merged onto the group wrapper. */
  className?: string;
}

const TagGroupContext = createContext(false);

/* The remove glyph - drawn inline (path-level, per section D) so it can wind up on hover. */
function TagRemoveGlyph() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Tag({
  children,
  icon = null,
  onRemove = null,
  removeLabel,
  size = 'md',
  disabled = false,
  className = '',
  ...rest
}: TagProps) {
  const grouped = useContext(TagGroupContext);
  const classes = ['tag', size === 'sm' ? 'tag--sm' : '', className].filter(Boolean).join(' ');

  const xLabel = removeLabel || (typeof children === 'string' ? 'Remove ' + children : 'Remove');

  const content = (
    <Fragment>
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
    </Fragment>
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
      /* span props whose names collide with Motion gesture callbacks (onDrag*) can't be
         typed onto a motion element; the runtime spread is unchanged */
      {...(rest as Record<string, unknown>)}
    >
      {content}
    </motion.span>
  );
}

export function TagGroup({ label, className = '', children, ...rest }: TagGroupProps) {
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
