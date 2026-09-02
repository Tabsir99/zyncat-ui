import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'MCP Server for React UI Components',
  description:
    'An MCP server that hands Claude Code, Cursor and any MCP client the live React component API - exact prop types read from the installed package, not guessed.',
  keywords: [
    'mcp server',
    'model context protocol',
    'mcp servers',
    'what is an mcp server',
    'claude code mcp',
    'claude mcp',
    'what are mcp servers',
    'claude mcp servers',
    'mcp claude',
    'mcp client',
    'mcp tools',
    'best mcp servers',
    'claude desktop mcp',
    'claude code mcp server',
    'cursor mcp',
  ],
  lede: 'An MCP server that hands your AI coding agent the real Zyncat UI prop types, so it stops guessing them.',
  faq: [
    {
      q: 'What is an MCP server?',
      a: 'An MCP server is a small local program an AI assistant queries over the Model Context Protocol - an open standard from Anthropic - instead of loading whole documentation files into its context window. The Zyncat UI one speaks JSON-RPC over stdio as the zyncat-ui-mcp executable and answers questions about the components installed in your project.',
    },
    {
      q: 'How do I add an MCP server to Claude Code?',
      a: 'Run npx zyncat-ui init in your project root: it writes the zyncat-ui entry into .mcp.json, which Claude Code reads natively, and copies the agent skill into .claude/skills/. The manual equivalent is { "mcpServers": { "zyncat-ui": { "command": "node", "args": ["./node_modules/@zyncat/ui/dist/mcp.js"] } } }. Restart the agent session afterwards.',
    },
    {
      q: 'Does it work with Cursor, Windsurf or Claude Desktop?',
      a: 'Yes - it is a plain stdio MCP server with zero dependencies, so any MCP client can run it. Cursor takes the same JSON in .cursor/mcp.json, and a client configured outside a project, such as Claude Desktop, can run it straight off the registry with npx -y --package=@zyncat/ui@latest zyncat-ui-mcp.',
    },
    {
      q: 'What tools does the MCP server expose?',
      a: 'Three. get_component(components) takes one name or a list and returns each component’s usage doc, live docs URL, a verified example and the complete TypeScript prop interface; search_api(query) ranks a keyword search across every usage doc, prop type and design token; get_tokens(group) prints the CSS token vocabulary with real values. An unknown name or a zero-match query returns the full catalog rather than a dead end.',
    },
    {
      q: 'Do I need the MCP server to use the components?',
      a: 'No. Unlike the general-purpose MCP servers you add for a new capability, this one ships inside the package you already installed and only accelerates AI-assisted editing - @zyncat/ui renders identically without it. The same contract is readable directly from node_modules/@zyncat/ui/dist/types/ and the *.usage.md files.',
    },
    {
      q: 'Will its answers match the version I have installed?',
      a: 'Yes. The server reads the installed package’s usage docs, dist/types/ declarations and src/tokens/*.css at call time instead of shipping a snapshot, so the prop types it returns are the ones your project actually runs. Re-run npx zyncat-ui init after upgrading so the bundled agent skill matches too.',
    },
  ],
};

export default seo;
