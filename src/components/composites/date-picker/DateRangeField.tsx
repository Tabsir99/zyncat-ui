'use client';

/* DateRangeField - DateField's sibling for { start, end }: a Linear/Notion two-click range; the surface switches Popover and Sheet by viewport. */

import './date-picker.css';
import { useEffect, useState } from 'react';
import { Popover } from '../popover/Popover';
import { Sheet } from '../sheet/Sheet';
import { FieldShell, FieldTrigger, type DateFieldBaseProps } from './field-shell';
import { useControllable } from '../../internal/hooks/use-controllable';
import { DrpPanel, drpRangeText, type DateRange } from './range-panel';

export type { DateRange };

function useNarrowViewport(query?: string): boolean {
  const q = query || '(max-width: 640px)';
  const [narrow, setNarrow] = useState(() => (typeof matchMedia === 'function' ? matchMedia(q).matches : false));
  useEffect(() => {
    const mq = matchMedia(q);
    const fn = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener('change', fn);
    setNarrow(mq.matches);
    return () => mq.removeEventListener('change', fn);
  }, [q]);
  return narrow;
}

export interface DateRangeFieldProps extends DateFieldBaseProps {
  /** Controlled value - both endpoints, or null when empty. */
  value?: DateRange | null;
  /** Uncontrolled initial range. Use instead of `value`. @default null */
  defaultValue?: DateRange | null;
  /** Fires only on a COMPLETE range (a lone anchor never commits). */
  onChange?: (value: DateRange) => void;
  /** Trigger text shown when no range is picked. @default 'Pick a date range' */
  placeholder?: string;
  /** IANA timezone (e.g. 'Europe/Riga') - display context, shown in the footer. */
  timezone?: string;
  /** Earliest pickable date, 'YYYY-MM-DD', inclusive. */
  min?: string;
  /** Latest pickable date, 'YYYY-MM-DD', inclusive. */
  max?: string;
}

export function DateRangeField({
  value,
  defaultValue = null,
  onChange,
  label,
  placeholder = 'Pick a date range',
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
}: DateRangeFieldProps) {
  const [val, commit] = useControllable(value, defaultValue, onChange);

  const narrow = useNarrowViewport();
  /* open is owned here so the picker survives a Popover<->Sheet swap while up */
  const [pickerOpen, setPickerOpen] = useState(false);

  const display = val && val.start && val.end ? drpRangeText(val.start, val.end) : null;
  const trigger = <FieldTrigger display={display} placeholder={placeholder} disabled={disabled} />;
  const panel = (api: { close: () => void }) => (
    <DrpPanel
      value={val}
      commit={commit}
      close={api.close}
      min={min}
      max={max}
      timezone={timezone}
      label={label}
      months={narrow ? 1 : 2}
      layout={narrow ? 'sheet' : 'popover'}
    />
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
      htmlProps={htmlProps}
    >
      {narrow ? (
        <Sheet trigger={trigger} side="bottom" open={pickerOpen} onOpenChange={setPickerOpen}>
          {panel}
        </Sheet>
      ) : (
        <Popover
          trigger={trigger}
          side="bottom"
          align="start"
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          animation={animation}
        >
          {panel}
        </Popover>
      )}
    </FieldShell>
  );
}
