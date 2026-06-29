'use client';

/* DateTimeField.tsx — date + time picker.
   ─────────────────────────────────────────────────────────────────────────
   Sibling of DateField (A9: a different value shape owns its own component):
   the value is 'YYYY-MM-DDTHH:mm' — wall-clock, target timezone. The same
   calendar panel (DtpPanel, domain-internal) with the segmented time machine
   (time-core.tsx) seated between the grid and the footer.

     <DateTimeField
       label="Starts at"
       value="2026-06-18T09:30"     // 'YYYY-MM-DDTHH:mm' | null
       onChange={(v) => …}
       timezone="Europe/Riga"
       min="2026-06-12T14:00"        // date or datetime — see below
       format="24h" minuteStep={5}
     />

   OPINIONS:
     • commit is LIVE but HONEST — only complete datetimes commit. Half-picked
       halves (a day without a time, a time without a day) wait in local
       state; the trigger shows the gap ('Jun 18, --:--').
     • min/max accept a date ('YYYY-MM-DD') or a datetime. The date part
       gates the day grid; the time part applies ONLY on the boundary date,
       as a clamp — picking the boundary day with a stranded earlier time
       saturates it to the earliest valid (never an error state).
     • duplication with DateField (display helpers, the field shell) is
       deliberate — siblings stay disentangled (A9).

   Primitives consumed (A8): DtpPanel (via its variant-blind `slot`),
   TimeSegments, Overlay, the .fld vocabulary, Icon. */

import * as React from 'react';
import { Overlay } from '../overlay/Overlay';
import { FieldShell } from './field-shell';
import { TimeSegments } from './time-core';
import { DtpPanel } from './DateField';
import { MONTHS as DTTF_MONTHS, pad as dttfPad } from './date-utils';

const { useState, useEffect } = React;

interface DateTimeParts {
  date: string | null;
  time: string | null;
}

function dttfDisplayDate(key: string): string {
  const p = key.split('-').map(Number);
  const year = p[0] === new Date().getFullYear() ? '' : ', ' + p[0];
  return DTTF_MONTHS[p[1] - 1].slice(0, 3) + ' ' + dttfPad(p[2]) + year;
}
function dttfDisplayTime(t: string, format?: '24h' | '12h'): string {
  if (format !== '12h') return t;
  const p = t.split(':').map(Number);
  const mer = p[0] >= 12 ? 'PM' : 'AM';
  return ((p[0] + 11) % 12) + 1 + ':' + dttfPad(p[1]) + ' ' + mer;
}
/* value: 'YYYY-MM-DDTHH:mm' → parts. Limits may be date-only. */
function dttfSplit(v: string | null | undefined): DateTimeParts {
  if (!v) return { date: null, time: null };
  const i = v.indexOf('T');
  return i < 0 ? { date: v, time: null } : { date: v.slice(0, i), time: v.slice(i + 1) };
}

export interface DateTimeFieldProps {
  /** Controlled value, 'YYYY-MM-DDTHH:mm'. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  /** IANA timezone (e.g. 'Europe/Riga') — display context, shown in the footer. */
  timezone?: string;
  /** Lower bound — 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm', inclusive. */
  min?: string;
  /** Upper bound — 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm', inclusive. */
  max?: string;
  /** Time display only; storage stays 24h. Default '24h'. */
  format?: '24h' | '12h';
  /** ↑/↓ step granularity in minutes (typing is exact). Default 5. */
  minuteStep?: number;
  required?: boolean;
  invalid?: boolean;
  message?: string;
  disabled?: boolean;
  className?: string;
}

export function DateTimeField({
  value, // controlled: 'YYYY-MM-DDTHH:mm' | null
  defaultValue = null,
  onChange,
  label,
  placeholder = 'Pick date & time',
  timezone,
  min, // 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm' (inclusive)
  max,
  format = '24h',
  minuteStep = 5,
  required = false,
  invalid = false,
  message,
  disabled = false,
  className = '',
}: DateTimeFieldProps) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState<string | null>(defaultValue);
  const val = controlled ? value : inner;
  const parts = dttfSplit(val);

  /* incomplete halves wait here; a committed value supersedes them */
  const [pendDate, setPendDate] = useState<string | null>(null);
  const [pendTime, setPendTime] = useState<string | null>(null);
  useEffect(() => {
    setPendDate(null);
    setPendTime(null);
  }, [val]);

  const date = pendDate != null ? pendDate : parts.date;
  const time = pendTime != null ? pendTime : parts.time;

  const minL = dttfSplit(min);
  const maxL = dttfSplit(max);
  /* time bounds exist only on the boundary date */
  const minTime = date && date === minL.date ? minL.time : null;
  const maxTime = date && date === maxL.date ? maxL.time : null;

  function commitIf(d: string | null, t: string | null) {
    if (!d || !t) return;
    let tt = t;
    if (minL.time && d === minL.date && tt < minL.time) tt = minL.time;
    if (maxL.time && d === maxL.date && tt > maxL.time) tt = maxL.time;
    if (tt !== t) setPendTime(tt); /* reflect the clamp into the segments */
    const next = d + 'T' + tt;
    if (next === val) return;
    if (!controlled) setInner(next);
    if (onChange) onChange(next);
  }
  function handleDate(d: string) {
    setPendDate(d);
    commitIf(d, time);
  }
  function handleTime(t: string) {
    setPendTime(t);
    commitIf(date, t);
  }

  const display = date
    ? dttfDisplayDate(date) + ', ' + (time ? dttfDisplayTime(time, format) : '--:--')
    : null;

  const trigger = (
    <button type="button" className="fld__input dtf__trigger" disabled={disabled}>
      {display ? (
        <span className="dtf__value">{display}</span>
      ) : (
        <span className="dtf__placeholder">{placeholder}</span>
      )}
    </button>
  );

  return (
    <FieldShell
      variant="dtf"
      label={label}
      required={required}
      invalid={invalid}
      message={message}
      icon="calendar"
      className={className}
    >
      <Overlay trigger={trigger} side="bottom" align="start">
        {(api) => (
          <DtpPanel
            val={date}
            commit={handleDate}
            close={api.close}
            min={minL.date}
            max={maxL.date}
            timezone={timezone}
            label={label}
            slot={
              <div className="dtp__time">
                <span className="dtp__timeLabel">Time</span>
                <span className="dtp__timeHint" aria-hidden="true">
                  <kbd>↑</kbd>
                  <kbd>↓</kbd>
                </span>
                <TimeSegments
                  value={time}
                  onCommit={handleTime}
                  format={format}
                  minuteStep={minuteStep}
                  min={minTime}
                  max={maxTime}
                  ariaLabel="Time"
                />
              </div>
            }
          />
        )}
      </Overlay>
    </FieldShell>
  );
}
