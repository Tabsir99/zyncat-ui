import { Callout, Steps, Step, CodeBlock, TabGroup } from '../kit';

export function McpDoc() {
  const cursorConfig = `{
  "mcpServers": {
    "zyncat-ui": {
      "command": "npx",
      "args": ["-y", "@zyncat/ui-mcp@latest"]
    }
  }
}`;

  const claudeConfig = `{
  "mcpServers": {
    "zyncat-ui": {
      "command": "npx",
      "args": ["-y", "@zyncat/ui-mcp@latest"]
    }
  }
}`;

  const localWorkspaceConfig = `{
  "mcpServers": {
    "zyncat-ui": {
      "command": "node",
      "args": ["./node_modules/@zyncat/ui/dist/mcp.js"]
    }
  }
}`;

  return (
    <>
      <section className="guide-section" id="overview">
        <h2 className="guide-section__title">Overview</h2>
        <p className="guide-section__p">
          Zyncat UI ships with an official, built-in <strong>Model Context Protocol (MCP) server</strong>.
        </p>
        <p className="guide-section__p">
          When connected to your AI-assisted IDE or autonomous agent (Cursor, Claude Desktop, Windsurf, Antigravity,
          Cline, Roo Code), your AI assistant receives real-time access to the exact component signatures, prop types,
          CSS token vocabulary, and WAAPI motion guidelines—drastically reducing hallucinated props and invalid styling.
        </p>

        <Callout tone="tip" title="Included in the Package">
          The MCP server is bundled directly inside <code className="doc-inline-code">@zyncat/ui</code> under the{' '}
          <code className="doc-inline-code">zyncat-ui-mcp</code> executable. No separate global installation is needed.
        </Callout>
      </section>

      <section className="guide-section" id="what-is-mcp">
        <h2 className="guide-section__title">What is MCP?</h2>
        <p className="guide-section__p">
          The <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="doc-link">Model Context Protocol (MCP)</a> is
          an open standard created by Anthropic that allows local developer tools, IDEs, and LLMs to safely query
          workspace data and execute structured tools.
        </p>
        <p className="guide-section__p">
          Rather than stuffing entire documentation files into your chat context window, the AI dynamically queries the
          Zyncat UI MCP server on-demand when you ask questions or ask it to generate code.
        </p>
      </section>

      <section className="guide-section" id="ide-configuration">
        <h2 className="guide-section__title">IDE Configuration</h2>
        <p className="guide-section__p">
          Choose your development environment below and add the configuration to your MCP config file:
        </p>

        <TabGroup
          tabs={[
            {
              id: 'cursor',
              label: 'Cursor',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p className="guide-section__p">
                    Add the following to your project&apos;s <code className="doc-inline-code">.cursor/mcp.json</code> or
                    global Cursor MCP settings:
                  </p>
                  <CodeBlock code={cursorConfig} language="json" />
                  <p className="guide-section__p">Then restart Cursor or reload MCP servers.</p>
                </div>
              ),
            },
            {
              id: 'claude',
              label: 'Claude Desktop',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p className="guide-section__p">
                    Add to your Claude Desktop config (
                    <code className="doc-inline-code">~/Library/Application Support/Claude/claude_desktop_config.json</code> on
                    macOS or <code className="doc-inline-code">%APPDATA%\Claude\claude_desktop_config.json</code> on Windows):
                  </p>
                  <CodeBlock code={claudeConfig} language="json" />
                  <p className="guide-section__p">Restart Claude Desktop.</p>
                </div>
              ),
            },
            {
              id: 'local',
              label: 'Local Workspace',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p className="guide-section__p">
                    If <code className="doc-inline-code">@zyncat/ui</code> is already installed in your repository, you
                    can run the bundled MCP executable directly:
                  </p>
                  <CodeBlock code={localWorkspaceConfig} language="json" />
                </div>
              ),
            },
          ]}
        />
      </section>

      <section className="guide-section" id="tools-reference">
        <h2 className="guide-section__title">Tools Reference</h2>
        <p className="guide-section__p">
          The Zyncat UI MCP server exposes the following tools to connected AI assistants:
        </p>

        <div className="examples-list">
          <div className="example-block">
            <h3 className="example-block__title">
              <code className="doc-inline-code">list_components</code>
            </h3>
            <p className="example-block__desc">
              Lists all available primitives, form controls, data displays, and overlays with their category, status,
              and import paths.
            </p>
          </div>

          <div className="example-block">
            <h3 className="example-block__title">
              <code className="doc-inline-code">get_component(name)</code>
            </h3>
            <p className="example-block__desc">
              Returns the full TypeScript prop interface, JSDoc descriptions, default values, and usage examples for a
              specific component.
            </p>
          </div>

          <div className="example-block">
            <h3 className="example-block__title">
              <code className="doc-inline-code">get_tokens(category?)</code>
            </h3>
            <p className="example-block__desc">
              Retrieves the closed CSS token vocabulary, including surface colors, text contrast steps, radii,
              elevations, and spacing steps.
            </p>
          </div>

          <div className="example-block">
            <h3 className="example-block__title">
              <code className="doc-inline-code">search_api(query)</code>
            </h3>
            <p className="example-block__desc">
              Performs a search across all documentation, prop types, and architectural guidance.
            </p>
          </div>

          <div className="example-block">
            <h3 className="example-block__title">
              <code className="doc-inline-code">motion_guide(topic?)</code>
            </h3>
            <p className="example-block__desc">
              Provides the WAAPI motion engine guidelines, spring physics parameters, and animation rules.
            </p>
          </div>
        </div>
      </section>

      <section className="guide-section" id="sample-prompts">
        <h2 className="guide-section__title">Sample AI Prompts</h2>
        <p className="guide-section__p">
          Once the MCP server is enabled in your IDE, you can prompt your AI assistant naturally:
        </p>

        <ul className="guide-section__list">
          <li>
            <em>&ldquo;Create a multi-step user registration form using TextField, OtpField, and a primary Button.&rdquo;</em>
          </li>
          <li>
            <em>&ldquo;Add a confirmation Dialog with a danger button that shows a toast on confirmation.&rdquo;</em>
          </li>
          <li>
            <em>&ldquo;What props does the DateRangeField component take? Show me an example with min and max bounds.&rdquo;</em>
          </li>
          <li>
            <em>&ldquo;What color tokens should I use for secondary button hover states and subtle card backgrounds?&rdquo;</em>
          </li>
        </ul>
      </section>
    </>
  );
}
