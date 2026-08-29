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

export interface Doc {
  slug: string;
  label: string;
  blurb: string;
  HeroComponent?: ComponentType;
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
        blurb:
          'A React 19 design system with modern CSS, a small closed token vocabulary, and a ~3 kB WAAPI motion engine.',
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
        blurb: 'How to install dependencies, configure CSS tokens, and structure your React 19 or Next.js app.',
        Content: InstallationDoc,
        toc: [
          { id: 'prerequisites', title: 'Prerequisites', level: 2 },
          { id: 'package-install', title: 'Package Installation', level: 2 },
          { id: 'styles-setup', title: 'Styles & CSS Tokens', level: 2 },
          { id: 'framework-setup', title: 'Framework Setup', level: 2 },
          { id: 'first-component', title: 'First Component', level: 2 },
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
          { id: 'ide-configuration', title: 'IDE Configuration', level: 2 },
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
        HeroComponent: P.ButtonHero,
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
        HeroComponent: P.IconHero,
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
        HeroComponent: P.CollapseHero,
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
        HeroComponent: P.BadgeHero,
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
        HeroComponent: P.StatusBadgeHero,
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
        HeroComponent: P.CountBadgeHero,
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
        HeroComponent: E.OdometerHero,
        heroCode: `import { Odometer } from '@zyncat/ui/odometer';\n\n<Odometer value={count} format={(v) => v.toLocaleString('en-US')} />`,
        examples: [
          {
            id: 'formatting',
            title: 'Formatting',
            description:
              'format renders the value to a string - digits roll, everything else stays put as a separator.',
            Component: E.OdometerFormatDemo,
            code: `<Odometer value={v} />\n<Odometer value={v} format={(n) => n.toLocaleString('en-US')} />\n<Odometer value={v} format={(n) => String(n).padStart(8, '0')} />`,
          },
          {
            id: 'speed',
            title: 'Speed',
            description:
              'speed is sampled live on every frame, so it can track a prop while the columns are still moving.',
            Component: E.OdometerSpeedDemo,
            code: `<Odometer value={v} speed={0.4} />\n<Odometer value={v} />\n<Odometer value={v} speed={2} />`,
          },
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
        HeroComponent: E.TypingLinesHero,
        heroCode: `import { TypingLines } from '@zyncat/ui/typing-lines';\n\n<TypingLines lines={['Design every state.', 'Make every motion interruptible.']} />`,
        examples: [
          {
            id: 'carets',
            title: 'Carets',
            description: 'Every caret holds solid while characters land and blinks only once the line is idle.',
            Component: E.TypingLinesCaretsDemo,
            code: `<TypingLines lines={lines} caret="line" />\n<TypingLines lines={lines} caret="block" />\n<TypingLines lines={lines} caret="underscore" />`,
          },
          {
            id: 'word-reveal',
            title: 'Word reveal',
            description: 'unit="word" arrives a whole word at a time; the caret drops because nothing is pending.',
            Component: E.TypingLinesWordDemo,
            code: `<TypingLines unit="word" caret="none" lines={['Words arrive whole, one at a time.']} />`,
          },
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
        HeroComponent: E.LensHero,
        heroCode: `import { Lens } from '@zyncat/ui/lens';\n\n<Lens magnification={2.6} radius={132}>\n  <TypeSpecimen />\n</Lens>`,
        examples: [
          {
            id: 'optics',
            title: 'Optics',
            description:
              'magnification is clamped to 1.2-6 and radius to 60-260. Two concentric copies are drawn, the outer one scaled harder, so the image crowds toward the edge the way thick glass does.',
            Component: E.LensOpticsDemo,
            code: `<Lens magnification={3.8} radius={172}>\n  <TypeSpecimen />\n</Lens>`,
          },
          {
            id: 'chromatic',
            title: 'Chromatic fringing',
            description:
              'Colour separation at the rim that strengthens with travel speed. Turn it off for a clean edge.',
            Component: E.LensChromaticDemo,
            code: `<Lens chromatic={false} magnification={3.4}>\n  <TypeSpecimen />\n</Lens>`,
          },
        ],
      },
      {
        slug: 'weight-field',
        label: 'WeightField',
        blurb: 'A display headline whose glyphs gain weight as the cursor approaches, and overshoot on the way back.',
        HeroComponent: E.WeightFieldHero,
        heroCode: `import { WeightField } from '@zyncat/ui/weight-field';\n\n<WeightField text="Kinetic" />`,
        examples: [
          {
            id: 'speed',
            title: 'Speed',
            description:
              'speed is sampled live on every frame, so it can change while the glyphs are still travelling.',
            Component: E.WeightFieldSpeedDemo,
            code: `<WeightField text="Damped" speed={0.4} />\n<WeightField text="Damped" speed={1} />\n<WeightField text="Damped" speed={2} />`,
          },
          {
            id: 'splitting',
            title: 'Splitting',
            description:
              'Up to 48 animated units every glyph springs on its own; past that the split falls back to one spring per word, so the node count stays bounded and no text is dropped.',
            Component: E.WeightFieldSplitDemo,
            code: `<WeightField text="Kinetic type" />\n<WeightField text="A headline long enough that per glyph springs would outnumber the animated unit cap" />`,
          },
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
        HeroComponent: E.MorphingTextHero,
        heroCode: `import { MorphingText } from '@zyncat/ui/morphing-text';\n\n<MorphingText words={['Weight', 'Timing', 'Ease', 'Rest']} />`,
        examples: [
          {
            id: 'pacing',
            title: 'Pacing',
            description:
              'hold is the resting time between morphs and speed scales the whole clock - both are sampled live, so pressing either mid-morph retimes the morph already in flight.',
            Component: E.MorphingTextPacingDemo,
            code: `<MorphingText words={words} hold={hold} speed={speed} />`,
          },
          {
            id: 'phrases',
            title: 'Phrases',
            description:
              'Each letter runs its own window, so the pooling has a direction; spaces stay as text nodes and never smear.',
            Component: E.MorphingTextPhrasesDemo,
            code: `<MorphingText words={['Design every state', 'Interrupt every motion', 'Ship the polish']} hold={2200} />`,
          },
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
        HeroComponent: E.FlowFieldHero,
        heroCode: `import { FlowField } from '@zyncat/ui/flow-field';\n\n<FlowField spacing={26} radius={210}>\n  <Hero />\n</FlowField>`,
        examples: [
          {
            id: 'density',
            title: 'Density',
            description:
              'spacing is the gap between needles, clamped to 12-72 px. On a large surface the gap widens on its own so the field never draws more than 1600 needles - a 1920x1080 panel settles at a 36 px gap and 1590 needles.',
            Component: E.FlowFieldDensityDemo,
            code: `<FlowField spacing={14} />`,
          },
          {
            id: 'reach',
            title: 'Reach and rate',
            description:
              'radius is how far the pointer steers, clamped to 40-640 px; speed multiplies the simulation and is sampled live every frame. The grip takes hold in 83 ms and lets go over 400 ms, so the field never snaps back.',
            Component: E.FlowFieldReachDemo,
            code: `<FlowField radius={420} speed={1.8} />`,
          },
          {
            id: 'palette',
            title: 'Needle palette',
            description:
              'The needles are drawn from a twelve-stop ramp mixed in oklab between --flow-field-ink and --flow-field-accent; a needle picks its stop from how hard the pointer is steering it. Override a single --flow-field-ramp-N to bend the ramp.',
            Component: E.FlowFieldPaletteDemo,
            code: `<FlowField style={{ '--flow-field-ink': 'var(--border-strong)', '--flow-field-accent': 'var(--text-strong)' }} />`,
          },
        ],
      },
      {
        slug: 'confetti',
        label: 'Confetti',
        blurb: 'A canvas burst you fire yourself - paper, curls, ribbons and foil on real drag, lift and tumble.',
        HeroComponent: E.ConfettiHero,
        heroCode: `import { Confetti, type ConfettiHandle } from '@zyncat/ui/confetti';\n\nconst confetti = useRef<ConfettiHandle>(null);\n\n<div style={{ position: 'relative' }}>\n  <Confetti ref={confetti} />\n  <Button onClick={() => confetti.current?.fire()}>Celebrate</Button>\n</div>`,
        examples: [
          {
            id: 'emitters',
            title: 'Emitters',
            description:
              'sides fires two cannons in from the edges, top drops a full-width fall, corners fires up from the floor. fire() takes a per-burst override, so one instance covers all three without re-rendering.',
            Component: E.ConfettiEmitterDemo,
            code: `<Confetti ref={confetti} emitter="top" />\n\nconfetti.current?.fire({ emitter: 'corners' });`,
          },
          {
            id: 'window',
            title: 'Burst and taper',
            description:
              'duration is the seconds the emitter stays open, clamped to 0-10. Pieces leave front-loaded inside it - 69% are out by the halfway mark - so 0 reads as one shove and 2.5 as a burst that thins into a fall. Bursts coexist: firing again mid-flight adds to the field instead of restarting it.',
            Component: E.ConfettiWindowDemo,
            code: `confetti.current?.fire({ duration: 0, count: 220 });\nconfetti.current?.fire({ duration: 2.5, count: 300 });`,
          },
          {
            id: 'papers',
            title: 'Paper stock',
            description:
              'Five paper slots, each with a reverse side mixed toward --confetti-ink and a specular mixed toward --confetti-light, so every piece flashes as it turns edge-on. --confetti-weights sets how often each slot is cut.',
            Component: E.ConfettiPaletteDemo,
            code: `<Confetti\n  ref={confetti}\n  style={{\n    '--confetti-paper-1': 'oklch(0.82 0.13 88)',\n    '--confetti-weights': '1 0.8 0.9 1 0.3',\n    '--confetti-gloss': '78%',\n  } as CSSProperties}\n/>`,
          },
        ],
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
        HeroComponent: C.SupportFanHero,
        heroCode: `import { SupportFan } from '@zyncat/ui/support-fan';\n\n<SupportFan actions={actions} caption="Studio open · GMT+1" onSelect={route} />`,
        examples: [
          {
            id: 'layouts',
            title: 'Layouts',
            description:
              'arc puts every chip the same distance from the trigger centre; dock stacks them straight and shows their meta; icon-dock runs icon-only chips sideways. The radius is derived from the chip box and the count, so the vertical pitch stays constant.',
            Component: C.SupportFanLayoutDemo,
            code: `<SupportFan actions={actions} layout="arc" />\n<SupportFan actions={actions} layout="dock" />\n<SupportFan actions={actions} layout="icon-dock" />`,
          },
          {
            id: 'count',
            title: 'Any number of actions',
            description:
              'The deck pinned five chips and five angles. Here the arc solves its own radius from the measured chip height, so two actions and seven actions both keep an even pitch. Past about seven, dock is the layout that still fits.',
            Component: C.SupportFanCountDemo,
            code: `<SupportFan actions={actions.slice(0, 2)} />\n<SupportFan actions={actions.slice(0, 7)} />`,
          },
          {
            id: 'glide',
            title: 'Glide',
            description:
              'The row is one deformable surface driven by a continuous fractional focus index, not by per-chip hover. Displacement is tanh, monotonic in the index, so the spacing only ever grows - chips cannot collide or tear a hole. glide 0 freezes the row without disabling anything else.',
            Component: C.SupportFanGlideDemo,
            code: `<SupportFan actions={actions} glide={0} magnify={0} />\n<SupportFan actions={actions} glide={1} />\n<SupportFan actions={actions} glide={1.8} />`,
          },
          {
            id: 'bow',
            title: 'Bow and spread',
            description:
              'bow lifts the focused chip off the row along the row normal; spread is the width of that gaussian. 0.6 pops a single chip out of line, 3 sweeps the whole row into a curve.',
            Component: C.SupportFanBowDemo,
            code: `<SupportFan actions={actions} bow={1.6} spread={0.6} />\n<SupportFan actions={actions} bow={1.6} spread={1.45} />\n<SupportFan actions={actions} bow={1.6} spread={3} />`,
          },
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
            id: 'trigger',
            title: 'Trigger',
            description:
              'live shows the availability dot while the fan is closed. triggerIcon replaces the plus glyph and still turns 135 degrees on open; label names both the trigger and the deployed menu.',
            Component: C.SupportFanTriggerDemo,
            code: `<SupportFan actions={actions} />\n<SupportFan actions={actions} live={false} label="Get help" triggerIcon={<Lifebuoy />} />`,
          },
          {
            id: 'retuning',
            title: 'Retuning',
            description:
              'Level 2 override - the scoped --support-fan-* properties are the theming contract. Surfaces, ink, accent, trigger size, caption tracking and every duration are knobs; none of them is a prop.',
            Component: C.SupportFanThemeDemo,
            code: `<SupportFan actions={actions} style={{ '--support-fan-surface': 'var(--gray-900)', '--support-fan-ink': 'var(--text-inverse)' } as CSSProperties} />\n<SupportFan actions={actions} style={{ '--support-fan-open-duration': 'var(--duration-base)' } as CSSProperties} />`,
          },
          {
            id: 'reduced-motion',
            title: 'Reduced motion',
            description:
              'The engine loop calls snap() once and never starts, so the pointer field settles instead of running; the slot transitions collapse with the global duration tokens. Every chip stays at its resting place and the caption still names what the pointer or the keyboard is on.',
            Component: C.SupportFanReducedMotionDemo,
            code: `<SupportFan actions={actions} caption="Studio open · GMT+1" />`,
          },
        ],
      },
      {
        slug: 'support-rail',
        label: 'SupportRail',
        blurb:
          'Expressive contract. An edge tab that grows a support panel out of its own measured box, and folds back into it.',
        HeroComponent: C.SupportRailHero,
        heroCode: `import { SupportRail } from '@zyncat/ui/support-rail';\n\n<SupportRail actions={actions} status="Open · closes 20:00" live onSelect={route} />`,
        examples: [
          {
            id: 'sides',
            title: 'Either edge',
            description:
              'side flips the needle radius, the collapse origin, the panel border, the grabber edge, the row hover nudge, the vertical label and the drag direction. It is a real axis, not a mirrored stylesheet.',
            Component: C.SupportRailSidesDemo,
            code: `<SupportRail actions={actions} side="right" />\n<SupportRail actions={actions} side="left" needleLabel="Aide" />`,
          },
          {
            id: 'content',
            title: 'Rows, children and footer',
            description:
              'actions renders the rows. Selecting one fires onSelect and leaves the rail open - what happens next is the app’s, and it renders through children. footer pins a strip to the bottom. Rows with no icon, meta or description still line up.',
            Component: C.SupportRailSelectDemo,
            code: `<SupportRail actions={actions} onSelect={route} footer={<Shift />}>\n  {picked ? <Thread id={picked} /> : null}\n</SupportRail>`,
          },
          {
            id: 'minimal',
            title: 'Minimal',
            description: 'No status, no footer, no children, and actions carrying nothing but a label.',
            Component: C.SupportRailMinimalDemo,
            code: `<SupportRail actions={[{ id: 'chat', label: 'Live chat' }]} title="Need a hand?" needleLabel="Help" />`,
          },
          {
            id: 'collapse',
            title: 'Measured collapse',
            description:
              'The panel folds into the needle’s real box, not into pinned ratios: both boxes are measured and re-measured on resize, so the fold lands exactly on the tab at any container height.',
            Component: C.SupportRailResizeDemo,
            code: `<SupportRail actions={actions} status="Measured collapse" defaultOpen />`,
          },
          {
            id: 'drag',
            title: 'Drag to dismiss',
            description:
              'Drag the grabber outward past 88px, or flick it shorter than that above 500px/s. Dragging the wrong way rubber-bands at a sixth of the travel. The drag writes a custom property and CSS composes it into translate, so the release spring is the same writer.',
            Component: C.SupportRailDragDemo,
            code: `<SupportRail actions={actions} defaultOpen onOpenChange={setOpen} />`,
          },
          {
            id: 'controlled',
            title: 'Controlled',
            description:
              'Hit the outside toggle while the panel is still collapsing and the shell reverses from wherever it is. The shell stays mounted through the whole close so the collapse always plays; only the faded-out content unmounts, chained to the exit animation rather than to a timer.',
            Component: C.SupportRailControlledDemo,
            code: `<SupportRail actions={actions} open={open} onOpenChange={setOpen} />`,
          },
          {
            id: 'retuning',
            title: 'Retuning',
            description:
              'Level 2 override - the scoped --support-rail-* properties are the theming contract. Row padding is one of them, which is why there is no density prop: the knob reaches any value, an enum reached two.',
            Component: C.SupportRailThemeDemo,
            code: `<SupportRail actions={actions} style={{ '--support-rail-width': '272px', '--support-rail-row-pad-block': 'var(--space-2)' } as CSSProperties} />`,
          },
          {
            id: 'reduced-motion',
            title: 'Reduced motion',
            description:
              'Every duration knob is a calc() of a --duration-* token, so the whole choreography collapses under one frame. The live halo opts out on its own: a 2.6x expansion repeating forever is the class of motion the setting exists to stop, so it becomes a static ring and the status survives in colour and shape.',
            Component: C.SupportRailReducedMotionDemo,
            code: `<SupportRail actions={actions} live style={{ '--support-rail-open-duration': '0ms' } as CSSProperties} />`,
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
        HeroComponent: IG.InstagramFeedHero,
        heroCode: `import { InstagramFeed } from '@zyncat/ui/instagram-feed';\n\n<InstagramFeed handle="studio.zyncat" caption="Shot on the roof." media={<img src={photo} alt="" />} likes={2600} />`,
        examples: [
          {
            id: 'types',
            title: 'The two post types are structurally different',
            description:
              'An image post has a white header strip above the photo with dark text and Follow as a grey pill. A video post runs the black frame full-bleed from the top of the card and puts the header on it in white, and Follow loses its pill. One data-type attribute flips it: the header goes absolute and sets color, and every descendant reads inherit or currentColor - including the menu pips - so one property carries the whole switch.',
            Component: IG.InstagramFeedTypes,
            code: `<InstagramFeed type="image" handle="studio.zyncat" media={photo} />\n<InstagramFeed type="video" handle="studio.zyncat" audio="Nils Frahm · Says" media={clip} />`,
          },
          {
            id: 'widths',
            title: 'Mobile and web',
            description:
              'A real behavioural axis, not a max-width: the web column adds the Follow action in the header and mobile does not.',
            Component: IG.InstagramFeedWidths,
            code: `<InstagramFeed width="mobile" handle="studio.zyncat" />\n<InstagramFeed width="web" handle="studio.zyncat" />`,
          },
          {
            id: 'ratios',
            title: 'Media ratios',
            description:
              '4:5 is the platform default; 1:1 is the square crop. Video letterboxes to black inside either.',
            Component: IG.InstagramFeedRatios,
            code: `<InstagramFeed ratio="4:5" media={photo} />\n<InstagramFeed ratio="1:1" media={photo} />`,
          },
          {
            id: 'caption',
            title: 'Caption, hashtags and mentions',
            description:
              'Hashtags and mentions render in link blue. The caption clips to one line with a "more" affordance, and counts sit inline beside each glyph - there is no separate likes line and no "View all N comments" line.',
            Component: IG.InstagramFeedCaption,
            code: `<InstagramFeed caption="Golden hour on the roof #goldenhour with @mara" likes={760400} comments={1280} />`,
          },
          {
            id: 'placeholder',
            title: 'No media supplied',
            description:
              'The replica reproduces the chrome; the content is yours. With no media prop it renders a CSS-only placeholder and makes no network request - the component never fetches anything.',
            Component: IG.InstagramFeedPlaceholder,
            code: `<InstagramFeed handle="studio.zyncat" />`,
          },
          {
            id: 'controlled',
            title: 'Controlled interaction',
            description:
              'Like, save and mute are controlled triples, so the consumer owns the value. Double-tap the media to like it - that is the platform behaviour, not an invention. Pass no handlers and the affordances stay inert.',
            Component: IG.InstagramFeedControlled,
            code: `<InstagramFeed liked={liked} onLikedChange={setLiked} saved={saved} onSavedChange={setSaved} onAction={track} />`,
          },
          {
            id: 'reduced-motion',
            title: 'Reduced motion',
            description:
              'The only motion is a token-timed press transition, so it collapses to 1ms globally and the surface is otherwise pixel-identical.',
            Component: IG.InstagramFeedReducedMotion,
            code: `<InstagramFeed handle="studio.zyncat" media={photo} />`,
          },
        ],
      },
      {
        slug: 'facebook-feed',
        label: 'FacebookFeed',
        blurb: 'Replica. Three Facebook surfaces - feed post, reel and story - behind one surface prop.',
        HeroComponent: FB.FacebookPostSurfaces,
        heroCode: `import { FacebookFeed } from '@zyncat/ui/facebook-feed';\n\n<FacebookFeed surface="post" name="Zyncat Studio" caption="New build is live." media={photo} likes={1240} />`,
        examples: [
          {
            id: 'post',
            title: 'Feed post',
            description:
              'Mobile 390px and web 680px cards. The caption sits above the media - the opposite of Instagram. The action row is 42px with no divider above it, counts inline 9px from their 20px glyph, and the reaction pills right-aligned with a 1.5px white ring and a -5px overlap. Counts stay exact below 1,000.',
            Component: FB.FacebookPostSurfaces,
            code: `<FacebookFeed surface="post" width="mobile" name="Zyncat Studio" media={photo} />\n<FacebookFeed surface="post" width="web" name="Zyncat Studio" media={photo} />`,
          },
          {
            id: 'reel',
            title: 'Reels',
            description:
              'Narrow 557x878 with a 9:16 video and wide 1601x886 with a 16:9 one, sharing one bottom-anchored rail on a 65px pitch. Reels letterbox to flat black - no blurred backdrop - and their Follow is white, not blue.',
            Component: FB.FacebookReelSurfaces,
            code: `<FacebookFeed surface="reel" stage="narrow" name="Zyncat Studio" audio="Nils Frahm · Says" media={clip} />\n<FacebookFeed surface="reel" stage="wide" name="Zyncat Studio" media={clip} />`,
          },
          {
            id: 'story',
            title: 'Story',
            description:
              'A 486x864 9:16 stage. Two 4px segments at the top, the header at (14,28), and the whole stage behind the card filled with a blurred, heavily darkened copy of the same source.',
            Component: FB.FacebookStorySurface,
            code: `<FacebookFeed surface="story" name="Zyncat Studio" audio="Nils Frahm · Says" media={photo} />`,
          },
          {
            id: 'letterbox',
            title: 'Three letterbox treatments',
            description:
              'The feed fills the bars with a blurred, saturated copy of the same frame; reels go flat black; the story blurs and darkens the whole stage. They are three different treatments, not one with a knob - the blurred backdrop is suppressed only for node video, where duplicating it would mean a second network request.',
            Component: FB.FacebookMuteControl,
            code: `<FacebookFeed surface="post" ratio="16:9" media={photo} />\n<FacebookFeed surface="reel" media={clip} />`,
          },
          {
            id: 'reduced-motion',
            title: 'Reduced motion',
            description:
              'Motion is two CSS hover transitions on --duration-fast, which the global token collapses to 1ms. A reduced-motion user sees pixel-identical surfaces.',
            Component: FB.FacebookReducedMotion,
            code: `<FacebookFeed surface="post" name="Zyncat Studio" media={photo} />`,
          },
        ],
      },
      {
        slug: 'tiktok',
        label: 'TikTok',
        blurb: 'Replica. The TikTok post surface, desktop and mobile, with the photo carousel.',
        HeroComponent: TT.TikTokDesktopHero,
        heroCode: `import { TikTok } from '@zyncat/ui/tiktok';\n\n<TikTok surface="desktop" name="zyncat.studio" caption="Build log 04" media={clip} likes={187000} />`,
        examples: [
          {
            id: 'desktop',
            title: 'Desktop',
            description:
              'The rail runs on a 78px pitch - 48px puck, 6px gap, 14px count, 10px - and sits flush to the stage floor, because the rail height and the video height sum to it exactly. Ratios from 3:2 through 9:16 reflow the stage.',
            Component: TT.TikTokDesktopRatioDemo,
            code: `<TikTok surface="desktop" ratio="16:9" media={clip} />\n<TikTok surface="desktop" ratio="9:16" media={clip} />`,
          },
          {
            id: 'carousel',
            title: 'Photo carousel',
            description:
              'slides pages a photo strip. Paging has a destination, so it runs through the engine, never the loop primitive - JS is the sole writer of translate on the track and the stylesheet has no transition at all. Arrows page it, and the strip carries a real role and an accessible name.',
            Component: TT.TikTokCarouselDemo,
            code: `<TikTok surface="desktop" slides={photos} slide={index} onSlideChange={setIndex} />`,
          },
          {
            id: 'single',
            title: 'A single slide',
            description: 'With one slide the chevrons and the counter drop out rather than rendering as dead controls.',
            Component: TT.TikTokSingleSlideDemo,
            code: `<TikTok surface="desktop" slides={[photo]} />`,
          },
          {
            id: 'mobile',
            title: 'Mobile',
            description:
              'A different rail on a 65px pitch, a 44px avatar, and the sound line under the caption. Measured off the reference captures, not off the deck, which was wrong in nine places.',
            Component: TT.TikTokMobileRatioDemo,
            code: `<TikTok surface="mobile" name="zyncat.studio" music="original sound" media={clip} />`,
          },
          {
            id: 'mute',
            title: 'Sound',
            description:
              'The mute control is a real button with a keyboard path; it is one of the few glyphs that can act.',
            Component: TT.TikTokMuteDemo,
            code: `<TikTok surface="desktop" muted={muted} onMutedChange={setMuted} media={clip} />`,
          },
          {
            id: 'placeholder',
            title: 'No media supplied',
            description: 'A CSS-only placeholder. The component never makes a network request.',
            Component: TT.TikTokPlaceholderDemo,
            code: `<TikTok surface="desktop" name="zyncat.studio" />`,
          },
          {
            id: 'reduced-motion',
            title: 'Reduced motion',
            description: 'The carousel still pages to the right slide; it just arrives there without travelling.',
            Component: TT.TikTokReducedMotionDemo,
            code: `<TikTok surface="desktop" slides={photos} />`,
          },
        ],
      },
      {
        slug: 'youtube',
        label: 'YouTube',
        blurb: 'Replica. Three YouTube surfaces - feed card, Short and community post - behind one surface prop.',
        HeroComponent: YT.YouTubeVideoHero,
        heroCode: `import { YouTube } from '@zyncat/ui/youtube';\n\n<YouTube surface="video" title="Building a design system from zero" channel="Zyncat" views="184K views" age="3 weeks ago" duration="14:22" media={photo} />`,
        examples: [
          {
            id: 'video',
            title: 'Feed card',
            description:
              'The duration badge scrim is rgba(0,0,0,.6), measured off the capture rather than taken from the deck: white thumbnail pixels under the badge read exactly (102,102,102). Thumbnail radius is 8px, and the gutter is 12px.',
            Component: YT.YouTubeVideoPlaceholderDemo,
            code: `<YouTube surface="video" title="Building a design system" channel="Zyncat" views="184K views" age="3 weeks ago" duration="14:22" verified />`,
          },
          {
            id: 'short',
            title: 'Shorts',
            description:
              'progress and paused are props, so the bar position is consumer state, not something animated on a timer. The bar is a CSS width transition off a channel property; under reduced motion it still shows the right position, it just does not travel there.',
            Component: YT.YouTubeShortDemo,
            code: `<YouTube surface="short" channel="@zyncat" title="One token, nine surfaces" progress={64} paused />`,
          },
          {
            id: 'short-uncontrolled',
            title: 'Shorts, uncontrolled',
            description: 'Leave progress and paused off and the surface manages its own pair.',
            Component: YT.YouTubeShortUncontrolledDemo,
            code: `<YouTube surface="short" channel="@zyncat" title="One token, nine surfaces" media={clip} />`,
          },
          {
            id: 'post-carousel',
            title: 'Community post',
            description:
              'carousel takes an array rather than the deck’s boolean - a boolean carousel has nothing to page, and the boolean is subsumed by length > 1. Paging is a CSS translate off a page channel, with startDrag writing a separate drag channel while data-dragging suspends the transition. One writer per property.',
            Component: YT.YouTubePostCarouselDemo,
            code: `<YouTube surface="post" channel="Zyncat" age="9 days ago" text="Three surfaces, one component." carousel={photos} page={page} onPageChange={setPage} />`,
          },
          {
            id: 'post-single',
            title: 'Community post, one image',
            description: 'With one entry the pager drops out.',
            Component: YT.YouTubePostSingleDemo,
            code: `<YouTube surface="post" channel="Zyncat" age="9 days ago" text="A single frame post." media={photo} />`,
          },
          {
            id: 'counts',
            title: 'Counts',
            description:
              'Counts abbreviate the way the platform does, and the accessible name carries the un-abbreviated number.',
            Component: YT.YouTubeCountsDemo,
            code: `<YouTube surface="short" likes={187000} comments={1280} remixes={412} />`,
          },
          {
            id: 'reduced-motion',
            title: 'Reduced motion',
            description: 'Both channels collapse to 1ms and still land on the correct position.',
            Component: YT.YouTubeReducedMotionDemo,
            code: `<YouTube surface="post" carousel={photos} />`,
          },
        ],
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
        HeroComponent: F.TextFieldHero,
        heroCode: `import { TextField } from '@zyncat/ui/text-field';\n\n<TextField label="Search projects" leadingIcon={<SearchIcon />} clearable />`,
        examples: [
          {
            id: 'label-and-helper',
            title: 'Label & Helper',
            description: 'Label, placeholder, required indicator, and helper text.',
            Component: F.TextFieldLabelDemo,
            code: `<TextField label="Workspace name" required helper="Visible to team." />`,
          },
          {
            id: 'validation-states',
            title: 'Validation States',
            description: 'Error, warning, and success messages animate into view via Collapse.',
            Component: F.TextFieldValidationDemo,
            code: `<TextField label="Username" error="Must be at least 4 characters." />\n<TextField label="Handle" success="Available." />`,
          },
          {
            id: 'sizes',
            title: 'Sizes',
            description: 'Standard input sizes: sm (28px), md (36px), lg (40px).',
            Component: F.TextFieldSizesDemo,
            code: `<TextField size="sm" placeholder="Small" />\n<TextField size="md" placeholder="Medium" />\n<TextField size="lg" placeholder="Large" />`,
          },
        ],
      },
      {
        slug: 'number-field',
        label: 'NumberField',
        blurb: 'Tabular figures, caret steppers, unit suffix, clamp to bounds.',
        HeroComponent: F.NumberFieldHero,
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
        HeroComponent: F.OtpFieldHero,
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
        HeroComponent: F.TextareaHero,
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
        HeroComponent: F.CheckboxHero,
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
        HeroComponent: F.ToggleHero,
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
        HeroComponent: F.RadioGroupHero,
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
        HeroComponent: F.SelectHero,
        heroCode: `import { Select } from '@zyncat/ui/select';\n\n<Select ariaLabel="Timezone" value={tz} onChange={setTz} options={TIMEZONES} searchable />`,
        examples: [
          {
            id: 'options-and-channels',
            title: 'Channel Selection',
            description: 'Listbox with icons and smooth keyboard active descendant.',
            Component: F.SelectOptionsDemo,
            code: `<Select ariaLabel="Destination" options={CHANNELS} />`,
          },
        ],
      },
      {
        slug: 'multi-select',
        label: 'MultiSelect',
        blurb: 'Many-of listbox - toggling keeps the menu open; trigger summarises as first +N.',
        HeroComponent: F.MultiSelectHero,
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
        HeroComponent: D.AvatarHero,
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
        HeroComponent: D.TagHero,
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
        HeroComponent: D.TableHero,
        heroCode: `import { Table } from '@zyncat/ui/table';\n\n<Table data={rows} columns={columns} keyField="id" selectable />`,
        examples: [],
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
        HeroComponent: T.DateTimeFieldHero,
        heroCode: `import { DateTimeField } from '@zyncat/ui/datetime-field';\n\n<DateTimeField label="Publish timestamp" value={datetime} onChange={setDatetime} />`,
        examples: [],
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
        HeroComponent: T.TimeFieldHero,
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
        HeroComponent: O.AlertHero,
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
        HeroComponent: O.ToastHero,
        heroCode: `import { toast, Toaster } from '@zyncat/ui/toast';\n\ntoast.success('Changes saved', { description: 'Updated across all workspaces.' });`,
        examples: [],
      },
      {
        slug: 'tooltip',
        label: 'Tooltip',
        blurb: 'Transient hint on hover/focus. One bubble travels between triggers.',
        HeroComponent: O.TooltipHero,
        heroCode: `import { Tooltip } from '@zyncat/ui/tooltip';\n\n<Tooltip content="Schedule post to queue" shortcut="⌘S">\n  <Button variant="secondary">Schedule</Button>\n</Tooltip>`,
        examples: [],
      },
      {
        slug: 'dialog',
        label: 'Dialog',
        blurb: 'Styled modal over the headless overlay - scrim, focus trap, scroll lock.',
        HeroComponent: O.DialogHero,
        heroCode: `import { Dialog } from '@zyncat/ui/dialog';\n\n<Dialog trigger={<Button variant="danger">Delete project</Button>} title="Delete project permanently?" tone="danger">\n  This action cannot be undone.\n</Dialog>`,
        examples: [],
      },
      {
        slug: 'popover',
        label: 'Popover',
        blurb: 'Headless anchored panel, non-modal - flips and clamps to the viewport. The render-prop gets { close }.',
        HeroComponent: O.PopoverHero,
        heroCode: `import { Popover } from '@zyncat/ui/popover';\n\n<Popover trigger={<Button variant="secondary">More actions</Button>} side="bottom" align="start">\n  <menu>...</menu>\n</Popover>`,
        examples: [],
      },
      {
        slug: 'dropdown',
        label: 'Dropdown',
        blurb: 'Menu button for actions - grouped rows, shortcuts, and submenus that nest as deep as you like.',
        HeroComponent: O.DropdownHero,
        heroCode: `import { Dropdown } from '@zyncat/ui/dropdown';\n\n<Dropdown ariaLabel="Post options" trigger={<Button>Options</Button>} items={items} />`,
        examples: [],
      },
      {
        slug: 'sheet',
        label: 'Sheet',
        blurb: 'Modal panel docked to an edge - drag-to-dismiss, coupled scrim, scroll handoff.',
        HeroComponent: O.SheetHero,
        heroCode: `import { Sheet } from '@zyncat/ui/sheet';\n\n<Sheet side="right" open={open} onOpenChange={setOpen}>\n  <div>Panel content</div>\n</Sheet>`,
        examples: [],
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
