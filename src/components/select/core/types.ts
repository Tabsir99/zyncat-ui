/* select data layer - option shapes plus the pure normalize/matches helpers.
   No React, no DOM: safe to import from the hook and the render without pulling either. */
import type { ReactNode } from 'react';

export interface SelectOption {
  /** The stored value - what `onChange` returns and `value` matches; must be unique. */
  value: string;
  /** Primary row text, and the trigger label once selected; also matched by `searchable`. */
  label: string;
  /** Optional secondary line under the label; also matched by `searchable`. */
  description?: string;
  /** Your own icon node shown before the label. */
  icon?: ReactNode;
  /** Not selectable - skipped by keyboard nav and typeahead, and marked `aria-disabled`. @default false */
  disabled?: boolean;
}
export interface SelectGroup {
  /** Section heading rendered above the options; omit for an unlabeled group. */
  label?: string;
  /** The options in this section. */
  options: SelectOption[];
}

export interface NormalizedGroup {
  label: string | null | undefined;
  options: SelectOption[];
}

export function normalize(options: SelectOption[] | SelectGroup[]): {
  groups: NormalizedGroup[];
  flat: SelectOption[];
} {
  const grouped =
    options.length > 0 && options[0] && Array.isArray((options[0] as SelectGroup).options);
  const groups: NormalizedGroup[] = grouped
    ? (options as SelectGroup[]).map((g) => ({ label: g.label, options: g.options || [] }))
    : [{ label: null, options: options as SelectOption[] }];
  return { groups, flat: groups.flatMap((g) => g.options) };
}

export const matches = (o: SelectOption, q: string) =>
  !q || (o.label + ' ' + (o.description || '')).toLowerCase().includes(q.toLowerCase());
