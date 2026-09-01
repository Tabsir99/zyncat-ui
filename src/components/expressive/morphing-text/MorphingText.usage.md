# MorphingText - @zyncat/ui/morphing-text

Group: expressive
Docs: https://ui.zyncat.app/morphing-text

A headline that cycles a word list, morphing each word into the next.

Both words blur per letter through one SVG alpha threshold, so their letterforms pool and split like
liquid; the threshold attaches only during the morph, so a resting word is untouched type. A
hairline under the word stretches between the two word widths and heats to the accent at the peak.
words is the list, hold is the resting time in ms, speed is sampled live. Hovering holds the current
word; a morph already in flight always finishes. Retune through --morphing-text-* on the root: ink,
size, weight, leading, tracking, smear, rule-ink, rule-accent, rule-height, rule-gap, rule-rest,
rule-lift. The current word is real text for screen readers; reduced motion shows it unblurred,
unmorphed.

```tsx
<MorphingText words={['Weight', 'Timing', 'Ease', 'Rest']} hold={1800} />
```
