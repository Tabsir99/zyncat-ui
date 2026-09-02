# SEO record - mcp

Page: https://ui.zyncat.app/mcp ("MCP Server"). Guide page, not a component.

What it documents: `@zyncat/ui` bundles two halves of one agent setup - an agent skill under
`skills/` (installed to `.claude/skills/`) and a zero-dependency MCP server exposed as the
`zyncat-ui-mcp` bin (`dist/mcp.js`). The server is hand-written JSON-RPC 2.0 over stdio - no
`@modelcontextprotocol/sdk`, no runtime dependency of any kind - and reads the installed
package's `*.usage.md`, `dist/types/` declarations and `src/tokens/*.css` at call time.
Consumer installs see three tools (`get_component`, `search_api`, `get_tokens`); inside the
zyncat-ui repo it additionally exposes `motion_guide`, `design_rules`, `authoring_checklist`.
`npx zyncat-ui init` is the whole setup. Every FAQ claim traces to
`apps/docs/components/pages/mcp.tsx`, `src/mcp/server.ts` or `README.md`.

## Primary and secondary

| Role        | Keyword                 | KD  | Volume bucket | Proven traffic | Proof                                                           |
| ----------- | ----------------------- | --- | ------------- | -------------- | --------------------------------------------------------------- |
| Primary     | `mcp server`            | 84  | >10K          | **41,000/mo**  | cloud.google.com/discover/what-is-model-context-protocol at #12 |
| Secondary 1 | `claude code mcp`       | 29  | >1K           | **3,300/mo**   | code.claude.com/docs/en/mcp-quickstart at #2                    |
| Secondary 2 | `what is an mcp server` | 53  | >1K           | **7,200/mo**   | stackoverflow.blog/2026/05/08/no-dumb-questions-mcp/ at #2      |
| Secondary 3 | `mcp servers`           | 76  | >1K           | **8,200/mo**   | mcpservers.org at #1                                            |
| Secondary 4 | `best mcp servers`      | 18  | >100          | **900/mo**     | mcpservers.org at #1                                            |
| Secondary 5 | `mcp client`            | 30  | >1K           | **1,100/mo**   | cloudflare.com/learning/ai/mcp-client-and-server/ at #4         |

`mcp server` leads the title because it is literally what the page documents and it carries the
largest proven traffic in the set. It is **qualified, never bare** - "MCP Server for React UI
Components". At KD 84 the bare head is unwinnable; the qualifier is what the page can own, and
the winnable ground lives in the KD 18-34 band below (`best mcp servers` 18, `claude code mcp
server` 21, `claude code mcp` 29, `mcp client` 30, `mcp claude` 31, `claude mcp servers` 34).

## The homograph question - settled, do not re-litigate

The brief warned that "MCP" also means Master Control Program (Tron), Microsoft Certified
Professional, Managed Care Plan and multi-chip package, and told me to prove intent with `serp`
before treating any bare-MCP term as a head term. I ran it. **The homograph does not appear in
the SERP at all.**

`serp "mcp"` top 6, in order: modelcontextprotocol.io/docs/.../getting-started/intro,
anthropic.com/news/model-context-protocol, en.wikipedia.org/wiki/Model_Context_Protocol,
cloud.google.com/discover/what-is-model-context-protocol, mcp.so, backslash.security. Zero Tron,
zero Microsoft certification, zero managed care. `serp "mcp server"` and `serp "mcp servers"` are
the same picture - protocol docs, cloud-vendor explainers, and server directories.

**So bare-MCP search intent in the US SERP is the Model Context Protocol, as of this round.** The
homograph is real but lives only in the _generator's_ long tail, where it is easy to spot and
easy to drop: `mcp joint` (>1K, metacarpophalangeal - the finger joint), `what is mcp server
minecraft` / `what is mcp client minecraft` / `what are mcp servers minecraft` (Minecraft Coder
Pack), `how is mcp implemented in hardware` (>1K, multi-chip package), `which industries use mcp`
/ `who offers mcp solutions` / `what are the components of an mcp system` (>1K, Managed Care
Plan / process control). All were filtered out of the candidate pool by regex and none reached
the shortlist. The Tron and Microsoft-cert senses did not surface in a single one of the 1,204
candidates.

Practical consequence: this page does not need a defensive title. It needs a _differentiating_
one, because the competition is not ambiguity, it is authority.

## The real constraint: a UI library's MCP page earns brand traffic, not MCP traffic

The closest analogue to this page that exists is shadcn's, and I measured it directly rather than
reasoning about it.

| URL                                      | Page traffic | What it earns it from                                       |
| ---------------------------------------- | ------------ | ----------------------------------------------------------- |
| ui.shadcn.com/docs/mcp                   | **427/mo**   | `shadcn mcp` 1,200/mo at #1                                 |
| ui.shadcn.com/docs/registry/mcp          | **172/mo**   | `shadcn mcp` at #2                                          |
| github.com/Jpisnice/shadcn-ui-mcp-server | **137/mo**   | `shadcn mcp` at #3                                          |
| shadcnstudio.com/mcp                     | **137/mo**   | `shadcn mcp` at #5                                          |
| shadcnspace.com/mcp                      | **110/mo**   | `shadcn mcp` at #4                                          |
| blog.logrocket.com/ai-shadcn-components/ | **42/mo**    | `shadcn mcp` at #8                                          |
| mcpservers.org/servers/heilgar/shadcn-…  | **36/mo**    | `shadcn mcp` at #9                                          |
| www.shadcn.io/mcp/vs-code                | **26/mo**    | `shadcn mcp` at #10                                         |
| **magicui.design/docs/mcp**              | **115/mo**   | `magic ui` 4,900, `magicui` 600 - **no MCP keyword at all** |

Every single URL on the `shadcn mcp` SERP earns its traffic from the one brand term. MagicUI's
MCP page earns nothing from any MCP keyword - only from its own brand. **No component library's
MCP page ranks for a generic MCP term anywhere in the top ten.** That ground belongs to
modelcontextprotocol.io (92.5K/mo on the intro page alone), Google Cloud (13.5K), Anthropic
(11.8K), Wikipedia (7.6K), mcpservers.org (34.7K) and mcp.so (15.3K).

**Net call:** the generic MCP cluster ships in the keyword tag - it feeds the JSON-LD that answer
engines read, where entity match matters more than SERP position - and the page competes in prose
on the two places a library doc can actually be the best answer: the _setup_ long tail (`claude
code mcp server` KD 21, `claude code mcp` KD 29, `claude mcp` KD 39, `cursor mcp`) and the
eventual brand term `zyncat mcp`, which has no volume yet by construction. The title carries
"React UI Components" because that qualifier is the only thing on the page no competitor has.

## Kept

All fifteen clear the >=20/mo gate. Ranked by proven traffic, which is the shipped array order.

| Keyword                | Source (angle · competitor)                                      | Volume | Traffic/mo | KD  | Cluster   | Placed in                         |
| ---------------------- | ---------------------------------------------------------------- | ------ | ---------- | --- | --------- | --------------------------------- |
| mcp server             | A · cloud.google.com/discover/what-is-model-context-protocol #12 | >10K   | **41000**  | 84  | head      | title, description, keywords, faq |
| model context protocol | A · modelcontextprotocol.io/.../getting-started/intro #1         | >10K   | **15000**  | 85  | head      | keywords, faq                     |
| mcp servers            | D · mcpservers.org #1                                            | >1K    | **8200**   | 76  | head      | keywords, faq                     |
| what is an mcp server  | H · stackoverflow.blog/2026/05/08/no-dumb-questions-mcp/ #2      | >1K    | **7200**   | 53  | explainer | keywords, faq                     |
| claude code mcp        | F · code.claude.com/docs/en/mcp-quickstart #2                    | >1K    | **3300**   | 29  | setup     | description, keywords, faq        |
| claude mcp             | F · code.claude.com/docs/en/mcp-quickstart #1                    | >1K    | **2600**   | 39  | setup     | keywords, faq                     |
| what are mcp servers   | H · akuity.io/blog/what-is-an-mcp-server #10                     | >1K    | **1700**   | 12  | explainer | keywords, faq                     |
| claude mcp servers     | F · modelcontextprotocol.io/.../connect-local-servers #2         | >100   | **1200**   | 34  | setup     | keywords, faq                     |
| mcp claude             | F · code.claude.com/docs/en/mcp-quickstart #1                    | >1K    | **1100**   | 31  | setup     | keywords, faq                     |
| mcp client             | D · cloudflare.com/learning/ai/mcp-client-and-server/ #4         | >1K    | **1100**   | 30  | client    | description, keywords, faq        |
| mcp tools              | D · celigo.com/blog/mcp-tools/ #1                                | >1K    | **1100**   | 72  | tools     | keywords, faq                     |
| best mcp servers       | G · mcpservers.org #1                                            | >100   | **900**    | 18  | shopping  | keywords, faq                     |
| claude desktop mcp     | F · support.claude.com/…/local-mcp-servers-on-claude-desktop #1  | >100   | **700**    | 46  | setup     | keywords, faq                     |
| claude code mcp server | E · modelcontextprotocol.io/.../connect-local-servers #3         | >100   | **500**    | 21  | setup     | keywords, faq                     |
| cursor mcp             | F · github.com/cursor/mcp-servers #10                            | >100   | **350**    | 62  | setup     | keywords, faq                     |

Also past the >=20 gate but cut - redundant with a kept term, brand-owned, or a subject this page
does not answer: `what is mcp` 11000 (KD 61), `mcp ai` 1900 (KD 79), `mcp model context protocol`
1900, `what is mcp server` 1700 (KD 36), `what is a mcp server` 1300, `shadcn mcp` 1200 (KD 46,
competitor brand), `mcp server full form` 1100, `anthropic mcp` 1100 (KD 78, brand),
`mcp marketplace` 1000, `what does mcp stand for in ai` 900, `mcp server list` 700 (KD 73),
`model context protocol documentation` 700, `mcp clients` 500 (KD 34, duplicate of `mcp client`),
`what is mcp server in ai` 500, `what is an mcp server in ai` 500, `what is mcp in ai` 3900
(KD 63), `mcp desktop` 150, `@modelcontextprotocol/sdk` 150, `mcp server meaning` 4500 (KD 45 -
dictionary intent, the page does not define an acronym), `github mcp` 2800 and
`github mcp server` 3900 (a different vendor's server), `playwright mcp` 15000,
`chrome devtools mcp` 3800, `figma mcp` >10K, `claude skills` 19000.

## Rejected clusters

- **The MCP homograph senses** (`mcp joint`, `mcp server minecraft`, `mcp client minecraft`,
  `how is mcp implemented in hardware`, `which industries use mcp`, `who offers mcp solutions`,
  `what are the components of an mcp system`, `what does mcp stand for in computing systems`).
  Finger joint, Minecraft Coder Pack, multi-chip package and Managed Care Plan. Real volume,
  entirely different subjects. **Note for future agents: these appear in the generator's long
  tail only. They are absent from the `mcp`, `mcp server` and `mcp servers` SERPs, all three of
  which are 100% Model Context Protocol. Do not re-run the intent check.**

- **Vendor-specific MCP servers** (`github mcp server` 3,900/mo, `playwright mcp` 15,000,
  `figma mcp` >10K, `chrome devtools mcp` 3,800, `slack mcp server`, `atlassian mcp`,
  `context7 mcp server`, `aws mcp servers`, `datadog mcp server`, `n8n mcp client`). The largest
  block in the whole seed set. Each names a different product's server. Nothing on this page
  answers them, and `figma mcp` in particular is design-file-to-code, a different job entirely.

- **`shadcn mcp` (1,200/mo, KD 46) and the whole shadcn-MCP SERP.** Directly relevant as a
  competitor model and measured in full above, but it is a competitor's brand term. Cannot ship.

- **"Build your own MCP server"** (`build mcp server`, `how to build an mcp server`,
  `how to create an mcp server`, `mcp sdk`, `python mcp sdk`, `mcp typescript sdk`,
  `@modelcontextprotocol/sdk` 150/mo, `how to migrate from mcp sdk v1 to v2`). A large, coherent
  cluster with real volume. This page documents _consuming_ a shipped server, not authoring one.
  Wrong intent for every word on the page.

- **Claude Code / Claude Desktop product queries** (`install claude code` >10K,
  `claude code pricing` >10K, `claude code download` >10K, `claude desktop app` >10K,
  `is claude code free`, `codex vs claude code`, `claude code vs cursor`). The single biggest
  volume block mined. Anthropic's product-install and pricing intent, not MCP intent. Only the
  `<client> + mcp` intersection was kept.

- **Client-name + MCP docs pages, measured and found empty.**
  `code.visualstudio.com/docs/copilot/customization/mcp-servers`,
  `code.visualstudio.com/docs/copilot/chat/mcp-servers`, `docs.windsurf.com/windsurf/cascade/mcp`
  and `docs.cline.bot/mcp/mcp-overview` all return **0/mo**, and `docs.cursor.com/context/model-
context-protocol` returns 0/mo (the live Cursor MCP traffic sits on `cursor.com/docs`, which
  earns from `cursor pricing`, not from MCP). So `vscode mcp`, `windsurf mcp` and `cline mcp` have
  no provable traffic despite the page naming all three clients. They stay in the page's prose,
  never in the keyword array.

- **The UI/component-MCP intersection, mined and found too thin to carry anything.** Seeds
  `ui mcp`, `component mcp`, `design mcp` produced `shadcn ui mcp` (>100), `magic ui mcp` (>100)
  and then a wall of `<100`: `ui mcp`, `radix ui mcp`, `material ui mcp`, `nuxt ui mcp`,
  `daisy ui mcp`, `ant design mcp`, `ui design mcp server`, `frontend design mcp`. `component mcp`
  returned exactly **one** idea. `react mcp` returned 12 ideas and no SERP data at all. There is
  no generic "UI library MCP server" head term yet - the category is named after its brands. This
  is the ground the page should own as it emerges; today it is unprovable, so it lives in the
  title and lede as positioning, not in the keyword array.

- **Adjacent AI-coding subjects** (`vibe coding` >10K, `ai coding tools`, `coding agent`,
  `github copilot coding agent`, `ai website builder`, `v0 dev`, `lovable`). Adjacent audience,
  different subject. A searcher for `vibe coding` wants an overview of a practice, not a config
  entry for one library's MCP server.

- **News and transient** (`model context protocol news today` 2,100/mo, `mcp tools news`,
  `ai coding tools latest release 2026`, `claude desktop release notes 2026`,
  `claude code changelog`, `claude code leak`). Volume that decays; a docs page cannot serve it.

## Collisions with shipped siblings

**None.** I diffed the shipped array against all fourteen shipped `content/seo/*.ts` files: not
one contains the substring `mcp`, `model context`, `claude`, `cursor` or `agent`. The MCP cluster
was researched by `introduction`, which found >10K volume and explicitly ceded it - its own record
says "`mcp server` (>10K) and its whole question set ... Enormous and genuinely relevant to the
bundled server, but `/mcp` is a sibling page in this same docs set and owns it." Claim taken here
in full.

Adjacency worth noting so a future agent does not read it as a collision: `introduction` owns
`component library`, `react component library` and `react ui components`; this page uses "React UI
Components" in its **title** as a qualifier on `mcp server`, and ships no bare component-library
keyword. `installation` owns the tailwind-alternative cluster and `theming` owns tokens and CSS
variables - neither overlaps.

## Method notes and tooling conditions

- **Seeds:** 38 across all nine angles - `mcp server`, `mcp`, `model context`, `context protocol`,
  `mcp client`, `mcp tools`, `mcp servers`, `mcp sdk`, `claude code`, `cursor mcp`, `vscode mcp`,
  `claude desktop`, `windsurf ide`, `cline ai`, `mcp setup`, `mcp config`, `install mcp`,
  `add mcp`, `ai coding`, `coding agent`, `code assistant`, `ai codegen`, `mcp typescript`,
  `mcp npm`, `react mcp`, `mcp node`, `best mcp`, `mcp list`, `mcp directory`, `mcp github`,
  `ai ui`, `ai components`, `shadcn mcp`, `ui generator`, `ai frontend`, `mcp integration`,
  `anthropic mcp`, `llm tools`, plus a third round of `ui mcp`, `component mcp`, `design mcp`,
  `figma mcp`, `vibe coding`, `v0 dev`, `ai website builder`, `mcp minecraft`, `agent skills`,
  `claude skills`. **1,204 unique candidates** (687 ideas + 556 questions, deduped).
- **Angle F** (platform/format) is `claude code` / `cursor` / `vscode` / `claude desktop` /
  `windsurf` / `cline` here rather than gif/lottie - the "format" a searcher names for an MCP
  server is the client they run it in. It was the most productive angle in the set: five of the
  fifteen shipped keywords came from it. **Angle H** was as rich as the brief predicted -
  `how to add mcp server to claude code`, `how to add mcp to claude code`,
  `how to add mcp server to cursor`, `how do mcp servers work`, `what are mcp servers used for` -
  and it supplied three of the six FAQ questions near-verbatim.
- **`serp` has no data for long-tail terms.** Empty for `best mcp servers`,
  `how to add mcp server to claude code`, `claude code mcp servers`, `vscode mcp`, `react mcp`,
  `ai component library`, `mcp servers list`. Empty is a signal, not an error - those terms were
  proven through the `traffic` topKeywords of pages that rank for them instead.
- **`traffic` returns at most 5 keyword rows per target**, regardless of `--limit`. Proving a
  cluster means running it on many ranking URLs, not raising the limit. 45 URLs were checked
  across five batches.
- **Both `traffic` and `kd` were throttled mid-run and both recovered.** `traffic` returned
  all-zero payloads with a `success` status for a full 15-URL batch (batch B: mcpservers.org,
  github.com/modelcontextprotocol/servers, mcp.so, mcpservers.com, cursor.com/docs,
  github.com/cursor/mcp-servers, platform.claude.com, github.com/auchenberg/claude-code-mcp,
  code.visualstudio.com, docs.cursor.com, modelcontextprotocol.io/quickstart/user,
  en.wikipedia.org, anthropic.com, backslash.security, firecrawl.dev) and simultaneously for
  known-good controls `ahrefs.com`, `react.dev`, `github.com` and `mui.com` - which is how the
  throttle was distinguished from a dead URL. Every one of those URLs was re-run in smaller
  batches after recovery and the real numbers are what is tabulated above. `kd` returned
  `kd: null, label: "Unknown"` on 18 rows, then again on 6 rows nine minutes later, then returned
  real scores on the third attempt. **Every KD in this document is a real numeric score, not a
  generator difficulty label.** Batches of 7-8 `traffic` calls ran clean where 15 did not.

## Open questions

None. Every FAQ claim is verified against source: the three consumer tools and the in-repo-only
`motion_guide` / `design_rules` / `authoring_checklist` split against `src/mcp/server.ts` (the
`tools()` / `inRepo(findRoot())` branch); the stdio JSON-RPC transport and the absence of any SDK
dependency against the same file's hand-rolled `handle()` / `send()` loop; both config JSON shapes
and the `npx -y --package=@zyncat/ui@latest zyncat-ui-mcp` global form against
`apps/docs/components/pages/mcp.tsx`; the `.mcp.json` and `.claude/skills/` writes against
`packages/zyncat-ui/src/init.ts`; and "answers match the installed version" against the `db()`
function, which calls `loadModules(root)` at call time.
