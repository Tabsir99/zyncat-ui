'use client';

import './input.css';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '../../internal/icon/Icon';
import { Collapse } from '../../../motion/Collapse';

export interface FieldMessagingProps {
  /** Field id, ties the label to the control. */
  id?: string;
  /** Label text (sentence case). */
  label?: ReactNode;
  /** Show a danger `*` after the label. */
  required?: boolean;
  /** Show a muted "(optional)" after the label. */
  optional?: boolean;
  /** Neutral helper text - shown when there's no validation message. */
  helper?: ReactNode;
  /** Error message - sets the error state (border + icon + colour). Wins over warning/success/helper. */
  error?: ReactNode;
  /** Warning message - amber state. Loses to `error`; wins over `success`/`helper`. */
  warning?: ReactNode;
  /** Success message - green state. Loses to `error`/`warning`; wins over `helper`. */
  success?: ReactNode;
}

export interface FieldLabelProps {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  optional?: boolean;
}

export function FieldLabel({ id, label, required, optional }: FieldLabelProps) {
  if (!label) return null;
  return (
    <label className="fld__label" htmlFor={id}>
      {label}
      {required && (
        <span className="fld__req" aria-hidden="true">
          *
        </span>
      )}
      {optional && <span className="fld__optional">(optional)</span>}
    </label>
  );
}

export interface FieldMessageProps {
  message?: ReactNode;
  icon?: IconName | null;
}

export function FieldMessage({ message, icon }: FieldMessageProps) {
  return (
    <Collapse open={!!message} className="fld__msg-wrap">
      <div className="fld__msg">
        {icon && <Icon name={icon} size="sm" weight="fill" />}
        {message}
      </div>
    </Collapse>
  );
}

export function resolveFieldMessage(
  error: ReactNode,
  warning: ReactNode,
  success: ReactNode,
  helper: ReactNode,
): { state: string; msg: ReactNode; msgIcon: IconName | null } {
  return {
    state: error ? 'is-error' : warning ? 'is-warning' : success ? 'is-success' : '',
    msg: error || warning || success || helper,
    msgIcon: error ? 'warning-circle' : warning ? 'warning' : success ? 'check-circle' : null,
  };
}
