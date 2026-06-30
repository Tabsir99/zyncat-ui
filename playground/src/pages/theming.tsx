import { Demo } from '../kit';

const OVERRIDE = `/* your app - after \`import 'premium-ds/styles.css'\` */
:root {
  --accent: oklch(0.55 0.21 285);   /* primary action fill   */
  --accent-hover: oklch(0.50 0.21 285);
  --radius-md: 10px;                 /* control corners       */
  --font-sans: 'Inter', system-ui;   /* the whole type ramp   */
}

[data-theme='dark'] {
  --bg-app: oklch(0.16 0 0);
}`;

const pre: React.CSSProperties = {
  margin: 0,
  padding: 'var(--space-5)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-default)',
  background: 'var(--bg-app)',
  font: 'var(--type-mono)',
  color: 'var(--text-body)',
  overflowX: 'auto',
  lineHeight: 1.7,
};

export function ThemingPage() {
  return (
    <>
      <Demo label="paste into your global stylesheet" fill>
        <pre style={pre}>{OVERRIDE}</pre>
      </Demo>
      <Demo label="try it live" fill>
        <span style={{ color: 'var(--text-muted)' }}>
          The accent swatches and the theme toggle in the top bar set exactly these variables on{' '}
          <code style={{ font: 'var(--type-mono)', color: 'var(--text-strong)' }}>:root</code> - no
          source, no rebuild. That's the whole theming story.
        </span>
      </Demo>
    </>
  );
}
