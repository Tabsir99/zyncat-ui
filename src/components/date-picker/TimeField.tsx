'use client';

/* TimeField.tsx - standalone time field.
   -------------------------------------------------------------------------
   The segmented HH:MM machine (time-core.tsx) wearing the Input vocabulary -
   usable anywhere a bare time is needed, without the calendar.

     <TimeField
       label="Send at"
       value="09:30"             // canonical 'HH:mm' (24h) | null
       onChange={(t) => ...}       // live - the instant both segments exist
       format="12h"              // display only; storage stays 24h
       minuteStep={15}           // ↑/↓ granularity (typing is exact)
       min="09:00" max="17:30"   // saturation bounds - clamp, never error
     />

   Primitives consumed (A8): the .fld Input vocabulary (label/message/error
   chrome), TimeSegments (the machine), Icon. The box is a div wearing
   .fld__input - clicking its empty area seats focus in the hours segment.
   Buildless global was window.TimeField; a bundled app imports it. */

import type { PointerEvent } from 'react';
import { FieldShell, useControllable } from './field-shell';
import { TimeSegments } from './time-core';

export interface TimeFieldProps {
  /** Controlled value, canonical 'HH:mm' (24h). */
  value?: string | null;
  defaultValue?: string | null;
  /** Fires live - the instant both segments exist. */
  onChange?: (value: string) => void;
  label?: string;
  /** Display only; storage stays 24h. Default '24h'. */
  format?: '24h' | '12h';
  /** ↑/↓ step granularity in minutes (typing is exact). Default 5. */
  minuteStep?: number;
  /** Lower bound 'HH:mm' - saturates, never errors. */
  min?: string;
  /** Upper bound 'HH:mm' - saturates, never errors. */
  max?: string;
  required?: boolean;
  invalid?: boolean;
  message?: string;
  disabled?: boolean;
  className?: string;
}

export function TimeField({
  value, // controlled: 'HH:mm' | null
  defaultValue = null,
  onChange,
  label,
  format = '24h',
  minuteStep = 5,
  min,
  max,
  required = false,
  invalid = false,
  message,
  disabled = false,
  className = '',
}: TimeFieldProps) {
  const [val, commit] = useControllable(value, defaultValue, onChange);

  /* clicking the box (not a segment) seats focus where typing starts */
  function onBoxPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (disabled || (e.target as HTMLElement).closest('.tsg__seg')) return;
    e.preventDefault();
    const seg = e.currentTarget.querySelector('.tsg__seg') as HTMLElement | null;
    if (seg) seg.focus();
  }

  return (
    <FieldShell
      variant="tfd"
      label={label}
      required={required}
      invalid={invalid}
      message={message}
      icon="clock"
      className={className}
    >
      <div
        className={'fld__input tfd__box' + (disabled ? ' is-disabled' : '')}
        onPointerDown={onBoxPointerDown}
      >
        <TimeSegments
          value={val}
          onCommit={commit}
          format={format}
          minuteStep={minuteStep}
          min={min}
          max={max}
          disabled={disabled}
          ariaLabel={label || 'Time'}
        />
      </div>
    </FieldShell>
  );
}
