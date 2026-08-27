'use client';

import { useState, type ComponentType, type ReactNode } from 'react';

import { Icon } from './icon';

export interface ExampleCardProps {
  Component?: ComponentType;
  children?: ReactNode;
  code?: string;
  fill?: boolean;
}

export function ExampleCard({ Component, children, code, fill }: ExampleCardProps) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="example-card">
      <div className="example-card__header">
        <div className="example-card__tabs">
          <button
            type="button"
            className={`example-card__tab ${tab === 'preview' ? 'example-card__tab--active' : ''}`}
            onClick={() => setTab('preview')}
          >
            Preview
          </button>
          {code ? (
            <button
              type="button"
              className={`example-card__tab ${tab === 'code' ? 'example-card__tab--active' : ''}`}
              onClick={() => setTab('code')}
            >
              Code
            </button>
          ) : null}
        </div>
        <div className="example-card__actions">
          <button
            type="button"
            className="example-card__btn-icon"
            onClick={() => setReplayKey((k) => k + 1)}
            title="Restart animation"
            aria-label="Restart animation"
          >
            <Icon name="arrow-counter-clockwise" size="sm" />
          </button>
        </div>
      </div>

      {tab === 'preview' ? (
        <div
          className={fill ? 'example-card__canvas example-card__canvas--fill' : 'example-card__canvas'}
          key={replayKey}
        >
          <div className="example-card__inner">{Component ? <Component /> : children}</div>
        </div>
      ) : code ? (
        <div className="example-card__code">
          <CodeBlock code={code} language="tsx" />
        </div>
      ) : null}
    </div>
  );
}

// Backward-compatible Demo wrapper
export function Demo({
  label,
  description,
  fill,
  code,
  children,
}: {
  label?: string;
  description?: string;
  fill?: boolean;
  code?: string;
  children: ReactNode;
}) {
  const id = label
    ? label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : undefined;

  return (
    <div className="example-block" id={id ? `example-${id}` : undefined}>
      {label ? <h3 className="example-block__title">{label}</h3> : null}
      {description ? <p className="example-block__desc">{description}</p> : null}
      <ExampleCard code={code} fill={fill}>
        {children}
      </ExampleCard>
    </div>
  );
}

function tokenizeLine(line: string): ReactNode {
  if (!line.trim()) {
    return <span>&nbsp;</span>;
  }

  if (line.trim().startsWith('//')) {
    return <span className="tok-comment">{line}</span>;
  }

  const tokenRegex =
    /(\/\*.*?\*\/|\/\/.*?$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Za-z0-9_]+|\b(?:import|export|from|const|let|var|function|return|default|type|interface|extends|true|false|null|undefined|async|await|new|typeof|satisfies|as|if|else)\b|[A-Za-z0-9_]+(?==)|[{}()[\];,.:])/g;

  const elements: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      elements.push(line.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('//') || token.startsWith('/*')) {
      elements.push(
        <span key={match.index} className="tok-comment">
          {token}
        </span>,
      );
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
      elements.push(
        <span key={match.index} className="tok-string">
          {token}
        </span>,
      );
    } else if (
      /^(import|export|from|const|let|var|function|return|default|type|interface|extends|true|false|null|undefined|async|await|new|typeof|satisfies|as|if|else)$/.test(
        token,
      )
    ) {
      elements.push(
        <span key={match.index} className="tok-keyword">
          {token}
        </span>,
      );
    } else if (token.startsWith('<') || token.startsWith('</')) {
      elements.push(
        <span key={match.index} className="tok-tag">
          {token}
        </span>,
      );
    } else if (line[tokenRegex.lastIndex] === '=') {
      elements.push(
        <span key={match.index} className="tok-attr">
          {token}
        </span>,
      );
    } else if (/^[{}()[\];,.:]$/.test(token)) {
      elements.push(
        <span key={match.index} className="tok-punct">
          {token}
        </span>,
      );
    } else {
      elements.push(token);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    elements.push(line.slice(lastIndex));
  }

  return elements;
}

export function CodeBlock({
  code,
  language = 'tsx',
  showLineNumbers = true,
}: {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">{language}</span>
        <button
          type="button"
          className="code-block__copy"
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          <Icon name={copied ? 'check' : 'copy'} size="sm" />
          <span className="code-block__copy-text">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="code-block__pre">
        <code className="code-block__code">
          {lines.map((line, i) => (
            <div key={i} className="code-block__line">
              {showLineNumbers ? <span className="code-block__number">{i + 1}</span> : null}
              <span className="code-block__content">{tokenizeLine(line)}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export function InstallationBox({ slug }: { slug: string }) {
  const [tab, setTab] = useState<'cli' | 'manual'>('cli');
  const [pkgManager, setPkgManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');

  const cliCommands: Record<string, string> = {
    pnpm: 'pnpm add @zyncat/ui',
    npm: 'npm install @zyncat/ui',
    yarn: 'yarn add @zyncat/ui',
    bun: 'bun add @zyncat/ui',
  };

  return (
    <section className="installation-box" id="installation">
      <div className="section-head">
        <h2 className="section-head__title">Installation</h2>
      </div>

      <div className="installation-box__tabs">
        <button
          type="button"
          className={`installation-box__tab ${tab === 'cli' ? 'installation-box__tab--active' : ''}`}
          onClick={() => setTab('cli')}
        >
          CLI
        </button>
        <button
          type="button"
          className={`installation-box__tab ${tab === 'manual' ? 'installation-box__tab--active' : ''}`}
          onClick={() => setTab('manual')}
        >
          Manual
        </button>
      </div>

      {tab === 'cli' ? (
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
          <CodeBlock code={cliCommands[pkgManager]} language="bash" showLineNumbers={false} />
        </div>
      ) : (
        <div className="installation-manual">
          <p className="installation-manual__step">1. Install package dependencies:</p>
          <CodeBlock code="pnpm add @zyncat/ui" language="bash" showLineNumbers={false} />
          <p className="installation-manual__step">2. Import component and styles:</p>
          <CodeBlock
            code={`import { ${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())} } from '@zyncat/ui/${slug}';\nimport '@zyncat/ui/${slug}.css';`}
            language="tsx"
            showLineNumbers={false}
          />
        </div>
      )}
    </section>
  );
}

export function Breadcrumbs({ group, label }: { group: string; label: string }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumbs">
      <span className="breadcrumbs__text">Docs</span>
      <span className="breadcrumbs__sep">/</span>
      <span className="breadcrumbs__text">{group}</span>
      <span className="breadcrumbs__sep">/</span>
      <span className="breadcrumbs__current">{label}</span>
    </nav>
  );
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warning' | 'tip' | 'note';
  title?: string;
  children: ReactNode;
}) {
  const iconMap: Record<string, 'info' | 'warning-circle' | 'lightbulb' | 'sparkle'> = {
    info: 'info',
    warning: 'warning-circle',
    tip: 'lightbulb',
    note: 'sparkle',
  };

  return (
    <div className={`doc-callout doc-callout--${tone}`}>
      <div className="doc-callout__icon">
        <Icon name={iconMap[tone] || 'info'} size="sm" />
      </div>
      <div className="doc-callout__body">
        {title ? <p className="doc-callout__title">{title}</p> : null}
        <div className="doc-callout__content">{children}</div>
      </div>
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <div className="doc-steps">{children}</div>;
}

export function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <div className="doc-step">
      <div className="doc-step__marker">{number}</div>
      <div className="doc-step__content">
        <h3 className="doc-step__title">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function TabGroup({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div className="doc-tabs-group">
      <div className="doc-tabs-group__header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`doc-tabs-group__tab ${activeTab === tab.id ? 'doc-tabs-group__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="doc-tabs-group__body">{tabs.find((t) => t.id === activeTab)?.content}</div>
    </div>
  );
}

export function FeatureGrid({ children }: { children: ReactNode }) {
  return <div className="feature-grid">{children}</div>;
}

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon:
    'package' | 'rocket' | 'browsers' | 'cpu' | 'shield-check' | 'lightning' | 'gear' | 'terminal' | 'code' | 'sparkle';
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-card__icon">
        <Icon name={icon} size="md" />
      </div>
      <h4 className="feature-card__title">{title}</h4>
      <p className="feature-card__desc">{description}</p>
    </div>
  );
}
