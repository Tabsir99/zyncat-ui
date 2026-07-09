/* Motion scale names - the canonical token vocabulary shared by the CSS custom properties
   (motion.css), the JS bridge (motion-tokens.ts) and component timing props (Collapse).
   Deliberately type-only and dependency-free so component d.ts graphs can use the names
   without dragging in the optional `motion` peer's types. */

/** Names of the UI-transition duration scale (`--duration-*`). */
export type DurationToken = 'fast' | 'base' | 'slow';
/** Names of the brand easing curves (`--ease-*`). */
export type EaseToken = 'standard' | 'entrance' | 'exit' | 'spring' | 'glide';
