'use client';

/* Alert.jsx — Alert / Banner.
   ─────────────────────────────────────────────────────────────────────────
   The persistent, in-flow status message. All paint lives in alert.css;
   this file composes the class vocabulary and owns the ONE motion:
   existence. Per §C, AnimatePresence owns enter/exit — the shell animates
   height 0 ↔ auto (+ fade) so a dismissed alert eases shut and the layout
   below settles instead of teleporting. `initial={false}` keeps alerts
   already on the page at load from re-entering — they're simply there.

   Open state is controllable: pass `open` (+ `onDismiss`) to own it, or
   omit it and `dismissible` manages itself. Banner is a paint modifier
   (A9 — it carries no state of its own).

   Semantics: warning/danger render role="alert" (assertive — failures,
   expirations), info/success role="status" (polite). The action follows
   Toast's contract — `{ label, onClick }` rendered as the system's
   secondary small button (A8), one action max. */

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertAction {
  /** Sentence-case label, e.g. "Update billing". */
  label: string;
  onClick?: () => void;
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Status of the message. info/success announce politely (role="status");
      warning/danger assertively (role="alert"). Default 'info'. */
  tone?: AlertTone;
  /** The message — sentence case, ideally one line. */
  title: React.ReactNode;
  /** Optional description (plain text / inline content). Stays neutral
      --text-body — tone marks the message, not the prose. */
  children?: React.ReactNode;
  /** One action max, rendered as the system secondary small button. */
  action?: AlertAction;
  /** Renders the always-visible ×. Uncontrolled unless `open` is given. */
  dismissible?: boolean;
  /** Fires on ×. With `open` set, the parent owns hiding the alert. */
  onDismiss?: () => void;
  /** Controlled visibility. Omit for uncontrolled. Exit eases shut
      (height collapse) — nothing teleports. */
  open?: boolean;
  /** App-level strip: square corners, hairline below only. Paint modifier —
      same component, same state. Dock it above the view yourself. */
  banner?: boolean;
  /** Override the tone glyph; pass null to render no glyph. */
  icon?: React.ReactNode | null;
}

const { t } = UIMotion;

const TONE_GLYPH: Record<AlertTone, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'warning-circle',
};
const TONE_ROLE: Record<AlertTone, string> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
};

export function Alert({
  tone = 'info', // 'info' | 'success' | 'warning' | 'danger'
  title, // the message — sentence case, one line ideally
  children = null, // optional description (plain/inline content)
  action = null, // { label, onClick } — one action max
  dismissible = false, // renders the × ; uncontrolled unless `open` given
  onDismiss,
  open, // controlled visibility (omit = uncontrolled)
  banner = false, // app-level strip: square, hairline below only
  icon, // override glyph node; null = no glyph
  className = '',
  ...rest
}: AlertProps) {
  const [selfOpen, setSelfOpen] = React.useState(true);
  const isOpen = open === undefined ? selfOpen : open;

  const dismiss = () => {
    if (open === undefined) setSelfOpen(false);
    if (onDismiss) onDismiss();
  };

  const classes = ['alert', banner ? 'alert--banner' : '', className].filter(Boolean).join(' ');

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="alert-shell" /* explicit key — the 12.40 UMD presence bookkeeping
                                 drops/strands un-keyed conditional children
                                 (same family as the Tabs/Tooltip notes) */
          className="alert-shell"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, transition: { height: t.layout, opacity: t.exit } }}
          transition={{ height: t.layout, opacity: t.enter }}
        >
          <div className={classes} data-tone={tone} role={TONE_ROLE[tone] || 'status'} {...rest}>
            {icon === null ? null : (
              <span className="alert__icon" aria-hidden="true">
                {icon !== undefined ? icon : <Icon name={TONE_GLYPH[tone] || 'info'} size="md" />}
              </span>
            )}
            <div className="alert__body">
              <p className="alert__title">{title}</p>
              {children != null && <p className="alert__desc">{children}</p>}
            </div>
            {action && (
              <button type="button" className="btn btn--sm alert__action" onClick={action.onClick}>
                {action.label}
              </button>
            )}
            {dismissible && (
              <button type="button" className="alert__close" aria-label="Dismiss" onClick={dismiss}>
                <Icon name="close" size="sm" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
