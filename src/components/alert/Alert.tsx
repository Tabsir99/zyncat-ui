'use client';

/* Alert - the persistent, in-flow status message (banner is a paint modifier). */

import './alert.css';
import type { HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon, type IconName } from '../icon/Icon';
import { Button } from '../button/Button';
import { IconSlot } from '../icon/IconSlot';
import { useControllable } from '../use-controllable';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertAction {
  /** Sentence-case label, e.g. "Update billing". */
  label: string;
  onClick?: () => void;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Status of the message; info/success are polite, warning/danger assertive. Default 'info'. */
  tone?: AlertTone;
  /** The message - sentence case, ideally one line. */
  title: ReactNode;
  /** Optional description; stays neutral - tone marks the message, not the prose. */
  children?: ReactNode;
  /** One action max, rendered as the system secondary small button. */
  action?: AlertAction;
  /** Renders the always-visible close button. Uncontrolled unless `open` is given. */
  dismissible?: boolean;
  /** Fires on dismiss. With `open` set, the parent owns hiding the alert. */
  onDismiss?: () => void;
  /** Controlled visibility; omit for uncontrolled. Exit eases shut (height collapse). */
  open?: boolean;
  /** App-level strip: square corners, hairline below only. Paint modifier. */
  banner?: boolean;
  /** Override the tone glyph; pass null to render no glyph. */
  icon?: ReactNode | null;
}

const { t } = UIMotion;

const TONE_GLYPH: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'warning-circle',
};
const TONE_ROLE: Record<AlertTone, string> = { info: 'status', success: 'status', warning: 'alert', danger: 'alert' };

export function Alert({
  tone = 'info',
  title,
  children = null,
  action = null,
  dismissible = false,
  onDismiss,
  open,
  banner = false,
  icon,
  className = '',
  ...rest
}: AlertProps) {
  const [isOpen, setOpen] = useControllable(open, true, onDismiss);
  const dismiss = () => setOpen(false);

  const classes = ['alert', banner ? 'alert--banner' : '', className].filter(Boolean).join(' ');

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="alert-shell" /* explicit key - AnimatePresence strands un-keyed conditional children */
          className="alert-shell"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, transition: { height: t.layout, opacity: t.exit } }}
          transition={{ height: t.layout, opacity: t.enter }}
        >
          <div className={classes} data-tone={tone} role={TONE_ROLE[tone] || 'status'} {...rest}>
            {icon === null ? null : (
              <span className="alert__icon" aria-hidden="true">
                {icon !== undefined ? (
                  <IconSlot size="md">{icon}</IconSlot>
                ) : (
                  <Icon name={TONE_GLYPH[tone] || 'info'} size="md" />
                )}
              </span>
            )}
            <div className="alert__body">
              <p className="alert__title">{title}</p>
              {children != null && <p className="alert__desc">{children}</p>}
            </div>
            {action && (
              <Button variant="unstyled" size="sm" className="alert__action" onClick={action.onClick}>
                {action.label}
              </Button>
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
