'use client';

/* FieldShell - the variant-blind chrome around every date/time field's control.
   The .fld vocabulary is owned by input.css (imported via field-chrome);
   date-picker.css only extends it. */

import './date-picker.css';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react';
import { Icon, type IconName } from '../../internal/icon/Icon';
import { FieldLabel, FieldMessage } from '../../primitives/input/field-chrome';
import type { DisableableAnimation } from '../../../motion/timing';
import type { DataAttributes } from '../../../dom-props';

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
  /** Standard <div> attributes (style, data-*, aria-*, ...) forwarded to the field shell root. */
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  /** Popover open/close timing - motion tokens only, or `null` to disable. (Not used by TimeField, which is inline.) */
  animation?: DisableableAnimation;
}

export interface FieldShellProps {
  variant: string;
  label?: string;
  required?: boolean;
  invalid?: boolean;
  message?: ReactNode;
  icon: IconName;
  className?: string;
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
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
  htmlProps,
  children,
}: FieldShellProps) {
  const cls = ['fld', variant, 'fld--has-lead', invalid ? 'is-error' : '', className || ''].filter(Boolean).join(' ');
  return (
    <div {...htmlProps} className={cls}>
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
