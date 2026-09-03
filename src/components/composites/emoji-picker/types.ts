/**
 * Where an emoji is rendered, so a `GetEmojiUrl` can vary provider, size or format per context: `inline` in
 * editor text, `picker-grid` in the panel, `category-bar` for the tab icons, `callout-icon` for a callout's
 * leading icon.
 */
export type EmojiUrlSource = 'inline' | 'picker-grid' | 'category-bar' | 'callout-icon';

/** Returns a URL for an emoji image. */
export type GetEmojiUrl = (hexId: string, source: EmojiUrlSource) => string;
