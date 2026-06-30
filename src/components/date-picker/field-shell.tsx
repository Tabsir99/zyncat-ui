'use client';

/* FieldShell + useControllable - the variant-blind .fld chrome and a controlled/uncontrolled state hook. */

import * as React from 'react';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '../icon/Icon';

const { useState, useCallback } = React;

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
  icon: IconName;
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
