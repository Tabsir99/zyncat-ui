'use client';

/* DateTimeField - DateField's sibling for 'YYYY-MM-DDTHH:mm': the calendar panel plus the segmented time machine; commits only complete datetimes. */

import './date-picker.css';
import * as React from 'react';
import { Overlay } from '../overlay/Overlay';
import { FieldShell, FieldTrigger, type DateFieldBaseProps } from './field-shell';
import { useControllable } from '../use-controllable';
import { TimeSegments } from './time-core';
import { DtpPanel } from './DateField';
import { pad, displayDay } from './date-utils';

const { useState, useEffect } = React;

interface DateTimeParts {
  date: string | null;
  time: string | null;
}

function displayTime(t: string, format?: '24h' | '12h'): string {
  if (format !== '12h') return t;
  const p = t.split(':').map(Number);
  const mer = p[0] >= 12 ? 'PM' : 'AM';
  return ((p[0] + 11) % 12) + 1 + ':' + pad(p[1]) + ' ' + mer;
}
/* value: 'YYYY-MM-DDTHH:mm' - parts. Limits may be date-only. */
function dttfSplit(v: string | null | undefined): DateTimeParts {
  if (!v) return { date: null, time: null };
  const i = v.indexOf('T');
  return i < 0 ? { date: v, time: null } : { date: v.slice(0, i), time: v.slice(i + 1) };
}

export interface DateTimeFieldProps extends DateFieldBaseProps {
  /** Controlled value, 'YYYY-MM-DDTHH:mm'. */
  value?: string | null;
  /** Uncontrolled initial value, 'YYYY-MM-DDTHH:mm'. Use instead of `value`. @default null */
  defaultValue?: string | null;
  /** Fires once both date and time are set, with 'YYYY-MM-DDTHH:mm' (an incomplete half never commits). */
  onChange?: (value: string) => void;
  /** Trigger text shown when no value is picked. @default 'Pick date & time' */
  placeholder?: string;
  /** IANA timezone (e.g. 'Europe/Riga') - display context, shown in the footer. */
  timezone?: string;
  /** Lower bound - 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm', inclusive. */
  min?: string;
  /** Upper bound - 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm', inclusive. */
  max?: string;
  /** Time display only; storage stays 24h. Default '24h'. */
  format?: '24h' | '12h';
  /** ↑/↓ step granularity in minutes (typing is exact). Default 5. */
  minuteStep?: number;
}

export function DateTimeField({
  value,
  defaultValue = null,
  onChange,
  label,
  placeholder = 'Pick date & time',
  timezone,
  min,
  max,
  format = '24h',
  minuteStep = 5,
  required = false,
  invalid = false,
  message,
  disabled = false,
  className = '',
}: DateTimeFieldProps) {
  const [val, setVal] = useControllable<string | null>(
    value,
    defaultValue,
    onChange as ((next: string | null) => void) | undefined,
  );
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
    if (tt !== t) setPendTime(tt);
    const next = d + 'T' + tt;
    if (next !== val) setVal(next);
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
    ? displayDay(date) + ', ' + (time ? displayTime(time, format) : '--:--')
    : null;
  const trigger = <FieldTrigger display={display} placeholder={placeholder} disabled={disabled} />;

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
