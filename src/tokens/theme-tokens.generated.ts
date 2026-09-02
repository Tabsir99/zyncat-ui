/**
 * The themeable vocabulary, grouped the way the tokens are organised. Each key is one
 * design token in camelCase - `accent` is `--accent`, `radiusMd` is `--radius-md` - and
 * takes any CSS the property accepts, including `var()` references to other tokens.
 *
 * Generated from the token and component CSS by `scripts/gen-theme.mjs` - `pnpm sync` rebuilds it.
 */
export interface ColorTokens {
  /** `--gray-0`. Default: `oklch(1 0 0)`. */
  gray0?: string | number;
  /** `--gray-25`. Default: `oklch(0.992 0.002 198)`. */
  gray25?: string | number;
  /** `--gray-50`. Default: `oklch(0.984 0.003 198)`. */
  gray50?: string | number;
  /** `--gray-100`. Default: `oklch(0.97 0.004 198)`. */
  gray100?: string | number;
  /** `--gray-150`. Default: `oklch(0.954 0.005 198)`. */
  gray150?: string | number;
  /** `--gray-200`. Default: `oklch(0.924 0.006 198)`. */
  gray200?: string | number;
  /** `--gray-300`. Default: `oklch(0.874 0.007 198)`. */
  gray300?: string | number;
  /** `--gray-400`. Default: `oklch(0.765 0.009 198)`. */
  gray400?: string | number;
  /** `--gray-500`. Default: `oklch(0.642 0.011 198)`. */
  gray500?: string | number;
  /** `--gray-600`. Default: `oklch(0.532 0.012 198)`. */
  gray600?: string | number;
  /** `--gray-700`. Default: `oklch(0.422 0.012 198)`. */
  gray700?: string | number;
  /** `--gray-800`. Default: `oklch(0.305 0.01 198)`. */
  gray800?: string | number;
  /** `--gray-900`. Default: `oklch(0.225 0.008 198)`. */
  gray900?: string | number;
  /** `--gray-950`. Default: `oklch(0.165 0.007 198)`. */
  gray950?: string | number;
  /** `--teal-50`. Default: `oklch(0.972 0.02 198)`. */
  teal50?: string | number;
  /** `--teal-100`. Default: `oklch(0.935 0.04 198)`. */
  teal100?: string | number;
  /** `--teal-200`. Default: `oklch(0.88 0.066 198)`. */
  teal200?: string | number;
  /** `--teal-300`. Default: `oklch(0.795 0.092 198)`. */
  teal300?: string | number;
  /** `--teal-400`. Default: `oklch(0.705 0.112 198)`. */
  teal400?: string | number;
  /** `--teal-500`. Default: `oklch(0.63 0.118 198)`. */
  teal500?: string | number;
  /** `--teal-600`. Default: `oklch(0.56 0.114 198)`. */
  teal600?: string | number;
  /** `--teal-700`. Default: `oklch(0.478 0.1 198)`. */
  teal700?: string | number;
  /** `--teal-800`. Default: `oklch(0.4 0.082 198)`. */
  teal800?: string | number;
  /** `--teal-900`. Default: `oklch(0.32 0.062 198)`. */
  teal900?: string | number;
  /** `--green-50`. Default: `oklch(0.965 0.028 152)`. */
  green50?: string | number;
  /** `--green-500`. Default: `oklch(0.62 0.13 152)`. */
  green500?: string | number;
  /** `--green-600`. Default: `oklch(0.548 0.122 152)`. */
  green600?: string | number;
  /** `--green-700`. Default: `oklch(0.462 0.1 152)`. */
  green700?: string | number;
  /** `--amber-50`. Default: `oklch(0.972 0.034 75)`. */
  amber50?: string | number;
  /** `--amber-500`. Default: `oklch(0.76 0.14 75)`. */
  amber500?: string | number;
  /** `--amber-600`. Default: `oklch(0.7 0.142 75)`. */
  amber600?: string | number;
  /** `--amber-700`. Default: `oklch(0.56 0.118 75)`. */
  amber700?: string | number;
  /** `--red-50`. Default: `oklch(0.968 0.02 27)`. */
  red50?: string | number;
  /** `--red-300`. Default: `oklch(0.8 0.09 27)`. */
  red300?: string | number;
  /** `--red-400`. Default: `oklch(0.64 0.2 27)`. */
  red400?: string | number;
  /** `--red-500`. Default: `oklch(0.602 0.196 27)`. */
  red500?: string | number;
  /** `--red-600`. Default: `oklch(0.545 0.196 27)`. */
  red600?: string | number;
  /** `--red-700`. Default: `oklch(0.478 0.172 27)`. */
  red700?: string | number;
  /** `--gray-wash`. Default: `color-mix(in oklab, var(--gray-700) 6%, transparent)`. */
  grayWash?: string | number;
  /** `--gray-wash-strong`. Default: `color-mix(in oklab, var(--gray-700) 10%, transparent)`. */
  grayWashStrong?: string | number;
  /** `--teal-wash`. Default: `oklch(0.63 0.118 198 / 0.05)`. */
  tealWash?: string | number;
  /** `--green-wash`. Default: `oklch(0.62 0.13 152 / 0.1)`. */
  greenWash?: string | number;
  /** `--amber-wash`. Default: `oklch(0.76 0.14 75 / 0.12)`. */
  amberWash?: string | number;
  /** `--red-wash`. Default: `oklch(0.602 0.196 27 / 0.1)`. */
  redWash?: string | number;
  /** `--shadow-rgb`. Default: `15 22 25`. */
  shadowRgb?: string | number;
  /** `--bg-app`. Default: `var(--gray-0)`. */
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
  /** `--text-accent`. Default: `var(--teal-700)`. */
  textAccent?: string | number;
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
  /** `--accent-lift`. Default: `var(--teal-400)`. */
  accentLift?: string | number;
  /** `--accent`. Default: `var(--teal-500)`. */
  accent?: string | number;
  /** `--accent-hover`. Default: `var(--teal-600)`. */
  accentHover?: string | number;
  /** `--accent-active`. Default: `var(--teal-700)`. */
  accentActive?: string | number;
  /** `--accent-subtle`. Default: `var(--teal-50)`. */
  accentSubtle?: string | number;
  /** `--accent-border`. Default: `var(--teal-200)`. */
  accentBorder?: string | number;
  /** `--accent-disabled`. Default: `var(--teal-300)`. */
  accentDisabled?: string | number;
  /** `--success-subtle`. Default: `var(--green-50)`. */
  successSubtle?: string | number;
  /** `--success`. Default: `var(--green-600)`. */
  success?: string | number;
  /** `--success-text`. Default: `var(--green-700)`. */
  successText?: string | number;
  /** `--warning-subtle`. Default: `var(--amber-50)`. */
  warningSubtle?: string | number;
  /** `--warning`. Default: `var(--amber-600)`. */
  warning?: string | number;
  /** `--warning-text`. Default: `var(--amber-700)`. */
  warningText?: string | number;
  /** `--danger-subtle`. Default: `var(--red-50)`. */
  dangerSubtle?: string | number;
  /** `--danger`. Default: `var(--red-600)`. */
  danger?: string | number;
  /** `--danger-text`. Default: `var(--red-700)`. */
  dangerText?: string | number;
  /** `--info-subtle`. Default: `var(--teal-50)`. */
  infoSubtle?: string | number;
  /** `--info`. Default: `var(--teal-600)`. */
  info?: string | number;
  /** `--info-text`. Default: `var(--teal-700)`. */
  infoText?: string | number;
  /** `--danger-disabled`. Default: `var(--red-300)`. */
  dangerDisabled?: string | number;
  /** `--neutral-wash`. Default: `var(--gray-wash)`. */
  neutralWash?: string | number;
  /** `--neutral-wash-press`. Default: `var(--gray-wash-strong)`. */
  neutralWashPress?: string | number;
  /** `--accent-wash`. Default: `var(--teal-wash)`. */
  accentWash?: string | number;
  /** `--success-wash`. Default: `var(--green-wash)`. */
  successWash?: string | number;
  /** `--warning-wash`. Default: `var(--amber-wash)`. */
  warningWash?: string | number;
  /** `--danger-wash`. Default: `var(--red-wash)`. */
  dangerWash?: string | number;
  /** `--glass-tint-neutral`. Default: `color-mix(in oklab, var(--gray-600) 13%, transparent)`. */
  glassTintNeutral?: string | number;
  /** `--glass-tint-info`. Default: `color-mix(in oklab, var(--info) 17%, transparent)`. */
  glassTintInfo?: string | number;
  /** `--glass-tint-success`. Default: `color-mix(in oklab, var(--success) 17%, transparent)`. */
  glassTintSuccess?: string | number;
  /** `--glass-tint-warning`. Default: `color-mix(in oklab, var(--warning) 21%, transparent)`. */
  glassTintWarning?: string | number;
  /** `--glass-tint-danger`. Default: `color-mix(in oklab, var(--danger) 17%, transparent)`. */
  glassTintDanger?: string | number;
  /** `--focus-ring`. Default: `var(--ring-accent)`. */
  focusRing?: string | number;
}

export interface TypeTokens {
  /** `--font-sans`. Default: `'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif`. */
  fontSans?: string | number;
  /** `--font-mono`. Default: `'Geist Mono', ui-monospace, 'SF Mono', 'Menlo', monospace`. */
  fontMono?: string | number;
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
  /** `--measure-floating`. Default: `36ch`. */
  measureFloating?: string | number;
  /** `--tracking-caps`. Default: `0.04em`. */
  trackingCaps?: string | number;
  /** `--tracking-normal`. Default: `0em`. */
  trackingNormal?: string | number;
  /** `--tracking-tight`. Default: `-0.011em`. */
  trackingTight?: string | number;
  /** `--tracking-tighter`. Default: `-0.016em`. */
  trackingTighter?: string | number;
  /** `--tracking-display`. Default: `-0.021em`. */
  trackingDisplay?: string | number;
  /** `--type-display-lg`. Default: `var(--weight-semibold) var(--size-display-lg)/var(--leading-display-lg) var(--font-sans)`. */
  typeDisplayLg?: string | number;
  /** `--type-display`. Default: `var(--weight-semibold) var(--size-display)/var(--leading-display) var(--font-sans)`. */
  typeDisplay?: string | number;
  /** `--type-title-lg`. Default: `var(--weight-semibold) var(--size-title-lg)/var(--leading-title-lg) var(--font-sans)`. */
  typeTitleLg?: string | number;
  /** `--type-title`. Default: `var(--weight-semibold) var(--size-title)/var(--leading-title) var(--font-sans)`. */
  typeTitle?: string | number;
  /** `--type-heading`. Default: `var(--weight-semibold) var(--size-heading)/var(--leading-heading) var(--font-sans)`. */
  typeHeading?: string | number;
  /** `--type-body-lg`. Default: `var(--weight-regular) var(--size-body-lg)/var(--leading-body-lg) var(--font-sans)`. */
  typeBodyLg?: string | number;
  /** `--type-body`. Default: `var(--weight-regular) var(--size-body)/var(--leading-body) var(--font-sans)`. */
  typeBody?: string | number;
  /** `--type-label`. Default: `var(--weight-medium) var(--size-body)/var(--leading-body) var(--font-sans)`. */
  typeLabel?: string | number;
  /** `--type-caption`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-sans)`. */
  typeCaption?: string | number;
  /** `--type-micro`. Default: `var(--weight-medium) var(--size-micro)/var(--leading-micro) var(--font-sans)`. */
  typeMicro?: string | number;
  /** `--type-mono`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-mono)`. */
  typeMono?: string | number;
}

export interface SpaceTokens {
  /** `--space-px`. Default: `1px`. */
  spacePx?: string | number;
  /** `--space-0`. Default: `0`. */
  space0?: string | number;
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
  /** `--container-max`. Default: `72rem`. */
  containerMax?: string | number;
  /** `--measure-prose`. Default: `38rem`. */
  measureProse?: string | number;
  /** `--sidebar-width`. Default: `16rem`. */
  sidebarWidth?: string | number;
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

export interface RadiusTokens {
  /** `--radius-0`. Default: `0`. */
  radius0?: string | number;
  /** `--radius-sm`. Default: `0.25rem`. */
  radiusSm?: string | number;
  /** `--radius-md`. Default: `0.375rem`. */
  radiusMd?: string | number;
  /** `--radius-lg`. Default: `0.5rem`. */
  radiusLg?: string | number;
  /** `--radius-xl`. Default: `0.75rem`. */
  radiusXl?: string | number;
  /** `--radius-2xl`. Default: `1rem`. */
  radius2xl?: string | number;
  /** `--radius-full`. Default: `624.9375rem`. */
  radiusFull?: string | number;
}

export interface ElevationTokens {
  /** `--shadow-xs`. Default: `0 1px 1px rgb(var(--shadow-rgb) / 0.04)`. */
  shadowXs?: string | number;
  /** `--shadow-sm`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.05), 0 1px 1px rgb(var(--shadow-rgb) / 0.04)`. */
  shadowSm?: string | number;
  /** `--shadow-md`. Default: `0 2px 4px rgb(var(--shadow-rgb) / 0.04), 0 6px 12px rgb(var(--shadow-rgb) / 0.07)`. */
  shadowMd?: string | number;
  /** `--shadow-lg`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 4px 8px rgb(var(--shadow-rgb) / 0.04), 0 12px 28px rgb(var(--shadow-rgb) / 0.1)`. */
  shadowLg?: string | number;
  /** `--shadow-xl`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 8px 16px rgb(var(--shadow-rgb) / 0.06), 0 24px 48px rgb(var(--shadow-rgb) / 0.14)`. */
  shadowXl?: string | number;
  /** `--border-hairline`. Default: `1px`. */
  borderHairline?: string | number;
  /** `--border-emphasis`. Default: `1.5px`. */
  borderEmphasis?: string | number;
  /** `--ring-accent`. Default: `0 0 0 3px color-mix(in oklab, var(--accent) 32%, transparent)`. */
  ringAccent?: string | number;
  /** `--ring-danger`. Default: `0 0 0 3px oklch(0.602 0.196 27 / 0.3)`. */
  ringDanger?: string | number;
  /** `--ring-warning`. Default: `0 0 0 3px color-mix(in oklab, var(--warning) 30%, transparent)`. */
  ringWarning?: string | number;
  /** `--ring-success`. Default: `0 0 0 3px color-mix(in oklab, var(--success) 30%, transparent)`. */
  ringSuccess?: string | number;
  /** `--ring-offset`. Default: `0 0 0 2px var(--bg-surface), 0 0 0 4px color-mix(in oklab, var(--accent) 40%, transparent)`. */
  ringOffset?: string | number;
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
  /** `--ease-glide` - in-out travel - persistent element gliding between siblings; not for enter/exit. Default: `cubic-bezier( 0.55, 0, 0.15, 1 )`. */
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
  /** `--transition-control`. Default: `color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)`. */
  transitionControl?: string | number;
  /** `--transition-colors`. Default: `color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)`. */
  transitionColors?: string | number;
  /** `--transition-opacity`. Default: `opacity var(--duration-base) var(--ease-standard)`. */
  transitionOpacity?: string | number;
  /** `--transition-transform`. Default: `transform var(--duration-base) var(--ease-standard)`. */
  transitionTransform?: string | number;
  /** `--transition-layout`. Default: `grid-template-rows var(--duration-slow) var(--ease-entrance), grid-template-columns var(--duration-slow) var(--ease-entrance), max-height var(--duration-slow) var(--ease-entrance), max-width var(--duration-slow) var(--ease-entrance)`. */
  transitionLayout?: string | number;
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
  /** `--glass-shadow`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.05), 0 2px 5px rgb(var(--shadow-rgb) / 0.05)`. */
  glassShadow?: string | number;
  /** `--glass-shadow-hover`. Default: `0 2px 4px rgb(var(--shadow-rgb) / 0.06), 0 8px 18px rgb(var(--shadow-rgb) / 0.1)`. */
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
  /** `--avatar-sheen`. Default: `oklch(1 0 0 / 0.35)`. */
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

/** The scoped properties Dock publishes as its theming contract. */
export interface DockTokens {
  /** `--dock-gap`. Default: `var(--space-2)`. */
  gap?: string | number;
  /** `--dock-pad`. Default: `var(--space-2)`. */
  pad?: string | number;
  /** `--dock-rail-size`. Default: `calc(var(--dock-size) + var(--dock-pad) * 2 + var(--border-hairline) * 2)`. */
  railSize?: string | number;
  /** `--dock-surface`. Default: `color-mix(in oklab, var(--bg-surface) 70%, transparent)`. */
  surface?: string | number;
  /** `--dock-line`. Default: `var(--border-default)`. */
  line?: string | number;
  /** `--dock-radius`. Default: `var(--radius-2xl)`. */
  radius?: string | number;
  /** `--dock-shadow`. Default: `var(--shadow-md)`. */
  shadow?: string | number;
  /** `--dock-backdrop`. Default: `blur(var(--glass-blur))`. */
  backdrop?: string | number;
  /** `--dock-item-radius`. Default: `var(--radius-full)`. */
  itemRadius?: string | number;
  /** `--dock-item-pad-min`. Default: `0.375rem`. */
  itemPadMin?: string | number;
  /** `--dock-item-pad-ratio`. Default: `0.2`. */
  itemPadRatio?: string | number;
  /** `--dock-item-pad`. Default: `max(var(--dock-item-pad-min), calc(var(--dock-size) * var(--dock-item-pad-ratio)))`. */
  itemPad?: string | number;
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

/** The scoped properties SupportFan publishes as its theming contract. */
export interface SupportFanTokens {
  /** `--support-fan-inset`. Default: `var(--space-5)`. */
  inset?: string | number;
  /** `--support-fan-trigger-size`. Default: `3.5rem`. */
  triggerSize?: string | number;
  /** `--support-fan-surface`. Default: `var(--bg-subtle)`. */
  surface?: string | number;
  /** `--support-fan-surface-lifted`. Default: `var(--bg-surface)`. */
  surfaceLifted?: string | number;
  /** `--support-fan-ink`. Default: `var(--text-strong)`. */
  ink?: string | number;
  /** `--support-fan-ink-soft`. Default: `var(--text-secondary)`. */
  inkSoft?: string | number;
  /** `--support-fan-ink-faint`. Default: `var(--text-subtle)`. */
  inkFaint?: string | number;
  /** `--support-fan-accent`. Default: `var(--accent)`. */
  accent?: string | number;
  /** `--support-fan-accent-wash`. Default: `var(--accent-wash)`. */
  accentWash?: string | number;
  /** `--support-fan-live-color`. Default: `var(--success)`. */
  liveColor?: string | number;
  /** `--support-fan-line`. Default: `var(--border-default)`. */
  line?: string | number;
  /** `--support-fan-shadow`. Default: `var(--shadow-md)`. */
  shadow?: string | number;
  /** `--support-fan-shadow-lifted`. Default: `var(--shadow-lg)`. */
  shadowLifted?: string | number;
  /** `--support-fan-chip-padding`. Default: `var(--space-1) var(--space-3)`. */
  chipPadding?: string | number;
  /** `--support-fan-chip-gap`. Default: `var(--space-2)`. */
  chipGap?: string | number;
  /** `--support-fan-icon-chip-padding`. Default: `var(--space-2)`. */
  iconChipPadding?: string | number;
  /** `--support-fan-caption-tracking`. Default: `0.16em`. */
  captionTracking?: string | number;
  /** `--support-fan-caption-gap`. Default: `var(--space-2)`. */
  captionGap?: string | number;
  /** `--support-fan-rail-gap`. Default: `var(--space-3)`. */
  railGap?: string | number;
  /** `--support-fan-ring-inset`. Default: `0.3125rem`. */
  ringInset?: string | number;
  /** `--support-fan-live-offset`. Default: `0.375rem`. */
  liveOffset?: string | number;
  /** `--support-fan-live-size`. Default: `0.4375rem`. */
  liveSize?: string | number;
  /** `--support-fan-glyph-turn`. Default: `135deg`. */
  glyphTurn?: string | number;
  /** `--support-fan-collapse-x`. Default: `0.875rem`. */
  collapseX?: string | number;
  /** `--support-fan-collapse-scale`. Default: `0.3`. */
  collapseScale?: string | number;
  /** `--support-fan-stagger`. Default: `calc(var(--duration-fast) * 0.3)`. */
  stagger?: string | number;
  /** `--support-fan-open-duration`. Default: `var(--duration-slower)`. */
  openDuration?: string | number;
  /** `--support-fan-close-duration`. Default: `var(--duration-slow)`. */
  closeDuration?: string | number;
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
  /** Dock - its `--dock-*` properties. */
  dock?: DockTokens;
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
  /** SupportFan - its `--support-fan-*` properties. */
  supportFan?: SupportFanTokens;
  /** SupportRail - its `--support-rail-*` properties. */
  supportRail?: SupportRailTokens;
}

/** One theme: the tokens it repoints, grouped. Every group is optional. */
export interface ThemeTokens {
  /** Color tokens. */
  color?: ColorTokens;
  /** Type tokens. */
  type?: TypeTokens;
  /** Space tokens. */
  space?: SpaceTokens;
  /** Radius tokens. */
  radius?: RadiusTokens;
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
    /** `--gray-0`. Default: `oklch(1 0 0)`. */
    '--gray-0'?: string | number;
    /** `--gray-25`. Default: `oklch(0.992 0.002 198)`. */
    '--gray-25'?: string | number;
    /** `--gray-50`. Default: `oklch(0.984 0.003 198)`. */
    '--gray-50'?: string | number;
    /** `--gray-100`. Default: `oklch(0.97 0.004 198)`. */
    '--gray-100'?: string | number;
    /** `--gray-150`. Default: `oklch(0.954 0.005 198)`. */
    '--gray-150'?: string | number;
    /** `--gray-200`. Default: `oklch(0.924 0.006 198)`. */
    '--gray-200'?: string | number;
    /** `--gray-300`. Default: `oklch(0.874 0.007 198)`. */
    '--gray-300'?: string | number;
    /** `--gray-400`. Default: `oklch(0.765 0.009 198)`. */
    '--gray-400'?: string | number;
    /** `--gray-500`. Default: `oklch(0.642 0.011 198)`. */
    '--gray-500'?: string | number;
    /** `--gray-600`. Default: `oklch(0.532 0.012 198)`. */
    '--gray-600'?: string | number;
    /** `--gray-700`. Default: `oklch(0.422 0.012 198)`. */
    '--gray-700'?: string | number;
    /** `--gray-800`. Default: `oklch(0.305 0.01 198)`. */
    '--gray-800'?: string | number;
    /** `--gray-900`. Default: `oklch(0.225 0.008 198)`. */
    '--gray-900'?: string | number;
    /** `--gray-950`. Default: `oklch(0.165 0.007 198)`. */
    '--gray-950'?: string | number;
    /** `--teal-50`. Default: `oklch(0.972 0.02 198)`. */
    '--teal-50'?: string | number;
    /** `--teal-100`. Default: `oklch(0.935 0.04 198)`. */
    '--teal-100'?: string | number;
    /** `--teal-200`. Default: `oklch(0.88 0.066 198)`. */
    '--teal-200'?: string | number;
    /** `--teal-300`. Default: `oklch(0.795 0.092 198)`. */
    '--teal-300'?: string | number;
    /** `--teal-400`. Default: `oklch(0.705 0.112 198)`. */
    '--teal-400'?: string | number;
    /** `--teal-500`. Default: `oklch(0.63 0.118 198)`. */
    '--teal-500'?: string | number;
    /** `--teal-600`. Default: `oklch(0.56 0.114 198)`. */
    '--teal-600'?: string | number;
    /** `--teal-700`. Default: `oklch(0.478 0.1 198)`. */
    '--teal-700'?: string | number;
    /** `--teal-800`. Default: `oklch(0.4 0.082 198)`. */
    '--teal-800'?: string | number;
    /** `--teal-900`. Default: `oklch(0.32 0.062 198)`. */
    '--teal-900'?: string | number;
    /** `--green-50`. Default: `oklch(0.965 0.028 152)`. */
    '--green-50'?: string | number;
    /** `--green-500`. Default: `oklch(0.62 0.13 152)`. */
    '--green-500'?: string | number;
    /** `--green-600`. Default: `oklch(0.548 0.122 152)`. */
    '--green-600'?: string | number;
    /** `--green-700`. Default: `oklch(0.462 0.1 152)`. */
    '--green-700'?: string | number;
    /** `--amber-50`. Default: `oklch(0.972 0.034 75)`. */
    '--amber-50'?: string | number;
    /** `--amber-500`. Default: `oklch(0.76 0.14 75)`. */
    '--amber-500'?: string | number;
    /** `--amber-600`. Default: `oklch(0.7 0.142 75)`. */
    '--amber-600'?: string | number;
    /** `--amber-700`. Default: `oklch(0.56 0.118 75)`. */
    '--amber-700'?: string | number;
    /** `--red-50`. Default: `oklch(0.968 0.02 27)`. */
    '--red-50'?: string | number;
    /** `--red-300`. Default: `oklch(0.8 0.09 27)`. */
    '--red-300'?: string | number;
    /** `--red-400`. Default: `oklch(0.64 0.2 27)`. */
    '--red-400'?: string | number;
    /** `--red-500`. Default: `oklch(0.602 0.196 27)`. */
    '--red-500'?: string | number;
    /** `--red-600`. Default: `oklch(0.545 0.196 27)`. */
    '--red-600'?: string | number;
    /** `--red-700`. Default: `oklch(0.478 0.172 27)`. */
    '--red-700'?: string | number;
    /** `--gray-wash`. Default: `color-mix(in oklab, var(--gray-700) 6%, transparent)`. */
    '--gray-wash'?: string | number;
    /** `--gray-wash-strong`. Default: `color-mix(in oklab, var(--gray-700) 10%, transparent)`. */
    '--gray-wash-strong'?: string | number;
    /** `--teal-wash`. Default: `oklch(0.63 0.118 198 / 0.05)`. */
    '--teal-wash'?: string | number;
    /** `--green-wash`. Default: `oklch(0.62 0.13 152 / 0.1)`. */
    '--green-wash'?: string | number;
    /** `--amber-wash`. Default: `oklch(0.76 0.14 75 / 0.12)`. */
    '--amber-wash'?: string | number;
    /** `--red-wash`. Default: `oklch(0.602 0.196 27 / 0.1)`. */
    '--red-wash'?: string | number;
    /** `--shadow-rgb`. Default: `15 22 25`. */
    '--shadow-rgb'?: string | number;
    /** `--bg-app`. Default: `var(--gray-0)`. */
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
    /** `--text-accent`. Default: `var(--teal-700)`. */
    '--text-accent'?: string | number;
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
    /** `--accent-lift`. Default: `var(--teal-400)`. */
    '--accent-lift'?: string | number;
    /** `--accent`. Default: `var(--teal-500)`. */
    '--accent'?: string | number;
    /** `--accent-hover`. Default: `var(--teal-600)`. */
    '--accent-hover'?: string | number;
    /** `--accent-active`. Default: `var(--teal-700)`. */
    '--accent-active'?: string | number;
    /** `--accent-subtle`. Default: `var(--teal-50)`. */
    '--accent-subtle'?: string | number;
    /** `--accent-border`. Default: `var(--teal-200)`. */
    '--accent-border'?: string | number;
    /** `--accent-disabled`. Default: `var(--teal-300)`. */
    '--accent-disabled'?: string | number;
    /** `--success-subtle`. Default: `var(--green-50)`. */
    '--success-subtle'?: string | number;
    /** `--success`. Default: `var(--green-600)`. */
    '--success'?: string | number;
    /** `--success-text`. Default: `var(--green-700)`. */
    '--success-text'?: string | number;
    /** `--warning-subtle`. Default: `var(--amber-50)`. */
    '--warning-subtle'?: string | number;
    /** `--warning`. Default: `var(--amber-600)`. */
    '--warning'?: string | number;
    /** `--warning-text`. Default: `var(--amber-700)`. */
    '--warning-text'?: string | number;
    /** `--danger-subtle`. Default: `var(--red-50)`. */
    '--danger-subtle'?: string | number;
    /** `--danger`. Default: `var(--red-600)`. */
    '--danger'?: string | number;
    /** `--danger-text`. Default: `var(--red-700)`. */
    '--danger-text'?: string | number;
    /** `--info-subtle`. Default: `var(--teal-50)`. */
    '--info-subtle'?: string | number;
    /** `--info`. Default: `var(--teal-600)`. */
    '--info'?: string | number;
    /** `--info-text`. Default: `var(--teal-700)`. */
    '--info-text'?: string | number;
    /** `--danger-disabled`. Default: `var(--red-300)`. */
    '--danger-disabled'?: string | number;
    /** `--neutral-wash`. Default: `var(--gray-wash)`. */
    '--neutral-wash'?: string | number;
    /** `--neutral-wash-press`. Default: `var(--gray-wash-strong)`. */
    '--neutral-wash-press'?: string | number;
    /** `--accent-wash`. Default: `var(--teal-wash)`. */
    '--accent-wash'?: string | number;
    /** `--success-wash`. Default: `var(--green-wash)`. */
    '--success-wash'?: string | number;
    /** `--warning-wash`. Default: `var(--amber-wash)`. */
    '--warning-wash'?: string | number;
    /** `--danger-wash`. Default: `var(--red-wash)`. */
    '--danger-wash'?: string | number;
    /** `--glass-tint-neutral`. Default: `color-mix(in oklab, var(--gray-600) 13%, transparent)`. */
    '--glass-tint-neutral'?: string | number;
    /** `--glass-tint-info`. Default: `color-mix(in oklab, var(--info) 17%, transparent)`. */
    '--glass-tint-info'?: string | number;
    /** `--glass-tint-success`. Default: `color-mix(in oklab, var(--success) 17%, transparent)`. */
    '--glass-tint-success'?: string | number;
    /** `--glass-tint-warning`. Default: `color-mix(in oklab, var(--warning) 21%, transparent)`. */
    '--glass-tint-warning'?: string | number;
    /** `--glass-tint-danger`. Default: `color-mix(in oklab, var(--danger) 17%, transparent)`. */
    '--glass-tint-danger'?: string | number;
    /** `--focus-ring`. Default: `var(--ring-accent)`. */
    '--focus-ring'?: string | number;
    /** `--font-sans`. Default: `'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif`. */
    '--font-sans'?: string | number;
    /** `--font-mono`. Default: `'Geist Mono', ui-monospace, 'SF Mono', 'Menlo', monospace`. */
    '--font-mono'?: string | number;
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
    /** `--measure-floating`. Default: `36ch`. */
    '--measure-floating'?: string | number;
    /** `--tracking-caps`. Default: `0.04em`. */
    '--tracking-caps'?: string | number;
    /** `--tracking-normal`. Default: `0em`. */
    '--tracking-normal'?: string | number;
    /** `--tracking-tight`. Default: `-0.011em`. */
    '--tracking-tight'?: string | number;
    /** `--tracking-tighter`. Default: `-0.016em`. */
    '--tracking-tighter'?: string | number;
    /** `--tracking-display`. Default: `-0.021em`. */
    '--tracking-display'?: string | number;
    /** `--type-display-lg`. Default: `var(--weight-semibold) var(--size-display-lg)/var(--leading-display-lg) var(--font-sans)`. */
    '--type-display-lg'?: string | number;
    /** `--type-display`. Default: `var(--weight-semibold) var(--size-display)/var(--leading-display) var(--font-sans)`. */
    '--type-display'?: string | number;
    /** `--type-title-lg`. Default: `var(--weight-semibold) var(--size-title-lg)/var(--leading-title-lg) var(--font-sans)`. */
    '--type-title-lg'?: string | number;
    /** `--type-title`. Default: `var(--weight-semibold) var(--size-title)/var(--leading-title) var(--font-sans)`. */
    '--type-title'?: string | number;
    /** `--type-heading`. Default: `var(--weight-semibold) var(--size-heading)/var(--leading-heading) var(--font-sans)`. */
    '--type-heading'?: string | number;
    /** `--type-body-lg`. Default: `var(--weight-regular) var(--size-body-lg)/var(--leading-body-lg) var(--font-sans)`. */
    '--type-body-lg'?: string | number;
    /** `--type-body`. Default: `var(--weight-regular) var(--size-body)/var(--leading-body) var(--font-sans)`. */
    '--type-body'?: string | number;
    /** `--type-label`. Default: `var(--weight-medium) var(--size-body)/var(--leading-body) var(--font-sans)`. */
    '--type-label'?: string | number;
    /** `--type-caption`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-sans)`. */
    '--type-caption'?: string | number;
    /** `--type-micro`. Default: `var(--weight-medium) var(--size-micro)/var(--leading-micro) var(--font-sans)`. */
    '--type-micro'?: string | number;
    /** `--type-mono`. Default: `var(--weight-regular) var(--size-caption)/var(--leading-caption) var(--font-mono)`. */
    '--type-mono'?: string | number;
    /** `--space-px`. Default: `1px`. */
    '--space-px'?: string | number;
    /** `--space-0`. Default: `0`. */
    '--space-0'?: string | number;
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
    /** `--container-max`. Default: `72rem`. */
    '--container-max'?: string | number;
    /** `--measure-prose`. Default: `38rem`. */
    '--measure-prose'?: string | number;
    /** `--sidebar-width`. Default: `16rem`. */
    '--sidebar-width'?: string | number;
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
    /** `--radius-0`. Default: `0`. */
    '--radius-0'?: string | number;
    /** `--radius-sm`. Default: `0.25rem`. */
    '--radius-sm'?: string | number;
    /** `--radius-md`. Default: `0.375rem`. */
    '--radius-md'?: string | number;
    /** `--radius-lg`. Default: `0.5rem`. */
    '--radius-lg'?: string | number;
    /** `--radius-xl`. Default: `0.75rem`. */
    '--radius-xl'?: string | number;
    /** `--radius-2xl`. Default: `1rem`. */
    '--radius-2xl'?: string | number;
    /** `--radius-full`. Default: `624.9375rem`. */
    '--radius-full'?: string | number;
    /** `--shadow-xs`. Default: `0 1px 1px rgb(var(--shadow-rgb) / 0.04)`. */
    '--shadow-xs'?: string | number;
    /** `--shadow-sm`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.05), 0 1px 1px rgb(var(--shadow-rgb) / 0.04)`. */
    '--shadow-sm'?: string | number;
    /** `--shadow-md`. Default: `0 2px 4px rgb(var(--shadow-rgb) / 0.04), 0 6px 12px rgb(var(--shadow-rgb) / 0.07)`. */
    '--shadow-md'?: string | number;
    /** `--shadow-lg`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 4px 8px rgb(var(--shadow-rgb) / 0.04), 0 12px 28px rgb(var(--shadow-rgb) / 0.1)`. */
    '--shadow-lg'?: string | number;
    /** `--shadow-xl`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 8px 16px rgb(var(--shadow-rgb) / 0.06), 0 24px 48px rgb(var(--shadow-rgb) / 0.14)`. */
    '--shadow-xl'?: string | number;
    /** `--border-hairline`. Default: `1px`. */
    '--border-hairline'?: string | number;
    /** `--border-emphasis`. Default: `1.5px`. */
    '--border-emphasis'?: string | number;
    /** `--ring-accent`. Default: `0 0 0 3px color-mix(in oklab, var(--accent) 32%, transparent)`. */
    '--ring-accent'?: string | number;
    /** `--ring-danger`. Default: `0 0 0 3px oklch(0.602 0.196 27 / 0.3)`. */
    '--ring-danger'?: string | number;
    /** `--ring-warning`. Default: `0 0 0 3px color-mix(in oklab, var(--warning) 30%, transparent)`. */
    '--ring-warning'?: string | number;
    /** `--ring-success`. Default: `0 0 0 3px color-mix(in oklab, var(--success) 30%, transparent)`. */
    '--ring-success'?: string | number;
    /** `--ring-offset`. Default: `0 0 0 2px var(--bg-surface), 0 0 0 4px color-mix(in oklab, var(--accent) 40%, transparent)`. */
    '--ring-offset'?: string | number;
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
    /** `--ease-glide` - in-out travel - persistent element gliding between siblings; not for enter/exit. Default: `cubic-bezier( 0.55, 0, 0.15, 1 )`. */
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
    /** `--transition-control`. Default: `color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)`. */
    '--transition-control'?: string | number;
    /** `--transition-colors`. Default: `color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)`. */
    '--transition-colors'?: string | number;
    /** `--transition-opacity`. Default: `opacity var(--duration-base) var(--ease-standard)`. */
    '--transition-opacity'?: string | number;
    /** `--transition-transform`. Default: `transform var(--duration-base) var(--ease-standard)`. */
    '--transition-transform'?: string | number;
    /** `--transition-layout`. Default: `grid-template-rows var(--duration-slow) var(--ease-entrance), grid-template-columns var(--duration-slow) var(--ease-entrance), max-height var(--duration-slow) var(--ease-entrance), max-width var(--duration-slow) var(--ease-entrance)`. */
    '--transition-layout'?: string | number;
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
    /** `--glass-shadow`. Default: `0 1px 2px rgb(var(--shadow-rgb) / 0.05), 0 2px 5px rgb(var(--shadow-rgb) / 0.05)`. */
    '--glass-shadow'?: string | number;
    /** `--glass-shadow-hover`. Default: `0 2px 4px rgb(var(--shadow-rgb) / 0.06), 0 8px 18px rgb(var(--shadow-rgb) / 0.1)`. */
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
    /** `--avatar-sheen`. Default: `oklch(1 0 0 / 0.35)`. */
    '--avatar-sheen'?: string | number;
    /** `--avatar-shade`. Default: `oklch(0.225 0.012 264 / 0.05)`. */
    '--avatar-shade'?: string | number;
  }
}
