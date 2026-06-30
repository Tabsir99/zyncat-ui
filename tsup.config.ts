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
  // Bundle the ~16 curated Phosphor glyphs the components import (static, tree-shaken).
  // react/react-dom/motion stay external — stateful singletons the app must own one of.
  external: ['react', 'react-dom', 'motion'],
  metafile: true,

  // esbuild strips the per-file `'use client'` when bundling and tsup's banner never
  // reaches split chunks. Re-assert it on every output that is a client boundary —
  // a chunk holding a client source, or an entry/chunk that imports one — while pure
  // data/util modules (motion-tokens, …) stay server-importable. Prepend same-line so
  // source-map line numbers don't shift.
  async onSuccess() {
    const { readdir, readFile, writeFile, rm } = await import('node:fs/promises');
    const isClientSrc = async (src: string) => {
      try {
        return /^\s*['"]use client['"]/.test((await readFile(src, 'utf8')).slice(0, 48));
      } catch {
        return false;
      }
    };
    const metaName = (await readdir('dist')).find(
      (f) => f.startsWith('metafile-') && f.endsWith('.json'),
    );
    if (!metaName) return;
    const meta = JSON.parse(await readFile(`dist/${metaName}`, 'utf8')) as {
      outputs: Record<string, { inputs: Record<string, unknown>; imports?: { path: string }[] }>;
    };
    const outputs = Object.entries(meta.outputs).filter(([o]) => o.endsWith('.js'));

    const client = new Set<string>();
    for (const [out, info] of outputs) {
      const hits = await Promise.all(Object.keys(info.inputs).map(isClientSrc));
      if (hits.some(Boolean)) client.add(out);
    }
    for (let changed = true; changed;) {
      changed = false;
      for (const [out, info] of outputs) {
        if (client.has(out)) continue;
        if ((info.imports || []).some((i) => client.has(i.path))) {
          client.add(out);
          changed = true;
        }
      }
    }
    for (const out of client) {
      const code = await readFile(out, 'utf8');
      if (!/^['"]use client['"]/.test(code)) await writeFile(out, `'use client';${code}`);
    }
    await rm(`dist/${metaName}`);
  },
});
