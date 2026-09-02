# zyncat-ui

The setup CLI for [`@zyncat/ui`](https://www.npmjs.com/package/@zyncat/ui) - a premium React 19
design system.

```bash
pnpm dlx zyncat-ui init
# or: npx zyncat-ui init · yarn dlx zyncat-ui init · bunx zyncat-ui init
```

Run it inside a React project. One command installs `@zyncat/ui` (and React 19 if the project
needs it), imports the base stylesheet at your app root, installs the agent skill into
`.claude/skills/`, registers the MCP server in `.mcp.json`, and scaffolds a typed
`zyncat.theme.ts`. Re-run it after upgrading `@zyncat/ui` to refresh everything.

This package is where the CLI lives, and it holds the unscoped name so the command works before
`@zyncat/ui` is installed. It ships one bundled file and declares zero runtime dependencies - the
terminal UI is inlined at build time. `@zyncat/ui` mirrors the same bundle as its own `zyncat-ui`
bin, so after install `pnpm exec zyncat-ui init` runs the version-matched copy.

Docs: [ui.zyncat.app](https://ui.zyncat.app).
