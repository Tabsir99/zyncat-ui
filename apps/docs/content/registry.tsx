import type { ComponentType } from 'react';

import * as C from '../components/pages/compound';
import * as D from '../components/pages/data';
import * as T from '../components/pages/datetime';
import * as E from '../components/pages/expressive';
import * as FB from '../components/pages/facebook-feed';
import * as F from '../components/pages/forms';
import * as IG from '../components/pages/instagram-feed';
import { InstallationDoc } from '../components/pages/installation';
import { IntroductionDoc } from '../components/pages/introduction';
import { McpDoc } from '../components/pages/mcp';
import * as O from '../components/pages/overlays';
import * as P from '../components/pages/primitives';
import { ThemingDoc } from '../components/pages/theming';
import * as TT from '../components/pages/tiktok';
import * as YT from '../components/pages/youtube';
import type { PropRow } from '../components/PropsTable';
import { CONTENT } from './content';
import { GENERATED_PROPS, GENERATED_TYPES, type NestedType } from './props.generated';

export interface ExampleItem {
  id: string;
  title: string;
  description?: string;
  Component: ComponentType;
  code?: string;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export const NEW_SLUGS = new Set(['count-badge', 'emoji-picker', 'date-range', 'multi-select']);

export interface Doc {
  slug: string;
  label: string;
  headline?: string;
  blurb: string;
  HeroComponent?: ComponentType;
  Playground?: ComponentType;
  heroCode?: string;
  examples?: ExampleItem[];
  props?: PropRow[];
  types?: NestedType[];
  Content?: ComponentType;
  toc?: TocItem[];
}

export interface DocGroup {
  id: string;
  title: string;
  docs: Doc[];
}

export const GROUPS: DocGroup[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    docs: [
      {
        slug: 'introduction',
        label: 'Introduction',
        headline: 'A catalogue of moving parts.',
        blurb:
          'React 19 components on a closed token vocabulary, animated by a house-built WAAPI engine — no Tailwind, no CSS-in-JS, no animation library underneath.',
        Content: IntroductionDoc,
        toc: [
          { id: 'overview', title: 'Overview', level: 2 },
          { id: 'philosophy', title: 'Philosophy & Craft', level: 2 },
          { id: 'core-pillars', title: 'Core Pillars', level: 2 },
          { id: 'architecture', title: 'Design Architecture', level: 2 },
          { id: 'next-steps', title: 'Next Steps', level: 2 },
        ],
      },
      {
        slug: 'installation',
        label: 'Installation',
        blurb:
          'One command sets up everything: the package, the stylesheet, the agent skill, the MCP server and a typed theme.',
        Content: InstallationDoc,
        toc: [
          { id: 'quick-start', title: 'One command', level: 2 },
          { id: 'what-it-does', title: 'What init does', level: 2 },
          { id: 'after-init', title: 'After init', level: 2 },
          { id: 'requirements', title: 'Requirements & CI', level: 2 },
        ],
      },
      {
        slug: 'theming',
        label: 'Theming & Overrides',
        blurb:
          'The four ways to override Zyncat UI: cascade layers, tokens, scoped custom properties, and props - ' +
          'with a typed theme file behind the token layer.',
        Content: ThemingDoc,
        toc: [
          { id: 'override-levels', title: 'The four override levels', level: 2 },
          { id: 'level-0', title: 'Level 0 — Cascade layers', level: 2 },
          { id: 'level-1', title: 'Level 1 — Tokens', level: 2 },
          { id: 'typed-theme', title: 'The typed theme', level: 2 },
          { id: 'level-2', title: 'Level 2 — Scoped properties', level: 2 },
          { id: 'level-3', title: 'Level 3 — Instance props', level: 2 },
          { id: 'replicas', title: 'Replicas', level: 2 },
        ],
      },
      {
        slug: 'mcp',
        label: 'MCP Server',
        blurb: 'Connect AI-assisted coding agents and IDEs directly to Zyncat UI via Model Context Protocol.',
        Content: McpDoc,
        toc: [
          { id: 'overview', title: 'Overview', level: 2 },
          { id: 'what-is-mcp', title: 'What is MCP?', level: 2 },
          { id: 'ide-configuration', title: 'Setup', level: 2 },
          { id: 'tools-reference', title: 'Tools Reference', level: 2 },
          { id: 'sample-prompts', title: 'Sample AI Prompts', level: 2 },
        ],
      },
    ],
  },
  {
    id: 'primitives',
    title: 'Primitives',
    docs: [
      {
        slug: 'button',
        label: 'Button',
        blurb: 'One control for every click action. Exactly one primary per view.',
        Playground: P.ButtonPlayground,
        heroCode: `import { Button } from '@zyncat/ui/button';\n\n<Button variant="primary" onClick={schedulePost}>Schedule post</Button>`,
        examples: [
          {
            id: 'variants',
            title: 'Variants',
            description: 'Five semantic intents — primary, secondary, ghost, danger, and link.',
            Component: P.ButtonVariantsDemo,
            code: `<Button variant="primary">Primary</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="danger">Danger</Button>\n<Button variant="link">Link</Button>`,
          },
          {
            id: 'sizes',
            title: 'Sizes',
            description: 'Three standardized heights snapping to token steps.',
            Component: P.ButtonSizesDemo,
            code: `<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>`,
          },
          {
            id: 'icons-and-states',
            title: 'Icons & States',
            description: 'Compose Phosphor icons, loading spinner replacement, and disabled states.',
            Component: P.ButtonIconsDemo,
            code: `<Button><PlusIcon /> New project</Button>\n<Button loading>Saving</Button>\n<Button disabled>Disabled</Button>`,
          },
        ],
      },
      {
        slug: 'icon',
        label: 'Icon',
        blurb: 'Any Phosphor glyph by name or semantic alias; fill marks active.',
        Playground: P.IconPlayground,
        heroCode: `import { Icon } from './icon';\n\n<Icon name="lightning" size="lg" />`,
        examples: [
          {
            id: 'glyphs',
            title: 'Glyphs',
            description: 'Pre-registered Phosphor icons used across the design system.',
            Component: P.IconGlyphsDemo,
            code: `<Icon name="gear" />\n<Icon name="bell" />\n<Icon name="cloud" />`,
          },
          {
            id: 'sizes',
            title: 'Sizes',
            description: 'Standard sizing steps: sm (16px), md (20px), lg (24px).',
            Component: P.IconSizesDemo,
            code: `<Icon name="star" size="sm" />\n<Icon name="star" size="md" />\n<Icon name="star" size="lg" />`,
          },
          {
            id: 'weights',
            title: 'Weights',
            description: 'Regular and fill weights for inactive/active indicators.',
            Component: P.IconWeightsDemo,
            code: `<Icon name="heart" />\n<Icon name="heart" weight="fill" />`,
          },
        ],
      },
      {
        slug: 'collapse',
        label: 'Collapse',
        blurb: 'Layout-transition primitive - grid-fr open/close, never touches auto.',
        Playground: P.CollapsePlayground,
        heroCode: `import { Collapse } from '@zyncat/ui/collapse';\n\n<Collapse open={open}>\n  <div>Collapsing region content.</div>\n</Collapse>`,
        examples: [
          {
            id: 'asymmetric-timing',
            title: 'Asymmetric Timing',
            description: 'Deliberate entrance ease, swift exit curve without layout snap.',
            Component: P.CollapseAsymDemo,
            code: `<Collapse open={open} fade animation={{ duration: { open: 'slow', close: 'fast' }, ease: { close: 'exit' } }}>\n  <div>Animated content</div>\n</Collapse>`,
          },
          {
            id: 'tab-order-management',
            title: 'Tab Order Management',
            description: 'Closed content is automatically removed from the tab focus order.',
            Component: P.CollapseTabOrderDemo,
            code: `<Collapse open={formOpen}>\n  <TextField label="Name" />\n</Collapse>`,
          },
        ],
      },
      {
        slug: 'badge',
        label: 'Badge',
        blurb: 'Glass or outline. Status hues reserved for genuine status.',
        Playground: P.BadgePlayground,
        heroCode: `import { Badge } from '@zyncat/ui/badge';\n\n<Badge tone="info" pill>New Release</Badge>`,
        examples: [
          {
            id: 'tones',
            title: 'Tones',
            description: 'Neutral and semantic status tones (info, success, warning, danger).',
            Component: P.BadgeTonesDemo,
            code: `<Badge>Neutral</Badge>\n<Badge tone="info">Info</Badge>\n<Badge tone="success">Success</Badge>`,
          },
          {
            id: 'variants',
            title: 'Variants',
            description: 'Dot, live pulse, outline, and pill styles.',
            Component: P.BadgeVariantsDemo,
            code: `<Badge dot tone="info">Dot</Badge>\n<Badge live tone="warning">Live</Badge>\n<Badge pill tone="success">Pill</Badge>`,
          },
        ],
      },
      {
        slug: 'status-badge',
        label: 'StatusBadge',
        blurb: 'Canonical status - tone + one-word label; morph animates in place.',
        Playground: P.StatusBadgePlayground,
        heroCode: `import { StatusBadge } from '@zyncat/ui/status-badge';\n\n<StatusBadge status="scheduled" morph />`,
        examples: [
          {
            id: 'all-statuses',
            title: 'All Statuses',
            description: 'Standard post and workflow statuses mapped to design tokens.',
            Component: P.StatusBadgeAllDemo,
            code: `<StatusBadge status="draft" />\n<StatusBadge status="scheduled" />\n<StatusBadge status="published" />`,
          },
        ],
      },
      {
        slug: 'count-badge',
        label: 'CountBadge',
        blurb: 'Mono, tabular counts; roll animates digits like an odometer.',
        Playground: P.CountBadgePlayground,
        heroCode: `import { CountBadge } from '@zyncat/ui/count-badge';\n\n<CountBadge value={count} roll tone="info" />`,
        examples: [
          {
            id: 'static-counts',
            title: 'Static Counts',
            description: 'Tabular monospace readouts with tone variants.',
            Component: P.CountBadgeStaticDemo,
            code: `<CountBadge value="7 / 10" />\n<CountBadge value="99+" tone="warning" />`,
          },
        ],
      },
    ],
  },
  {
    id: 'expressive',
    title: 'Expressive',
    docs: [
      {
        slug: 'odometer',
        label: 'Odometer',
        blurb: 'Rolling figures at display size; every digit column carries its own spring.',
        Playground: E.OdometerPlayground,
        heroCode: `import { Odometer } from '@zyncat/ui/odometer';\n\n<Odometer value={count} format={(v) => v.toLocaleString('en-US')} />`,
        examples: [
          {
            id: 'retuning',
            title: 'Retuning',
            description: 'Level 2 override - the scoped --odometer-* properties are the theming contract.',
            Component: E.OdometerThemeDemo,
            code: `<Odometer value={v} style={{ '--odometer-size': 'var(--size-title)', '--odometer-weight': '600' }} />\n<Odometer value={v} style={{ '--odometer-accent': 'var(--accent-active)', '--odometer-gap': '0.14em' }} />`,
          },
        ],
      },
      {
        slug: 'typing-lines',
        label: 'TypingLines',
        blurb: 'A line types itself, holds, deletes, and moves to the next one.',
        Playground: E.TypingLinesPlayground,
        heroCode: `import { TypingLines } from '@zyncat/ui/typing-lines';\n\n<TypingLines lines={['Design every state.', 'Make every motion interruptible.']} />`,
        examples: [
          {
            id: 'retuning',
            title: 'Retuning',
            description: 'Level 2 override - size, weight and caret ink are scoped --typing-lines-* properties.',
            Component: E.TypingLinesThemeDemo,
            code: `<TypingLines lines={lines} style={{ '--typing-lines-size': 'var(--size-display)', '--typing-lines-caret-ink': 'var(--accent-active)' }} />`,
          },
        ],
      },
      {
        slug: 'lens',
        label: 'Lens',
        blurb: 'An optical loupe over live DOM - magnified type is re-rasterised, never upscaled.',
        Playground: E.LensPlayground,
        heroCode: `import { Lens } from '@zyncat/ui/lens';\n\n<Lens magnification={2.6} radius={132}>\n  <TypeSpecimen />\n</Lens>`,
      },
      {
        slug: 'weight-field',
        label: 'WeightField',
        blurb: 'A display headline whose glyphs gain weight as the cursor approaches, and overshoot on the way back.',
        Playground: E.WeightFieldPlayground,
        heroCode: `import { WeightField } from '@zyncat/ui/weight-field';\n\n<WeightField text="Kinetic" />`,
        examples: [
          {
            id: 'retuning',
            title: 'Retuning',
            description: 'Level 2 override - the scoped --weight-field-* properties are the theming contract.',
            Component: E.WeightFieldThemeDemo,
            code: `<WeightField text="Restrained" style={{ '--weight-field-rest-weight': '400', '--weight-field-peak-weight': '600', '--weight-field-lift': '0em', '--weight-field-tint': '0' }} />\n<WeightField text="Exaggerated" style={{ '--weight-field-accent': 'var(--accent-active)', '--weight-field-reach': '4', '--weight-field-lift': '0.16em' }} />`,
          },
        ],
      },
      {
        slug: 'morphing-text',
        label: 'MorphingText',
        blurb: 'A word list that morphs word into word through one alpha threshold, so letterforms pool like liquid.',
        Playground: E.MorphingTextPlayground,
        heroCode: `import { MorphingText } from '@zyncat/ui/morphing-text';\n\n<MorphingText words={['Weight', 'Timing', 'Ease', 'Rest']} />`,
        examples: [
          {
            id: 'retuning',
            title: 'Retuning',
            description:
              'Level 2 override - the scoped --morphing-text-* properties are the theming contract; smear is how far letterforms melt, and the hairline is removed by zeroing its height.',
            Component: E.MorphingTextThemeDemo,
            code: `<MorphingText words={words} style={{ '--morphing-text-smear': '1.6', '--morphing-text-rule-accent': 'var(--accent-active)' }} />\n<MorphingText words={words} style={{ '--morphing-text-smear': '0.5', '--morphing-text-rule-height': '0' }} />`,
          },
        ],
      },
      {
        slug: 'flow-field',
        label: 'FlowField',
        blurb: 'A canvas needle field that breathes on a noise loop and swings away from the pointer.',
        Playground: E.FlowFieldPlayground,
        heroCode: `import { FlowField } from '@zyncat/ui/flow-field';\n\n<FlowField spacing={26} radius={210}>\n  <Hero />\n</FlowField>`,
      },
      {
        slug: 'confetti',
        label: 'Confetti',
        blurb: 'A canvas burst you fire yourself - paper, curls, ribbons and foil on real drag, lift and tumble.',
        Playground: E.ConfettiPlayground,
        heroCode: `import { Confetti, type ConfettiHandle } from '@zyncat/ui/confetti';\n\nconst confetti = useRef<ConfettiHandle>(null);\n\n<Confetti ref={confetti} field="viewport" />\n<Button onClick={() => confetti.current?.fire()}>Celebrate</Button>`,
      },
    ],
  },
  {
    id: 'compound',
    title: 'Compound',
    docs: [
      {
        slug: 'support-fan',
        label: 'SupportFan',
        blurb:
          'Expressive contract. A trigger that fans its actions onto an arc, with one pointer-tracked field the whole row glides along.',
        Playground: C.SupportFanPlayground,
        heroCode: `import { SupportFan } from '@zyncat/ui/support-fan';\n\n<SupportFan actions={actions} caption="Studio open · GMT+1" onSelect={route} />`,
        examples: [
          {
            id: 'keyboard',
            title: 'Keyboard',
            description:
              'Down or Up on the closed trigger opens onto the first or last chip. Arrows step, Home and End jump, Escape returns focus. Focus aims the same field the pointer does, so the row glides to the focused chip and the caption follows - a keyboard user gets the component, not a reduced version of it.',
            Component: C.SupportFanKeyboardDemo,
            code: `<SupportFan actions={actions} layout="dock" caption="Keyboard drives the same field" />`,
          },
          {
            id: 'controlled',
            title: 'Controlled and interruptible',
            description:
              'Toggle mid-flight or switch layout while the row is still deploying: the slots retarget from wherever they are. The open transition and the pointer field live on two nested layers, so neither can cancel the other.',
            Component: C.SupportFanControlledDemo,
            code: `<SupportFan actions={actions} open={open} onOpenChange={setOpen} onSelect={handleSelect} />`,
          },
          {
            id: 'retuning',
            title: 'Retuning',
            description:
              'Level 2 override - the scoped --support-fan-* properties are the theming contract. Surfaces, ink, accent, trigger size, caption tracking and every duration are knobs; none of them is a prop.',
            Component: C.SupportFanThemeDemo,
            code: `<SupportFan actions={actions} style={{ '--support-fan-surface': 'var(--gray-900)', '--support-fan-ink': 'var(--text-inverse)' } as CSSProperties} />\n<SupportFan actions={actions} style={{ '--support-fan-open-duration': 'var(--duration-base)' } as CSSProperties} />`,
          },
        ],
      },
      {
        slug: 'support-rail',
        label: 'SupportRail',
        blurb:
          'Expressive contract. An edge tab that grows a support panel out of its own measured box, and folds back into it.',
        Playground: C.SupportRailPlayground,
        heroCode: `import { SupportRail } from '@zyncat/ui/support-rail';\n\n<SupportRail actions={actions} status="Open · closes 20:00" live onSelect={route} />`,
        examples: [
          {
            id: 'retuning',
            title: 'Retuning',
            description:
              'Level 2 override - the scoped --support-rail-* properties are the theming contract. Row padding is one of them, which is why there is no density prop: the knob reaches any value, an enum reached two.',
            Component: C.SupportRailThemeDemo,
            code: `<SupportRail actions={actions} style={{ '--support-rail-width': '272px', '--support-rail-row-pad-block': 'var(--space-2)' } as CSSProperties} />`,
          },
        ],
      },
    ],
  },
  {
    id: 'replicas',
    title: 'Replicas',
    docs: [
      {
        slug: 'instagram-feed',
        label: 'InstagramFeed',
        blurb:
          'Replica. An Instagram post, image or video, at both column widths. Fidelity is the contract - no theming knobs.',
        Playground: IG.InstagramPlayground,
        heroCode: `import { InstagramFeed } from '@zyncat/ui/instagram-feed';\n\n<InstagramFeed handle="studio.zyncat" caption="Shot on the roof." media={<img src={photo} alt="" />} likes={2600} />`,
        examples: [
          {
            id: 'controlled',
            title: 'Controlled interaction',
            description:
              'Like, save and mute are controlled triples, so the consumer owns the value. Double-tap the media to like it - that is the platform behaviour, not an invention. Pass no handlers and the affordances stay inert.',
            Component: IG.InstagramFeedControlled,
            code: `<InstagramFeed liked={liked} onLikedChange={setLiked} saved={saved} onSavedChange={setSaved} onAction={track} />`,
          },
        ],
      },
      {
        slug: 'facebook-feed',
        label: 'FacebookFeed',
        blurb: 'Replica. Three Facebook surfaces - feed post, reel and story - behind one surface prop.',
        Playground: FB.FacebookPlayground,
        heroCode: `import { FacebookFeed } from '@zyncat/ui/facebook-feed';\n\n<FacebookFeed surface="post" name="Zyncat Studio" caption="New build is live." media={photo} likes={1240} />`,
      },
      {
        slug: 'tiktok',
        label: 'TikTok',
        blurb: 'Replica. The TikTok post surface, desktop and mobile, with the photo carousel.',
        Playground: TT.TikTokPlayground,
        heroCode: `import { TikTok } from '@zyncat/ui/tiktok';\n\n<TikTok surface="desktop" name="zyncat.studio" caption="Build log 04" media={clip} likes={187000} />`,
        examples: [
          {
            id: 'controlled',
            title: 'Controlled interaction',
            description:
              'The rail is real buttons, not decorated spans. liked, saved and followed are controlled triples and the counts add yours; comment, share, menu and search carry no state and report through onAction. Tap the heart or the bookmark on the rail.',
            Component: TT.TikTokControlledDemo,
            code: `<TikTok surface="desktop" liked={liked} onLikedChange={setLiked} saved={saved} onSavedChange={setSaved} onAction={track} />`,
          },
        ],
      },
      {
        slug: 'youtube',
        label: 'YouTube',
        blurb: 'Replica. Three YouTube surfaces - feed card, Short and community post - behind one surface prop.',
        Playground: YT.YouTubePlayground,
        heroCode: `import { YouTube } from '@zyncat/ui/youtube';\n\n<YouTube surface="video" title="Building a design system from zero" channel="Zyncat" views="184K views" age="3 weeks ago" duration="14:22" media={photo} />`,
      },
    ],
  },
  {
    id: 'forms',
    title: 'Forms',
    docs: [
      {
        slug: 'text-field',
        label: 'TextField',
        blurb: 'The base text input - states disclose via Collapse, never jump.',
        Playground: F.TextFieldPlayground,
        heroCode: `import { TextField } from '@zyncat/ui/text-field';\n\n<TextField label="Search projects" leadingIcon={<SearchIcon />} clearable />`,
        examples: [
          {
            id: 'validation-states',
            title: 'Validation States',
            description:
              'Type in the username field - the error appears and clears via Collapse, never jumping the layout.',
            Component: F.TextFieldValidationDemo,
            code: `<TextField label="Username" error="Must be at least 4 characters." />\n<TextField label="Handle" success="Available." />`,
          },
        ],
      },
      {
        slug: 'number-field',
        label: 'NumberField',
        blurb: 'Tabular figures, caret steppers, unit suffix, clamp to bounds.',
        Playground: F.NumberFieldPlayground,
        heroCode: `import { NumberField } from '@zyncat/ui/number-field';\n\n<NumberField label="Seats" unit="users" min={1} max={50} value={seats} onChange={setSeats} />`,
        examples: [
          {
            id: 'unit-and-bounds',
            title: 'Unit & Bounds',
            description: 'Unit suffix label with min/max clamping and stepper controls.',
            Component: F.NumberFieldUnitDemo,
            code: `<NumberField label="Posts per day" unit="posts" min={1} max={20} step={1} />`,
          },
        ],
      },
      {
        slug: 'otp-field',
        label: 'OtpField',
        blurb: 'Segmented one-time-code - auto-advance, paste-to-fill.',
        Playground: F.OtpFieldPlayground,
        heroCode: `import { OtpField } from '@zyncat/ui/otp-field';\n\n<OtpField length={6} group={3} value={code} onChange={setCode} />`,
        examples: [
          {
            id: 'sizes-and-groups',
            title: 'Sizes & Grouping',
            description: 'Configurable character length and segment grouping.',
            Component: F.OtpFieldSizesDemo,
            code: `<OtpField length={4} size="sm" />\n<OtpField length={6} group={3} size="md" />`,
          },
        ],
      },
      {
        slug: 'textarea',
        label: 'Textarea',
        blurb: 'Auto-grow, character meter, over-limit highlight, ⌘/Ctrl+↵ submit.',
        Playground: F.TextareaPlayground,
        heroCode: `import { Textarea } from '@zyncat/ui/textarea';\n\n<Textarea label="Announcement" max={280} minRows={3} onSubmit={handleSubmit} hint="Cmd+Enter to submit" />`,
        examples: [
          {
            id: 'auto-grow',
            title: 'Auto-Growth & Bounds',
            description: 'Smooth auto-resizing with minRows and maxRows constraints.',
            Component: F.TextareaAutoGrowDemo,
            code: `<Textarea label="Notes" minRows={2} maxRows={6} />`,
          },
        ],
      },
      {
        slug: 'checkbox',
        label: 'Checkbox',
        blurb: 'Stages a choice you submit later - fill springs in, then the tick draws on.',
        Playground: F.CheckboxPlayground,
        heroCode: `import { Checkbox } from '@zyncat/ui/checkbox';\n\n<Checkbox label="Pin post to queue" description="Published before any other scheduled items." />`,
        examples: [
          {
            id: 'states',
            title: 'States & Indeterminate',
            description: 'Uncontrolled, indeterminate batch, and disabled states.',
            Component: F.CheckboxStatesDemo,
            code: `<Checkbox label="Default" defaultChecked />\n<Checkbox label="Indeterminate" indeterminate />\n<Checkbox label="Disabled" disabled defaultChecked />`,
          },
        ],
      },
      {
        slug: 'toggle',
        label: 'Toggle',
        blurb: 'Actuates a setting on the spot - the thumb travels on a real spring.',
        Playground: F.TogglePlayground,
        heroCode: `import { Toggle } from '@zyncat/ui/toggle';\n\n<Toggle label="Auto-save drafts" description="Changes sync automatically as you type." checked={toggled} onChange={setToggled} />`,
        examples: [
          {
            id: 'controlled-and-disabled',
            title: 'Controlled & Disabled',
            description: 'Controlled state toggling and disabled policy settings.',
            Component: F.ToggleControlledDemo,
            code: `<Toggle label="Two-factor auth" checked={twoFa} onChange={setTwoFa} />\n<Toggle label="Locked policy" disabled defaultChecked />`,
          },
        ],
      },
      {
        slug: 'radio-group',
        label: 'RadioGroup',
        blurb: 'Pick exactly one - quiet rows or selectable cards; the marker glides.',
        Playground: F.RadioGroupPlayground,
        heroCode: `import { RadioGroup } from '@zyncat/ui/radio-group';\n\n<RadioGroup name="plan" label="Select a plan" value={plan} onChange={setPlan} options={PLAN_OPTIONS} />`,
        examples: [
          {
            id: 'row-options',
            title: 'Simple Row Options',
            description: 'Standard quiet rows with radio indicator and descriptions.',
            Component: F.RadioGroupRowsDemo,
            code: `<RadioGroup name="role" label="Member permission" options={ROLES} />`,
          },
        ],
      },
      {
        slug: 'select',
        label: 'Select',
        blurb: 'Custom single-select listbox - committing closes and returns focus.',
        Playground: F.SelectPlayground,
        heroCode: `import { Select } from '@zyncat/ui/select';\n\n<Select ariaLabel="Timezone" value={tz} onChange={setTz} options={TIMEZONES} searchable />`,
      },
      {
        slug: 'multi-select',
        label: 'MultiSelect',
        blurb: 'Many-of listbox - toggling keeps the menu open; trigger summarises as first +N.',
        Playground: F.MultiSelectPlayground,
        heroCode: `import { MultiSelect } from '@zyncat/ui/multi-select';\n\n<MultiSelect ariaLabel="Channels" value={channels} onChange={setChannels} options={CHANNELS} searchable />`,
        examples: [],
      },
    ],
  },
  {
    id: 'data',
    title: 'Data display',
    docs: [
      {
        slug: 'avatar',
        label: 'Avatar',
        blurb: 'Identity mark - image, initials, or silhouette, with presence.',
        Playground: D.AvatarPlayground,
        heroCode: `import { Avatar } from '@zyncat/ui/avatar';\n\n<Avatar src="https://i.pravatar.cc/96?img=47" name="Ana Ng" status="online" size="lg" />`,
        examples: [
          {
            id: 'sizes',
            title: 'Sizes',
            description: 'Five avatar sizes: xs, sm, md, lg, and xl.',
            Component: D.AvatarSizesDemo,
            code: `<Avatar name="Ana Ng" size="xs" />\n<Avatar name="Ana Ng" size="md" />\n<Avatar name="Ana Ng" size="xl" />`,
          },
          {
            id: 'status-indicators',
            title: 'Status Indicators',
            description: 'Presence dots for online, away, busy, and offline status.',
            Component: D.AvatarStatusDemo,
            code: `<Avatar name="Bo Park" status="online" />\n<Avatar name="Cira Diaz" status="away" />`,
          },
          {
            id: 'avatar-group',
            title: 'Avatar Group',
            description: 'Overlapping stack with automatic +N overflow badge.',
            Component: D.AvatarGroupDemo,
            code: `<AvatarGroup max={4} size="md">\n  <Avatar name="Ana Ng" />\n  <Avatar name="Bo Park" />\n</AvatarGroup>`,
          },
        ],
      },
      {
        slug: 'tag',
        label: 'Tag',
        blurb: 'User-owned label - removable entries, applied filters. A control, not a status.',
        Playground: D.TagPlayground,
        heroCode: `import { Tag, TagGroup } from '@zyncat/ui/tag';\n\n<TagGroup ariaLabel="Labels">\n  <Tag icon={<HashIcon />} onRemove={handleRemove}>design</Tag>\n</TagGroup>`,
        examples: [
          {
            id: 'toggle-tags',
            title: 'Toggle Tags (Filters)',
            description: 'Multi-selection tag filters for interactive data filtering.',
            Component: D.TagToggleGroupDemo,
            code: `<ToggleTag checked={selected} onChange={toggle}>Open</ToggleTag>`,
          },
        ],
      },
      {
        slug: 'table',
        label: 'Table',
        blurb: 'Declare columns + rows; it owns sort, selection, stickiness, overflow.',
        Playground: D.TablePlayground,
        heroCode: `import { Table } from '@zyncat/ui/table';\n\n<Table rows={rows} columns={columns} rowKey="id" selectable />`,
      },
      {
        slug: 'pagination',
        label: 'Pagination',
        blurb: 'Honest cursor strip - a mono range readout and a prev/next pair.',
        HeroComponent: D.PaginationHero,
        heroCode: `import { Pagination } from '@zyncat/ui/pagination';\n\n<Pagination page={page} pageSize={10} totalCount={94} onPageChange={setPage} />`,
        examples: [],
      },
    ],
  },
  {
    id: 'datetime',
    title: 'Date, time & tabs',
    docs: [
      {
        slug: 'date-field',
        label: 'DateField',
        blurb: "A month calendar in a popover; commit is live, value is 'YYYY-MM-DD'.",
        HeroComponent: T.DateFieldHero,
        heroCode: `import { DateField } from '@zyncat/ui/date-field';\n\n<DateField label="Publish date" value={date} onChange={setDate} />`,
        examples: [
          {
            id: 'bounds-constraints',
            title: 'Min / Max Bounds',
            description: 'Restrict selectable calendar dates to a specific range.',
            Component: T.DateFieldBoundsDemo,
            code: `<DateField label="Schedule window" min="2026-08-01" max="2026-08-31" />`,
          },
        ],
      },
      {
        slug: 'datetime-field',
        label: 'DateTimeField',
        blurb: "Calendar plus the segmented HH:MM machine; value is 'YYYY-MM-DDTHH:mm'.",
        Playground: T.DateTimeFieldPlayground,
        heroCode: `import { DateTimeField } from '@zyncat/ui/datetime-field';\n\n<DateTimeField label="Publish timestamp" value={datetime} onChange={setDatetime} />`,
      },
      {
        slug: 'date-range',
        label: 'DateRangeField',
        blurb: 'Two-tap auto-ordering window; commits only when both ends exist.',
        HeroComponent: T.DateRangeFieldHero,
        heroCode: `import { DateRangeField } from '@zyncat/ui/date-range-field';\n\n<DateRangeField label="Campaign duration" startDate={start} endDate={end} onRangeChange={setRange} />`,
        examples: [],
      },
      {
        slug: 'time-field',
        label: 'TimeField',
        blurb: "The standalone segmented time machine; value is 'HH:mm', bounds saturate.",
        Playground: T.TimeFieldPlayground,
        heroCode: `import { TimeField } from '@zyncat/ui/time-field';\n\n<TimeField label="Broadcast time" value={time} onChange={setTime} />`,
        examples: [],
      },
      {
        slug: 'tabs',
        label: 'Tabs',
        blurb: 'Line tabs - the ink reaches then releases; panels enter from the side you moved toward.',
        HeroComponent: T.TabsHero,
        heroCode: `import { Tabs } from '@zyncat/ui/tabs';\n\n<Tabs items={tabItems} activeId={active} onChange={setActive} />`,
        examples: [],
      },
    ],
  },
  {
    id: 'overlays',
    title: 'Overlays & feedback',
    docs: [
      {
        slug: 'alert',
        label: 'Alert',
        blurb: 'Persistent, in-flow status. Existence is the only motion - dismissal eases shut.',
        Playground: O.AlertPlayground,
        heroCode: `import { Alert } from '@zyncat/ui/alert';\n\n<Alert tone="warning" title="Subscription renewal" action={{ label: 'Manage plan', onClick: handlePlan }}>\n  Your workspace trial will expire in 3 days.\n</Alert>`,
        examples: [
          {
            id: 'tones',
            title: 'Semantic Tones',
            description: 'Info, success, warning, and danger tones for in-flow alerts.',
            Component: O.AlertTonesDemo,
            code: `<Alert tone="info" title="Update available">...</Alert>\n<Alert tone="success" title="Published">...</Alert>\n<Alert tone="danger" title="Payment declined">...</Alert>`,
          },
        ],
      },
      {
        slug: 'toast',
        label: 'Toast',
        blurb: 'Imperative toast() API. Mount <Toaster /> once at the root, then fire one from anywhere.',
        Playground: O.ToastPlayground,
        heroCode: `import { toast, Toaster } from '@zyncat/ui/toast';\n\ntoast.success('Changes saved', { description: 'Updated across all workspaces.' });`,
        examples: [],
      },
      {
        slug: 'tooltip',
        label: 'Tooltip',
        blurb: 'Transient hint on hover/focus. One bubble travels between triggers.',
        Playground: O.TooltipPlayground,
        heroCode: `import { Tooltip } from '@zyncat/ui/tooltip';\n\n<Tooltip content="Schedule post to queue" shortcut="⌘S">\n  <Button variant="secondary">Schedule</Button>\n</Tooltip>`,
      },
      {
        slug: 'dialog',
        label: 'Dialog',
        blurb: 'Styled modal over the headless overlay - scrim, focus trap, scroll lock.',
        Playground: O.DialogPlayground,
        heroCode: `import { Dialog } from '@zyncat/ui/dialog';\n\n<Dialog trigger={<Button variant="danger">Delete project</Button>} title="Delete project permanently?" tone="danger">\n  This action cannot be undone.\n</Dialog>`,
      },
      {
        slug: 'popover',
        label: 'Popover',
        blurb: 'Headless anchored panel, non-modal - flips and clamps to the viewport. The render-prop gets { close }.',
        Playground: O.PopoverPlayground,
        heroCode: `import { Popover } from '@zyncat/ui/popover';\n\n<Popover trigger={<Button variant="secondary">More actions</Button>} side="bottom" align="start">\n  <menu>...</menu>\n</Popover>`,
      },
      {
        slug: 'dropdown',
        label: 'Dropdown',
        blurb: 'Menu button for actions - grouped rows, shortcuts, and submenus that nest as deep as you like.',
        Playground: O.DropdownPlayground,
        heroCode: `import { Dropdown } from '@zyncat/ui/dropdown';\n\n<Dropdown ariaLabel="Post options" trigger={<Button>Options</Button>} items={items} />`,
        examples: [],
      },
      {
        slug: 'sheet',
        label: 'Sheet',
        blurb: 'Modal panel docked to an edge - drag-to-dismiss, coupled scrim, scroll handoff.',
        Playground: O.SheetPlayground,
        heroCode: `import { Sheet } from '@zyncat/ui/sheet';\n\n<Sheet side="right" open={open} onOpenChange={setOpen}>\n  <div>Panel content</div>\n</Sheet>`,
      },
      {
        slug: 'emoji-picker',
        label: 'EmojiPicker',
        blurb: 'Searchable emoji grid with a scrollspy category rail - a popover on desktop, a bottom sheet on phones.',
        HeroComponent: O.EmojiPickerHero,
        heroCode: `import { EmojiPickerPanel, loadEmojiData, getEmojiUrl } from '@zyncat/ui/emoji-picker';\n\n<EmojiPickerPanel open={open} onOpenChange={setOpen} onSelect={handleSelect} getEmojiUrl={getEmojiUrl} search trigger={<Button>Add reaction</Button>} />`,
        examples: [],
      },
    ],
  },
];

export const DOCS: Doc[] = GROUPS.flatMap((g) => g.docs).map((d) => ({
  ...d,
  props: GENERATED_PROPS[d.slug] ?? [],
  types: GENERATED_TYPES[d.slug] ?? [],
  ...CONTENT[d.slug],
}));
