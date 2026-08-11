'use client';

import './tag.css';
import { createContext, useContext, Fragment, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { resolveMotionTiming } from '../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../motion/timing';
import { IconSlot } from '../../internal/icon/IconSlot';
import type { DataAttributes } from '../../../dom-props';

const TAG_TIMING = { open: { duration: 'base', ease: 'entrance' }, close: { duration: 'fast', ease: 'exit' } } as const;
const TAG_LAYOUT_TIMING = {
  open: { duration: 'slow', ease: 'entrance' },
  close: { duration: 'slow', ease: 'entrance' },
} as const;

interface TagOwnProps {
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
  /** Inline styles merged onto the root element. */
  style?: CSSProperties;
}

/** Tag - the removable, editable label (stateless; the parent owns the list). */
export interface TagProps extends TagOwnProps {
  /** Standard <span> attributes forwarded to the tag root. */
  htmlProps?: Omit<HTMLAttributes<HTMLSpanElement>, keyof TagOwnProps> & DataAttributes;
}

interface TagGroupOwnProps {
  /** Accessible name for the group (role="group"). */
  label?: string;
  /** The `Tag`s; wrapped in `AnimatePresence` so adds/removes animate. */
  children?: ReactNode;
  /** Extra class(es) merged onto the group wrapper. */
  className?: string;
  /** Inline styles merged onto the group wrapper. */
  style?: CSSProperties;
  /** Add/remove/reflow timing for the member tags - motion tokens only, or `null` to disable. */
  animation?: DisableableAnimation;
}

/** TagGroup - wrapping flex row + removal/insertion choreography. */
export interface TagGroupProps extends TagGroupOwnProps {
  /** Standard <div> attributes forwarded to the group wrapper. */
  htmlProps?: Omit<HTMLAttributes<HTMLDivElement>, keyof TagGroupOwnProps> & DataAttributes;
}

interface TagGroupCtx {
  grouped: boolean;
  animation?: DisableableAnimation;
}
const TagGroupContext = createContext<TagGroupCtx>({ grouped: false });

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
  style,
  htmlProps,
}: TagProps) {
  const { grouped, animation } = useContext(TagGroupContext);
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
        <button type="button" className="tag__remove" aria-label={xLabel} disabled={disabled} onClick={onRemove}>
          <TagRemoveGlyph />
        </button>
      )}
    </Fragment>
  );

  if (!grouped) {
    return (
      <span className={classes} style={style} data-disabled={disabled ? 'true' : undefined} {...htmlProps}>
        {content}
      </span>
    );
  }

  const enterExit = resolveMotionTiming(animation, TAG_TIMING);
  const layout = resolveMotionTiming(animation, TAG_LAYOUT_TIMING).open;
  return (
    <motion.span
      layout
      className={classes}
      style={style}
      data-disabled={disabled ? 'true' : undefined}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, transition: enterExit.open }}
      exit={{ opacity: 0, scale: 0.9, transition: enterExit.close }}
      transition={layout}
      {...(htmlProps as Record<string, unknown>)}
    >
      {content}
    </motion.span>
  );
}

export function TagGroup({ label, className = '', style, children, htmlProps, animation }: TagGroupProps) {
  return (
    <div
      className={['tag-group', className].filter(Boolean).join(' ')}
      style={style}
      role="group"
      aria-label={label}
      {...htmlProps}
    >
      <TagGroupContext.Provider value={{ grouped: true, animation }}>
        <AnimatePresence initial={false}>{children}</AnimatePresence>
      </TagGroupContext.Provider>
    </div>
  );
}
