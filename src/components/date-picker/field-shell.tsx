'use client';

/* field-shell.tsx — FieldShell + useControllable: the variant-blind field shell.
   ─────────────────────────────────────────────────────────────────────────
   Presentational chrome + a generic state hook (A9: both variant-blind — they
   know NOTHING of dates, times or ranges). Every date-domain field wears the
   .fld Input vocabulary identically: a label with the required mark, the
   .fld__control row with a leading icon, and the message slot. Only the
   CONTROL inside and the icon name differ, so those are props; everything else
   collapses to one shell. Siblings still own their value shape and commit
   semantics — this holds only the wrapper. Buildless globals were
   window.FieldShell, window.useControllable; a bundled app imports these. */

import * as React from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../icon/Icon';

const { useState, useCallback } = React;

/* controlled/uncontrolled value with a stable commit. Siblings whose commit
   is plain (DateField, DateRangeField, TimeField) use this; DateTimeField
   keeps its own honest-commit + clamp inline (A9: don't force a leaky core
   to absorb logic that is genuinely that sibling's own). */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const controlled = value !== undefined;
  const [inner, setInner] = useState<T>(defaultValue);
  const val = controlled ? (value as T) : inner;
  const commit = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      if (onChange) onChange(next);
    },
    [controlled, onChange],
  );
  return [val, commit];
}

export interface FieldShellProps {
  variant: string;
  label?: string;
  required?: boolean;
  invalid?: boolean;
  message?: ReactNode;
  icon: string;
  className?: string;
  children?: ReactNode;
}

export function FieldShell({
  variant,
  label,
  required,
  invalid,
  message,
  icon,
  className,
  children,
}: FieldShellProps) {
  const cls = ['fld', variant, 'fld--has-lead', invalid ? 'is-error' : '', className || '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls}>
      {label ? (
        <span className="fld__label">
          {label}
          {required ? (
            <span className="fld__req" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <div className="fld__control">
        {children}
        <span className="fld__icon fld__icon--lead" aria-hidden="true">
          <Icon name={icon} size="md" />
        </span>
      </div>
      {message ? (
        <div className="fld__msg">
          <span>{message}</span>
        </div>
      ) : null}
    </div>
  );
}
