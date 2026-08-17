/**
 * Where the emoji is being rendered. It's metadata for
 * {@link GetEmojiUrl} — consumers can vary provider, size, or format per
 * context, or ignore it entirely.
 *
 * - `"inline"`       — inline within editor text (small)
 * - `"picker-grid"`  — main grid in the picker panel (medium)
 * - `"category-bar"` — category tab icons (small, often animated)
 * - `"callout-icon"` — callout block leading icon (medium)
 */
export type EmojiUrlSource = 'inline' | 'picker-grid' | 'category-bar' | 'callout-icon';

/** Returns a URL for an emoji image. */
export type GetEmojiUrl = (hexId: string, source: EmojiUrlSource) => string;
