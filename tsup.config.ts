import { defineConfig } from 'tsup';

// One entry per public module → one dist file + .d.ts each, so consumers can
// deep-import (`premium-ui/button`) without pulling the barrel. splitting:true
// hoists shared internals (overlay-core, select-core, field-shell, …) into
// shared chunks instead of duplicating them per entry.
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    button: 'src/components/button/Button.tsx',
    collapse: 'src/components/motion/Collapse.tsx',
    badge: 'src/components/badge/Badge.tsx',
    'status-badge': 'src/components/badge/StatusBadge.tsx',
    'count-badge': 'src/components/badge/CountBadge.tsx',
    avatar: 'src/components/avatar/Avatar.tsx',
    'avatar-group': 'src/components/avatar/AvatarGroup.tsx',
    tag: 'src/components/tag/Tag.tsx',
    'toggle-tag': 'src/components/tag/ToggleTag.tsx',
    table: 'src/components/table/Table.tsx',
    pagination: 'src/components/pagination/Pagination.tsx',
    'text-field': 'src/components/input/TextField.tsx',
    'number-field': 'src/components/input/NumberField.tsx',
    'otp-field': 'src/components/input/OtpField.tsx',
    textarea: 'src/components/textarea/Textarea.tsx',
    checkbox: 'src/components/checkbox/Checkbox.tsx',
    toggle: 'src/components/toggle/Toggle.tsx',
    'radio-group': 'src/components/radio-group/RadioGroup.tsx',
    select: 'src/components/select/Select.tsx',
    'multi-select': 'src/components/select/MultiSelect.tsx',
    'date-field': 'src/components/date-picker/DateField.tsx',
    'datetime-field': 'src/components/date-picker/DateTimeField.tsx',
    'date-range-field': 'src/components/date-picker/DateRangeField.tsx',
    'time-field': 'src/components/date-picker/TimeField.tsx',
    tabs: 'src/components/tabs/Tabs.tsx',
    overlay: 'src/components/overlay/Overlay.tsx',
    dialog: 'src/components/dialog/Dialog.tsx',
    tooltip: 'src/components/tooltip/Tooltip.tsx',
    alert: 'src/components/alert/Alert.tsx',
    toast: 'src/components/toast/Toast.tsx',
    'toast-store': 'src/components/toast/toast-store.ts',
    'motion-tokens': 'src/tokens/motion-tokens.ts',
  },
  format: ['esm'],
  dts: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  external: ['react', 'react-dom', 'motion', '@phosphor-icons/react'],

  // esbuild strips the per-file `'use client'` when bundling and tsup's banner
  // never reaches the split chunks, so re-assert it on every emitted file. Prepend
  // same-line so source-map line numbers don't shift. Data-only modules get it too
  // — harmless; they're never imported from a Server Component.
  async onSuccess() {
    const { readdir, readFile, writeFile } = await import('node:fs/promises');
    for (const f of await readdir('dist')) {
      if (!f.endsWith('.js')) continue;
      const p = `dist/${f}`;
      const code = await readFile(p, 'utf8');
      if (!/^['"]use client['"]/.test(code)) await writeFile(p, `'use client';${code}`);
    }
  },
});
