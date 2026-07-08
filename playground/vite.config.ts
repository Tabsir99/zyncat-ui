import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// The playground consumes the library exactly as a real app would - through the
// public subpath specifiers (there is no barrel). Each subpath is aliased to
// its ../src module so edits to the DS are live (HMR), and react/motion are
// deduped so there is ONE copy across the playground and ../src.
// Keep this map in sync with tsup.config.ts entries + tsconfig.json paths.
const ENTRIES: Record<string, string> = {
  button: 'components/button/Button.tsx',
  collapse: 'components/motion/Collapse.tsx',
  badge: 'components/badge/Badge.tsx',
  'status-badge': 'components/badge/StatusBadge.tsx',
  'count-badge': 'components/badge/CountBadge.tsx',
  avatar: 'components/avatar/Avatar.tsx',
  'avatar-group': 'components/avatar/AvatarGroup.tsx',
  tag: 'components/tag/Tag.tsx',
  'toggle-tag': 'components/tag/ToggleTag.tsx',
  table: 'components/table/Table.tsx',
  pagination: 'components/pagination/Pagination.tsx',
  'text-field': 'components/input/TextField.tsx',
  'number-field': 'components/input/NumberField.tsx',
  'otp-field': 'components/input/OtpField.tsx',
  textarea: 'components/textarea/Textarea.tsx',
  checkbox: 'components/checkbox/Checkbox.tsx',
  toggle: 'components/toggle/Toggle.tsx',
  'radio-group': 'components/radio-group/RadioGroup.tsx',
  select: 'components/select/Select.tsx',
  'multi-select': 'components/select/MultiSelect.tsx',
  'date-field': 'components/date-picker/DateField.tsx',
  'datetime-field': 'components/date-picker/DateTimeField.tsx',
  'date-range-field': 'components/date-picker/DateRangeField.tsx',
  'time-field': 'components/date-picker/TimeField.tsx',
  tabs: 'components/tabs/Tabs.tsx',
  popover: 'components/popover/Popover.tsx',
  sheet: 'components/sheet/Sheet.tsx',
  dialog: 'components/dialog/Dialog.tsx',
  tooltip: 'components/tooltip/Tooltip.tsx',
  alert: 'components/alert/Alert.tsx',
  toast: 'components/toast/Toast.tsx',
  'toast-store': 'components/toast/toast-store.ts',
  'motion-tokens': 'tokens/motion-tokens.ts',
};

export const dsAliases = [
  { find: 'premium-ds/styles.css', replacement: r('../src/styles.css') },
  ...Object.entries(ENTRIES).map(([name, path]) => ({
    find: `premium-ds/${name}`,
    replacement: r(`../src/${path}`),
  })),
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: dsAliases,
    dedupe: ['react', 'react-dom', 'motion', '@phosphor-icons/react'],
  },
  server: { fs: { allow: [r('..')] }, port: 5179 },
});
