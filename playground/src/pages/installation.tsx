import { useState } from 'react';
import { Callout, Steps, Step, CodeBlock, TabGroup } from '../kit';

export function InstallationDoc() {
  const [pkgManager, setPkgManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');

  const installCommands: Record<string, string> = {
    pnpm: 'pnpm add @zyncat/ui @phosphor-icons/react',
    npm: 'npm install @zyncat/ui @phosphor-icons/react',
    yarn: 'yarn add @zyncat/ui @phosphor-icons/react',
    bun: 'bun add @zyncat/ui @phosphor-icons/react',
  };

  const nextAppCode = `// app/layout.tsx
import type { Metadata } from 'next';
import '@zyncat/ui/styles.css';
import { Toaster } from '@zyncat/ui/toast';

export const metadata: Metadata = {
  title: 'My Zyncat UI App',
  description: 'Built with React 19 and Zyncat UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}`;

  const nextConfigCode = `// next.config.mjs
import { withZyncat } from '@zyncat/ui/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withZyncat(nextConfig);`;

  const viteAppCode = `// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@zyncat/ui/styles.css';
import { Toaster } from '@zyncat/ui/toast';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);`;

  const firstComponentCode = `import { useState } from 'react';
import { Button } from '@zyncat/ui/button';
import { TextField } from '@zyncat/ui/text-field';
import { StatusBadge } from '@zyncat/ui/status-badge';
import { toast } from '@zyncat/ui/toast';

export function WorkspaceCreator() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Name required', { description: 'Please enter a workspace name.' });
      return;
    }
    setLoading(true);
    // Simulate async creation
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success('Workspace created', { description: \`\${name} is ready for collaboration.\` });
    setName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3>New Workspace</h3>
        <StatusBadge status="scheduled" />
      </div>
      
      <TextField
        label="Workspace name"
        placeholder="e.g. Acme Marketing"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Button variant="primary" loading={loading} onClick={handleCreate}>
        Create workspace
      </Button>
    </div>
  );
}`;

  return (
    <>
      <section className="guide-section" id="prerequisites">
        <h2 className="guide-section__title">Prerequisites</h2>
        <p className="guide-section__p">
          Zyncat UI requires modern JavaScript runtime environments and React 19:
        </p>

        <ul className="guide-section__list">
          <li>
            <strong>React 19+:</strong> <code className="doc-inline-code">react</code> and{' '}
            <code className="doc-inline-code">react-dom</code> version <code className="doc-inline-code">^19.0.0</code>
          </li>
          <li>
            <strong>Node.js:</strong> Version <code className="doc-inline-code">&gt;= 18.0.0</code>
          </li>
          <li>
            <strong>Modern Browsers:</strong> Chrome 105+, Safari 16.4+, Firefox 121+, Edge 105+ (supporting modern
            CSS nesting, subgrid, and WAAPI).
          </li>
        </ul>
      </section>

      <section className="guide-section" id="package-install">
        <h2 className="guide-section__title">Package Installation</h2>
        <p className="guide-section__p">
          Install the <code className="doc-inline-code">@zyncat/ui</code> package along with the Phosphor icon library
          using your preferred package manager:
        </p>

        <div className="installation-cli">
          <div className="installation-cli__pills">
            {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
              <button
                key={pm}
                type="button"
                className={`installation-cli__pill ${pkgManager === pm ? 'installation-cli__pill--active' : ''}`}
                onClick={() => setPkgManager(pm)}
              >
                {pm}
              </button>
            ))}
          </div>
          <CodeBlock code={installCommands[pkgManager]} language="bash" showLineNumbers={false} />
        </div>

        <Callout tone="info" title="Peer Dependencies">
          Zyncat UI components take icons as React nodes (bring-your-own icon). We recommend{' '}
          <code className="doc-inline-code">@phosphor-icons/react</code>, but any SVG/icon library can be used.
        </Callout>
      </section>

      <section className="guide-section" id="styles-setup">
        <h2 className="guide-section__title">Styles &amp; CSS Tokens</h2>
        <p className="guide-section__p">
          Zyncat UI uses pure CSS custom properties for all themes, elevations, colors, and typography. You have two
          options for including styles in your build:
        </p>

        <Steps>
          <Step number={1} title="Option A: Global Stylesheet (Recommended)">
            <p className="guide-section__p">
              Import the complete, pre-bundled stylesheet once in your application entry file:
            </p>
            <CodeBlock code="import '@zyncat/ui/styles.css';" language="tsx" showLineNumbers={false} />
          </Step>

          <Step number={2} title="Option B: Granular Per-Component Styles">
            <p className="guide-section__p">
              If you prefer strict tree-shaking of CSS, import only the stylesheets for the components you consume:
            </p>
            <CodeBlock
              code={`import { Button } from '@zyncat/ui/button';\nimport '@zyncat/ui/button.css';\n\nimport { Dialog } from '@zyncat/ui/dialog';\nimport '@zyncat/ui/dialog.css';`}
              language="tsx"
              showLineNumbers={false}
            />
          </Step>
        </Steps>
      </section>

      <section className="guide-section" id="framework-setup">
        <h2 className="guide-section__title">Framework Setup</h2>
        <p className="guide-section__p">
          Zyncat UI works out of the box with any modern React 19 bundler or meta-framework.
        </p>

        <TabGroup
          tabs={[
            {
              id: 'nextjs',
              label: 'Next.js (App Router)',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p className="guide-section__p">
                    1. Add the global styles and root <code className="doc-inline-code">&lt;Toaster /&gt;</code> to your{' '}
                    <code className="doc-inline-code">app/layout.tsx</code>:
                  </p>
                  <CodeBlock code={nextAppCode} language="tsx" />
                  <p className="guide-section__p">
                    2. (Optional) Wrap your configuration with <code className="doc-inline-code">withZyncat</code> in{' '}
                    <code className="doc-inline-code">next.config.mjs</code>:
                  </p>
                  <CodeBlock code={nextConfigCode} language="javascript" />
                </div>
              ),
            },
            {
              id: 'vite',
              label: 'Vite / SPA',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p className="guide-section__p">
                    Import <code className="doc-inline-code">@zyncat/ui/styles.css</code> in{' '}
                    <code className="doc-inline-code">src/main.tsx</code>:
                  </p>
                  <CodeBlock code={viteAppCode} language="tsx" />
                </div>
              ),
            },
          ]}
        />
      </section>

      <section className="guide-section" id="first-component">
        <h2 className="guide-section__title">Your First Component</h2>
        <p className="guide-section__p">
          Here is an example building an interactive card composing <code className="doc-inline-code">Button</code>,{' '}
          <code className="doc-inline-code">TextField</code>, <code className="doc-inline-code">StatusBadge</code>, and{' '}
          <code className="doc-inline-code">toast</code>:
        </p>

        <CodeBlock code={firstComponentCode} language="tsx" />
      </section>
    </>
  );
}
