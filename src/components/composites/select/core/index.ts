/* select/core - the shared listbox mechanics behind Select and MultiSelect. The core holds no
   selection state and stays variant-blind: the public components own their value shape and hand
   useListbox two opaque callbacks (isSelected / onCommit) plus a close policy.
   Not a public entry point - select.css is loaded by the Select / MultiSelect entries. */
export { useListbox, type ListboxState } from './use-listbox';
export { SelectTrigger } from './trigger';
export { ListboxPanel } from './panel';
export type { SelectOption, SelectGroup } from './types';
