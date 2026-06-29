/* premium-ui — public API barrel.
   ─────────────────────────────────────────────────────────────────────────
   The ONE import surface for product code:  import { Button, Icon } from 'premium-ui'
   Re-exports every shipped component + its prop types. Internal helpers
   (*-core, field-shell, glide-pill, sheet-drag, date-utils, aliases) are
   intentionally NOT re-exported — import them directly if you ever need them.

   The CSS is NOT imported here — link the token + component stylesheets once
   via `premium-ui/styles.css`. */

// ── Primitives ────────────────────────────────────────────────────────────
export * from './components/button/Button';
export * from './components/icon/Icon';
export * from './components/glass/Glass';
export * from './components/motion/Collapse';

// ── Data display ──────────────────────────────────────────────────────────
export * from './components/badge/Badge';
export * from './components/badge/StatusBadge';
export * from './components/badge/CountBadge';
export * from './components/avatar/Avatar';
export * from './components/avatar/AvatarGroup';
export * from './components/tag/Tag';
export * from './components/tag/ToggleTag';
export * from './components/table/Table';
export * from './components/pagination/Pagination';

// ── Inputs & forms ────────────────────────────────────────────────────────
export * from './components/input/TextField';
export * from './components/input/NumberField';
export * from './components/input/OtpField';
export * from './components/textarea/Textarea';
export * from './components/checkbox/Checkbox';
export * from './components/toggle/Toggle';
export * from './components/radio-group/RadioGroup';
export * from './components/select/Select';
export * from './components/select/MultiSelect';
export type { SelectOption, SelectGroup } from './components/select/select-core';

// ── Date & time ───────────────────────────────────────────────────────────
export * from './components/date-picker/DateField';
export * from './components/date-picker/DateTimeField';
export * from './components/date-picker/DateRangeField';
export * from './components/date-picker/TimeField';

// ── Navigation ────────────────────────────────────────────────────────────
export * from './components/tabs/Tabs';

// ── Overlays & feedback ───────────────────────────────────────────────────
export * from './components/overlay/Overlay';
export * from './components/dialog/Dialog';
export * from './components/tooltip/Tooltip';
export * from './components/alert/Alert';
export * from './components/toast/Toast'; // <Toaster/> mount + host
export * from './components/toast/toast-store'; // toast() API, UIToast, types

// ── Motion tokens (shared JS↔CSS bridge) ──────────────────────────────────
export { UIMotion } from './tokens/motion-tokens';
export type { MotionTokens, Bezier } from './tokens/motion-tokens';
