/**
 * The themeable vocabulary. The eight decisions sit at the top level of a theme and every
 * other token is grouped the way the files are organised. Each key is one design token in
 * camelCase - `accent` is `--accent`, `radiusMd` is `--radius-md` - and takes any CSS the
 * property accepts, including `var()` references to other tokens.
 *
 * Generated from the token and component CSS by `scripts/gen-theme.mjs` - `pnpm sync` rebuilds it.
 */
export interface ColorTokens {
  /** `--gray-0`. Default: `oklch(1 0 0)`. */
  gray0?: string | number;
  /** `--gray-50`. Default: `oklch(from var(--neutral) 0.984 0.003 h)`. */
  gray50?: string | number;
  /** `--gray-100`. Default: `oklch(from var(--neutral) 0.97 0.004 h)`. */
  gray100?: string | number;
  /** `--gray-150`. Default: `oklch(from var(--neutral) 0.954 0.005 h)`. */
  gray150?: string | number;
  /** `--gray-200`. Default: `oklch(from var(--neutral) 0.924 0.006 h)`. */
  gray200?: string | number;
  /** `--gray-300`. Default: `oklch(from var(--neutral) 0.874 0.007 h)`. */
  gray300?: string | number;
  /** `--gray-400`. Default: `oklch(from var(--neutral) 0.765 0.009 h)`. */
  gray400?: string | number;
  /** `--gray-500`. Default: `oklch(from var(--neutral) 0.642 0.011 h)`. */
  gray500?: string | number;
  /** `--gray-600`. Default: `oklch(from var(--neutral) 0.532 0.012 h)`. */
  gray600?: string | number;
  /** `--gray-700`. Default: `oklch(from var(--neutral) 0.422 0.012 h)`. */
  gray700?: string | number;
  /** `--gray-800`. Default: `oklch(from var(--neutral) 0.305 0.01 h)`. */
  gray800?: string | number;
  /** `--gray-900`. Default: `oklch(from var(--neutral) 0.225 0.008 h)`. */
  gray900?: string | number;
  /** `--gray-950`. Default: `oklch(from var(--neutral) 0.165 0.007 h)`. */
  gray950?: string | number;
  /** `--shadow-rgb` - Cool near-black shadow ink - matches the cool neutral ramp on the white canvas. Default: `15 22 25`. */
  shadowRgb?: string | number;
  /** `--bg-app` - The canvas is pure white; cards and floating panels share it and separate with hairlines and shadow, the way print separates with rules rather than tint. The tinted trio steps for real: subtle (hover wash) < muted (passive fill) < inset (a recessed well - code, terminals), each one ramp stop apart. Default: `var(--gray-0)`. */
  bgApp?: string | number;
  /** `--bg-surface`. Default: `var(--gray-0)`. */
  bgSurface?: string | number;
  /** `--bg-surface-raised`. Default: `var(--gray-0)`. */
  bgSurfaceRaised?: string | number;
  /** `--bg-subtle`. Default: `var(--gray-50)`. */
  bgSubtle?: string | number;
  /** `--bg-muted`. Default: `var(--gray-100)`. */
  bgMuted?: string | number;
  /** `--bg-inset`. Default: `var(--gray-150)`. */
  bgInset?: string | number;
  /** `--bg-overlay`. Default: `color-mix(in oklab, var(--gray-900) 44%, transparent)`. */
  bgOverlay?: string | number;
  /** `--text-strong`. Default: `var(--gray-950)`. */
  textStrong?: string | number;
  /** `--text-body`. Default: `var(--gray-800)`. */
  textBody?: string | number;
  /** `--text-secondary`. Default: `var(--gray-700)`. */
  textSecondary?: string | number;
  /** `--text-muted`. Default: `var(--gray-600)`. */
  textMuted?: string | number;
  /** `--text-subtle`. Default: `var(--gray-500)`. */
  textSubtle?: string | number;
  /** `--text-disabled`. Default: `var(--gray-400)`. */
  textDisabled?: string | number;
  /** `--text-on-accent`. Default: `var(--gray-0)`. */
  textOnAccent?: string | number;
  /** `--text-inverse`. Default: `var(--gray-0)`. */
  textInverse?: string | number;
  /** `--border-subtle`. Default: `var(--gray-150)`. */
  borderSubtle?: string | number;
  /** `--border-default`. Default: `var(--gray-200)`. */
  borderDefault?: string | number;
  /** `--border-strong`. Default: `var(--gray-300)`. */
  borderStrong?: string | number;
  /** `--neutral-wash` - State layer: interactive hover/press fills are translucent washes, never opaque near-whites - opaque --bg-subtle patches vanish on tinted/app surfaces. Press > hover. Default: `color-mix(in oklab, var(--gray-700) 6%, transparent)`. */
  neutralWash?: string | number;
  /** `--neutral-wash-press`. Default: `color-mix(in oklab, var(--gray-700) 10%, transparent)`. */
  neutralWashPress?: string | number;
  /** `--glass-tint-neutral`. Default: `color-mix(in oklab, var(--gray-600) 13%, transparent)`. */
  glassTintNeutral?: string | number;
  /** `--accent-lift` - Accent family. Hover, active and lift step lightness relative to the accent so a dark or pale accent keeps its own contrast ladder; subtle, border and disabled pin lightness and chroma and take only the hue, so they stay tints on the white canvas whatever the accent. Default: `oklch(from var(--accent) calc(l + 0.075) calc(c - 0.006) h)`. Re-derived on every theme root. */
  accentLift?: string | number;
  /** `--accent-hover`. Default: `oklch(from var(--accent) calc(l - 0.07) calc(c - 0.004) h)`. Re-derived on every theme root. */
  accentHover?: string | number;
  /** `--accent-active`. Default: `oklch(from var(--accent) calc(l - 0.152) calc(c - 0.018) h)`. Re-derived on every theme root. */
  accentActive?: string | number;
  /** `--accent-subtle`. Default: `oklch(from var(--accent) 0.972 0.02 h)`. Re-derived on every theme root. */
  accentSubtle?: string | number;
  /** `--accent-border`. Default: `oklch(from var(--accent) 0.88 0.066 h)`. Re-derived on every theme root. */
  accentBorder?: string | number;
  /** `--accent-disabled`. Default: `oklch(from var(--accent) 0.795 0.092 h)`. Re-derived on every theme root. */
  accentDisabled?: string | number;
  /** `--accent-wash`. Default: `oklch(from var(--accent) l c h / 0.08)`. Re-derived on every theme root. */
  accentWash?: string | number;
  /** `--text-accent`. Default: `var(--accent-active)`. Re-derived on every theme root. */
  textAccent?: string | number;
  /** `--info` - Info reads as the accent's own hue one step down; repoint --info to give it a hue of its own. Default: `var(--accent-hover)`. Re-derived on every theme root. */
  info?: string | number;
  /** `--info-subtle`. Default: `oklch(from var(--info) 0.972 0.02 h)`. Re-derived on every theme root. */
  infoSubtle?: string | number;
  /** `--info-text`. Default: `oklch(from var(--info) calc(l - 0.082) calc(c - 0.014) h)`. Re-derived on every theme root. */
  infoText?: string | number;
  /** `--info-wash`. Default: `oklch(from var(--info) 0.63 0.118 h / 0.08)`. Re-derived on every theme root. */
  infoWash?: string | number;
  /** `--success-subtle`. Default: `oklch(from var(--success) 0.965 0.028 h)`. Re-derived on every theme root. */
  successSubtle?: string | number;
  /** `--success-text`. Default: `oklch(from var(--success) calc(l - 0.086) calc(c - 0.022) h)`. Re-derived on every theme root. */
  successText?: string | number;
  /** `--success-wash`. Default: `oklch(from var(--success) 0.62 0.13 h / 0.1)`. Re-derived on every theme root. */
  successWash?: string | number;
  /** `--warning-subtle`. Default: `oklch(from var(--warning) 0.972 0.034 h)`. Re-derived on every theme root. */
  warningSubtle?: string | number;
  /** `--warning-text`. Default: `oklch(from var(--warning) calc(l - 0.14) calc(c - 0.024) h)`. Re-derived on every theme root. */
  warningText?: string | number;
  /** `--warning-wash`. Default: `oklch(from var(--warning) 0.76 0.14 h / 0.12)`. Re-derived on every theme root. */
  warningWash?: string | number;
  /** `--danger-lift` - Danger carries the destructive button's ladder too: fill is the resting face, one step lighter than the --danger ink so white text sits on it; lift is the hover face above that. Default: `oklch(from var(--danger) 0.64 0.2 h)`. Re-derived on every theme root. */
  dangerLift?: string | number;
  /** `--danger-fill`. Default: `oklch(from var(--danger) 0.602 0.196 h)`. Re-derived on every theme root. */
  dangerFill?: string | number;
  /** `--danger-active`. Default: `oklch(from var(--danger) calc(l - 0.067) calc(c - 0.024) h)`. Re-derived on every theme root. */
  dangerActive?: string | number;
  /** `--danger-subtle`. Default: `oklch(from var(--danger) 0.968 0.02 h)`. Re-derived on every theme root. */
  dangerSubtle?: string | number;
  /** `--danger-text`. Default: `var(--danger-active)`. Re-derived on every theme root. */
  dangerText?: string | number;
  /** `--danger-disabled`. Default: `oklch(from var(--danger) 0.8 0.09 h)`. Re-derived on every theme root. */
  dangerDisabled?: string | number;
  /** `--danger-wash`. Default: `oklch(from var(--danger) 0.602 0.196 h / 0.1)`. Re-derived on every theme root. */
  dangerWash?: string | number;
  /** `--glass-tint-info` - Glass tints - per-tone translucent fills; alpha kept low so the frost reads through. Default: `color-mix(in oklab, var(--info) 17%, transparent)`. Re-derived on every theme root. */
  glassTintInfo?: string | number;
  /** `--glass-tint-success`. Default: `color-mix(in oklab, var(--success) 17%, transparent)`. Re-derived on every theme root. */
  glassTintSuccess?: string | number;
  /** `--glass-tint-warning`. Default: `color-mix(in oklab, var(--warning) 21%, transparent)`. Re-derived on every theme root. */
  glassTintWarning?: string | number;
  /** `--glass-tint-danger`. Default: `color-mix(in oklab, var(--danger) 17%, transparent)`. Re-derived on every theme root. */
  glassTintDanger?: string | number;
  /** `--focus-ring`. Default: `var(--ring-accent)`. Re-derived on every theme root. */
  focusRing?: string | number;
}

export interface TypeTokens {
  /** `--weight-regular`. Default: `400`. */
  weightRegular?: string | number;
  /** `--weight-medium`. Default: `500`. */
  weightMedium?: string | number;
  /** `--weight-semibold`. Default: `600`. */
  weightSemibold?: string | number;
  /** `--size-micro`. Default: `0.75rem`. */
  sizeMicro?: string | number;
  /** `--size-caption`. Default: `0.8125rem`. */
  sizeCaption?: string | number;
  /** `--size-body`. Default: `0.875rem`. */
  sizeBody?: string | number;
  /** `--size-body-lg`. Default: `1rem`. */
  sizeBodyLg?: string | number;
  /** `--size-heading`. Default: `1.125rem`. */
  sizeHeading?: string | number;
  /** `--size-title`. Default: `1.3125rem`. */
  sizeTitle?: string | number;
  /** `--size-title-lg`. Default: `1.625rem`. */
  sizeTitleLg?: string | number;
  /** `--size-display`. Default: `2rem`. */
  sizeDisplay?: string | number;
  /** `--size-display-lg`. Default: `2.5rem`. */
  sizeDisplayLg?: string | number;
  /** `--leading-micro`. Default: `1rem`. */
  leadingMicro?: string | number;
  /** `--leading-caption`. Default: `1.125rem`. */
  leadingCaption?: string | number;
  /** `--leading-body`. Default: `1.375rem`. */
  leadingBody?: string | number;
  /** `--leading-body-lg`. Default: `1.625rem`. */
  leadingBodyLg?: string | number;
  /** `--leading-heading`. Default: `1.625rem`. */
  leadingHeading?: string | number;
  /** `--leading-title`. Default: `1.75rem`. */
  leadingTitle?: string | number;
  /** `--leading-title-lg`. Default: `2rem`. */
  leadingTitleLg?: string | number;
  /** `--leading-display`. Default: `2.375rem`. */
  leadingDisplay?: string | number;
  /** `--leading-display-lg`. Default: `2.875rem`. */
  leadingDisplayLg?: string | number;
  /** `--measure-floating` - Measure - line-length cap for floating text (tooltip, toast, popover hints) so it never runs a long ribbon. Default: `36ch`. */
  measureFloating?: string | number;
  /** `--tracking-caps`. Default: `0.04em`. */
  trackingCaps?: string | number;
  /** `--tracking-normal`. Default: `0em`. */
  trackingNormal?: string | number;
  /** `--tracking-tight`. Default: `-0.011em`. */
  trackingTight?: string | number;
  /** `--tracking-display`. Default: `-0.021em`. */
  trackingDisplay?: string | number;
  /** `--type-display-lg` - Role bundles - size + leading + weight + tracking, pre-composed; reach for these first. On every theme root so a subtree that swaps --font-sans gets the bundles in that face. Default: `var(--weight-semibold) var(--size-display-lg)/var(--leading-display-lg) var(--font-sans)`. Re-derived on every theme root. */
  typeDisplayLg?: string | number;
  /** `--type-display`. Default: `var(--weight-semibold) var(--size-display)/var(--leading-display) var(--font-sans)`. Re-derived on every theme root. */
  typeDisplay?: string | number;
  /** `--type-title-lg`. Default: `var(--weight-semibold) var(--size-title-lg)/var(--leading-title-lg) var(--font-sans)`. Re-derived on every theme root. */
  typeTitleLg?: string | number;
  /** `--type-title`. Default: `var(--weight-semibold) var(--size-title)/var(--leading-title) var(--font-sans)`. Re-derived on every theme root. */
  typeTitle?: string | number;
  /** `--type-heading`. Default: `var(--weight-semibold) var(--size-heading)/var(--leading-heading) var(--font-sans)`. Re-derived on every theme root. */
  typeHeading?: string | number;
  /** `--type-body-lg`. Default: `var(--weight-regular) var(--size-body-lg)/var(--leading-body-lg) var(--font-sans)`. Re-derived on every theme root. */
  typeBodyLg?: string | number;
  /** `--type-body`. Default: `var(--weight-regular) var(--size-body)/var(--leading-body) var(--font-sans)`. Re-derived on every theme root. */
  typeBody?: string | number;
  /** `--type-label`. Default: `var(--weight-medium) var(--size-body)/var(--leading-body) var(--font-sans)`. Re-derived on every theme root. */
  typeLabel?: string | number;
  /** `--type-caption`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-sans)`. Re-derived on every theme root. */
  typeCaption?: string | number;
  /** `--type-micro`. Default: `var(--weight-medium) var(--size-micro)/var(--leading-micro) var(--font-sans)`. Re-derived on every theme root. */
  typeMicro?: string | number;
  /** `--type-mono`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-mono)`. Re-derived on every theme root. */
  typeMono?: string | number;
}

export interface SpaceTokens {
  /** `--space-px`. Default: `1px`. */
  spacePx?: string | number;
  /** `--space-1`. Default: `0.25rem`. */
  space1?: string | number;
  /** `--space-2`. Default: `0.5rem`. */
  space2?: string | number;
  /** `--space-3`. Default: `0.75rem`. */
  space3?: string | number;
  /** `--space-4`. Default: `1rem`. */
  space4?: string | number;
  /** `--space-5`. Default: `1.5rem`. */
  space5?: string | number;
  /** `--space-6`. Default: `2rem`. */
  space6?: string | number;
  /** `--space-7`. Default: `3rem`. */
  space7?: string | number;
  /** `--space-8`. Default: `4rem`. */
  space8?: string | number;
  /** `--space-9`. Default: `6rem`. */
  space9?: string | number;
  /** `--space-10`. Default: `8rem`. */
  space10?: string | number;
  /** `--measure-prose`. Default: `38rem`. */
  measureProse?: string | number;
  /** `--control-height-sm`. Default: `1.75rem`. */
  controlHeightSm?: string | number;
  /** `--control-height`. Default: `2rem`. */
  controlHeight?: string | number;
  /** `--control-height-lg`. Default: `2.3rem`. */
  controlHeightLg?: string | number;
  /** `--control-box`. Default: `1.125rem`. */
  controlBox?: string | number;
  /** `--control-switch` - switch track (md); the one control size off the scale - width reuses --control-height(-sm), sm height reuses --space-4. Default: `1.25rem`. */
  controlSwitch?: string | number;
}

export interface RadiiTokens {
  /** `--radius-full`. Default: `624.9375rem`. */
  radiusFull?: string | number;
  /** `--radius-sm`. Default: `calc(var(--radius) * 0.5)`. Re-derived on every theme root. */
  radiusSm?: string | number;
  /** `--radius-md`. Default: `calc(var(--radius) * 0.75)`. Re-derived on every theme root. */
  radiusMd?: string | number;
  /** `--radius-lg`. Default: `var(--radius)`. Re-derived on every theme root. */
  radiusLg?: string | number;
  /** `--radius-xl`. Default: `calc(var(--radius) * 1.5)`. Re-derived on every theme root. */
  radiusXl?: string | number;
  /** `--radius-2xl`. Default: `calc(var(--radius) * 2)`. Re-derived on every theme root. */
  radius2xl?: string | number;
}

export interface ElevationTokens {
  /** `--border-hairline` - Borders - one hairline (1px); weight comes from the border color, not thickness; 2px for focus/selected. Default: `1px`. */
  borderHairline?: string | number;
  /** `--border-emphasis`. Default: `1.5px`. */
  borderEmphasis?: string | number;
  /** `--shadow-xs`. Default: `0 1px 1px rgb(var(--shadow-rgb) / 0.04)`. Re-derived on every theme root. */
  shadowXs?: string | number;
  /** `--shadow-sm`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.05), 0 1px 1px rgb(var(--shadow-rgb) / 0.04)`. Re-derived on every theme root. */
  shadowSm?: string | number;
  /** `--shadow-md`. Default: `0 2px 4px rgb(var(--shadow-rgb) / 0.04), 0 6px 12px rgb(var(--shadow-rgb) / 0.07)`. Re-derived on every theme root. */
  shadowMd?: string | number;
  /** `--shadow-lg`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 4px 8px rgb(var(--shadow-rgb) / 0.04), 0 12px 28px rgb(var(--shadow-rgb) / 0.1)`. Re-derived on every theme root. */
  shadowLg?: string | number;
  /** `--shadow-xl`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 8px 16px rgb(var(--shadow-rgb) / 0.06), 0 24px 48px rgb(var(--shadow-rgb) / 0.14)`. Re-derived on every theme root. */
  shadowXl?: string | number;
  /** `--ring-accent` - Focus & selection rings - box-shadows (not outlines) so they follow border-radius. Each tracks its role's hue; danger rings on its fill tone, the lighter face the destructive button rests on. Default: `0 0 0 3px color-mix(in oklab, var(--accent) 32%, transparent)`. Re-derived on every theme root. */
  ringAccent?: string | number;
  /** `--ring-danger`. Default: `0 0 0 3px oklch(from var(--danger) 0.602 0.196 h / 0.3)`. Re-derived on every theme root. */
  ringDanger?: string | number;
  /** `--ring-warning`. Default: `0 0 0 3px color-mix(in oklab, var(--warning) 30%, transparent)`. Re-derived on every theme root. */
  ringWarning?: string | number;
  /** `--ring-success`. Default: `0 0 0 3px color-mix(in oklab, var(--success) 30%, transparent)`. Re-derived on every theme root. */
  ringSuccess?: string | number;
}

export interface MotionTokens {
  /** `--duration-fast`. Default: `140ms`. Collapses to `1ms` under reduced motion. */
  durationFast?: string | number;
  /** `--duration-base`. Default: `200ms`. Collapses to `1ms` under reduced motion. */
  durationBase?: string | number;
  /** `--duration-slow`. Default: `300ms`. Collapses to `1ms` under reduced motion. */
  durationSlow?: string | number;
  /** `--duration-slower` - large-surface movement - dialog, sheet, page-scale reveals. Default: `450ms`. Collapses to `1ms` under reduced motion. */
  durationSlower?: string | number;
  /** `--duration-slowest` - hero-scale movement - card expansion, container transforms; the scale's ceiling. Default: `900ms`. Collapses to `1ms` under reduced motion. */
  durationSlowest?: string | number;
  /** `--duration-spin` - continuous loaders only; deliberately outside the UI-transition scale. Default: `600ms`. Collapses to `1200ms` under reduced motion. */
  durationSpin?: string | number;
  /** `--duration-pulse` - ambient live/processing breathing; not collapsed under reduced motion. Default: `1600ms`. */
  durationPulse?: string | number;
  /** `--ease-standard`. Default: `cubic-bezier(0.2, 0, 0, 1)`. */
  easeStandard?: string | number;
  /** `--ease-entrance`. Default: `cubic-bezier(0.25, 1, 0.4, 1)`. */
  easeEntrance?: string | number;
  /** `--ease-exit`. Default: `cubic-bezier(0.4, 0, 1, 1)`. */
  easeExit?: string | number;
  /** `--ease-spring`. Default: `cubic-bezier(0.34, 1.4, 0.5, 1)`. */
  easeSpring?: string | number;
  /** `--ease-glide` - fast-out travel - a persistent element answering a new target at once, then landing soft; the glide pill's curve, not for enter/exit. Default: `cubic-bezier( 0.32, 0.55, 0, 1 )`. */
  easeGlide?: string | number;
  /** `--distance-sm` - 8px - settling into place; the surface is already where it belongs. Default: `0.5rem`. */
  distanceSm?: string | number;
  /** `--distance-md` - 16px - arriving from an adjacent position - page turns, tab panels, paged ranges. Default: `1rem`. */
  distanceMd?: string | number;
  /** `--distance-lg` - 24px - arriving from outside the surface - a toast joining its stack. Default: `1.5rem`. */
  distanceLg?: string | number;
  /** `--scale-panel` - full-width surfaces - dialog, modal, sheet. Default: `0.98`. */
  scalePanel?: string | number;
  /** `--scale-floating` - floating surfaces - popover, tooltip, menu, toast, alert. Default: `0.96`. */
  scaleFloating?: string | number;
  /** `--scale-chip` - small inline elements - tag, badge, count. Default: `0.9`. */
  scaleChip?: string | number;
  /** `--transition-control`. Default: `color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)`. Re-derived on every theme root. */
  transitionControl?: string | number;
  /** `--transition-colors`. Default: `color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)`. Re-derived on every theme root. */
  transitionColors?: string | number;
  /** `--transition-opacity`. Default: `opacity var(--duration-base) var(--ease-standard)`. Re-derived on every theme root. */
  transitionOpacity?: string | number;
}

export interface GlassTokens {
  /** `--glass-blur`. Default: `9px`. */
  glassBlur?: string | number;
  /** `--glass-blur-strong`. Default: `16px`. */
  glassBlurStrong?: string | number;
  /** `--glass-saturate`. Default: `1.5`. */
  glassSaturate?: string | number;
  /** `--glass-sheen`. Default: `linear-gradient( 145deg, rgb(255 255 255 / 0.55) 0%, rgb(255 255 255 / 0.1) 24%, rgb(255 255 255 / 0) 46% )`. */
  glassSheen?: string | number;
  /** `--glass-sheen-rest`. Default: `0.8`. */
  glassSheenRest?: string | number;
  /** `--glass-sheen-hover`. Default: `1`. */
  glassSheenHover?: string | number;
  /** `--glass-highlight`. Default: `inset 0 1px 0 0 rgb(255 255 255 / 0.55)`. */
  glassHighlight?: string | number;
  /** `--glass-shadow`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.05), 0 2px 5px rgb(var(--shadow-rgb) / 0.05)`. Re-derived on every theme root. */
  glassShadow?: string | number;
  /** `--glass-shadow-hover`. Default: `0 2px 4px rgb(var(--shadow-rgb) / 0.06), 0 8px 18px rgb(var(--shadow-rgb) / 0.1)`. Re-derived on every theme root. */
  glassShadowHover?: string | number;
}

export interface IconTokens {
  /** `--icon-sm`. Default: `17px`. */
  iconSm?: string | number;
  /** `--icon-md`. Default: `20px`. */
  iconMd?: string | number;
  /** `--icon-lg`. Default: `26px`. */
  iconLg?: string | number;
}

export interface LayerTokens {
  /** `--layer-overlay`. Default: `1000`. */
  layerOverlay?: string | number;
  /** `--layer-toast`. Default: `1050`. */
  layerToast?: string | number;
  /** `--layer-tooltip`. Default: `1100`. */
  layerTooltip?: string | number;
}

export interface AvatarTokens {
  /** `--avatar-1-bg`. Default: `oklch(0.945 0.04 250)`. */
  avatar1Bg?: string | number;
  /** `--avatar-1-fg`. Default: `oklch(0.45 0.08 250)`. */
  avatar1Fg?: string | number;
  /** `--avatar-2-bg`. Default: `oklch(0.945 0.04 292)`. */
  avatar2Bg?: string | number;
  /** `--avatar-2-fg`. Default: `oklch(0.45 0.08 292)`. */
  avatar2Fg?: string | number;
  /** `--avatar-3-bg`. Default: `oklch(0.945 0.04 334)`. */
  avatar3Bg?: string | number;
  /** `--avatar-3-fg`. Default: `oklch(0.45 0.08 334)`. */
  avatar3Fg?: string | number;
  /** `--avatar-4-bg`. Default: `oklch(0.945 0.04 5)`. */
  avatar4Bg?: string | number;
  /** `--avatar-4-fg`. Default: `oklch(0.45 0.08 5)`. */
  avatar4Fg?: string | number;
  /** `--avatar-5-bg`. Default: `oklch(0.945 0.04 55)`. */
  avatar5Bg?: string | number;
  /** `--avatar-5-fg`. Default: `oklch(0.45 0.08 55)`. */
  avatar5Fg?: string | number;
  /** `--avatar-6-bg`. Default: `oklch(0.945 0.04 125)`. */
  avatar6Bg?: string | number;
  /** `--avatar-6-fg`. Default: `oklch(0.45 0.08 125)`. */
  avatar6Fg?: string | number;
  /** `--avatar-sheen` - Surface finish - white sheen from top, cool near-black shade from bottom (never pure black). Default: `oklch(1 0 0 / 0.35)`. */
  avatarSheen?: string | number;
  /** `--avatar-shade`. Default: `oklch(0.225 0.012 264 / 0.05)`. */
  avatarShade?: string | number;
}

/** The scoped properties Confetti publishes as its theming contract. */
export interface ConfettiTokens {
  /** `--confetti-paper-1`. Default: `oklch(0.53 0.2 288)`. */
  paper1?: string | number;
  /** `--confetti-paper-2`. Default: `var(--accent)`. */
  paper2?: string | number;
  /** `--confetti-paper-3`. Default: `oklch(0.78 0.115 62)`. */
  paper3?: string | number;
  /** `--confetti-paper-4`. Default: `oklch(0.67 0.18 12)`. */
  paper4?: string | number;
  /** `--confetti-paper-5`. Default: `var(--text-strong)`. */
  paper5?: string | number;
  /** `--confetti-weights`. Default: `1 1 1 1 0.45`. */
  weights?: string | number;
  /** `--confetti-ink`. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--confetti-light`. Default: `var(--bg-surface)`. */
  light?: string | number;
  /** `--confetti-shade`. Default: `42%`. */
  shade?: string | number;
  /** `--confetti-gloss`. Default: `66%`. */
  gloss?: string | number;
  /** `--confetti-layer`. Default: `var(--layer-toast)`. */
  layer?: string | number;
  /** `--confetti-reverse-1`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-1))`. */
  reverse1?: string | number;
  /** `--confetti-reverse-2`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-2))`. */
  reverse2?: string | number;
  /** `--confetti-reverse-3`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-3))`. */
  reverse3?: string | number;
  /** `--confetti-reverse-4`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-4))`. */
  reverse4?: string | number;
  /** `--confetti-reverse-5`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-5))`. */
  reverse5?: string | number;
  /** `--confetti-sheen-1`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-1))`. */
  sheen1?: string | number;
  /** `--confetti-sheen-2`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-2))`. */
  sheen2?: string | number;
  /** `--confetti-sheen-3`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-3))`. */
  sheen3?: string | number;
  /** `--confetti-sheen-4`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-4))`. */
  sheen4?: string | number;
  /** `--confetti-sheen-5`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-5))`. */
  sheen5?: string | number;
}

/** The scoped properties FlowField publishes as its theming contract. */
export interface FlowFieldTokens {
  /** `--flow-field-ink`. Default: `var(--text-subtle)`. */
  ink?: string | number;
  /** `--flow-field-accent`. Default: `var(--accent)`. */
  accent?: string | number;
  /** `--flow-field-min-height`. Default: `var(--space-10)`. */
  minHeight?: string | number;
  /** `--flow-field-ramp-0`. Default: `var(--flow-field-ink)`. */
  ramp0?: string | number;
  /** `--flow-field-ramp-1`. Default: `color-mix(in oklab, var(--flow-field-accent) 9%, var(--flow-field-ink))`. */
  ramp1?: string | number;
  /** `--flow-field-ramp-2`. Default: `color-mix(in oklab, var(--flow-field-accent) 18%, var(--flow-field-ink))`. */
  ramp2?: string | number;
  /** `--flow-field-ramp-3`. Default: `color-mix(in oklab, var(--flow-field-accent) 27%, var(--flow-field-ink))`. */
  ramp3?: string | number;
  /** `--flow-field-ramp-4`. Default: `color-mix(in oklab, var(--flow-field-accent) 36%, var(--flow-field-ink))`. */
  ramp4?: string | number;
  /** `--flow-field-ramp-5`. Default: `color-mix(in oklab, var(--flow-field-accent) 45%, var(--flow-field-ink))`. */
  ramp5?: string | number;
  /** `--flow-field-ramp-6`. Default: `color-mix(in oklab, var(--flow-field-accent) 55%, var(--flow-field-ink))`. */
  ramp6?: string | number;
  /** `--flow-field-ramp-7`. Default: `color-mix(in oklab, var(--flow-field-accent) 64%, var(--flow-field-ink))`. */
  ramp7?: string | number;
  /** `--flow-field-ramp-8`. Default: `color-mix(in oklab, var(--flow-field-accent) 73%, var(--flow-field-ink))`. */
  ramp8?: string | number;
  /** `--flow-field-ramp-9`. Default: `color-mix(in oklab, var(--flow-field-accent) 82%, var(--flow-field-ink))`. */
  ramp9?: string | number;
  /** `--flow-field-ramp-10`. Default: `color-mix(in oklab, var(--flow-field-accent) 91%, var(--flow-field-ink))`. */
  ramp10?: string | number;
  /** `--flow-field-ramp-11`. Default: `var(--flow-field-accent)`. */
  ramp11?: string | number;
}

/** The scoped properties Lens publishes as its theming contract. */
export interface LensTokens {
  /** `--lens-ink`. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--lens-surface`. Default: `var(--bg-surface)`. */
  surface?: string | number;
  /** `--lens-edge`. Default: `color-mix(in oklab, var(--lens-ink) 16%, transparent)`. */
  edge?: string | number;
  /** `--lens-highlight`. Default: `color-mix(in oklab, var(--bg-surface) 90%, transparent)`. */
  highlight?: string | number;
  /** `--lens-vignette-mid`. Default: `5%`. */
  vignetteMid?: string | number;
  /** `--lens-vignette-edge`. Default: `15%`. */
  vignetteEdge?: string | number;
  /** `--lens-fringe-warm`. Default: `oklch(0.72 0.16 12 / 0.3)`. */
  fringeWarm?: string | number;
  /** `--lens-fringe-cool`. Default: `oklch(0.7 0.15 265 / 0.34)`. */
  fringeCool?: string | number;
  /** `--lens-rim-start`. Default: `79%`. */
  rimStart?: string | number;
  /** `--lens-rim-end`. Default: `87%`. */
  rimEnd?: string | number;
}

/** The scoped properties MorphingText publishes as its theming contract. */
export interface MorphingTextTokens {
  /** `--morphing-text-ink`. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--morphing-text-size`. Default: `var(--size-display-lg)`. */
  size?: string | number;
  /** `--morphing-text-weight`. Default: `var(--weight-medium)`. */
  weight?: string | number;
  /** `--morphing-text-leading`. Default: `1.2`. */
  leading?: string | number;
  /** `--morphing-text-tracking`. Default: `var(--tracking-display)`. */
  tracking?: string | number;
  /** `--morphing-text-smear`. Default: `1`. */
  smear?: string | number;
  /** `--morphing-text-rule-ink`. Default: `var(--text-strong)`. */
  ruleInk?: string | number;
  /** `--morphing-text-rule-accent`. Default: `var(--accent)`. */
  ruleAccent?: string | number;
  /** `--morphing-text-rule-height`. Default: `1px`. */
  ruleHeight?: string | number;
  /** `--morphing-text-rule-gap`. Default: `var(--space-3)`. */
  ruleGap?: string | number;
  /** `--morphing-text-rule-rest`. Default: `0.1`. */
  ruleRest?: string | number;
  /** `--morphing-text-rule-lift`. Default: `0.3`. */
  ruleLift?: string | number;
}

/** The scoped properties Odometer publishes as its theming contract. */
export interface OdometerTokens {
  /** `--odometer-cell`. Default: `1em`. */
  cell?: string | number;
  /** `--odometer-digit`. Default: `1ch`. */
  digit?: string | number;
  /** `--odometer-gap`. Default: `0.02em`. */
  gap?: string | number;
  /** `--odometer-ink`. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--odometer-accent`. Default: `var(--accent)`. */
  accent?: string | number;
  /** `--odometer-separator-ink`. Default: `var(--text-muted)`. */
  separatorInk?: string | number;
  /** `--odometer-size`. Default: `var(--size-display)`. */
  size?: string | number;
  /** `--odometer-weight`. Default: `var(--weight-medium)`. */
  weight?: string | number;
}

/** The scoped properties TypingLines publishes as its theming contract. */
export interface TypingLinesTokens {
  /** `--typing-lines-ink`. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--typing-lines-caret-ink`. Default: `var(--accent)`. */
  caretInk?: string | number;
  /** `--typing-lines-size`. Default: `var(--size-title)`. */
  size?: string | number;
  /** `--typing-lines-weight`. Default: `var(--weight-regular)`. */
  weight?: string | number;
  /** `--typing-lines-leading`. Default: `1.4`. */
  leading?: string | number;
  /** `--typing-lines-blink`. Default: `1080ms`. */
  blink?: string | number;
  /** `--typing-lines-caret-gap`. Default: `0.12em`. */
  caretGap?: string | number;
}

/** The scoped properties WeightField publishes as its theming contract. */
export interface WeightFieldTokens {
  /** `--weight-field-ink`. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--weight-field-size`. Default: `6rem`. */
  size?: string | number;
  /** `--weight-field-leading`. Default: `1`. */
  leading?: string | number;
  /** `--weight-field-align`. Default: `center`. */
  align?: string | number;
  /** `--weight-field-pad`. Default: `var(--space-6) var(--space-4)`. */
  pad?: string | number;
  /** `--weight-field-tracking`. Default: `-0.05em`. */
  tracking?: string | number;
  /** `--weight-field-rest-weight`. Default: `300`. */
  restWeight?: string | number;
  /** `--weight-field-far-weight`. Default: `400`. */
  farWeight?: string | number;
  /** `--weight-field-near-weight`. Default: `600`. */
  nearWeight?: string | number;
  /** `--weight-field-peak-weight`. Default: `900`. */
  peakWeight?: string | number;
  /** `--weight-field-hover-padding`. Default: `calc(1em / 12)`. */
  hoverPadding?: string | number;
  /** `--weight-field-stroke`. Default: `calc(1em * 125 / 6000)`. */
  stroke?: string | number;
  /** `--weight-field-stroke-peak`. Default: `calc(var(--weight-field-stroke) * 2)`. */
  strokePeak?: string | number;
  /** `--weight-field-duration`. Default: `400ms`. */
  duration?: string | number;
  /** `--weight-field-ease`. Default: `ease`. */
  ease?: string | number;
  /** `--weight-field-ramp`. Default: `calc(var(--weight-field-duration) / var(--weight-field-speed))`. */
  ramp?: string | number;
}

/** The scoped properties SupportRail publishes as its theming contract. */
export interface SupportRailTokens {
  /** `--support-rail-width`. Default: `318px`. */
  width?: string | number;
  /** `--support-rail-needle-width`. Default: `42px`. */
  needleWidth?: string | number;
  /** `--support-rail-needle-height`. Default: `150px`. */
  needleHeight?: string | number;
  /** `--support-rail-needle-duck`. Default: `0.55`. */
  needleDuck?: string | number;
  /** `--support-rail-needle-tracking`. Default: `0.22em`. */
  needleTracking?: string | number;
  /** `--support-rail-caps-tracking`. Default: `0.13em`. */
  capsTracking?: string | number;
  /** `--support-rail-grabber-width`. Default: `13px`. */
  grabberWidth?: string | number;
  /** `--support-rail-grabber-pill`. Default: `34px`. */
  grabberPill?: string | number;
  /** `--support-rail-live-size`. Default: `6px`. */
  liveSize?: string | number;
  /** `--support-rail-live-reach`. Default: `2.6`. */
  liveReach?: string | number;
  /** `--support-rail-rule-width`. Default: `1.5px`. */
  ruleWidth?: string | number;
  /** `--support-rail-rule-height`. Default: `20px`. */
  ruleHeight?: string | number;
  /** `--support-rail-row-pad-block`. Default: `var(--space-4)`. */
  rowPadBlock?: string | number;
  /** `--support-rail-row-pad-inline`. Default: `var(--space-4)`. */
  rowPadInline?: string | number;
  /** `--support-rail-row-nudge`. Default: `5px`. */
  rowNudge?: string | number;
  /** `--support-rail-surface`. Default: `var(--bg-subtle)`. */
  surface?: string | number;
  /** `--support-rail-surface-raised`. Default: `var(--bg-surface)`. */
  surfaceRaised?: string | number;
  /** `--support-rail-line`. Default: `var(--border-default)`. */
  line?: string | number;
  /** `--support-rail-line-soft`. Default: `var(--border-subtle)`. */
  lineSoft?: string | number;
  /** `--support-rail-accent`. Default: `var(--accent)`. */
  accent?: string | number;
  /** `--support-rail-live-color`. Default: `var(--success)`. */
  liveColor?: string | number;
  /** `--support-rail-radius`. Default: `var(--radius-2xl)`. */
  radius?: string | number;
  /** `--support-rail-open-duration`. Default: `calc(var(--duration-slower) * 1.4)`. */
  openDuration?: string | number;
  /** `--support-rail-close-duration`. Default: `var(--duration-slower)`. */
  closeDuration?: string | number;
  /** `--support-rail-needle-delay`. Default: `calc(var(--duration-slow) * 0.5)`. */
  needleDelay?: string | number;
  /** `--support-rail-stagger`. Default: `calc(var(--duration-fast) * 0.3)`. */
  stagger?: string | number;
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
 * One theme: the tokens it repoints. The decisions come first - set one and every token that
 * derives from it follows - then the groups. Everything is optional.
 */
export interface ThemeTokens {
  /** `--accent` - The brand hue - hover, active, lift, subtle, border, wash, the focus ring and info follow. Default: `oklch(0.63 0.118 198)`. */
  accent?: string | number;
  /** `--success` - Positive status - its subtle, text and wash follow. Default: `oklch(0.548 0.122 152)`. */
  success?: string | number;
  /** `--warning` - Caution - its subtle, text and wash follow. Default: `oklch(0.7 0.142 75)`. */
  warning?: string | number;
  /** `--danger` - Destructive actions and errors - the danger button ladder, ring, subtle, text and wash follow. Default: `oklch(0.545 0.196 27)`. */
  danger?: string | number;
  /** `--neutral` - The gray ramp's hue - the accent by default, so chrome shares its temperature. A fixed colour cuts the grays loose. Read on :root only: a themed subtree inherits the ramp. Default: `var(--accent)`. */
  neutral?: string | number;
  /** `--radius` - Roundness - every --radius-<step> is a fixed ratio of it; 0 squares every corner. Default: `0.5rem`. */
  radius?: string | number;
  /** `--font-sans` - The body face - every --type-* bundle follows. Default: `'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif`. */
  fontSans?: string | number;
  /** `--font-mono` - The code face - --type-mono follows. Default: `'Geist Mono', ui-monospace, 'SF Mono', 'Menlo', monospace`. */
  fontMono?: string | number;
  /** Color tokens. */
  color?: ColorTokens;
  /** Type tokens. */
  type?: TypeTokens;
  /** Space tokens. */
  space?: SpaceTokens;
  /** Radii tokens. */
  radii?: RadiiTokens;
  /** Elevation tokens. */
  elevation?: ElevationTokens;
  /** Motion tokens. */
  motion?: MotionTokens;
  /** Glass tokens. */
  glass?: GlassTokens;
  /** Icon tokens. */
  icon?: IconTokens;
  /** Layer tokens. */
  layer?: LayerTokens;
  /** Avatar tokens. */
  avatar?: AvatarTokens;
  /** Scoped knobs, per component. */
  components?: ComponentTokens;
  /** Any other custom property, written out in full. */
  custom?: Record<`--${string}`, string | number>;
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
  export interface CSSProperties {
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
    /** `--font-sans` - The body face - every --type-* bundle follows. Default: `'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif`. */
    '--font-sans'?: string | number;
    /** `--font-mono` - The code face - --type-mono follows. Default: `'Geist Mono', ui-monospace, 'SF Mono', 'Menlo', monospace`. */
    '--font-mono'?: string | number;
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
    /** `--neutral-wash` - State layer: interactive hover/press fills are translucent washes, never opaque near-whites - opaque --bg-subtle patches vanish on tinted/app surfaces. Press > hover. Default: `color-mix(in oklab, var(--gray-700) 6%, transparent)`. */
    '--neutral-wash'?: string | number;
    /** `--neutral-wash-press`. Default: `color-mix(in oklab, var(--gray-700) 10%, transparent)`. */
    '--neutral-wash-press'?: string | number;
    /** `--glass-tint-neutral`. Default: `color-mix(in oklab, var(--gray-600) 13%, transparent)`. */
    '--glass-tint-neutral'?: string | number;
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
    /** `--glass-tint-info` - Glass tints - per-tone translucent fills; alpha kept low so the frost reads through. Default: `color-mix(in oklab, var(--info) 17%, transparent)`. Re-derived on every theme root. */
    '--glass-tint-info'?: string | number;
    /** `--glass-tint-success`. Default: `color-mix(in oklab, var(--success) 17%, transparent)`. Re-derived on every theme root. */
    '--glass-tint-success'?: string | number;
    /** `--glass-tint-warning`. Default: `color-mix(in oklab, var(--warning) 21%, transparent)`. Re-derived on every theme root. */
    '--glass-tint-warning'?: string | number;
    /** `--glass-tint-danger`. Default: `color-mix(in oklab, var(--danger) 17%, transparent)`. Re-derived on every theme root. */
    '--glass-tint-danger'?: string | number;
    /** `--focus-ring`. Default: `var(--ring-accent)`. Re-derived on every theme root. */
    '--focus-ring'?: string | number;
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
    /** `--type-display-lg` - Role bundles - size + leading + weight + tracking, pre-composed; reach for these first. On every theme root so a subtree that swaps --font-sans gets the bundles in that face. Default: `var(--weight-semibold) var(--size-display-lg)/var(--leading-display-lg) var(--font-sans)`. Re-derived on every theme root. */
    '--type-display-lg'?: string | number;
    /** `--type-display`. Default: `var(--weight-semibold) var(--size-display)/var(--leading-display) var(--font-sans)`. Re-derived on every theme root. */
    '--type-display'?: string | number;
    /** `--type-title-lg`. Default: `var(--weight-semibold) var(--size-title-lg)/var(--leading-title-lg) var(--font-sans)`. Re-derived on every theme root. */
    '--type-title-lg'?: string | number;
    /** `--type-title`. Default: `var(--weight-semibold) var(--size-title)/var(--leading-title) var(--font-sans)`. Re-derived on every theme root. */
    '--type-title'?: string | number;
    /** `--type-heading`. Default: `var(--weight-semibold) var(--size-heading)/var(--leading-heading) var(--font-sans)`. Re-derived on every theme root. */
    '--type-heading'?: string | number;
    /** `--type-body-lg`. Default: `var(--weight-regular) var(--size-body-lg)/var(--leading-body-lg) var(--font-sans)`. Re-derived on every theme root. */
    '--type-body-lg'?: string | number;
    /** `--type-body`. Default: `var(--weight-regular) var(--size-body)/var(--leading-body) var(--font-sans)`. Re-derived on every theme root. */
    '--type-body'?: string | number;
    /** `--type-label`. Default: `var(--weight-medium) var(--size-body)/var(--leading-body) var(--font-sans)`. Re-derived on every theme root. */
    '--type-label'?: string | number;
    /** `--type-caption`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-sans)`. Re-derived on every theme root. */
    '--type-caption'?: string | number;
    /** `--type-micro`. Default: `var(--weight-medium) var(--size-micro)/var(--leading-micro) var(--font-sans)`. Re-derived on every theme root. */
    '--type-micro'?: string | number;
    /** `--type-mono`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-mono)`. Re-derived on every theme root. */
    '--type-mono'?: string | number;
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
  }
}
