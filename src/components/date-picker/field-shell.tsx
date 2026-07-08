'use client';

/* FieldShell - the variant-blind chrome around every date/time field's control.
   The .fld vocabulary is owned by input.css (imported via field-chrome);
   date-picker.css only extends it. */

import './date-picker.css';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { Icon, type IconName } from '../icon/Icon';
import { FieldLabel, FieldMessage } from '../input/field-chrome';

/* Props every date/time field shares - documented once, inherited by each
   field's public interface. */
export interface DateFieldBaseProps {
  /** Field label rendered above the trigger. */
  label?: string;
  /** Asterisk on the label. @default false */
  required?: boolean;
  /** Danger border + message color (.fld is-error). @default false */
  invalid?: boolean;
  /** Helper / error text under the field. */
  message?: string;
  /** Disable the field. @default false */
  disabled?: boolean;
  /** Extra class on the field shell root. */
  className?: string;
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

export function FieldShell({ variant, label, required, invalid, message, icon, className, children }: FieldShellProps) {
  const cls = ['fld', variant, 'fld--has-lead', invalid ? 'is-error' : '', className || ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <FieldLabel label={label} required={required} />
      <div className="fld__control">
        {children}
        <span className="fld__icon fld__icon--lead" aria-hidden="true">
          <Icon name={icon} size="md" />
        </span>
      </div>
      <FieldMessage message={message ? <span>{message}</span> : null} />
    </div>
  );
}

/* The shared trigger button every popover field renders inside the shell.
   Overlay clones this element with onClick/aria/ref - everything not consumed
   here must reach the real <button>, so the rest (incl. React 19 ref-as-prop)
   spreads through. */
export function FieldTrigger({
  display,
  placeholder,
  disabled,
  ...rest
}: { display: string | null; placeholder: string; disabled?: boolean } & ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: Ref<HTMLButtonElement>;
  }) {
  return (
    <button type="button" className="fld__input dtf__trigger" disabled={disabled} {...rest}>
      {display ? (
        <span className="dtf__value">{display}</span>
      ) : (
        <span className="dtf__placeholder">{placeholder}</span>
      )}
    </button>
  );
}
