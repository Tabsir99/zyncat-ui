'use client';

import { useId, useState } from 'react';
import Link from 'next/link';

import { TabPanel, Tabs } from '@zyncat/ui/tabs';

import { Callout, CodeBlock, Step, Steps, TabGroup } from '../kit';
import { TerminalDemo } from '../terminal-demo';

const INIT_COMMANDS: Record<string, string> = {
  pnpm: 'pnpm dlx zyncat-ui init',
  npm: 'npx zyncat-ui init',
  yarn: 'yarn dlx zyncat-ui init',
  bun: 'bunx zyncat-ui init',
};

export function InstallationDoc() {
  const pmName = useId();
  const [pkgManager, setPkgManager] = useState('pnpm');
  const [pmDir, setPmDir] = useState<1 | -1 | 0>(0);

  const verifyCode = `import { Button } from '@zyncat/ui/button';
import { toast } from '@zyncat/ui/toast-store';

export function Hello() {
  return (
    <Button variant="primary" onClick={() => toast.success('Wired', { description: 'Zyncat UI is ready.' })}>
      Say hello
    </Button>
  );
}`;

  const toasterCode = `// app/layout.tsx - already imports the stylesheet after init
import { Toaster } from '@zyncat/ui/toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}`;

  const nextConfigCode = `// next.config.mjs (optional)
import { withZyncat } from '@zyncat/ui/next';

export default withZyncat({
  reactStrictMode: true,
});`;

  const ciCode = `npx zyncat-ui init --yes --pm pnpm`;

  return (
    <>
      <section className="guide-section" id="quick-start">
        <h2 className="guide-section__title">One command</h2>
        <p className="guide-section__p">
          Zyncat UI installs through its CLI, not a bare package install. Run this in the root of a React project:
        </p>

        <div className="installation-cli">
          <Tabs
            items={['pnpm', 'npm', 'yarn', 'bun'].map((pm) => ({ value: pm, label: pm }))}
            value={pkgManager}
            onChange={(v, d) => {
              setPkgManager(v);
              setPmDir(d);
            }}
            name={pmName}
            ariaLabel="Package manager"
            className="installation-cli__pms"
          />
          <TabPanel name={pmName} tab={pkgManager} dir={pmDir}>
            <CodeBlock code={INIT_COMMANDS[pkgManager]} language="bash" showLineNumbers={false} />
          </TabPanel>
        </div>

        <TerminalDemo pm={pkgManager} command={INIT_COMMANDS[pkgManager]} />

        <p className="guide-section__p">
          That is the whole setup. The CLI installs <code className="doc-inline-code">@zyncat/ui</code> (and React 19,
          if the project does not have it yet), imports the base stylesheet at your app root, installs the agent skill,
          registers the MCP server and scaffolds a typed theme file - then tells you exactly what it wrote.
        </p>

        <Callout tone="info" title="Why the CLI is the install path">
          The package never travels alone: the agent skill, the MCP registration, the generated theme types and the
          stylesheet import all have to match the installed version. <code className="doc-inline-code">init</code> moves
          them together, and re-running it after an upgrade refreshes all of them at once. Every step is idempotent -
          files you already have are kept, not overwritten.
        </Callout>
      </section>

      <section className="guide-section" id="what-it-does">
        <h2 className="guide-section__title">What init does</h2>
        <p className="guide-section__p">
          Five steps, each printed as it lands. Nothing is hidden and nothing else is touched.
        </p>

        <Steps>
          <Step number={1} title="Installs the package">
            <p className="guide-section__p">
              Adds <code className="doc-inline-code">@zyncat/ui</code> with your package manager - detected from the
              lockfile, the <code className="doc-inline-code">packageManager</code> field or the runner you invoked it
              with. If <code className="doc-inline-code">react</code> is missing it installs React 19 alongside; if
              React 18 is installed it asks before upgrading. Under pnpm the progress bar tracks the real download -
              resolved and fetched packages, with live byte counts on the tarballs.
            </p>
          </Step>

          <Step number={2} title="Imports the stylesheet">
            <p className="guide-section__p">
              Finds your app entry (<code className="doc-inline-code">app/layout.tsx</code>,{' '}
              <code className="doc-inline-code">src/main.tsx</code>,{' '}
              <code className="doc-inline-code">app/root.tsx</code>, ...) and adds{' '}
              <code className="doc-inline-code">import &apos;@zyncat/ui/styles.css&apos;;</code> as the first import, so
              stylesheets you load later keep winning the cascade. If the import already exists, the file is untouched;
              if no entry is found, it prints the one line to add yourself.
            </p>
          </Step>

          <Step number={3} title="Installs the agent skill">
            <p className="guide-section__p">
              Copies the <code className="doc-inline-code">zyncat-ui</code> skill into{' '}
              <code className="doc-inline-code">.claude/skills/</code> - the component map, picker tables, recipes and
              theming guide an AI coding agent should hold in context while writing your UI.
            </p>
          </Step>

          <Step number={4} title="Registers the MCP server">
            <p className="guide-section__p">
              Merges the <code className="doc-inline-code">zyncat-ui</code> entry into{' '}
              <code className="doc-inline-code">.mcp.json</code>, pointing at the server bundled with the installed
              package - so an agent&apos;s answers about props and tokens always match the version your project runs.
              Existing servers in the file are preserved.
            </p>
          </Step>

          <Step number={5} title="Scaffolds the typed theme">
            <p className="guide-section__p">
              Creates <code className="doc-inline-code">zyncat.theme.ts</code> (or{' '}
              <code className="doc-inline-code">.js</code> in a JavaScript project) with a starter{' '}
              <code className="doc-inline-code">defineTheme</code> - every token a typed key, ready to render through{' '}
              <code className="doc-inline-code">&lt;ZyncatTheme /&gt;</code>. An existing theme file is never
              overwritten.
            </p>
          </Step>
        </Steps>
      </section>

      <section className="guide-section" id="after-init">
        <h2 className="guide-section__title">After init</h2>
        <p className="guide-section__p">
          Restart your agent session so it picks up the skill and the MCP server, then prove the wiring with any
          component:
        </p>

        <CodeBlock code={verifyCode} language="tsx" />

        <p className="guide-section__p">Two things stay in your hands, because they are places in your JSX:</p>

        <TabGroup
          tabs={[
            {
              id: 'toaster',
              label: 'Toasts',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p className="guide-section__p">
                    Render one <code className="doc-inline-code">&lt;Toaster /&gt;</code> at the root if you use toasts:
                  </p>
                  <CodeBlock code={toasterCode} language="tsx" />
                </div>
              ),
            },
            {
              id: 'next-config',
              label: 'Next.js config',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p className="guide-section__p">
                    Optional: wrap your Next.js config with <code className="doc-inline-code">withZyncat</code>:
                  </p>
                  <CodeBlock code={nextConfigCode} language="javascript" />
                </div>
              ),
            },
          ]}
        />

        <p className="guide-section__p">
          From here: retheme through the scaffolded theme file on the{' '}
          <Link href="/theming" className="doc-link">
            Theming &amp; Overrides
          </Link>{' '}
          page, or see what the agent tooling can answer on the{' '}
          <Link href="/mcp" className="doc-link">
            MCP Server
          </Link>{' '}
          page.
        </p>
      </section>

      <section className="guide-section" id="requirements">
        <h2 className="guide-section__title">Requirements &amp; CI</h2>

        <ul className="guide-section__list">
          <li>
            <strong>React 19</strong> - <code className="doc-inline-code">react</code> and{' '}
            <code className="doc-inline-code">react-dom</code> <code className="doc-inline-code">^19</code>. The CLI
            installs or offers the upgrade itself.
          </li>
          <li>
            <strong>Node.js 18+</strong> for the CLI and the MCP server.
          </li>
          <li>
            <strong>Modern browsers</strong> - Chrome 105+, Safari 16.4+, Firefox 121+, Edge 105+ (modern CSS nesting
            and WAAPI).
          </li>
          <li>
            <strong>Icons are bundled.</strong> There is no icon peer to install - components render their own glyphs,
            and any prop that takes an icon accepts your own <code className="doc-inline-code">ReactNode</code>.
          </li>
        </ul>

        <p className="guide-section__p">
          In CI or any non-interactive shell the CLI prints plain sequential logs and never prompts. Pass{' '}
          <code className="doc-inline-code">--yes</code> to accept every default and{' '}
          <code className="doc-inline-code">--pm</code> to pin the package manager:
        </p>

        <CodeBlock code={ciCode} language="bash" showLineNumbers={false} />

        <p className="guide-section__p">
          Re-run init any time - after upgrading <code className="doc-inline-code">@zyncat/ui</code> it refreshes the
          skill and theme types to match the new version. Once the package is installed,{' '}
          <code className="doc-inline-code">pnpm exec zyncat-ui init</code> (or plain{' '}
          <code className="doc-inline-code">npx zyncat-ui init</code>) runs the local, version-matched copy.
        </p>
      </section>
    </>
  );
}
