import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { entryLines, parseLlms, PROP_COUNT_RE } from '../../scripts/lib/llms-format.mjs';

function findRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    const pj = join(dir, 'package.json');
    if (existsSync(pj)) {
      try {
        if (JSON.parse(readFileSync(pj, 'utf8')).name === '@zyncat/ui') return dir;
      } catch {}
    }
    const parent = dirname(dir);
    if (parent === dir) throw new Error('@zyncat/ui package root not found');
    dir = parent;
  }
}

interface LlmsEntry {
  title: string;
  subpath: string;
  section: string;
  lines: string[];
}
interface LlmsSection {
  title: string;
  body: string[];
}
interface Db {
  root: string;
  version: string;
  subpaths: string[];
  preamble: string[];
  sections: LlmsSection[];
  entries: LlmsEntry[];
}

function db(): Db {
  const root = findRoot();
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const subpaths = Object.entries(pkg.exports ?? {})
    .filter(([, v]) => typeof v === 'object' && v !== null && 'types' in (v as object))
    .map(([k]) => k.replace(/^\.\//, ''));

  const parsed = parseLlms(readFileSync(join(root, 'llms.txt'), 'utf8'));
  const entries: LlmsEntry[] = parsed.entries.map((e) => ({
    title: e.title,
    subpath: e.subpath,
    section: e.section,
    lines: entryLines(e),
  }));

  return {
    root,
    version: String(pkg.version ?? '0'),
    subpaths,
    preamble: parsed.preamble,
    sections: parsed.sections,
    entries,
  };
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/^@zyncat\/ui\//, '')
    .replace(/[^a-z0-9]/g, '');

function resolveSubpath(input: string): string {
  const d = db();
  const q = norm(input);
  if (!q) throw new Error('Pass a component name or subpath, e.g. "Button" or "text-field".');
  const candidates = new Map<string, string>();
  for (const sub of d.subpaths) candidates.set(norm(sub), sub);
  for (const e of d.entries) for (const part of e.title.split('/')) candidates.set(norm(part), e.subpath);
  const exact = candidates.get(q);
  if (exact) return exact;
  const loose = new Set<string>();
  for (const [name, sub] of candidates) if (name.includes(q) || q.includes(name)) loose.add(sub);
  if (loose.size === 1) return [...loose][0];
  const all = d.entries.map((e) => `${e.title} (${e.subpath})`).join(', ');
  const extras = d.subpaths.filter((s) => !d.entries.some((e) => e.subpath === s)).join(', ');
  throw new Error(
    (loose.size ? `"${input}" is ambiguous: ${[...loose].join(', ')}. ` : `No component matches "${input}". `) +
      `Available: ${all}${extras ? `; types-only modules: ${extras}` : ''}.`,
  );
}

function readTypes(root: string, subpath: string): string {
  const out: string[] = [];
  const seen = new Set<string>();
  const walk = (base: string) => {
    if (seen.has(base)) return;
    seen.add(base);
    const p = join(root, 'dist', `${base}.d.ts`);
    if (!existsSync(p)) return;
    const text = readFileSync(p, 'utf8');
    out.push(`--- dist/${base}.d.ts ---\n${text.trimEnd()}`);
    for (const m of text.matchAll(/from\s+['"]\.\/([\w.-]+)\.js['"]/g)) walk(m[1]);
  };
  walk(subpath);
  if (!out.length) {
    throw new Error(
      `dist/${subpath}.d.ts not found - the package is not built. In the zyncat-ui repo run "pnpm build"; in a consumer, reinstall the package.`,
    );
  }
  return out.join('\n\n');
}

const tokenFiles = (root: string): string[] =>
  existsSync(join(root, 'src/tokens'))
    ? readdirSync(join(root, 'src/tokens'))
        .filter((f) => f.endsWith('.css'))
        .sort()
    : [];

const CODE_LINE_RE = /^(?:[<{]|import\s|const\s|let\s|function\s)/;

function entryTeaser(e: LlmsEntry): string {
  const parts: string[] = [];
  for (let i = 1; i < e.lines.length; i++) {
    const line = e.lines[i].trim();
    if (!line) break;
    if (i > 1 && CODE_LINE_RE.test(line)) break;
    parts.push(line);
  }
  return parts.join(' ');
}

function listComponents(): string {
  const d = db();
  const out: string[] = [...d.preamble, ''];
  for (const s of d.sections) {
    const inSection = d.entries.filter((e) => e.section === s.title);
    if (!inSection.length && !s.body.length) continue;
    out.push(`== ${s.title} ==`);
    out.push(...s.body);
    for (const e of inSection) {
      const first = entryTeaser(e);
      out.push(`${e.title} - @zyncat/ui/${e.subpath}${first ? ` - ${first}` : ''}`);
    }
    out.push('');
  }
  const extras = d.subpaths.filter((sub) => !d.entries.some((e) => e.subpath === sub));
  if (extras.length) {
    out.push('== SUPPORTING MODULES (no llms.txt entry - full docs live in their types) ==');
    for (const sub of extras) out.push(`@zyncat/ui/${sub} - call get_component("${sub}")`);
  }
  return out.join('\n').trim();
}

function getComponent(input: string): string {
  const d = db();
  const sub = resolveSubpath(input);
  const entry = d.entries.find((e) => e.subpath === sub);

  const out: string[] = [`# ${entry ? entry.title : sub} - @zyncat/ui/${sub}`, ''];
  if (entry) {
    const note = d.sections.find((s) => s.title === entry.section)?.body ?? [];
    if (note.length) out.push(`Applies to every ${entry.section} component:`, ...note, '');
    out.push('## Usage (llms.txt)', ...entry.lines.filter((line) => !PROP_COUNT_RE.test(line)), '');
  } else {
    out.push('No llms.txt entry - this module is documented by its types below.', '');
  }
  out.push('## Types (entry .d.ts + the shared chunks it imports)', readTypes(d.root, sub));
  return out.join('\n');
}

function searchApi(query: string): string {
  const d = db();
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) throw new Error('Pass one or more keywords, e.g. "searchable" or "drag dismiss".');
  const hits = new Map<string, string[]>();
  const scan = (label: string, text: string, lineLabel?: (line: string, i: number) => string) => {
    text.split('\n').forEach((line, i) => {
      const l = line.toLowerCase();
      if (!words.every((w) => l.includes(w))) return;
      const key = lineLabel ? lineLabel(line, i) : label;
      if (!hits.has(key)) hits.set(key, []);
      hits.get(key)!.push(`  L${i + 1}: ${line.trim()}`);
    });
  };

  {
    const raw = readFileSync(join(d.root, 'llms.txt'), 'utf8');
    const parsed = parseLlms(raw);
    const marks = new Map<number, string>();
    for (const s of parsed.sections) marks.set(s.line, `llms.txt » ${s.title}`);
    for (const e of parsed.entries) marks.set(e.line, `llms.txt » ${e.title}`);
    const labels: string[] = [];
    let current = 'llms.txt';
    raw.split('\n').forEach((_line, i) => {
      current = marks.get(i + 1) ?? current;
      labels.push(current);
    });
    scan('llms.txt', raw, (_line, i) => labels[i]);
  }
  const distDir = join(d.root, 'dist');
  const dts = existsSync(distDir)
    ? readdirSync(distDir)
        .filter((f) => f.endsWith('.d.ts'))
        .sort()
    : [];
  for (const f of dts) scan(`dist/${f}`, readFileSync(join(distDir, f), 'utf8'));
  for (const f of tokenFiles(d.root)) scan(`src/tokens/${f}`, readFileSync(join(d.root, 'src/tokens', f), 'utf8'));

  const out: string[] = [];
  let shown = 0;
  let total = 0;
  for (const [, lines] of hits) total += lines.length;
  for (const [label, lines] of hits) {
    if (shown >= 60) break;
    out.push(`## ${label}`);
    for (const l of lines) {
      if (shown >= 60) break;
      out.push(l);
      shown++;
    }
  }
  if (!total) return `No matches for "${query}". Try a shorter keyword, or list_components for the full index.`;
  if (total > shown) out.push(`... +${total - shown} more matching lines - narrow the query.`);
  if (!dts.length) out.push('(note: dist/ is not built, so type definitions were not searched)');
  out.push('', 'Follow up with get_component(<name>) for the full picture.');
  return out.join('\n');
}

function getTokens(group?: string): string {
  const d = db();
  const files = tokenFiles(d.root);
  if (!files.length) throw new Error('src/tokens/*.css not found in the installed package.');
  let picked = files;
  if (group) {
    const q = norm(group);
    picked = files.filter((f) => {
      const name = norm(f.replace(/\.css$/, ''));
      return name.includes(q) || q.includes(name);
    });
    if (!picked.length) {
      throw new Error(
        `No token group matches "${group}". Groups: ${files.map((f) => f.replace(/\.css$/, '')).join(', ')}.`,
      );
    }
  }
  const out = picked.map(
    (f) => `/* ==== src/tokens/${f} ==== */\n${readFileSync(join(d.root, 'src/tokens', f), 'utf8').trimEnd()}`,
  );
  const theming = d.sections.find((s) => s.title.includes('THEMING'));
  if (theming?.body.length) out.push(['/* ==== theming ==== */', ...theming.body].join('\n'));
  return out.join('\n\n');
}

const GUIDES = { motion: 'motion.md', design: 'design-system.md', authoring: 'authoring.md' } as const;

const inRepo = (root: string): boolean => existsSync(join(root, 'tsup.config.ts'));

function contributorRoot(tool: string): string {
  const root = findRoot();
  if (!inRepo(root)) {
    throw new Error(
      `${tool} is a contributor tool and is only available inside the zyncat-ui repository. ` +
        'In a consumer install use list_components / get_component / search_api / get_tokens.',
    );
  }
  return root;
}

interface GuideSection {
  title: string;
  subtitles: string[];
  lines: string[];
}

function guideSections(root: string, file: string): GuideSection[] {
  const path = join(root, 'docs/authoring', file);
  if (!existsSync(path)) throw new Error(`docs/authoring/${file} is missing from the repository.`);
  const sections: GuideSection[] = [{ title: '', subtitles: [], lines: [] }];
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const head = line.match(/^##\s+(.+?)\s*$/);
    const sub = line.match(/^###\s+(.+?)\s*$/);
    if (head) sections.push({ title: head[1], subtitles: [], lines: [line] });
    else {
      const current = sections[sections.length - 1];
      if (sub) current.subtitles.push(sub[1]);
      current.lines.push(line);
    }
  }
  return sections;
}

function guide(tool: string, file: string, topic?: string): string {
  const sections = guideSections(contributorRoot(tool), file);
  const text = (picked: GuideSection[]) =>
    picked
      .flatMap((s) => s.lines)
      .join('\n')
      .trim();
  if (!topic) return text(sections);
  const q = norm(topic);
  const matches = (title: string) => norm(title).includes(q) || q.includes(norm(title));
  const named = sections.filter((s) => s.title);
  const hits = named.filter((s) => matches(s.title) || s.subtitles.some(matches));
  if (!hits.length) {
    const titles = named.flatMap((s) => [s.title, ...s.subtitles]);
    throw new Error(`No section of ${file} matches "${topic}". Sections: ${titles.join(', ')}.`);
  }
  return text(hits);
}

const CONSUMER_TOOLS = [
  {
    name: 'list_components',
    description:
      'Every Zyncat UI component: name, import subpath and one-line purpose, grouped by category, plus package setup and usage conventions. Start here instead of exploring node_modules.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_component',
    description:
      "Full API for one component: the maintainers' usage notes and example plus the complete TypeScript prop types with doc comments (shared type chunks inlined). Cheaper and more accurate than reading node_modules/@zyncat/ui yourself.",
    inputSchema: {
      type: 'object',
      properties: {
        component: {
          type: 'string',
          description: 'Component name or subpath - "Button", "TextField", "text-field", "@zyncat/ui/select".',
        },
      },
      required: ['component'],
      additionalProperties: false,
    },
  },
  {
    name: 'search_api',
    description:
      'Keyword search across all component docs, type definitions and design-token CSS. Finds which component owns a prop, type, token or behavior (e.g. "searchable", "DurationToken", "drag dismiss", "--accent"). Every word must match a line; follow up with get_component.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'One or more keywords.' } },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_tokens',
    description:
      'The design-token vocabulary as CSS custom properties with their real values - color, semantic, spacing, typography, radius, elevation, motion, icons, layers, glass, avatar, fonts. Optionally pass one group name; omit for all. Use for theming/overrides and for reading exact values.',
    inputSchema: {
      type: 'object',
      properties: {
        group: { type: 'string', description: 'One token group, e.g. "color" or "motion". Omit for all.' },
      },
      additionalProperties: false,
    },
  },
];

const CONTRIBUTOR_TOOLS = [
  {
    name: 'motion_guide',
    description:
      'How to animate inside this repo: the transitions-vs-simulations boundary, which layer to reach for (CSS transition vs the engine vs Presence vs FLIP vs glide), the complete Layer keyframe vocabulary, [to] vs [from,to] semantics, timing, the one-writer-per-property ownership rules, sequencing, global reduced motion, and the canonical enter/exit recipes. Read this before writing any motion code - most of it is not guessable from the source.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'One section, e.g. "ownership", "timing", "simulations", "recipes". Omit for all.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'design_rules',
    description:
      'The design-system rules for this repo: what the library is for, the system / expressive / replica contracts and the invariants that bind every tier, the token vocabulary and when to add a token rather than use an existing one, the consumer override levels, compose vs build a new component, which tier a component belongs in, and the internal machinery to reuse instead of hand-rolling.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'One section, e.g. "tokens", "contracts", "overrides", "compose", "tier". Omit for all.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'authoring_checklist',
    description:
      'The complete checklist to add a component to this repo: file placement and tsup auto-discovery, the exports-map entry that fails silently when skipped, the per-component stylesheet and CSS-graph rule, the llms.txt entry, which tests to write, and the checks to run.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

function tools() {
  try {
    return inRepo(findRoot()) ? [...CONSUMER_TOOLS, ...CONTRIBUTOR_TOOLS] : CONSUMER_TOOLS;
  } catch {
    return CONSUMER_TOOLS;
  }
}

const CONSUMER_INSTRUCTIONS =
  'Zyncat UI design-system API. Before writing Zyncat UI code, use these tools instead of reading ' +
  'node_modules or guessing props: list_components (what exists + setup and conventions), get_component ' +
  '(one component: usage docs + complete prop types), search_api (find the component/prop/token for a ' +
  'keyword), get_tokens (CSS custom-property vocabulary with real values, for theming). Imports are ' +
  'per-subpath (@zyncat/ui/button - no barrel); link @zyncat/ui/styles.css once at the root.';

const CONTRIBUTOR_INSTRUCTIONS =
  ' You are inside the zyncat-ui repository, so the contributor tools are also available and you are ' +
  'expected to use them before writing library code: motion_guide (call it before any motion code - the ' +
  'keyframe vocabulary and the ownership rules are not guessable from the source), design_rules (tokens, ' +
  'compose vs build, the internals to reuse), authoring_checklist (adding a component end to end).';

function instructions(): string {
  try {
    return inRepo(findRoot()) ? CONSUMER_INSTRUCTIONS + CONTRIBUTOR_INSTRUCTIONS : CONSUMER_INSTRUCTIONS;
  } catch {
    return CONSUMER_INSTRUCTIONS;
  }
}

function callTool(name: string, args: Record<string, unknown>): string {
  const str = (k: string) => (typeof args[k] === 'string' ? (args[k] as string) : undefined);
  switch (name) {
    case 'list_components':
      return listComponents();
    case 'get_component': {
      const component = str('component');
      if (!component) throw new Error('Missing required argument "component".');
      return getComponent(component);
    }
    case 'search_api': {
      const query = str('query');
      if (!query) throw new Error('Missing required argument "query".');
      return searchApi(query);
    }
    case 'get_tokens':
      return getTokens(str('group'));
    case 'motion_guide':
      return guide(name, GUIDES.motion, str('topic'));
    case 'design_rules':
      return guide(name, GUIDES.design, str('topic'));
    case 'authoring_checklist':
      return guide(name, GUIDES.authoring);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

type RpcId = number | string | null;
function send(msg: object): void {
  try {
    process.stdout.write(`${JSON.stringify(msg)}\n`);
  } catch {
    process.exit(0);
  }
}
const reply = (id: RpcId, result: object) => send({ jsonrpc: '2.0', id, result });
const replyError = (id: RpcId, code: number, message: string) => send({ jsonrpc: '2.0', id, error: { code, message } });

function handle(req: { id?: RpcId; method?: string; params?: Record<string, unknown> }): void {
  const { id, method, params } = req;
  const isNotification = id === undefined;
  switch (method) {
    case 'initialize': {
      let version = '0.0.0';
      try {
        version = db().version;
      } catch {}
      return reply(id!, {
        protocolVersion: typeof params?.protocolVersion === 'string' ? params.protocolVersion : '2025-06-18',
        capabilities: { tools: {} },
        serverInfo: { name: 'zyncat-ui', version },
        instructions: instructions(),
      });
    }
    case 'ping':
      return reply(id!, {});
    case 'tools/list':
      return reply(id!, { tools: tools() });
    case 'tools/call': {
      try {
        const name = typeof params?.name === 'string' ? params.name : '';
        const args = (params?.arguments ?? {}) as Record<string, unknown>;
        const text = callTool(name, args);
        return reply(id!, { content: [{ type: 'text', text }], isError: false });
      } catch (e) {
        const text = e instanceof Error ? e.message : String(e);
        return reply(id!, { content: [{ type: 'text', text }], isError: true });
      }
    }
    default:
      if (!isNotification) replyError(id ?? null, -32601, `Method not found: ${method}`);
  }
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk: string) => {
  buffer += chunk;
  let nl: number;
  while ((nl = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    try {
      handle(JSON.parse(line));
    } catch {
      replyError(null, -32700, 'Parse error');
    }
  }
});
process.stdin.on('end', () => process.exit(0));
process.stdout.on('error', () => process.exit(0));
