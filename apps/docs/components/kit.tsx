'use client';

import { useId, useState, type ComponentType, type ReactNode } from 'react';

import { Alert, type AlertTone } from '@zyncat/ui/alert';
import { Button } from '@zyncat/ui/button';
import { TabPanel, Tabs } from '@zyncat/ui/tabs';
import { Tooltip } from '@zyncat/ui/tooltip';

import { Icon } from './icon';

export interface ExampleCardProps {
  Component?: ComponentType;
  children?: ReactNode;
  code?: string;
  fill?: boolean;
}

export function ExampleCard({ Component, children, code, fill }: ExampleCardProps) {
  const name = useId();
  const [tab, setTab] = useState('preview');
  const [dir, setDir] = useState<1 | -1 | 0>(0);
  const [replayKey, setReplayKey] = useState(0);

  const items = [{ value: 'preview', label: 'Preview' }];
  if (code) items.push({ value: 'code', label: 'Code' });

  return (
    <div className="example-card">
      <div className="example-card__header">
        <Tabs
          items={items}
          value={tab}
          onChange={(v, d) => {
            setTab(v);
            setDir(d);
          }}
          name={name}
          ariaLabel="Example view"
          className="plate-tabs"
        />
        <Tooltip content="Replay the demo" placement="bottom">
          <Button variant="ghost" size="icon" onClick={() => setReplayKey((k) => k + 1)} aria-label="Restart animation">
            <Icon name="arrow-counter-clockwise" size="sm" />
          </Button>
        </Tooltip>
      </div>

      <TabPanel name={name} tab={tab} dir={dir}>
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
      </TabPanel>
    </div>
  );
}

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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          <Icon name={copied ? 'check' : 'copy'} size="sm" />
          {copied ? 'Copied' : 'Copy'}
        </Button>
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
  const name = useId();
  const pmName = useId();
  const [tab, setTab] = useState('cli');
  const [dir, setDir] = useState<1 | -1 | 0>(0);
  const [pkgManager, setPkgManager] = useState('pnpm');
  const [pmDir, setPmDir] = useState<1 | -1 | 0>(0);

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

      <Tabs
        items={[
          { value: 'cli', label: 'CLI' },
          { value: 'manual', label: 'Manual' },
        ]}
        value={tab}
        onChange={(v, d) => {
          setTab(v);
          setDir(d);
        }}
        name={name}
        ariaLabel="Installation method"
        className="installation-box__tabs"
      />

      <TabPanel name={name} tab={tab} dir={dir}>
        {tab === 'cli' ? (
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
              <CodeBlock code={cliCommands[pkgManager]} language="bash" showLineNumbers={false} />
            </TabPanel>
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
      </TabPanel>
    </section>
  );
}

const CALLOUT_TONES: Record<'info' | 'warning' | 'tip' | 'note', AlertTone> = {
  info: 'info',
  warning: 'warning',
  tip: 'success',
  note: 'info',
};

const CALLOUT_TITLES: Record<'info' | 'warning' | 'tip' | 'note', string> = {
  info: 'Good to know',
  warning: 'Heads up',
  tip: 'Tip',
  note: 'Note',
};

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warning' | 'tip' | 'note';
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="doc-callout">
      <Alert tone={CALLOUT_TONES[tone]} title={title ?? CALLOUT_TITLES[tone]}>
        {children}
      </Alert>
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
  const name = useId();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [dir, setDir] = useState<1 | -1 | 0>(0);

  return (
    <div className="doc-tabs-group">
      <Tabs
        items={tabs.map((t) => ({ value: t.id, label: t.label }))}
        value={activeTab}
        onChange={(v, d) => {
          setActiveTab(v);
          setDir(d);
        }}
        name={name}
        ariaLabel="Code variants"
        className="doc-tabs-group__header"
      />
      <TabPanel name={name} tab={activeTab ?? ''} dir={dir}>
        <div className="doc-tabs-group__body">{tabs.find((t) => t.id === activeTab)?.content}</div>
      </TabPanel>
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
