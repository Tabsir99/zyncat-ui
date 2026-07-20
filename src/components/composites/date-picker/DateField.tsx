'use client';

/* DateField - opinionated single-date picker: a .fld trigger opens a month-calendar popover, commit is live on day pick. */

import './date-picker.css';
import { Popover } from '../popover/Popover';
import { FieldShell, FieldTrigger, type DateFieldBaseProps } from './field-shell';
import { useControllable } from '../../internal/hooks/use-controllable';
import { DtpPanel } from './calendar-panel';
import { displayDay } from './date-utils';

export interface DateFieldProps extends DateFieldBaseProps {
  /** Controlled value, 'YYYY-MM-DD'. */
  value?: string | null;
  /** Uncontrolled initial value, 'YYYY-MM-DD'. Use instead of `value`. @default null */
  defaultValue?: string | null;
  /** Fires on each day pick (commit is live), with the picked 'YYYY-MM-DD'. */
  onChange?: (value: string) => void;
  /** Trigger text shown when no date is picked. @default 'Pick a date' */
  placeholder?: string;
  /** IANA timezone name (e.g. 'Europe/Riga') - display context only, shown with its GMT offset in the footer. */
  timezone?: string;
  /** Earliest pickable date, 'YYYY-MM-DD', inclusive. */
  min?: string;
  /** Latest pickable date, 'YYYY-MM-DD', inclusive. */
  max?: string;
}

export function DateField({
  value,
  defaultValue = null,
  onChange,
  label,
  placeholder = 'Pick a date',
  timezone,
  min,
  max,
  required = false,
  invalid = false,
  message,
  disabled = false,
  className = '',
  htmlProps,
  animation,
}: DateFieldProps) {
  const [val, commit] = useControllable(value, defaultValue, onChange);
  const trigger = <FieldTrigger display={displayDay(val)} placeholder={placeholder} disabled={disabled} />;

  return (
    <FieldShell
      variant="dtf"
      label={label}
      required={required}
      invalid={invalid}
      message={message}
      icon="calendar"
      className={className}
      htmlProps={htmlProps}
    >
      <Popover trigger={trigger} side="bottom" align="start" animation={animation}>
        {(api) => (
          <DtpPanel val={val} commit={commit} close={api.close} min={min} max={max} timezone={timezone} label={label} />
        )}
      </Popover>
    </FieldShell>
  );
}
