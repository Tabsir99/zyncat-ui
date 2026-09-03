/**
 * The themeable vocabulary. A theme is four categories - `color`, `type`, `shape`, `motion` -
 * each holding the decisions and the roles a theme sets, grouped by what they are; then the
 * scoped knobs under `components`. Every other token derives from those or is a scale a page
 * reads, and goes by its CSS name under `custom`. A path is the CSS name: `color.bg.app` is
 * `--bg-app`, `type.font.body` is `--font-body`, `shape.radius` is `--radius`. Values take any
 * CSS the property accepts, including `var()` references.
 *
 * Generated from the token and component CSS by `scripts/gen-theme.mjs` - `pnpm sync` rebuilds it.
 */
/** Surfaces - the canvas, cards, fills and the overlay scrim. */
export interface ColorBgTokens {
  /** `--bg-app` - The canvas is pure white; cards and floating panels share it and separate with hairlines and shadow, the way print separates with rules rather than tint. The tinted trio steps for real: subtle (hover wash) < muted (passive fill) < inset (a recessed well - code, terminals), each one ramp stop apart. Default: `var(--gray-0)`. */
  app?: string | number;
  /** `--bg-surface`. Default: `var(--gray-0)`. */
  surface?: string | number;
  /** `--bg-surface-raised`. Default: `var(--gray-0)`. */
  surfaceRaised?: string | number;
  /** `--bg-subtle`. Default: `var(--gray-50)`. */
  subtle?: string | number;
  /** `--bg-muted`. Default: `var(--gray-100)`. */
  muted?: string | number;
  /** `--bg-inset`. Default: `var(--gray-150)`. */
  inset?: string | number;
  /** `--bg-overlay`. Default: `color-mix(in oklab, var(--gray-900) 44%, transparent)`. */
  overlay?: string | number;
}

/** Ink, from strong to disabled, and the faces on a fill. */
export interface ColorTextTokens {
  /** `--text-strong`. Default: `var(--gray-950)`. */
  strong?: string | number;
  /** `--text-body`. Default: `var(--gray-800)`. */
  body?: string | number;
  /** `--text-secondary`. Default: `var(--gray-700)`. */
  secondary?: string | number;
  /** `--text-muted`. Default: `var(--gray-600)`. */
  muted?: string | number;
  /** `--text-subtle`. Default: `var(--gray-500)`. */
  subtle?: string | number;
  /** `--text-disabled`. Default: `var(--gray-400)`. */
  disabled?: string | number;
  /** `--text-on-accent`. Default: `var(--gray-0)`. */
  onAccent?: string | number;
  /** `--text-inverse`. Default: `var(--gray-0)`. */
  inverse?: string | number;
}

/** Hairlines, from subtle to strong. */
export interface ColorBorderTokens {
  /** `--border-subtle`. Default: `var(--gray-150)`. */
  subtle?: string | number;
  /** `--border-default`. Default: `var(--gray-200)`. */
  default?: string | number;
  /** `--border-strong`. Default: `var(--gray-300)`. */
  strong?: string | number;
}

/** The hues, and the neutral roles a light or dark theme sets directly. */
export interface ColorTokens {
  /** `--accent` - The brand hue - hover, active, lift, subtle, border, wash, the focus ring and info follow. Default: `oklch(0.63 0.118 198)`. */
  accent?: string | number;
  /** `--neutral` - The gray ramp's hue - the accent by default, so chrome shares its temperature. A fixed colour cuts the grays loose. Read on :root only: a themed subtree inherits the ramp. Default: `var(--accent)`. */
  neutral?: string | number;
  /** `--success` - Positive status - its subtle, text and wash follow. Default: `oklch(0.548 0.122 152)`. */
  success?: string | number;
  /** `--warning` - Caution - its subtle, text and wash follow. Default: `oklch(0.7 0.142 75)`. */
  warning?: string | number;
  /** `--danger` - Destructive actions and errors - the danger button ladder, ring, subtle, text and wash follow. Default: `oklch(0.545 0.196 27)`. */
  danger?: string | number;
  /** Surfaces - the canvas, cards, fills and the overlay scrim. */
  bg?: ColorBgTokens;
  /** Ink, from strong to disabled, and the faces on a fill. */
  text?: ColorTextTokens;
  /** Hairlines, from subtle to strong. */
  border?: ColorBorderTokens;
}

/** The body face and the code face - every type bundle follows. */
export interface TypeFontTokens {
  /** `--font-body` - The body face - every --type-* bundle follows. Default: `'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif`. */
  body?: string | number;
  /** `--font-code` - The code face - --type-code follows. Default: `'Geist Mono', ui-monospace, 'SF Mono', 'Menlo', monospace`. */
  code?: string | number;
}

/** The faces. */
export interface TypeTokens {
  /** The body face and the code face - every type bundle follows. */
  font?: TypeFontTokens;
}

/** Roundness. */
export interface ShapeTokens {
  /** `--radius` - Roundness - every --radius-<step> is a fixed ratio of it; 0 squares every corner. Default: `0.5rem`. */
  radius?: string | number;
}

/** The time bands. */
export interface MotionDurationTokens {
  /** `--duration-fast`. Default: `140ms`. Collapses to `1ms` under reduced motion. */
  fast?: string | number;
  /** `--duration-base`. Default: `200ms`. Collapses to `1ms` under reduced motion. */
  base?: string | number;
  /** `--duration-slow`. Default: `300ms`. Collapses to `1ms` under reduced motion. */
  slow?: string | number;
  /** `--duration-slower` - large-surface movement - dialog, sheet, page-scale reveals. Default: `450ms`. Collapses to `1ms` under reduced motion. */
  slower?: string | number;
  /** `--duration-slowest` - hero-scale movement - card expansion, container transforms; the scale's ceiling. Default: `900ms`. Collapses to `1ms` under reduced motion. */
  slowest?: string | number;
  /** `--duration-spin` - continuous loaders only; deliberately outside the UI-transition scale. Default: `600ms`. Collapses to `1200ms` under reduced motion. */
  spin?: string | number;
  /** `--duration-pulse` - ambient live/processing breathing; not collapsed under reduced motion. Default: `1600ms`. */
  pulse?: string | number;
}

/** The brand curves. */
export interface MotionEaseTokens {
  /** `--ease-standard`. Default: `cubic-bezier(0.2, 0, 0, 1)`. */
  standard?: string | number;
  /** `--ease-entrance`. Default: `cubic-bezier(0.25, 1, 0.4, 1)`. */
  entrance?: string | number;
  /** `--ease-exit`. Default: `cubic-bezier(0.4, 0, 1, 1)`. */
  exit?: string | number;
  /** `--ease-spring`. Default: `cubic-bezier(0.34, 1.4, 0.5, 1)`. */
  spring?: string | number;
  /** `--ease-glide` - fast-out travel - a persistent element answering a new target at once, then landing soft; the glide pill's curve, not for enter/exit. Default: `cubic-bezier( 0.32, 0.55, 0, 1 )`. */
  glide?: string | number;
}

/** How far a surface travels on the way in or out. */
export interface MotionDistanceTokens {
  /** `--distance-sm` - 8px - settling into place; the surface is already where it belongs. Default: `0.5rem`. */
  sm?: string | number;
  /** `--distance-md` - 16px - arriving from an adjacent position - page turns, tab panels, paged ranges. Default: `1rem`. */
  md?: string | number;
  /** `--distance-lg` - 24px - arriving from outside the surface - a toast joining its stack. Default: `1.5rem`. */
  lg?: string | number;
}

/** What a surface scales from on the way in, and to on the way out. */
export interface MotionScaleTokens {
  /** `--scale-panel` - full-width surfaces - dialog, modal, sheet. Default: `0.98`. */
  panel?: string | number;
  /** `--scale-floating` - floating surfaces - popover, tooltip, menu, toast, alert. Default: `0.96`. */
  floating?: string | number;
  /** `--scale-chip` - small inline elements - tag, badge, count. Default: `0.9`. */
  chip?: string | number;
}

/** How surfaces move. */
export interface MotionTokens {
  /** The time bands. */
  duration?: MotionDurationTokens;
  /** The brand curves. */
  ease?: MotionEaseTokens;
  /** How far a surface travels on the way in or out. */
  distance?: MotionDistanceTokens;
  /** What a surface scales from on the way in, and to on the way out. */
  scale?: MotionScaleTokens;
}

/** `--confetti-paper-1` to `--confetti-paper-5` - The five papers a burst draws from; a slot set to a role follows the theme. */
export interface ConfettiPaperTokens {
  /** `--confetti-paper-1` - The five papers a burst draws from; a slot set to a role follows the theme. Default: `oklch(0.53 0.2 288)`. */
  1?: string | number;
  /** `--confetti-paper-2` - The five papers a burst draws from; a slot set to a role follows the theme. Default: `var(--accent)`. */
  2?: string | number;
  /** `--confetti-paper-3` - The five papers a burst draws from; a slot set to a role follows the theme. Default: `oklch(0.78 0.115 62)`. */
  3?: string | number;
  /** `--confetti-paper-4` - The five papers a burst draws from; a slot set to a role follows the theme. Default: `oklch(0.67 0.18 12)`. */
  4?: string | number;
  /** `--confetti-paper-5` - The five papers a burst draws from; a slot set to a role follows the theme. Default: `var(--text-strong)`. */
  5?: string | number;
}

/** The scoped properties Confetti publishes as its theming contract. */
export interface ConfettiTokens {
  /** `--confetti-paper-1` to `--confetti-paper-5` - The five papers a burst draws from; a slot set to a role follows the theme. */
  paper?: ConfettiPaperTokens;
  /** `--confetti-weights` - How often each paper appears - five weights, in slot order. Default: `1 1 1 1 0.45`. */
  weights?: string | number;
  /** `--confetti-ink` - What the reverse side of a piece darkens toward. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--confetti-light` - What the glossy face of a piece brightens toward. Default: `var(--bg-surface)`. */
  light?: string | number;
  /** `--confetti-shade` - How far the reverse side leans toward the ink. Default: `42%`. */
  shade?: string | number;
  /** `--confetti-gloss` - How far the glossy face leans toward the light. Default: `66%`. */
  gloss?: string | number;
  /** `--confetti-layer` - The z-index of a viewport-field burst. Default: `var(--layer-toast)`. */
  layer?: string | number;
}

/** `--flow-field-ramp-0` to `--flow-field-ramp-11` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. */
export interface FlowFieldRampTokens {
  /** `--flow-field-ramp-0` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `var(--flow-field-ink)`. */
  0?: string | number;
  /** `--flow-field-ramp-1` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 9%, var(--flow-field-ink))`. */
  1?: string | number;
  /** `--flow-field-ramp-2` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 18%, var(--flow-field-ink))`. */
  2?: string | number;
  /** `--flow-field-ramp-3` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 27%, var(--flow-field-ink))`. */
  3?: string | number;
  /** `--flow-field-ramp-4` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 36%, var(--flow-field-ink))`. */
  4?: string | number;
  /** `--flow-field-ramp-5` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 45%, var(--flow-field-ink))`. */
  5?: string | number;
  /** `--flow-field-ramp-6` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 55%, var(--flow-field-ink))`. */
  6?: string | number;
  /** `--flow-field-ramp-7` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 64%, var(--flow-field-ink))`. */
  7?: string | number;
  /** `--flow-field-ramp-8` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 73%, var(--flow-field-ink))`. */
  8?: string | number;
  /** `--flow-field-ramp-9` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 82%, var(--flow-field-ink))`. */
  9?: string | number;
  /** `--flow-field-ramp-10` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `color-mix(in oklab, var(--flow-field-accent) 91%, var(--flow-field-ink))`. */
  10?: string | number;
  /** `--flow-field-ramp-11` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. Default: `var(--flow-field-accent)`. */
  11?: string | number;
}

/** The scoped properties FlowField publishes as its theming contract. */
export interface FlowFieldTokens {
  /** `--flow-field-ink` - The particle colour at rest - the ramp's cold end. Default: `var(--text-subtle)`. */
  ink?: string | number;
  /** `--flow-field-accent` - The particle colour at full speed - the ramp's hot end. Default: `var(--accent)`. */
  accent?: string | number;
  /** `--flow-field-min-height` - The field's minimum height before content sizes it. Default: `var(--space-10)`. */
  minHeight?: string | number;
  /** `--flow-field-ramp-0` to `--flow-field-ramp-11` - The twelve stops from ink to accent, sampled at the next measure; set all twelve for a ramp of your own. */
  ramp?: FlowFieldRampTokens;
}

/** The `--lens-fringe-*` knobs. */
export interface LensFringeTokens {
  /** `--lens-fringe-warm` - The chromatic fringe on the warm edge of the glass. Default: `oklch(0.72 0.16 12 / 0.3)`. */
  warm?: string | number;
  /** `--lens-fringe-cool` - The chromatic fringe on the cool edge of the glass. Default: `oklch(0.7 0.15 265 / 0.34)`. */
  cool?: string | number;
}

/** The scoped properties Lens publishes as its theming contract. */
export interface LensTokens {
  /** `--lens-ink` - The ink of the glass's edge, vignette and shadow. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--lens-surface` - The surface behind the glass. Default: `var(--bg-surface)`. */
  surface?: string | number;
  /** The `--lens-fringe-*` knobs. */
  fringe?: LensFringeTokens;
}

/** The `--morphing-text-rule-*` knobs. */
export interface MorphingTextRuleTokens {
  /** `--morphing-text-rule-ink` - The rule at rest. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--morphing-text-rule-accent` - The rule while a morph heats it. Default: `var(--accent)`. */
  accent?: string | number;
  /** `--morphing-text-rule-height` - The rule's thickness. Default: `1px`. */
  height?: string | number;
  /** `--morphing-text-rule-gap` - Space between the word and the rule. Default: `var(--space-3)`. */
  gap?: string | number;
}

/** The scoped properties MorphingText publishes as its theming contract. */
export interface MorphingTextTokens {
  /** `--morphing-text-ink` - Letter ink. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--morphing-text-size` - Letter size. Default: `var(--size-display-lg)`. */
  size?: string | number;
  /** `--morphing-text-weight` - Letter weight. Default: `var(--weight-medium)`. */
  weight?: string | number;
  /** `--morphing-text-leading` - Line height, unitless. Default: `1.2`. */
  leading?: string | number;
  /** `--morphing-text-tracking` - Letter spacing. Default: `var(--tracking-display)`. */
  tracking?: string | number;
  /** `--morphing-text-smear` - How much letters blur on the way between words; 0 cuts clean. Default: `1`. */
  smear?: string | number;
  /** The `--morphing-text-rule-*` knobs. */
  rule?: MorphingTextRuleTokens;
}

/** The scoped properties Odometer publishes as its theming contract. */
export interface OdometerTokens {
  /** `--odometer-gap` - Space between digit columns. Default: `0.02em`. */
  gap?: string | number;
  /** `--odometer-ink` - Digit ink. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--odometer-accent` - The tint digits take while they roll fast. Default: `var(--accent)`. */
  accent?: string | number;
  /** `--odometer-separator-ink` - The thousands separator. Default: `var(--text-muted)`. */
  separatorInk?: string | number;
  /** `--odometer-size` - Digit size. Default: `var(--size-display)`. */
  size?: string | number;
  /** `--odometer-weight` - Digit weight. Default: `var(--weight-medium)`. */
  weight?: string | number;
}

/** The `--typing-lines-caret-*` knobs. */
export interface TypingLinesCaretTokens {
  /** `--typing-lines-caret-ink` - The caret. Default: `var(--accent)`. */
  ink?: string | number;
  /** `--typing-lines-caret-gap` - Space between the last glyph and the caret. Default: `0.12em`. */
  gap?: string | number;
}

/** The scoped properties TypingLines publishes as its theming contract. */
export interface TypingLinesTokens {
  /** `--typing-lines-ink` - Letter ink. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** The `--typing-lines-caret-*` knobs. */
  caret?: TypingLinesCaretTokens;
  /** `--typing-lines-size` - Letter size. Default: `var(--size-title)`. */
  size?: string | number;
  /** `--typing-lines-weight` - Letter weight. Default: `var(--weight-regular)`. */
  weight?: string | number;
  /** `--typing-lines-leading` - Line height, unitless. Default: `1.4`. */
  leading?: string | number;
  /** `--typing-lines-blink` - The caret's blink period. Default: `1080ms`. */
  blink?: string | number;
}

/** The scoped properties WeightField publishes as its theming contract. */
export interface WeightFieldTokens {
  /** `--weight-field-ink` - Letter ink. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--weight-field-size` - Letter size. Default: `6rem`. */
  size?: string | number;
  /** `--weight-field-leading` - Line height, unitless. Default: `1`. */
  leading?: string | number;
  /** `--weight-field-align` - Where the units sit on the line - center, start or end. Default: `center`. */
  align?: string | number;
  /** `--weight-field-pad` - Padding around the field. Default: `var(--space-6) var(--space-4)`. */
  pad?: string | number;
  /** `--weight-field-tracking` - Letter spacing. Default: `-0.05em`. */
  tracking?: string | number;
  /** `--weight-field-rest-weight` - A unit's weight at rest. Default: `300`. */
  restWeight?: string | number;
  /** `--weight-field-far-weight` - The weight two units from the pointer. Default: `400`. */
  farWeight?: string | number;
  /** `--weight-field-near-weight` - The weight next to the pointer. Default: `600`. */
  nearWeight?: string | number;
  /** `--weight-field-peak-weight` - The weight under the pointer. Default: `900`. */
  peakWeight?: string | number;
  /** `--weight-field-hover-padding` - How much a unit widens under the pointer. Default: `calc(1em / 12)`. */
  hoverPadding?: string | number;
  /** `--weight-field-stroke` - The text stroke every unit carries; the peak letter doubles it. Default: `calc(1em * 125 / 6000)`. */
  stroke?: string | number;
  /** `--weight-field-duration` - How long a unit takes to settle at a new weight. Default: `400ms`. */
  duration?: string | number;
  /** `--weight-field-ease` - The settle curve. Default: `ease`. */
  ease?: string | number;
}

/** The `--support-rail-row-*` knobs. */
export interface SupportRailRowTokens {
  /** `--support-rail-row-pad-block` - Row padding on the block axis - the density knob. Default: `var(--space-4)`. */
  padBlock?: string | number;
  /** `--support-rail-row-pad-inline` - Row padding on the inline axis - the density knob. Default: `var(--space-4)`. */
  padInline?: string | number;
}

/** The scoped properties SupportRail publishes as its theming contract. */
export interface SupportRailTokens {
  /** `--support-rail-width` - Panel width; the rail never exceeds its container. Default: `318px`. */
  width?: string | number;
  /** The `--support-rail-row-*` knobs. */
  row?: SupportRailRowTokens;
  /** `--support-rail-surface` - The panel and the needle. Default: `var(--bg-subtle)`. */
  surface?: string | number;
  /** `--support-rail-surface-raised` - The needle while hovered. Default: `var(--bg-surface)`. */
  surfaceRaised?: string | number;
  /** `--support-rail-line` - The panel's edge and the needle's border. Default: `var(--border-default)`. */
  line?: string | number;
  /** `--support-rail-line-soft` - Row dividers and the grabber's edge. Default: `var(--border-subtle)`. */
  lineSoft?: string | number;
  /** `--support-rail-accent` - The needle's rule. Default: `var(--accent)`. */
  accent?: string | number;
  /** `--support-rail-live-color` - The live dot and its pulse. Default: `var(--success)`. */
  liveColor?: string | number;
  /** `--support-rail-radius` - The needle's outer corners. Default: `var(--radius-2xl)`. */
  radius?: string | number;
  /** `--support-rail-open-duration` - How long the panel takes to open. Default: `calc(var(--duration-slower) * 1.4)`. */
  openDuration?: string | number;
  /** `--support-rail-close-duration` - How long the panel takes to close. Default: `var(--duration-slower)`. */
  closeDuration?: string | number;
}

/** Per-component knobs - retunes every instance of that component. */
export interface ComponentTokens {
  /** Confetti - its `--confetti-*` properties. */
  confetti?: ConfettiTokens;
  /** FlowField - its `--flow-field-*` properties. */
  flowField?: FlowFieldTokens;
  /** Lens - its `--lens-*` properties. */
  lens?: LensTokens;
  /** MorphingText - its `--morphing-text-*` properties. */
  morphingText?: MorphingTextTokens;
  /** Odometer - its `--odometer-*` properties. */
  odometer?: OdometerTokens;
  /** TypingLines - its `--typing-lines-*` properties. */
  typingLines?: TypingLinesTokens;
  /** WeightField - its `--weight-field-*` properties. */
  weightField?: WeightFieldTokens;
  /** SupportRail - its `--support-rail-*` properties. */
  supportRail?: SupportRailTokens;
}

/**
 * Every design token by its CSS name, with what it does and its default. The type behind
 * `custom` in a theme and behind the `style` prop of every component.
 */
export interface TokenProperties {
  /** `--accent` - The brand hue - hover, active, lift, subtle, border, wash, the focus ring and info follow. Default: `oklch(0.63 0.118 198)`. */
  '--accent'?: string | number;
  /** `--success` - Positive status - its subtle, text and wash follow. Default: `oklch(0.548 0.122 152)`. */
  '--success'?: string | number;
  /** `--warning` - Caution - its subtle, text and wash follow. Default: `oklch(0.7 0.142 75)`. */
  '--warning'?: string | number;
  /** `--danger` - Destructive actions and errors - the danger button ladder, ring, subtle, text and wash follow. Default: `oklch(0.545 0.196 27)`. */
  '--danger'?: string | number;
  /** `--neutral` - The gray ramp's hue - the accent by default, so chrome shares its temperature. A fixed colour cuts the grays loose. Read on :root only: a themed subtree inherits the ramp. Default: `var(--accent)`. */
  '--neutral'?: string | number;
  /** `--radius` - Roundness - every --radius-<step> is a fixed ratio of it; 0 squares every corner. Default: `0.5rem`. */
  '--radius'?: string | number;
  /** `--font-body` - The body face - every --type-* bundle follows. Default: `'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif`. */
  '--font-body'?: string | number;
  /** `--font-code` - The code face - --type-code follows. Default: `'Geist Mono', ui-monospace, 'SF Mono', 'Menlo', monospace`. */
  '--font-code'?: string | number;
  /** `--gray-0`. Default: `oklch(1 0 0)`. */
  '--gray-0'?: string | number;
  /** `--gray-50`. Default: `oklch(from var(--neutral) 0.984 0.003 h)`. */
  '--gray-50'?: string | number;
  /** `--gray-100`. Default: `oklch(from var(--neutral) 0.97 0.004 h)`. */
  '--gray-100'?: string | number;
  /** `--gray-150`. Default: `oklch(from var(--neutral) 0.954 0.005 h)`. */
  '--gray-150'?: string | number;
  /** `--gray-200`. Default: `oklch(from var(--neutral) 0.924 0.006 h)`. */
  '--gray-200'?: string | number;
  /** `--gray-300`. Default: `oklch(from var(--neutral) 0.874 0.007 h)`. */
  '--gray-300'?: string | number;
  /** `--gray-400`. Default: `oklch(from var(--neutral) 0.765 0.009 h)`. */
  '--gray-400'?: string | number;
  /** `--gray-500`. Default: `oklch(from var(--neutral) 0.642 0.011 h)`. */
  '--gray-500'?: string | number;
  /** `--gray-600`. Default: `oklch(from var(--neutral) 0.532 0.012 h)`. */
  '--gray-600'?: string | number;
  /** `--gray-700`. Default: `oklch(from var(--neutral) 0.422 0.012 h)`. */
  '--gray-700'?: string | number;
  /** `--gray-800`. Default: `oklch(from var(--neutral) 0.305 0.01 h)`. */
  '--gray-800'?: string | number;
  /** `--gray-900`. Default: `oklch(from var(--neutral) 0.225 0.008 h)`. */
  '--gray-900'?: string | number;
  /** `--gray-950`. Default: `oklch(from var(--neutral) 0.165 0.007 h)`. */
  '--gray-950'?: string | number;
  /** `--shadow-rgb` - Cool near-black shadow ink - matches the cool neutral ramp on the white canvas. Default: `15 22 25`. */
  '--shadow-rgb'?: string | number;
  /** `--weight-regular`. Default: `400`. */
  '--weight-regular'?: string | number;
  /** `--weight-medium`. Default: `500`. */
  '--weight-medium'?: string | number;
  /** `--weight-semibold`. Default: `600`. */
  '--weight-semibold'?: string | number;
  /** `--size-micro`. Default: `0.75rem`. */
  '--size-micro'?: string | number;
  /** `--size-caption`. Default: `0.8125rem`. */
  '--size-caption'?: string | number;
  /** `--size-body`. Default: `0.875rem`. */
  '--size-body'?: string | number;
  /** `--size-body-lg`. Default: `1rem`. */
  '--size-body-lg'?: string | number;
  /** `--size-heading`. Default: `1.125rem`. */
  '--size-heading'?: string | number;
  /** `--size-title`. Default: `1.3125rem`. */
  '--size-title'?: string | number;
  /** `--size-title-lg`. Default: `1.625rem`. */
  '--size-title-lg'?: string | number;
  /** `--size-display`. Default: `2rem`. */
  '--size-display'?: string | number;
  /** `--size-display-lg`. Default: `2.5rem`. */
  '--size-display-lg'?: string | number;
  /** `--leading-micro`. Default: `1rem`. */
  '--leading-micro'?: string | number;
  /** `--leading-caption`. Default: `1.125rem`. */
  '--leading-caption'?: string | number;
  /** `--leading-body`. Default: `1.375rem`. */
  '--leading-body'?: string | number;
  /** `--leading-body-lg`. Default: `1.625rem`. */
  '--leading-body-lg'?: string | number;
  /** `--leading-heading`. Default: `1.625rem`. */
  '--leading-heading'?: string | number;
  /** `--leading-title`. Default: `1.75rem`. */
  '--leading-title'?: string | number;
  /** `--leading-title-lg`. Default: `2rem`. */
  '--leading-title-lg'?: string | number;
  /** `--leading-display`. Default: `2.375rem`. */
  '--leading-display'?: string | number;
  /** `--leading-display-lg`. Default: `2.875rem`. */
  '--leading-display-lg'?: string | number;
  /** `--measure-floating` - Measure - line-length cap for floating text (tooltip, toast, popover hints) so it never runs a long ribbon. Default: `36ch`. */
  '--measure-floating'?: string | number;
  /** `--tracking-caps`. Default: `0.04em`. */
  '--tracking-caps'?: string | number;
  /** `--tracking-normal`. Default: `0em`. */
  '--tracking-normal'?: string | number;
  /** `--tracking-tight`. Default: `-0.011em`. */
  '--tracking-tight'?: string | number;
  /** `--tracking-display`. Default: `-0.021em`. */
  '--tracking-display'?: string | number;
  /** `--type-display-lg` - Role bundles - size + leading + weight + tracking, pre-composed; reach for these first. On every theme root so a subtree that swaps --font-body gets the bundles in that face. Default: `var(--weight-semibold) var(--size-display-lg)/var(--leading-display-lg) var(--font-body)`. Re-derived on every theme root. */
  '--type-display-lg'?: string | number;
  /** `--type-display`. Default: `var(--weight-semibold) var(--size-display)/var(--leading-display) var(--font-body)`. Re-derived on every theme root. */
  '--type-display'?: string | number;
  /** `--type-title-lg`. Default: `var(--weight-semibold) var(--size-title-lg)/var(--leading-title-lg) var(--font-body)`. Re-derived on every theme root. */
  '--type-title-lg'?: string | number;
  /** `--type-title`. Default: `var(--weight-semibold) var(--size-title)/var(--leading-title) var(--font-body)`. Re-derived on every theme root. */
  '--type-title'?: string | number;
  /** `--type-heading`. Default: `var(--weight-semibold) var(--size-heading)/var(--leading-heading) var(--font-body)`. Re-derived on every theme root. */
  '--type-heading'?: string | number;
  /** `--type-body-lg`. Default: `var(--weight-regular) var(--size-body-lg)/var(--leading-body-lg) var(--font-body)`. Re-derived on every theme root. */
  '--type-body-lg'?: string | number;
  /** `--type-body`. Default: `var(--weight-regular) var(--size-body)/var(--leading-body) var(--font-body)`. Re-derived on every theme root. */
  '--type-body'?: string | number;
  /** `--type-label`. Default: `var(--weight-medium) var(--size-body)/var(--leading-body) var(--font-body)`. Re-derived on every theme root. */
  '--type-label'?: string | number;
  /** `--type-caption`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-body)`. Re-derived on every theme root. */
  '--type-caption'?: string | number;
  /** `--type-micro`. Default: `var(--weight-medium) var(--size-micro)/var(--leading-micro) var(--font-body)`. Re-derived on every theme root. */
  '--type-micro'?: string | number;
  /** `--type-code`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-code)`. Re-derived on every theme root. */
  '--type-code'?: string | number;
  /** `--space-px`. Default: `1px`. */
  '--space-px'?: string | number;
  /** `--space-1`. Default: `0.25rem`. */
  '--space-1'?: string | number;
  /** `--space-2`. Default: `0.5rem`. */
  '--space-2'?: string | number;
  /** `--space-3`. Default: `0.75rem`. */
  '--space-3'?: string | number;
  /** `--space-4`. Default: `1rem`. */
  '--space-4'?: string | number;
  /** `--space-5`. Default: `1.5rem`. */
  '--space-5'?: string | number;
  /** `--space-6`. Default: `2rem`. */
  '--space-6'?: string | number;
  /** `--space-7`. Default: `3rem`. */
  '--space-7'?: string | number;
  /** `--space-8`. Default: `4rem`. */
  '--space-8'?: string | number;
  /** `--space-9`. Default: `6rem`. */
  '--space-9'?: string | number;
  /** `--space-10`. Default: `8rem`. */
  '--space-10'?: string | number;
  /** `--measure-prose`. Default: `38rem`. */
  '--measure-prose'?: string | number;
  /** `--control-height-sm`. Default: `1.75rem`. */
  '--control-height-sm'?: string | number;
  /** `--control-height`. Default: `2rem`. */
  '--control-height'?: string | number;
  /** `--control-height-lg`. Default: `2.3rem`. */
  '--control-height-lg'?: string | number;
  /** `--control-box`. Default: `1.125rem`. */
  '--control-box'?: string | number;
  /** `--control-switch` - switch track (md); the one control size off the scale - width reuses --control-height(-sm), sm height reuses --space-4. Default: `1.25rem`. */
  '--control-switch'?: string | number;
  /** `--radius-full`. Default: `624.9375rem`. */
  '--radius-full'?: string | number;
  /** `--radius-sm`. Default: `calc(var(--radius) * 0.5)`. Re-derived on every theme root. */
  '--radius-sm'?: string | number;
  /** `--radius-md`. Default: `calc(var(--radius) * 0.75)`. Re-derived on every theme root. */
  '--radius-md'?: string | number;
  /** `--radius-lg`. Default: `var(--radius)`. Re-derived on every theme root. */
  '--radius-lg'?: string | number;
  /** `--radius-xl`. Default: `calc(var(--radius) * 1.5)`. Re-derived on every theme root. */
  '--radius-xl'?: string | number;
  /** `--radius-2xl`. Default: `calc(var(--radius) * 2)`. Re-derived on every theme root. */
  '--radius-2xl'?: string | number;
  /** `--border-hairline` - Borders - one hairline (1px); weight comes from the border color, not thickness; 2px for focus/selected. Default: `1px`. */
  '--border-hairline'?: string | number;
  /** `--border-emphasis`. Default: `1.5px`. */
  '--border-emphasis'?: string | number;
  /** `--shadow-xs`. Default: `0 1px 1px rgb(var(--shadow-rgb) / 0.04)`. Re-derived on every theme root. */
  '--shadow-xs'?: string | number;
  /** `--shadow-sm`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.05), 0 1px 1px rgb(var(--shadow-rgb) / 0.04)`. Re-derived on every theme root. */
  '--shadow-sm'?: string | number;
  /** `--shadow-md`. Default: `0 2px 4px rgb(var(--shadow-rgb) / 0.04), 0 6px 12px rgb(var(--shadow-rgb) / 0.07)`. Re-derived on every theme root. */
  '--shadow-md'?: string | number;
  /** `--shadow-lg`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 4px 8px rgb(var(--shadow-rgb) / 0.04), 0 12px 28px rgb(var(--shadow-rgb) / 0.1)`. Re-derived on every theme root. */
  '--shadow-lg'?: string | number;
  /** `--shadow-xl`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 8px 16px rgb(var(--shadow-rgb) / 0.06), 0 24px 48px rgb(var(--shadow-rgb) / 0.14)`. Re-derived on every theme root. */
  '--shadow-xl'?: string | number;
  /** `--ring-accent` - Focus & selection rings - box-shadows (not outlines) so they follow border-radius. Each tracks its role's hue; danger rings on its fill tone, the lighter face the destructive button rests on. Default: `0 0 0 3px color-mix(in oklab, var(--accent) 32%, transparent)`. Re-derived on every theme root. */
  '--ring-accent'?: string | number;
  /** `--ring-danger`. Default: `0 0 0 3px oklch(from var(--danger) 0.602 0.196 h / 0.3)`. Re-derived on every theme root. */
  '--ring-danger'?: string | number;
  /** `--ring-warning`. Default: `0 0 0 3px color-mix(in oklab, var(--warning) 30%, transparent)`. Re-derived on every theme root. */
  '--ring-warning'?: string | number;
  /** `--ring-success`. Default: `0 0 0 3px color-mix(in oklab, var(--success) 30%, transparent)`. Re-derived on every theme root. */
  '--ring-success'?: string | number;
  /** `--duration-fast`. Default: `140ms`. Collapses to `1ms` under reduced motion. */
  '--duration-fast'?: string | number;
  /** `--duration-base`. Default: `200ms`. Collapses to `1ms` under reduced motion. */
  '--duration-base'?: string | number;
  /** `--duration-slow`. Default: `300ms`. Collapses to `1ms` under reduced motion. */
  '--duration-slow'?: string | number;
  /** `--duration-slower` - large-surface movement - dialog, sheet, page-scale reveals. Default: `450ms`. Collapses to `1ms` under reduced motion. */
  '--duration-slower'?: string | number;
  /** `--duration-slowest` - hero-scale movement - card expansion, container transforms; the scale's ceiling. Default: `900ms`. Collapses to `1ms` under reduced motion. */
  '--duration-slowest'?: string | number;
  /** `--duration-spin` - continuous loaders only; deliberately outside the UI-transition scale. Default: `600ms`. Collapses to `1200ms` under reduced motion. */
  '--duration-spin'?: string | number;
  /** `--duration-pulse` - ambient live/processing breathing; not collapsed under reduced motion. Default: `1600ms`. */
  '--duration-pulse'?: string | number;
  /** `--ease-standard`. Default: `cubic-bezier(0.2, 0, 0, 1)`. */
  '--ease-standard'?: string | number;
  /** `--ease-entrance`. Default: `cubic-bezier(0.25, 1, 0.4, 1)`. */
  '--ease-entrance'?: string | number;
  /** `--ease-exit`. Default: `cubic-bezier(0.4, 0, 1, 1)`. */
  '--ease-exit'?: string | number;
  /** `--ease-spring`. Default: `cubic-bezier(0.34, 1.4, 0.5, 1)`. */
  '--ease-spring'?: string | number;
  /** `--ease-glide` - fast-out travel - a persistent element answering a new target at once, then landing soft; the glide pill's curve, not for enter/exit. Default: `cubic-bezier( 0.32, 0.55, 0, 1 )`. */
  '--ease-glide'?: string | number;
  /** `--distance-sm` - 8px - settling into place; the surface is already where it belongs. Default: `0.5rem`. */
  '--distance-sm'?: string | number;
  /** `--distance-md` - 16px - arriving from an adjacent position - page turns, tab panels, paged ranges. Default: `1rem`. */
  '--distance-md'?: string | number;
  /** `--distance-lg` - 24px - arriving from outside the surface - a toast joining its stack. Default: `1.5rem`. */
  '--distance-lg'?: string | number;
  /** `--scale-panel` - full-width surfaces - dialog, modal, sheet. Default: `0.98`. */
  '--scale-panel'?: string | number;
  /** `--scale-floating` - floating surfaces - popover, tooltip, menu, toast, alert. Default: `0.96`. */
  '--scale-floating'?: string | number;
  /** `--scale-chip` - small inline elements - tag, badge, count. Default: `0.9`. */
  '--scale-chip'?: string | number;
  /** `--transition-control`. Default: `color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)`. Re-derived on every theme root. */
  '--transition-control'?: string | number;
  /** `--transition-colors`. Default: `color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)`. Re-derived on every theme root. */
  '--transition-colors'?: string | number;
  /** `--transition-opacity`. Default: `opacity var(--duration-base) var(--ease-standard)`. Re-derived on every theme root. */
  '--transition-opacity'?: string | number;
  /** `--glass-blur`. Default: `9px`. */
  '--glass-blur'?: string | number;
  /** `--glass-blur-strong`. Default: `16px`. */
  '--glass-blur-strong'?: string | number;
  /** `--glass-saturate`. Default: `1.5`. */
  '--glass-saturate'?: string | number;
  /** `--glass-sheen`. Default: `linear-gradient( 145deg, rgb(255 255 255 / 0.55) 0%, rgb(255 255 255 / 0.1) 24%, rgb(255 255 255 / 0) 46% )`. */
  '--glass-sheen'?: string | number;
  /** `--glass-sheen-rest`. Default: `0.8`. */
  '--glass-sheen-rest'?: string | number;
  /** `--glass-sheen-hover`. Default: `1`. */
  '--glass-sheen-hover'?: string | number;
  /** `--glass-highlight`. Default: `inset 0 1px 0 0 rgb(255 255 255 / 0.55)`. */
  '--glass-highlight'?: string | number;
  /** `--glass-shadow`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.05), 0 2px 5px rgb(var(--shadow-rgb) / 0.05)`. Re-derived on every theme root. */
  '--glass-shadow'?: string | number;
  /** `--glass-shadow-hover`. Default: `0 2px 4px rgb(var(--shadow-rgb) / 0.06), 0 8px 18px rgb(var(--shadow-rgb) / 0.1)`. Re-derived on every theme root. */
  '--glass-shadow-hover'?: string | number;
  /** `--icon-sm`. Default: `17px`. */
  '--icon-sm'?: string | number;
  /** `--icon-md`. Default: `20px`. */
  '--icon-md'?: string | number;
  /** `--icon-lg`. Default: `26px`. */
  '--icon-lg'?: string | number;
  /** `--layer-overlay`. Default: `1000`. */
  '--layer-overlay'?: string | number;
  /** `--layer-toast`. Default: `1050`. */
  '--layer-toast'?: string | number;
  /** `--layer-tooltip`. Default: `1100`. */
  '--layer-tooltip'?: string | number;
  /** `--avatar-1-bg`. Default: `oklch(0.945 0.04 250)`. */
  '--avatar-1-bg'?: string | number;
  /** `--avatar-1-fg`. Default: `oklch(0.45 0.08 250)`. */
  '--avatar-1-fg'?: string | number;
  /** `--avatar-2-bg`. Default: `oklch(0.945 0.04 292)`. */
  '--avatar-2-bg'?: string | number;
  /** `--avatar-2-fg`. Default: `oklch(0.45 0.08 292)`. */
  '--avatar-2-fg'?: string | number;
  /** `--avatar-3-bg`. Default: `oklch(0.945 0.04 334)`. */
  '--avatar-3-bg'?: string | number;
  /** `--avatar-3-fg`. Default: `oklch(0.45 0.08 334)`. */
  '--avatar-3-fg'?: string | number;
  /** `--avatar-4-bg`. Default: `oklch(0.945 0.04 5)`. */
  '--avatar-4-bg'?: string | number;
  /** `--avatar-4-fg`. Default: `oklch(0.45 0.08 5)`. */
  '--avatar-4-fg'?: string | number;
  /** `--avatar-5-bg`. Default: `oklch(0.945 0.04 55)`. */
  '--avatar-5-bg'?: string | number;
  /** `--avatar-5-fg`. Default: `oklch(0.45 0.08 55)`. */
  '--avatar-5-fg'?: string | number;
  /** `--avatar-6-bg`. Default: `oklch(0.945 0.04 125)`. */
  '--avatar-6-bg'?: string | number;
  /** `--avatar-6-fg`. Default: `oklch(0.45 0.08 125)`. */
  '--avatar-6-fg'?: string | number;
  /** `--avatar-sheen` - Surface finish - white sheen from top, cool near-black shade from bottom (never pure black). Default: `oklch(1 0 0 / 0.35)`. */
  '--avatar-sheen'?: string | number;
  /** `--avatar-shade`. Default: `oklch(0.225 0.012 264 / 0.05)`. */
  '--avatar-shade'?: string | number;
  /** `--bg-app` - The canvas is pure white; cards and floating panels share it and separate with hairlines and shadow, the way print separates with rules rather than tint. The tinted trio steps for real: subtle (hover wash) < muted (passive fill) < inset (a recessed well - code, terminals), each one ramp stop apart. Default: `var(--gray-0)`. */
  '--bg-app'?: string | number;
  /** `--bg-surface`. Default: `var(--gray-0)`. */
  '--bg-surface'?: string | number;
  /** `--bg-surface-raised`. Default: `var(--gray-0)`. */
  '--bg-surface-raised'?: string | number;
  /** `--bg-subtle`. Default: `var(--gray-50)`. */
  '--bg-subtle'?: string | number;
  /** `--bg-muted`. Default: `var(--gray-100)`. */
  '--bg-muted'?: string | number;
  /** `--bg-inset`. Default: `var(--gray-150)`. */
  '--bg-inset'?: string | number;
  /** `--bg-overlay`. Default: `color-mix(in oklab, var(--gray-900) 44%, transparent)`. */
  '--bg-overlay'?: string | number;
  /** `--text-strong`. Default: `var(--gray-950)`. */
  '--text-strong'?: string | number;
  /** `--text-body`. Default: `var(--gray-800)`. */
  '--text-body'?: string | number;
  /** `--text-secondary`. Default: `var(--gray-700)`. */
  '--text-secondary'?: string | number;
  /** `--text-muted`. Default: `var(--gray-600)`. */
  '--text-muted'?: string | number;
  /** `--text-subtle`. Default: `var(--gray-500)`. */
  '--text-subtle'?: string | number;
  /** `--text-disabled`. Default: `var(--gray-400)`. */
  '--text-disabled'?: string | number;
  /** `--text-on-accent`. Default: `var(--gray-0)`. */
  '--text-on-accent'?: string | number;
  /** `--text-inverse`. Default: `var(--gray-0)`. */
  '--text-inverse'?: string | number;
  /** `--border-subtle`. Default: `var(--gray-150)`. */
  '--border-subtle'?: string | number;
  /** `--border-default`. Default: `var(--gray-200)`. */
  '--border-default'?: string | number;
  /** `--border-strong`. Default: `var(--gray-300)`. */
  '--border-strong'?: string | number;
  /** `--accent-lift` - Accent family. Hover, active and lift step lightness relative to the accent so a dark or pale accent keeps its own contrast ladder; subtle, border and disabled pin lightness and chroma and take only the hue, so they stay tints on the white canvas whatever the accent. Default: `oklch(from var(--accent) calc(l + 0.075) calc(c - 0.006) h)`. Re-derived on every theme root. */
  '--accent-lift'?: string | number;
  /** `--accent-hover`. Default: `oklch(from var(--accent) calc(l - 0.07) calc(c - 0.004) h)`. Re-derived on every theme root. */
  '--accent-hover'?: string | number;
  /** `--accent-active`. Default: `oklch(from var(--accent) calc(l - 0.152) calc(c - 0.018) h)`. Re-derived on every theme root. */
  '--accent-active'?: string | number;
  /** `--accent-subtle`. Default: `oklch(from var(--accent) 0.972 0.02 h)`. Re-derived on every theme root. */
  '--accent-subtle'?: string | number;
  /** `--accent-border`. Default: `oklch(from var(--accent) 0.88 0.066 h)`. Re-derived on every theme root. */
  '--accent-border'?: string | number;
  /** `--accent-disabled`. Default: `oklch(from var(--accent) 0.795 0.092 h)`. Re-derived on every theme root. */
  '--accent-disabled'?: string | number;
  /** `--accent-wash`. Default: `oklch(from var(--accent) l c h / 0.08)`. Re-derived on every theme root. */
  '--accent-wash'?: string | number;
  /** `--text-accent`. Default: `var(--accent-active)`. Re-derived on every theme root. */
  '--text-accent'?: string | number;
  /** `--neutral-wash` - State layer: interactive hover/press fills are translucent washes of the ink, never opaque near-whites - opaque --bg-subtle patches vanish on tinted/app surfaces - so a dark theme's light ink washes light without setting them. Press > hover. Default: `color-mix(in oklab, var(--text-secondary) 6%, transparent)`. Re-derived on every theme root. */
  '--neutral-wash'?: string | number;
  /** `--neutral-wash-press`. Default: `color-mix(in oklab, var(--text-secondary) 10%, transparent)`. Re-derived on every theme root. */
  '--neutral-wash-press'?: string | number;
  /** `--info` - Info reads as the accent's own hue one step down; repoint --info to give it a hue of its own. Default: `var(--accent-hover)`. Re-derived on every theme root. */
  '--info'?: string | number;
  /** `--info-subtle`. Default: `oklch(from var(--info) 0.972 0.02 h)`. Re-derived on every theme root. */
  '--info-subtle'?: string | number;
  /** `--info-text`. Default: `oklch(from var(--info) calc(l - 0.082) calc(c - 0.014) h)`. Re-derived on every theme root. */
  '--info-text'?: string | number;
  /** `--info-wash`. Default: `oklch(from var(--info) 0.63 0.118 h / 0.08)`. Re-derived on every theme root. */
  '--info-wash'?: string | number;
  /** `--success-subtle`. Default: `oklch(from var(--success) 0.965 0.028 h)`. Re-derived on every theme root. */
  '--success-subtle'?: string | number;
  /** `--success-text`. Default: `oklch(from var(--success) calc(l - 0.086) calc(c - 0.022) h)`. Re-derived on every theme root. */
  '--success-text'?: string | number;
  /** `--success-wash`. Default: `oklch(from var(--success) 0.62 0.13 h / 0.1)`. Re-derived on every theme root. */
  '--success-wash'?: string | number;
  /** `--warning-subtle`. Default: `oklch(from var(--warning) 0.972 0.034 h)`. Re-derived on every theme root. */
  '--warning-subtle'?: string | number;
  /** `--warning-text`. Default: `oklch(from var(--warning) calc(l - 0.14) calc(c - 0.024) h)`. Re-derived on every theme root. */
  '--warning-text'?: string | number;
  /** `--warning-wash`. Default: `oklch(from var(--warning) 0.76 0.14 h / 0.12)`. Re-derived on every theme root. */
  '--warning-wash'?: string | number;
  /** `--danger-lift` - Danger carries the destructive button's ladder too: fill is the resting face, one step lighter than the --danger ink so white text sits on it; lift is the hover face above that. Default: `oklch(from var(--danger) 0.64 0.2 h)`. Re-derived on every theme root. */
  '--danger-lift'?: string | number;
  /** `--danger-fill`. Default: `oklch(from var(--danger) 0.602 0.196 h)`. Re-derived on every theme root. */
  '--danger-fill'?: string | number;
  /** `--danger-active`. Default: `oklch(from var(--danger) calc(l - 0.067) calc(c - 0.024) h)`. Re-derived on every theme root. */
  '--danger-active'?: string | number;
  /** `--danger-subtle`. Default: `oklch(from var(--danger) 0.968 0.02 h)`. Re-derived on every theme root. */
  '--danger-subtle'?: string | number;
  /** `--danger-text`. Default: `var(--danger-active)`. Re-derived on every theme root. */
  '--danger-text'?: string | number;
  /** `--danger-disabled`. Default: `oklch(from var(--danger) 0.8 0.09 h)`. Re-derived on every theme root. */
  '--danger-disabled'?: string | number;
  /** `--danger-wash`. Default: `oklch(from var(--danger) 0.602 0.196 h / 0.1)`. Re-derived on every theme root. */
  '--danger-wash'?: string | number;
  /** `--glass-tint-neutral` - Glass tints - per-tone translucent fills; alpha kept low so the frost reads through. Default: `color-mix(in oklab, var(--text-muted) 13%, transparent)`. Re-derived on every theme root. */
  '--glass-tint-neutral'?: string | number;
  /** `--glass-tint-info`. Default: `color-mix(in oklab, var(--info) 17%, transparent)`. Re-derived on every theme root. */
  '--glass-tint-info'?: string | number;
  /** `--glass-tint-success`. Default: `color-mix(in oklab, var(--success) 17%, transparent)`. Re-derived on every theme root. */
  '--glass-tint-success'?: string | number;
  /** `--glass-tint-warning`. Default: `color-mix(in oklab, var(--warning) 21%, transparent)`. Re-derived on every theme root. */
  '--glass-tint-warning'?: string | number;
  /** `--glass-tint-danger`. Default: `color-mix(in oklab, var(--danger) 17%, transparent)`. Re-derived on every theme root. */
  '--glass-tint-danger'?: string | number;
  /** `--focus-ring`. Default: `var(--ring-accent)`. Re-derived on every theme root. */
  '--focus-ring'?: string | number;
}

/** The CSS name of every design token. */
export type TokenName = keyof TokenProperties;

/**
 * One theme: the tokens it repoints, by category. Set a decision and every token that derives
 * from it follows; set a role to break it away. Everything is optional.
 */
export interface ThemeTokens {
  /** The hues, and the neutral roles a light or dark theme sets directly. */
  color?: ColorTokens;
  /** The faces. */
  type?: TypeTokens;
  /** Roundness. */
  shape?: ShapeTokens;
  /** How surfaces move. */
  motion?: MotionTokens;
  /** Scoped knobs, per component. */
  components?: ComponentTokens;
  /** Any token by its CSS name - the ones the categories leave out - or a custom property of your own. */
  custom?: TokenProperties & Record<`--${string}`, string | number>;
}

/**
 * The themes an app ships. `base` lands on `:root`; every other key becomes a
 * `[data-theme='<key>']` block, activated by setting that attribute on any element.
 */
export interface ThemeSet {
  /** The always-applied foundation - light, dark, or whatever the app defaults to. */
  base?: ThemeTokens;
  [name: string]: ThemeTokens | undefined;
}

export const reducedMotionTokens: Readonly<Record<string, string>> = {
  '--duration-fast': '1ms',
  '--duration-base': '1ms',
  '--duration-slow': '1ms',
  '--duration-slower': '1ms',
  '--duration-slowest': '1ms',
  '--duration-spin': '1200ms',
};

declare module 'react' {
  export interface CSSProperties extends TokenProperties {}
}
