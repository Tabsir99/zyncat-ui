# TypingLines - @zyncat/ui/typing-lines

Group: expressive
Docs: https://ui.zyncat.app/typing-lines

A single line that types itself, holds, deletes, then moves to the next one and repeats.

lines is the sequence. unit character|word decides whether a character or a whole word arrives at a
time. caret line|block|underscore|none holds solid while text lands and blinks only once the line is
idle - pick none for word reveals, where nothing is pending. speed is sampled live every frame.
Retune through --typing-lines-* on the root: ink, caret-ink, size, weight, leading, blink,
caret-gap. The full line is exposed to screen readers; the animated text is aria-hidden. Reduced
motion shows the first line complete and never types.

```tsx
<TypingLines lines={['Design every state.', 'Make every motion interruptible.']} caret="block" />
```
