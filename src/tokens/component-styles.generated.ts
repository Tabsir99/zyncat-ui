import type { CSSProperties } from 'react';

/**
 * Inline styles for Confetti, including its `--confetti-*` knobs.
 *
 * One interface per component that publishes scoped properties: the design tokens plus
 * that component's own knobs, and nothing from any other component.
 *
 * Generated from the token and component CSS by `scripts/gen-theme.mjs` - `pnpm sync` rebuilds it.
 */
export interface ConfettiStyle extends CSSProperties {
  /** `--confetti-paper-1`. Default: `oklch(0.53 0.2 288)`. */
  '--confetti-paper-1'?: string | number;
  /** `--confetti-paper-2`. Default: `var(--accent)`. */
  '--confetti-paper-2'?: string | number;
  /** `--confetti-paper-3`. Default: `oklch(0.78 0.115 62)`. */
  '--confetti-paper-3'?: string | number;
  /** `--confetti-paper-4`. Default: `oklch(0.67 0.18 12)`. */
  '--confetti-paper-4'?: string | number;
  /** `--confetti-paper-5`. Default: `var(--text-strong)`. */
  '--confetti-paper-5'?: string | number;
  /** `--confetti-weights`. Default: `1 1 1 1 0.45`. */
  '--confetti-weights'?: string | number;
  /** `--confetti-ink`. Default: `var(--text-strong)`. */
  '--confetti-ink'?: string | number;
  /** `--confetti-light`. Default: `var(--bg-surface)`. */
  '--confetti-light'?: string | number;
  /** `--confetti-shade`. Default: `42%`. */
  '--confetti-shade'?: string | number;
  /** `--confetti-gloss`. Default: `66%`. */
  '--confetti-gloss'?: string | number;
  /** `--confetti-layer`. Default: `var(--layer-toast)`. */
  '--confetti-layer'?: string | number;
  /** `--confetti-reverse-1`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-1))`. */
  '--confetti-reverse-1'?: string | number;
  /** `--confetti-reverse-2`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-2))`. */
  '--confetti-reverse-2'?: string | number;
  /** `--confetti-reverse-3`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-3))`. */
  '--confetti-reverse-3'?: string | number;
  /** `--confetti-reverse-4`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-4))`. */
  '--confetti-reverse-4'?: string | number;
  /** `--confetti-reverse-5`. Default: `color-mix(in oklab, var(--confetti-ink) var(--confetti-shade), var(--confetti-paper-5))`. */
  '--confetti-reverse-5'?: string | number;
  /** `--confetti-sheen-1`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-1))`. */
  '--confetti-sheen-1'?: string | number;
  /** `--confetti-sheen-2`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-2))`. */
  '--confetti-sheen-2'?: string | number;
  /** `--confetti-sheen-3`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-3))`. */
  '--confetti-sheen-3'?: string | number;
  /** `--confetti-sheen-4`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-4))`. */
  '--confetti-sheen-4'?: string | number;
  /** `--confetti-sheen-5`. Default: `color-mix(in oklab, var(--confetti-light) var(--confetti-gloss), var(--confetti-paper-5))`. */
  '--confetti-sheen-5'?: string | number;
}

/** Inline styles for Dock, including its `--dock-*` knobs. */
export interface DockStyle extends CSSProperties {
  /** `--dock-gap`. Default: `var(--space-2)`. */
  '--dock-gap'?: string | number;
  /** `--dock-pad`. Default: `var(--space-2)`. */
  '--dock-pad'?: string | number;
  /** `--dock-rail-size`. Default: `calc(var(--dock-size) + var(--dock-pad) * 2 + var(--border-hairline) * 2)`. */
  '--dock-rail-size'?: string | number;
  /** `--dock-surface`. Default: `color-mix(in oklab, var(--bg-surface) 70%, transparent)`. */
  '--dock-surface'?: string | number;
  /** `--dock-line`. Default: `var(--border-default)`. */
  '--dock-line'?: string | number;
  /** `--dock-radius`. Default: `var(--radius-2xl)`. */
  '--dock-radius'?: string | number;
  /** `--dock-shadow`. Default: `var(--shadow-md)`. */
  '--dock-shadow'?: string | number;
  /** `--dock-backdrop`. Default: `blur(var(--glass-blur))`. */
  '--dock-backdrop'?: string | number;
  /** `--dock-item-radius`. Default: `var(--radius-full)`. */
  '--dock-item-radius'?: string | number;
  /** `--dock-item-pad-min`. Default: `0.375rem`. */
  '--dock-item-pad-min'?: string | number;
  /** `--dock-item-pad-ratio`. Default: `0.2`. */
  '--dock-item-pad-ratio'?: string | number;
  /** `--dock-item-pad`. Default: `max(var(--dock-item-pad-min), calc(var(--dock-size) * var(--dock-item-pad-ratio)))`. */
  '--dock-item-pad'?: string | number;
}

/** Inline styles for FlowField, including its `--flow-field-*` knobs. */
export interface FlowFieldStyle extends CSSProperties {
  /** `--flow-field-ink`. Default: `var(--text-subtle)`. */
  '--flow-field-ink'?: string | number;
  /** `--flow-field-accent`. Default: `var(--accent)`. */
  '--flow-field-accent'?: string | number;
  /** `--flow-field-min-height`. Default: `var(--space-10)`. */
  '--flow-field-min-height'?: string | number;
  /** `--flow-field-ramp-0`. Default: `var(--flow-field-ink)`. */
  '--flow-field-ramp-0'?: string | number;
  /** `--flow-field-ramp-1`. Default: `color-mix(in oklab, var(--flow-field-accent) 9%, var(--flow-field-ink))`. */
  '--flow-field-ramp-1'?: string | number;
  /** `--flow-field-ramp-2`. Default: `color-mix(in oklab, var(--flow-field-accent) 18%, var(--flow-field-ink))`. */
  '--flow-field-ramp-2'?: string | number;
  /** `--flow-field-ramp-3`. Default: `color-mix(in oklab, var(--flow-field-accent) 27%, var(--flow-field-ink))`. */
  '--flow-field-ramp-3'?: string | number;
  /** `--flow-field-ramp-4`. Default: `color-mix(in oklab, var(--flow-field-accent) 36%, var(--flow-field-ink))`. */
  '--flow-field-ramp-4'?: string | number;
  /** `--flow-field-ramp-5`. Default: `color-mix(in oklab, var(--flow-field-accent) 45%, var(--flow-field-ink))`. */
  '--flow-field-ramp-5'?: string | number;
  /** `--flow-field-ramp-6`. Default: `color-mix(in oklab, var(--flow-field-accent) 55%, var(--flow-field-ink))`. */
  '--flow-field-ramp-6'?: string | number;
  /** `--flow-field-ramp-7`. Default: `color-mix(in oklab, var(--flow-field-accent) 64%, var(--flow-field-ink))`. */
  '--flow-field-ramp-7'?: string | number;
  /** `--flow-field-ramp-8`. Default: `color-mix(in oklab, var(--flow-field-accent) 73%, var(--flow-field-ink))`. */
  '--flow-field-ramp-8'?: string | number;
  /** `--flow-field-ramp-9`. Default: `color-mix(in oklab, var(--flow-field-accent) 82%, var(--flow-field-ink))`. */
  '--flow-field-ramp-9'?: string | number;
  /** `--flow-field-ramp-10`. Default: `color-mix(in oklab, var(--flow-field-accent) 91%, var(--flow-field-ink))`. */
  '--flow-field-ramp-10'?: string | number;
  /** `--flow-field-ramp-11`. Default: `var(--flow-field-accent)`. */
  '--flow-field-ramp-11'?: string | number;
}

/** Inline styles for Lens, including its `--lens-*` knobs. */
export interface LensStyle extends CSSProperties {
  /** `--lens-ink`. Default: `var(--text-strong)`. */
  '--lens-ink'?: string | number;
  /** `--lens-surface`. Default: `var(--bg-surface)`. */
  '--lens-surface'?: string | number;
  /** `--lens-edge`. Default: `color-mix(in oklab, var(--lens-ink) 16%, transparent)`. */
  '--lens-edge'?: string | number;
  /** `--lens-highlight`. Default: `color-mix(in oklab, var(--bg-surface) 90%, transparent)`. */
  '--lens-highlight'?: string | number;
  /** `--lens-vignette-mid`. Default: `5%`. */
  '--lens-vignette-mid'?: string | number;
  /** `--lens-vignette-edge`. Default: `15%`. */
  '--lens-vignette-edge'?: string | number;
  /** `--lens-fringe-warm`. Default: `oklch(0.72 0.16 12 / 0.3)`. */
  '--lens-fringe-warm'?: string | number;
  /** `--lens-fringe-cool`. Default: `oklch(0.7 0.15 265 / 0.34)`. */
  '--lens-fringe-cool'?: string | number;
  /** `--lens-rim-start`. Default: `79%`. */
  '--lens-rim-start'?: string | number;
  /** `--lens-rim-end`. Default: `87%`. */
  '--lens-rim-end'?: string | number;
}

/** Inline styles for MorphingText, including its `--morphing-text-*` knobs. */
export interface MorphingTextStyle extends CSSProperties {
  /** `--morphing-text-ink`. Default: `var(--text-strong)`. */
  '--morphing-text-ink'?: string | number;
  /** `--morphing-text-size`. Default: `var(--size-display-lg)`. */
  '--morphing-text-size'?: string | number;
  /** `--morphing-text-weight`. Default: `var(--weight-medium)`. */
  '--morphing-text-weight'?: string | number;
  /** `--morphing-text-leading`. Default: `1.2`. */
  '--morphing-text-leading'?: string | number;
  /** `--morphing-text-tracking`. Default: `var(--tracking-display)`. */
  '--morphing-text-tracking'?: string | number;
  /** `--morphing-text-smear`. Default: `1`. */
  '--morphing-text-smear'?: string | number;
  /** `--morphing-text-rule-ink`. Default: `var(--text-strong)`. */
  '--morphing-text-rule-ink'?: string | number;
  /** `--morphing-text-rule-accent`. Default: `var(--accent)`. */
  '--morphing-text-rule-accent'?: string | number;
  /** `--morphing-text-rule-height`. Default: `1px`. */
  '--morphing-text-rule-height'?: string | number;
  /** `--morphing-text-rule-gap`. Default: `var(--space-3)`. */
  '--morphing-text-rule-gap'?: string | number;
  /** `--morphing-text-rule-rest`. Default: `0.1`. */
  '--morphing-text-rule-rest'?: string | number;
  /** `--morphing-text-rule-lift`. Default: `0.3`. */
  '--morphing-text-rule-lift'?: string | number;
}

/** Inline styles for Odometer, including its `--odometer-*` knobs. */
export interface OdometerStyle extends CSSProperties {
  /** `--odometer-cell`. Default: `1em`. */
  '--odometer-cell'?: string | number;
  /** `--odometer-digit`. Default: `1ch`. */
  '--odometer-digit'?: string | number;
  /** `--odometer-gap`. Default: `0.02em`. */
  '--odometer-gap'?: string | number;
  /** `--odometer-ink`. Default: `var(--text-strong)`. */
  '--odometer-ink'?: string | number;
  /** `--odometer-accent`. Default: `var(--accent)`. */
  '--odometer-accent'?: string | number;
  /** `--odometer-separator-ink`. Default: `var(--text-muted)`. */
  '--odometer-separator-ink'?: string | number;
  /** `--odometer-size`. Default: `var(--size-display)`. */
  '--odometer-size'?: string | number;
  /** `--odometer-weight`. Default: `var(--weight-medium)`. */
  '--odometer-weight'?: string | number;
}

/** Inline styles for TypingLines, including its `--typing-lines-*` knobs. */
export interface TypingLinesStyle extends CSSProperties {
  /** `--typing-lines-ink`. Default: `var(--text-strong)`. */
  '--typing-lines-ink'?: string | number;
  /** `--typing-lines-caret-ink`. Default: `var(--accent)`. */
  '--typing-lines-caret-ink'?: string | number;
  /** `--typing-lines-size`. Default: `var(--size-title)`. */
  '--typing-lines-size'?: string | number;
  /** `--typing-lines-weight`. Default: `var(--weight-regular)`. */
  '--typing-lines-weight'?: string | number;
  /** `--typing-lines-leading`. Default: `1.4`. */
  '--typing-lines-leading'?: string | number;
  /** `--typing-lines-blink`. Default: `1080ms`. */
  '--typing-lines-blink'?: string | number;
  /** `--typing-lines-caret-gap`. Default: `0.12em`. */
  '--typing-lines-caret-gap'?: string | number;
}

/** Inline styles for WeightField, including its `--weight-field-*` knobs. */
export interface WeightFieldStyle extends CSSProperties {
  /** `--weight-field-ink`. Default: `var(--text-strong)`. */
  '--weight-field-ink'?: string | number;
  /** `--weight-field-size`. Default: `6rem`. */
  '--weight-field-size'?: string | number;
  /** `--weight-field-leading`. Default: `1`. */
  '--weight-field-leading'?: string | number;
  /** `--weight-field-align`. Default: `center`. */
  '--weight-field-align'?: string | number;
  /** `--weight-field-pad`. Default: `var(--space-6) var(--space-4)`. */
  '--weight-field-pad'?: string | number;
  /** `--weight-field-tracking`. Default: `-0.05em`. */
  '--weight-field-tracking'?: string | number;
  /** `--weight-field-rest-weight`. Default: `300`. */
  '--weight-field-rest-weight'?: string | number;
  /** `--weight-field-far-weight`. Default: `400`. */
  '--weight-field-far-weight'?: string | number;
  /** `--weight-field-near-weight`. Default: `600`. */
  '--weight-field-near-weight'?: string | number;
  /** `--weight-field-peak-weight`. Default: `900`. */
  '--weight-field-peak-weight'?: string | number;
  /** `--weight-field-hover-padding`. Default: `calc(1em / 12)`. */
  '--weight-field-hover-padding'?: string | number;
  /** `--weight-field-stroke`. Default: `calc(1em * 125 / 6000)`. */
  '--weight-field-stroke'?: string | number;
  /** `--weight-field-stroke-peak`. Default: `calc(var(--weight-field-stroke) * 2)`. */
  '--weight-field-stroke-peak'?: string | number;
  /** `--weight-field-duration`. Default: `400ms`. */
  '--weight-field-duration'?: string | number;
  /** `--weight-field-ease`. Default: `ease`. */
  '--weight-field-ease'?: string | number;
  /** `--weight-field-ramp`. Default: `calc(var(--weight-field-duration) / var(--weight-field-speed))`. */
  '--weight-field-ramp'?: string | number;
}

/** Inline styles for SupportFan, including its `--support-fan-*` knobs. */
export interface SupportFanStyle extends CSSProperties {
  /** `--support-fan-inset`. Default: `var(--space-5)`. */
  '--support-fan-inset'?: string | number;
  /** `--support-fan-trigger-size`. Default: `3.5rem`. */
  '--support-fan-trigger-size'?: string | number;
  /** `--support-fan-surface`. Default: `var(--bg-subtle)`. */
  '--support-fan-surface'?: string | number;
  /** `--support-fan-surface-lifted`. Default: `var(--bg-surface)`. */
  '--support-fan-surface-lifted'?: string | number;
  /** `--support-fan-ink`. Default: `var(--text-strong)`. */
  '--support-fan-ink'?: string | number;
  /** `--support-fan-ink-soft`. Default: `var(--text-secondary)`. */
  '--support-fan-ink-soft'?: string | number;
  /** `--support-fan-ink-faint`. Default: `var(--text-subtle)`. */
  '--support-fan-ink-faint'?: string | number;
  /** `--support-fan-accent`. Default: `var(--accent)`. */
  '--support-fan-accent'?: string | number;
  /** `--support-fan-accent-wash`. Default: `var(--accent-wash)`. */
  '--support-fan-accent-wash'?: string | number;
  /** `--support-fan-live-color`. Default: `var(--success)`. */
  '--support-fan-live-color'?: string | number;
  /** `--support-fan-line`. Default: `var(--border-default)`. */
  '--support-fan-line'?: string | number;
  /** `--support-fan-shadow`. Default: `var(--shadow-md)`. */
  '--support-fan-shadow'?: string | number;
  /** `--support-fan-shadow-lifted`. Default: `var(--shadow-lg)`. */
  '--support-fan-shadow-lifted'?: string | number;
  /** `--support-fan-chip-padding`. Default: `var(--space-1) var(--space-3)`. */
  '--support-fan-chip-padding'?: string | number;
  /** `--support-fan-chip-gap`. Default: `var(--space-2)`. */
  '--support-fan-chip-gap'?: string | number;
  /** `--support-fan-icon-chip-padding`. Default: `var(--space-2)`. */
  '--support-fan-icon-chip-padding'?: string | number;
  /** `--support-fan-caption-tracking`. Default: `0.16em`. */
  '--support-fan-caption-tracking'?: string | number;
  /** `--support-fan-caption-gap`. Default: `var(--space-2)`. */
  '--support-fan-caption-gap'?: string | number;
  /** `--support-fan-rail-gap`. Default: `var(--space-3)`. */
  '--support-fan-rail-gap'?: string | number;
  /** `--support-fan-ring-inset`. Default: `0.3125rem`. */
  '--support-fan-ring-inset'?: string | number;
  /** `--support-fan-live-offset`. Default: `0.375rem`. */
  '--support-fan-live-offset'?: string | number;
  /** `--support-fan-live-size`. Default: `0.4375rem`. */
  '--support-fan-live-size'?: string | number;
  /** `--support-fan-glyph-turn`. Default: `135deg`. */
  '--support-fan-glyph-turn'?: string | number;
  /** `--support-fan-collapse-x`. Default: `0.875rem`. */
  '--support-fan-collapse-x'?: string | number;
  /** `--support-fan-collapse-scale`. Default: `0.3`. */
  '--support-fan-collapse-scale'?: string | number;
  /** `--support-fan-stagger`. Default: `calc(var(--duration-fast) * 0.3)`. */
  '--support-fan-stagger'?: string | number;
  /** `--support-fan-open-duration`. Default: `var(--duration-slower)`. */
  '--support-fan-open-duration'?: string | number;
  /** `--support-fan-close-duration`. Default: `var(--duration-slow)`. */
  '--support-fan-close-duration'?: string | number;
}

/** Inline styles for SupportRail, including its `--support-rail-*` knobs. */
export interface SupportRailStyle extends CSSProperties {
  /** `--support-rail-width`. Default: `318px`. */
  '--support-rail-width'?: string | number;
  /** `--support-rail-needle-width`. Default: `42px`. */
  '--support-rail-needle-width'?: string | number;
  /** `--support-rail-needle-height`. Default: `150px`. */
  '--support-rail-needle-height'?: string | number;
  /** `--support-rail-needle-duck`. Default: `0.55`. */
  '--support-rail-needle-duck'?: string | number;
  /** `--support-rail-needle-tracking`. Default: `0.22em`. */
  '--support-rail-needle-tracking'?: string | number;
  /** `--support-rail-caps-tracking`. Default: `0.13em`. */
  '--support-rail-caps-tracking'?: string | number;
  /** `--support-rail-grabber-width`. Default: `13px`. */
  '--support-rail-grabber-width'?: string | number;
  /** `--support-rail-grabber-pill`. Default: `34px`. */
  '--support-rail-grabber-pill'?: string | number;
  /** `--support-rail-live-size`. Default: `6px`. */
  '--support-rail-live-size'?: string | number;
  /** `--support-rail-live-reach`. Default: `2.6`. */
  '--support-rail-live-reach'?: string | number;
  /** `--support-rail-rule-width`. Default: `1.5px`. */
  '--support-rail-rule-width'?: string | number;
  /** `--support-rail-rule-height`. Default: `20px`. */
  '--support-rail-rule-height'?: string | number;
  /** `--support-rail-row-pad-block`. Default: `var(--space-4)`. */
  '--support-rail-row-pad-block'?: string | number;
  /** `--support-rail-row-pad-inline`. Default: `var(--space-4)`. */
  '--support-rail-row-pad-inline'?: string | number;
  /** `--support-rail-row-nudge`. Default: `5px`. */
  '--support-rail-row-nudge'?: string | number;
  /** `--support-rail-surface`. Default: `var(--bg-subtle)`. */
  '--support-rail-surface'?: string | number;
  /** `--support-rail-surface-raised`. Default: `var(--bg-surface)`. */
  '--support-rail-surface-raised'?: string | number;
  /** `--support-rail-line`. Default: `var(--border-default)`. */
  '--support-rail-line'?: string | number;
  /** `--support-rail-line-soft`. Default: `var(--border-subtle)`. */
  '--support-rail-line-soft'?: string | number;
  /** `--support-rail-accent`. Default: `var(--accent)`. */
  '--support-rail-accent'?: string | number;
  /** `--support-rail-live-color`. Default: `var(--success)`. */
  '--support-rail-live-color'?: string | number;
  /** `--support-rail-radius`. Default: `var(--radius-2xl)`. */
  '--support-rail-radius'?: string | number;
  /** `--support-rail-open-duration`. Default: `calc(var(--duration-slower) * 1.4)`. */
  '--support-rail-open-duration'?: string | number;
  /** `--support-rail-close-duration`. Default: `var(--duration-slower)`. */
  '--support-rail-close-duration'?: string | number;
  /** `--support-rail-needle-delay`. Default: `calc(var(--duration-slow) * 0.5)`. */
  '--support-rail-needle-delay'?: string | number;
  /** `--support-rail-stagger`. Default: `calc(var(--duration-fast) * 0.3)`. */
  '--support-rail-stagger'?: string | number;
}
