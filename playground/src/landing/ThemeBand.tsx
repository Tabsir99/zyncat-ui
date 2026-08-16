import { useState, type CSSProperties } from 'react';
import { Badge } from '@zyncat/ui/badge';
import { Button } from '@zyncat/ui/button';
import { RadioGroup } from '@zyncat/ui/radio-group';
import { Select } from '@zyncat/ui/select';
import { Tabs } from '@zyncat/ui/tabs';
import { TextField } from '@zyncat/ui/text-field';
import { Toggle } from '@zyncat/ui/toggle';
import { toast } from '@zyncat/ui/toast';
import { Icon } from '../icon';

type AccentName = 'teal' | 'indigo' | 'violet' | 'ember';
type RadiusName = 'sharp' | 'soft' | 'round';

// Alternate accents transpose the stock teal ramp's lightness steps onto a new
// hue, so every state (hover, active, subtle, ring) stays balanced for free.
const ACCENTS: Record<AccentName, { swatch: string; vars: Record<string, string> }> = {
  teal: {
    swatch: 'oklch(0.63 0.118 198)',
    vars: {
      '--accent-lift': 'oklch(0.705 0.112 198)',
      '--accent': 'oklch(0.63 0.118 198)',
      '--accent-hover': 'oklch(0.56 0.114 198)',
      '--accent-active': 'oklch(0.478 0.1 198)',
      '--accent-subtle': 'oklch(0.972 0.02 198)',
      '--accent-border': 'oklch(0.88 0.066 198)',
      '--accent-disabled': 'oklch(0.795 0.092 198)',
      '--text-accent': 'oklch(0.478 0.1 198)',
      '--accent-wash': 'oklch(0.63 0.118 198 / 0.05)',
    },
  },
  indigo: {
    swatch: 'oklch(0.62 0.16 272)',
    vars: {
      '--accent-lift': 'oklch(0.705 0.145 272)',
      '--accent': 'oklch(0.62 0.16 272)',
      '--accent-hover': 'oklch(0.55 0.165 272)',
      '--accent-active': 'oklch(0.47 0.15 272)',
      '--accent-subtle': 'oklch(0.97 0.02 272)',
      '--accent-border': 'oklch(0.875 0.06 272)',
      '--accent-disabled': 'oklch(0.79 0.1 272)',
      '--text-accent': 'oklch(0.47 0.15 272)',
      '--accent-wash': 'oklch(0.62 0.16 272 / 0.05)',
    },
  },
  violet: {
    swatch: 'oklch(0.62 0.17 315)',
    vars: {
      '--accent-lift': 'oklch(0.705 0.15 315)',
      '--accent': 'oklch(0.62 0.17 315)',
      '--accent-hover': 'oklch(0.55 0.17 315)',
      '--accent-active': 'oklch(0.47 0.155 315)',
      '--accent-subtle': 'oklch(0.97 0.02 315)',
      '--accent-border': 'oklch(0.88 0.065 315)',
      '--accent-disabled': 'oklch(0.79 0.1 315)',
      '--text-accent': 'oklch(0.47 0.155 315)',
      '--accent-wash': 'oklch(0.62 0.17 315 / 0.05)',
    },
  },
  ember: {
    swatch: 'oklch(0.63 0.145 45)',
    vars: {
      '--accent-lift': 'oklch(0.72 0.13 45)',
      '--accent': 'oklch(0.63 0.145 45)',
      '--accent-hover': 'oklch(0.56 0.14 45)',
      '--accent-active': 'oklch(0.48 0.125 45)',
      '--accent-subtle': 'oklch(0.972 0.02 45)',
      '--accent-border': 'oklch(0.88 0.06 45)',
      '--accent-disabled': 'oklch(0.795 0.095 45)',
      '--text-accent': 'oklch(0.478 0.125 45)',
      '--accent-wash': 'oklch(0.63 0.145 45 / 0.05)',
    },
  },
};

const RADII: Record<RadiusName, Record<string, string>> = {
  sharp: { '--radius-sm': '2px', '--radius-md': '4px', '--radius-lg': '6px', '--radius-xl': '10px' },
  soft: { '--radius-sm': '0.25rem', '--radius-md': '0.375rem', '--radius-lg': '0.5rem', '--radius-xl': '0.75rem' },
  round: { '--radius-sm': '8px', '--radius-md': '12px', '--radius-lg': '16px', '--radius-xl': '22px' },
};

const REGIONS = [
  { value: 'iad1', label: 'iad1', description: 'US East · N. Virginia' },
  { value: 'fra1', label: 'fra1', description: 'EU Central · Frankfurt' },
  { value: 'sfo1', label: 'sfo1', description: 'US West · San Francisco' },
  { value: 'syd1', label: 'syd1', description: 'APAC · Sydney' },
];

function overrideCss(accent: AccentName, radius: RadiusName): string {
  const isDefault = accent === 'teal' && radius === 'soft';
  const comment = isDefault
    ? '  /* the shipped defaults, spelled out */'
    : "  /* paste over the defaults — that's the whole theme */";
  const vars = { ...ACCENTS[accent].vars, ...RADII[radius] };
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return `:root {\n${comment}\n${lines.join('\n')}\n}`;
}

export function ThemeBand() {
  const [accent, setAccent] = useState<AccentName>('teal');
  const [radius, setRadius] = useState<RadiusName>('soft');
  const [tab, setTab] = useState('general');
  const [name, setName] = useState('Acme Analytics');
  const [region, setRegion] = useState<string | null>('fra1');
  const [digest, setDigest] = useState('realtime');

  const styleVars = { ...ACCENTS[accent].vars, ...RADII[radius] } as CSSProperties;

  return (
    <section className="ld-theme" id="tokens">
      <div className="ld-container ld-theme__grid">
        <div className="ld-theme__rail" data-reveal>
          <p className="ld-eyebrow ld-eyebrow--dark">--02 · tokens</p>
          <h2 className="ld-h2 ld-h2--dark">Re-skin it in one paste.</h2>
          <p className="ld-theme__lede">
            Every component reads from one small, intent-named token vocabulary — no config file, no build step. Repoint
            the custom properties and buttons, tabs, focus rings and hover washes all follow. Try it:
          </p>

          <div className="ld-theme__knobs">
            <div className="ld-knob">
              <span className="ld-knob__label">--accent</span>
              <div className="ld-knob__row" role="group" aria-label="Accent color">
                {(Object.keys(ACCENTS) as AccentName[]).map((a) => (
                  <button
                    key={a}
                    type="button"
                    className="ld-swatch"
                    data-active={a === accent || undefined}
                    aria-pressed={a === accent}
                    onClick={() => setAccent(a)}
                    style={{ '--sw': ACCENTS[a].swatch } as CSSProperties}
                  >
                    <i style={{ background: ACCENTS[a].swatch }} />
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="ld-knob">
              <span className="ld-knob__label">--radius</span>
              <div className="ld-knob__row" role="group" aria-label="Corner radius">
                {(Object.keys(RADII) as RadiusName[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className="ld-swatch"
                    data-active={r === radius || undefined}
                    aria-pressed={r === radius}
                    onClick={() => setRadius(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <pre className="ld-theme__css" aria-label="The exact CSS this preview is using">
            <code>{overrideCss(accent, radius)}</code>
          </pre>
          <p className="ld-theme__note">
            ↑ this block is the actual CSS the preview is running — copy it into your app and you're themed.
          </p>
        </div>

        <div className="ld-theme__stage" data-reveal="fade">
          <div className="ld-theme__panel" style={styleVars}>
            <div className="ld-panel__head">
              <div>
                <h3 className="ld-panel__title">Workspace settings</h3>
                <p className="ld-panel__sub">acme-analytics · eu-central</p>
              </div>
              <Badge tone="info" pill>
                Pro
              </Badge>
            </div>
            <Tabs
              ariaLabel="Settings sections"
              items={[
                { value: 'general', label: 'General' },
                { value: 'members', label: 'Members', count: 12 },
                { value: 'billing', label: 'Billing' },
              ]}
              value={tab}
              onChange={(v) => setTab(v)}
            />
            <div className="ld-panel__body">
              <TextField
                id="ld-ws-name"
                label="Workspace name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                helper="Shown on invoices and in the sidebar."
              />
              <Select
                ariaLabel="Primary region"
                leadingIcon={<Icon name="globe" size="sm" />}
                options={REGIONS}
                value={region}
                onChange={(v) => setRegion(v)}
              />
              <RadioGroup
                name="ld-digest"
                label="Alert delivery"
                options={[
                  { value: 'realtime', label: 'Real-time', description: 'Page the on-call.' },
                  { value: 'daily', label: 'Daily digest', description: 'One summary at 09:00.' },
                ]}
                value={digest}
                onChange={setDigest}
              />
              <Toggle label="Usage alerts" description="Email the team when nearing plan limits." defaultChecked />
            </div>
            <div className="ld-panel__foot">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button size="sm" onClick={() => toast.success('Settings saved')}>
                Save changes
              </Button>
            </div>
          </div>
          <p className="ld-theme__caption">
            same components · zero refactor —{' '}
            <span>focus rings, hover washes and pressed states re-derive themselves</span>
          </p>
        </div>
      </div>
    </section>
  );
}
