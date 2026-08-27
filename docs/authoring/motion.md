# Motion

Everything that moves in this library is driven by one ~2.5 kB WAAPI engine in
`src/engine`. There is no animation dependency, and there is no second way to
animate something. Read this before writing motion code — most of what follows
is not guessable from the source.

## Which layer do I reach for

Work down this list and stop at the first match.

| The change                                                                                    | Use                                                                     | Why                                                                                                           |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Colour, border, shadow, or a paint-only opacity on hover / press / focus / disabled           | A CSS `transition` with `--transition-control` or `--transition-colors` | Cheap, interruptible, and the browser already owns the property. Never animate these from JS.                 |
| An element enters or leaves the React tree                                                    | `<Presence>` around it, `<Motion exit={…}>` on it                       | `Presence` keeps the node mounted until its exit playback resolves. Nothing else can hold an unmounting node. |
| A mounted element must move, scale or fade under your control                                 | `<Motion animate={…}>`                                                  | It renders the node, so it holds the ref for you.                                                             |
| Same, but you do not render the node (a portal host, a measured child, a node from a ref)     | `animate(el, layer)` directly, or `useMotion(ref, specs)`               |                                                                                                               |
| The element's box changed because the _layout_ changed — a reorder, a resize, content growing | `<Motion layout>` or `<Motion layoutId="…">`                            | FLIP. You cannot compute the destination box yourself; the engine measures it.                                |
| A persistent indicator that follows whichever child is hovered or active                      | `useGlide(containerRef)` + `<GlidePill>`                                | One node that travels, not one node per child.                                                                |
| Height from nothing to content height                                                         | `<Collapse>`, or `height: [0, 'auto']`                                  | `'auto'` is measured for you — see the size keys below.                                                       |

If none of these fit, the answer is still one of these. Do not add a
`setTimeout`, `requestAnimationFrame`, `transitionend` or `animationend` to
sequence motion — see [Sequencing](#sequencing).

## The Layer vocabulary

A `Layer` is a plain object. This table is the whole vocabulary — there are no
other animatable keys.

| Key               | Type                               | Notes                                                                               |
| ----------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| `x`, `y`          | `Length[]`                         | Compiled together into one CSS `translate`. Giving only one holds the other at `0`. |
| `scale`           | `number[]` or `[number, number][]` | A bare number is uniform; a pair is `[x, y]`.                                       |
| `opacity`         | `number[]`                         |                                                                                     |
| `width`, `height` | `Size[]`                           |                                                                                     |
| `timing`          | `Timing`                           | See [Timing](#timing).                                                              |
| `composite`       | `CompositeOperation`               | Almost always omitted. See [Ownership](#ownership-one-writer-per-property).         |

```ts
type Length = number | `${number}%`; // bare numbers are px
type Size = Length | 'auto';
```

A percentage on `x` / `y` resolves against the element's own border box, because
it compiles to CSS `translate` — `x: ['100%']` moves the element exactly its own
width to the right, whatever that width is. A percentage on `width` / `height`
resolves against the containing block, as in CSS.

`'auto'` is only valid on `width` / `height`. The engine measures the element's
natural size, animates to that pixel value, then puts the literal `auto` back on
finish so the element stays responsive afterwards.

`animate()` takes any number of layers and runs them as one `Playback`:

```ts
animate(el, { y: [24, 0], scale: [0.96, 1], timing: SM.t.settle }, { opacity: [0, 1], timing: SM.t.enter });
```

Split them like that when parts of the move need different timing. Keep them in
one layer when they share timing.

## `[to]` versus `[from, to]`

Every value is a keyframe list, and the length changes the meaning.

- **One frame** — `x: [120]` — the engine reads the current computed value and
  uses it as the first frame. "From wherever you are now, to 120px." This is
  what you want for exits and for anything interrupting a move in flight.
- **Two or more** — `x: [0, 120]` — an explicit path. "From 0 to 120px,"
  regardless of where the element currently sits.

Getting this backwards is the most common motion bug in this repo: a two-frame
exit teleports the element to the `from` value before playing, which is visible
whenever the element was mid-flight.

Lists of different lengths in the same layer are allowed; the shorter one holds
its last value.

## Timing

Durations are in **seconds**, not milliseconds.

```ts
interface Timing {
  duration?: number;
  ease?: EaseValue | EaseValue[]; // one curve, or one per segment
  delay?: number;
  times?: number[]; // keyframe offsets, 0..1
  type?: 'spring';
  visualDuration?: number; // spring: time to visually arrive
  bounce?: number; // spring: 0 = no overshoot
  fill?: FillMode; // default 'both'
  release?: boolean; // default false
}
```

Prefer the ready-made transitions on `UIMotion.t` over hand-built timing:

|            |                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------ |
| `t.enter`  | Content arriving. `base` + `entrance`.                                                     |
| `t.exit`   | Content leaving. `fast` + `exit`.                                                          |
| `t.layout` | A box changing size or position. `slow` + `entrance`.                                      |
| `t.settle` | A spring for things landing in place. Collapses to `{ duration: 0 }` under reduced motion. |

For a component that exposes an `animation` prop, do not read `UIMotion`
directly — declare the defaults and run them through the resolver, which handles
the token vocabulary, per-direction overrides and `animation={null}`:

```ts
const MY_TIMING = { open: { duration: 'slow', ease: 'entrance' }, close: { duration: 'base', ease: 'exit' } } as const;

const timings = resolveMotionTiming(animation, MY_TIMING); // { open, close }
```

## Ownership: one writer per property

The engine tracks, per element, which animation owns each property. Starting a
new animation on a property **cancels** whatever held it. This is deliberate: it
is what makes an interrupted move resolve to a single destination instead of two
animations fighting.

Three rules follow, and all three have bitten this repo.

**1. CSS must not transition a property the engine writes.** If JS animates
`translate`, `scale`, `opacity`, `width` or `height` on an element, that
element's stylesheet must not list those properties in a `transition`. The
transition would smooth the engine's own per-frame writes, which lags every
animation and makes interruption look broken. `toast.css`, `tag.css` and
`tabs.css` each carry a note where this applies.

**2. A layer that must stack rather than replace needs `composite: 'add'`.** An
`'add'` layer deliberately does _not_ claim the property, so it plays on top of
whatever already owns it. This is how the tooltip's edge nudge rides on top of
its positioning transform, and how the toast's danger shake rides on top of the
stack offset. An `'add'` layer should almost always also set `fill: 'none'`, so
it contributes nothing once finished.

**3. Writing a style by hand while an animation holds the property does
nothing.** A finished animation with the default `fill: 'both'` keeps holding
its end value forever, so `el.style.translate = '…'` afterwards is silently
overridden. Two ways out:

- `set(el, { x: [120] })` — writes the value immediately and drops the claim.
  Use this for placement, not animation.
- `timing: { …, release: true }` — commits the end value, cancels the animation
  and hands the property back on finish. Use this when an entrance animation is
  followed by direct style writes, as the sheet's drag handler does.

## Sequencing

`animate()` returns a `Playback`:

```ts
interface Playback {
  stop(): void;
  finished: Promise<void>;
}
```

`finished` **resolves** — it never rejects, including when the element is
detached or hidden mid-flight. Chain off it. Never use a timer, a rAF, or a
`transitionend` / `animationend` listener to decide that motion has ended: the
engine scales playback rate through `clock.scale`, and reduced motion collapses
durations, so wall-clock assumptions are wrong by construction.

`Presence` already waits on `finished` for exits. You do not need to coordinate
unmount timing yourself.

## Reduced motion is global and automatic

`motion.css` collapses every `--duration-*` to `1ms` under
`prefers-reduced-motion: reduce`. `UIMotion` reads those custom properties, so
both the CSS and the JS paths shrink together. **Do not add a per-component
reduced-motion media query, and do not branch on `matchMedia` in a component.**

`UIMotion.reduced` exists for the narrow case where a fast animation is still
wrong rather than merely quick — FLIP is skipped entirely rather than played in
1ms, and `t.settle` becomes a hard `{ duration: 0 }`. Reach for it only when
speeding the animation up does not produce the right result.

## Layout animation

`<Motion layout>` FLIPs the element from its previous box on every render.
`<Motion layoutId="x">` FLIPs from wherever _any_ element last held that id, so
a box can travel between two different nodes as one swaps out for the other.

`layoutTransition` tunes it:

```ts
interface FlipTuning {
  size?: 'scale' | 'morph' | 'none';
  timing?: Timing;
}
```

`'scale'` (the default) corrects a changed size with a transform — cheap, but it
distorts borders and radii. `'morph'` animates real `width`/`height`, which is
what you want when the element has a visible border or corner radius.

Below the component layer, `flip(el, from, options)` and `measure(el)` are
available directly. You need them only when you hold a box across something
React does not re-render through.

## Focus and the first frame

**Focus directly in an effect. Do not defer it.** `Presence` mounts entering
children synchronously, and `OverlayPortal` attaches its host before the subtree
commits, so by the time your callback ref, layout effect or `[open]`-keyed
effect runs, the element is in the document, has layout, and resolves custom
properties. An in-flight entrance animation does not make an element
unfocusable.

`use-listbox` deferred focus with `setTimeout(…, 0)` for a long time. It was
cargo cult; it is gone. If you find yourself adding a timeout so that focus
"works", the bug is elsewhere.

## Named presets and space tokens

Repeated shapes live in `src/motion/presets.ts`:

```ts
popIn(scale, timing); // { opacity: [0, 1], scale: [scale, 1] }
popOut(scale, timing); // { opacity: [0],    scale: [scale]    }
slideIn(x, timing); // { x: [x, 0], opacity: [0, 1] }
```

They take numbers rather than token names. Travel has to be numeric — call
sites compute `dir * distance` at runtime, and a menu dropping from above needs
a negative offset — so scale is numeric too rather than shipping two
vocabularies for one idea. Feed both from the token scales rather than typing a
literal:

```ts
UIMotion.scale.panel; // 0.98 — full-width surfaces: dialog, modal, sheet
UIMotion.scale.floating; // 0.96 — popover, tooltip, menu, toast, alert
UIMotion.scale.chip; // 0.9  — tag, badge, count

UIMotion.dist.sm; // 8px  — settling into place
UIMotion.dist.md; // 16px — arriving from an adjacent position
UIMotion.dist.lg; // 24px — arriving from outside the surface
```

The scale token is picked by **surface size**, not by taste: the same ratio
reads as more movement the wider the element, so a dialog needs a subtler one
than a tag to land at the same perceived distance. The distance token is picked
by **how far the thing has conceptually come**, and does not track surface size
— a tooltip nudges 8px and a toast arrives from 24px, and both are floating.

## Canonical recipes

Use these rather than inventing a variant. Each is what the named component
already ships.

```tsx
// Floating surface — popover, menu, tooltip
animate={popIn(UIMotion.scale.floating, timings.open)}
exit={popOut(UIMotion.scale.floating, timings.close)}

// Takeover panel — modal
animate={popIn(UIMotion.scale.panel, timings.open)}
exit={popOut(UIMotion.scale.panel, timings.close)}

// Takeover panel that also rises — dialog
animate={{ y: [UIMotion.dist.sm, 0], scale: [UIMotion.scale.panel, 1], opacity: [0, 1], timing: timings.open }}
exit={{ y: [UIMotion.dist.sm], scale: [UIMotion.scale.panel], opacity: [0], timing: timings.close }}

// Chip inside a group — tag
animate={popIn(UIMotion.scale.chip, step.open)}
exit={popOut(UIMotion.scale.chip, step.close)}

// Edge sheet — slides its own full width or height in, then releases the property
animate={{ [axis]: ['100%', 0], timing: { ...timings.open, release: true } }}
exit={{ [axis]: ['100%'], timing: timings.close }}

// Paged content swapping in a direction — calendar month, pagination range
animate(el, slideIn(dir * UIMotion.dist.md, UIMotion.t.enter));
```
