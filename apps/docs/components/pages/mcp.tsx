'use client';

import { Callout, CodeBlock, TabGroup } from '../kit';

export function McpDoc() {
  const initCommand = `npx zyncat-ui init`;

  const manualConfig = `{
  "mcpServers": {
    "zyncat-ui": {
      "command": "node",
      "args": ["./node_modules/@zyncat/ui/dist/mcp.js"]
    }
  }
}`;

  const globalConfig = `{
  "mcpServers": {
    "zyncat-ui": {
      "command": "npx",
      "args": ["-y", "--package=@zyncat/ui@latest", "zyncat-ui-mcp"]
    }
  }
}`;

  return (
    <>
      <section className="guide-section" id="overview">
        <h2 className="guide-section__title">Overview</h2>
        <p className="guide-section__p">
          Zyncat UI ships two halves of one agent setup: an <strong>agent skill</strong> (the component map, picker
          tables, recipes and theming guide that belong in the model&apos;s context) and a built-in{' '}
          <strong>Model Context Protocol (MCP) server</strong> (the live component APIs, read from the installed package
          at call time).
        </p>
        <p className="guide-section__p">
          Connected to an AI-assisted IDE or autonomous agent (Claude Code, Cursor, Windsurf, Cline, Roo Code), the
          assistant learns the catalog from the skill and pulls exact prop types from the server before writing
          JSX—which is what eliminates hallucinated props and invalid styling.
        </p>

        <Callout tone="tip" title="Included in the Package">
          Both ship inside <code className="doc-inline-code">@zyncat/ui</code>—the server as the{' '}
          <code className="doc-inline-code">zyncat-ui-mcp</code> executable, the skill under{' '}
          <code className="doc-inline-code">skills/</code>. No separate installation.
        </Callout>
      </section>

      <section className="guide-section" id="what-is-mcp">
        <h2 className="guide-section__title">What is MCP?</h2>
        <p className="guide-section__p">
          The{' '}
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="doc-link">
            Model Context Protocol (MCP)
          </a>{' '}
          is an open standard created by Anthropic that allows local developer tools, IDEs, and LLMs to safely query
          workspace data and execute structured tools.
        </p>
        <p className="guide-section__p">
          Rather than stuffing entire documentation files into the chat context window, the AI queries the Zyncat UI MCP
          server on demand—and because the server reads the installed package, its answers always match the version your
          project actually runs.
        </p>
      </section>

      <section className="guide-section" id="ide-configuration">
        <h2 className="guide-section__title">Setup</h2>
        <p className="guide-section__p">
          The same command that installs Zyncat UI wires both halves - run it in your project root:
        </p>
        <CodeBlock code={initCommand} language="bash" />
        <p className="guide-section__p">
          It installs <code className="doc-inline-code">@zyncat/ui</code> if the project does not have it yet, copies
          the <code className="doc-inline-code">zyncat-ui</code> skill into{' '}
          <code className="doc-inline-code">.claude/skills/</code>, registers the MCP server in{' '}
          <code className="doc-inline-code">.mcp.json</code>, imports the stylesheet and writes the theme file beside
          it. Restart the agent session afterwards, and re-run the command after upgrading{' '}
          <code className="doc-inline-code">@zyncat/ui</code> so the skill matches the installed version; existing files
          are left alone.
        </p>

        <TabGroup
          tabs={[
            {
              id: 'claude-code',
              label: 'Claude Code',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p className="guide-section__p">
                    <code className="doc-inline-code">npx zyncat-ui init</code> is the whole setup—Claude Code reads{' '}
                    <code className="doc-inline-code">.mcp.json</code> and{' '}
                    <code className="doc-inline-code">.claude/skills/</code> natively. The equivalent manual server
                    entry:
                  </p>
                  <CodeBlock code={manualConfig} language="json" />
                </div>
              ),
            },
            {
              id: 'cursor',
              label: 'Cursor',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p className="guide-section__p">
                    Add the server entry to your project&apos;s{' '}
                    <code className="doc-inline-code">.cursor/mcp.json</code>, then restart Cursor or reload MCP
                    servers:
                  </p>
                  <CodeBlock code={manualConfig} language="json" />
                </div>
              ),
            },
            {
              id: 'global',
              label: 'Global / no install',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p className="guide-section__p">
                    For a client configured outside a project (e.g. Claude Desktop), run the server straight off the
                    registry:
                  </p>
                  <CodeBlock code={globalConfig} language="json" />
                  <p className="guide-section__p">
                    Prefer the per-project form when the package is installed—it guarantees the answers match your
                    installed version.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </section>

      <section className="guide-section" id="tools-reference">
        <h2 className="guide-section__title">Tools Reference</h2>
        <p className="guide-section__p">The Zyncat UI MCP server exposes three tools to connected AI assistants:</p>

        <div className="examples-list">
          <div className="example-block">
            <h3 className="example-block__title">
              <code className="doc-inline-code">get_component(components)</code>
            </h3>
            <p className="example-block__desc">
              The workhorse. Accepts one name or a list—
              <code className="doc-inline-code">[&quot;select&quot;, &quot;text-field&quot;, &quot;dialog&quot;]</code>
              —and returns, per component: the maintainers&apos; usage doc, the live docs page URL, a verified example,
              and the complete TypeScript prop interface with JSDoc and defaults, shared type chunks inlined. An unknown
              name returns the full catalog, so a wrong guess self-corrects.
            </p>
          </div>

          <div className="example-block">
            <h3 className="example-block__title">
              <code className="doc-inline-code">search_api(query)</code>
            </h3>
            <p className="example-block__desc">
              Ranked keyword search across every usage doc, prop type and design token—finds which component owns a
              prop, behavior or token. Zero matches returns the whole catalog instead of a dead end.
            </p>
          </div>

          <div className="example-block">
            <h3 className="example-block__title">
              <code className="doc-inline-code">get_tokens(group?)</code>
            </h3>
            <p className="example-block__desc">
              The closed CSS token vocabulary with real values—surfaces, text contrast steps, radii, elevations,
              spacing, motion—plus the four theming override levels.
            </p>
          </div>
        </div>

        <Callout tone="note" title="Contributor tools">
          Inside the zyncat-ui repository itself the server additionally exposes{' '}
          <code className="doc-inline-code">motion_guide</code>, <code className="doc-inline-code">design_rules</code>{' '}
          and <code className="doc-inline-code">authoring_checklist</code>—the library-authoring guidance. Consumer
          installs see only the three tools above.
        </Callout>
      </section>

      <section className="guide-section" id="sample-prompts">
        <h2 className="guide-section__title">Sample AI Prompts</h2>
        <p className="guide-section__p">
          Once the skill and server are wired, you can prompt your AI assistant naturally:
        </p>

        <ul className="guide-section__list">
          <li>
            <em>
              &ldquo;Create a multi-step user registration form using TextField, OtpField, and a primary Button.&rdquo;
            </em>
          </li>
          <li>
            <em>&ldquo;Add a confirmation Dialog with a danger button that shows a toast on confirmation.&rdquo;</em>
          </li>
          <li>
            <em>
              &ldquo;What props does the DateRangeField component take? Show me an example with min and max
              bounds.&rdquo;
            </em>
          </li>
          <li>
            <em>
              &ldquo;What color tokens should I use for secondary button hover states and subtle card
              backgrounds?&rdquo;
            </em>
          </li>
        </ul>
      </section>
    </>
  );
}
