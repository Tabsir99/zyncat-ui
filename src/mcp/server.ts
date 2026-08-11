/* Zyncat UI MCP server - Model Context Protocol over stdio (newline-delimited JSON-RPC 2.0).

   Coding agents pointed at a consumer app keep re-deriving this library's API by grepping
   node_modules - slow, token-hungry and error-prone. This server hands them the same ground
   truth as four precise tools:

     list_components  what exists + setup and usage conventions   (llms.txt)
     get_component    one component: usage docs + complete types  (llms.txt + dist/*.d.ts)
     search_api       which component/prop/token matches a word   (docs + types + token CSS)
     get_tokens       the CSS custom-property vocabulary           (src/tokens/*.css)

   Zero dependencies (node builtins only) and no hardcoded registry: everything is read at
   call time from the package's own package.json exports, llms.txt, dist/ and src/tokens/,
   so answers always match the installed version. Register in the consuming project:

     { "mcpServers": { "zyncat-ui": {
         "command": "node", "args": ["./node_modules/@zyncat/ui/dist/mcp.js"] } } }
*/

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/* ---------------------------------------------------------------- package root */

/** Walk up from this file until the @zyncat/ui package.json - works from dist/ and src/mcp/. */
function findRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    const pj = join(dir, 'package.json');
    if (existsSync(pj)) {
      try {
        if (JSON.parse(readFileSync(pj, 'utf8')).name === '@zyncat/ui') return dir;
      } catch {
        /* unreadable package.json on the way up - keep walking */
      }
    }
    const parent = dirname(dir);
    if (parent === dir) throw new Error('@zyncat/ui package root not found');
    dir = parent;
  }
}

/* ---------------------------------------------------------------- registry */

interface LlmsEntry {
  title: string; // "Button", "Tag / TagGroup"
  subpath: string; // "button"
  section: string; // "PRIMITIVES"
  lines: string[]; // raw block, heading included
}
interface LlmsSection {
  title: string;
  body: string[]; // column-0 note lines + entry-less section bodies (THEMING)
}
interface Db {
  root: string;
  version: string;
  subpaths: string[]; // from package.json exports - the API surface of record
  preamble: string[]; // llms.txt before the first section: setup + conventions
  sections: LlmsSection[];
  entries: LlmsEntry[];
}

const SECTION_RE = /^=+\s+(.+?)\s*$/;
const HEADING_RE = /^([A-Za-z][\w /]*?) - @zyncat\/ui\/([a-z][a-z0-9-]*)\b.*$/;

let cached: Db | null = null;
function db(): Db {
  if (cached) return cached;
  const root = findRoot();
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const subpaths = Object.entries(pkg.exports ?? {})
    .filter(([, v]) => typeof v === 'object' && v !== null && 'types' in (v as object))
    .map(([k]) => k.replace(/^\.\//, ''));

  const preamble: string[] = [];
  const sections: LlmsSection[] = [];
  const entries: LlmsEntry[] = [];
  let section: LlmsSection | null = null;
  let entry: LlmsEntry | null = null;
  const close = (e: LlmsEntry | null) => {
    if (!e) return;
    while (e.lines.length && !e.lines[e.lines.length - 1].trim()) e.lines.pop();
    entries.push(e);
  };
  for (const line of readFileSync(join(root, 'llms.txt'), 'utf8').split('\n')) {
    const sec = line.match(SECTION_RE);
    const head = line.match(HEADING_RE);
    if (sec) {
      close(entry);
      entry = null;
      section = { title: sec[1], body: [] };
      sections.push(section);
    } else if (head) {
      close(entry);
      entry = { title: head[1].trim(), subpath: head[2], section: section?.title ?? '', lines: [line] };
    } else if (entry) {
      entry.lines.push(line);
    } else if (section) {
      section.body.push(line);
    } else {
      preamble.push(line);
    }
  }
  close(entry);
  for (const s of sections) {
    while (s.body.length && !s.body[s.body.length - 1].trim()) s.body.pop();
    while (s.body.length && !s.body[0].trim()) s.body.shift();
  }
  while (preamble.length && !preamble[preamble.length - 1].trim()) preamble.pop();

  cached = { root, version: String(pkg.version ?? '0'), subpaths, preamble, sections, entries };
  return cached;
}

/* ---------------------------------------------------------------- lookups */

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/^@zyncat\/ui\//, '')
    .replace(/[^a-z0-9]/g, '');

/** "Button" | "text-field" | "@zyncat/ui/select" | "TagGroup" -> subpath. */
function resolveSubpath(input: string): string {
  const d = db();
  const q = norm(input);
  if (!q) throw new Error('Pass a component name or subpath, e.g. "Button" or "text-field".');
  const candidates = new Map<string, string>(); // norm(name) -> subpath
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

/** Entry .d.ts plus every shared type chunk it (transitively) imports - the closed type surface. */
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

/** Whether the built module (transitively) imports motion/react - i.e. needs the optional peer. */
function needsMotion(root: string, subpath: string): boolean | null {
  const seen = new Set<string>();
  const walk = (rel: string): boolean => {
    if (seen.has(rel)) return false;
    seen.add(rel);
    const p = join(root, 'dist', rel);
    if (!existsSync(p)) return false;
    const code = readFileSync(p, 'utf8');
    if (/["']motion\/react["']/.test(code)) return true;
    for (const m of code.matchAll(/(?:from|import)\s*["']\.\/([\w.-]+\.js)["']/g)) {
      if (walk(m[1])) return true;
    }
    return false;
  };
  return existsSync(join(root, 'dist', `${subpath}.js`)) ? walk(`${subpath}.js`) : null;
}

const tokenFiles = (root: string): string[] =>
  existsSync(join(root, 'src/tokens'))
    ? readdirSync(join(root, 'src/tokens'))
        .filter((f) => f.endsWith('.css'))
        .sort()
    : [];

/* ---------------------------------------------------------------- tools */

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
  const motion = needsMotion(d.root, sub);
  const peer =
    motion === null
      ? null
      : motion
        ? "requires the optional 'motion' peer to be installed"
        : "runs without the optional 'motion' peer";

  const out: string[] = [`# ${entry ? entry.title : sub} - @zyncat/ui/${sub}${peer ? `  [${peer}]` : ''}`, ''];
  if (entry) {
    const note = d.sections.find((s) => s.title === entry.section)?.body ?? [];
    if (note.length) out.push(`Applies to every ${entry.section} component:`, ...note, '');
    out.push('## Usage (llms.txt)', ...entry.lines, '');
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
  const hits = new Map<string, string[]>(); // label -> "  L12: line"
  const scan = (label: string, text: string, lineLabel?: (line: string, i: number) => string) => {
    text.split('\n').forEach((line, i) => {
      const l = line.toLowerCase();
      if (!words.every((w) => l.includes(w))) return;
      const key = lineLabel ? lineLabel(line, i) : label;
      if (!hits.has(key)) hits.set(key, []);
      hits.get(key)!.push(`  L${i + 1}: ${line.trim()}`);
    });
  };

  // llms.txt, attributed to the entry/section each matching line sits in
  {
    const raw = readFileSync(join(d.root, 'llms.txt'), 'utf8');
    const labels: string[] = [];
    let current = 'llms.txt';
    for (const line of raw.split('\n')) {
      const sec = line.match(SECTION_RE);
      const head = line.match(HEADING_RE);
      if (sec) current = `llms.txt » ${sec[1]}`;
      else if (head) current = `llms.txt » ${head[1].trim()}`;
      labels.push(current);
    }
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

/* ---------------------------------------------------------------- MCP plumbing */

const TOOLS = [
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

const INSTRUCTIONS =
  'Zyncat UI design-system API. Before writing Zyncat UI code, use these tools instead of reading ' +
  'node_modules or guessing props: list_components (what exists + setup and conventions), get_component ' +
  '(one component: usage docs + complete prop types), search_api (find the component/prop/token for a ' +
  'keyword), get_tokens (CSS custom-property vocabulary with real values, for theming). Imports are ' +
  'per-subpath (@zyncat/ui/button - no barrel); link @zyncat/ui/styles.css once at the root.';

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
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

type RpcId = number | string | null;
function send(msg: object): void {
  try {
    process.stdout.write(`${JSON.stringify(msg)}\n`);
  } catch {
    process.exit(0); // client hung up mid-write
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
      } catch {
        /* a broken install still gets a handshake; tool calls will explain */
      }
      return reply(id!, {
        protocolVersion: typeof params?.protocolVersion === 'string' ? params.protocolVersion : '2025-06-18',
        capabilities: { tools: {} },
        serverInfo: { name: 'zyncat-ui', version },
        instructions: INSTRUCTIONS,
      });
    }
    case 'ping':
      return reply(id!, {});
    case 'tools/list':
      return reply(id!, { tools: TOOLS });
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
