import type { PageSeo } from './types';

const emojiPicker: PageSeo = {
  title: 'Searchable React Emoji Picker',
  description:
    'A React emoji picker component - word-based search and a scrollspy category rail, in a popover that becomes a bottom sheet on phones. Zero dependencies.',
  keywords: [
    'emoji picker',
    'react emoji',
    'emoji picker react',
    'react emoji picker',
    'emoji selector',
    'react emojis',
  ],
  lede: 'A React emoji picker with a searchable grid and category rail. For chat inputs, comment boxes and reactions.',
  faq: [
    {
      q: 'How do I add an emoji picker to a React app?',
      a: "Import it from its own subpath - import { EmojiPickerPanel, loadEmojiData, getEmojiUrl } from '@zyncat/ui/emoji-picker' - call loadEmojiData('/emojis.json') once before the panel first opens, then render <EmojiPickerPanel open={open} onOpenChange={setOpen} onSelect={(shortcode, hexId) => addReaction(shortcode, hexId)} getEmojiUrl={getEmojiUrl} search trigger={<Button>Add reaction</Button>} />. It has no uncontrolled mode, so open and onOpenChange are both required.",
    },
    {
      q: 'Is the emoji dataset bundled with the package?',
      a: "No - the picker ships with no emoji data inside it. Call loadEmojiData(url | EmojiData) once with your own JSON, or an already-parsed object, before the panel first opens, or it throws 'Emoji data not found'. The docs site loads a 580KB set of 1,923 emoji this way from a static /emojis.json, so the dataset's caching and CDN are yours to control, separately from the component itself.",
    },
    {
      q: 'Does it render native emoji glyphs or images?',
      a: "Images, through the getEmojiUrl(hexId, source) prop you supply. The bundled getEmojiUrl renders Twemoji - inline SVG, or a 72×72 PNG in the grid - and Google's animated Noto emoji for category icons, so every emoji looks identical across operating systems instead of falling back to whichever emoji font the browser has; if an image 404s, that one tile swaps to the native glyph automatically.",
    },
    {
      q: "Can I drive the grid from my own input, like a Slack-style ':' trigger?",
      a: "Yes. Pass query instead of turning on the panel's own search field, point popoverProps.anchor at your caret's rect, and forward keydown events through the ref's handleKey - selectFocused commits whichever tile the roving marker is on. That is how a chat composer or a comment box wires its own :shortcode trigger without handing the text field over to the picker.",
    },
    {
      q: 'Is the emoji grid keyboard and screen-reader accessible?',
      a: 'Yes. Arrow keys move a roving marker across the grid and wrap between category sections, Enter commits the focused emoji, and the grid is a role="listbox" of role="option" tiles with aria-activedescendant kept on the field that holds focus, so a screen reader announces each emoji\'s name as you move. Under prefers-reduced-motion the highlight snaps to its new tile instead of animating between them.',
    },
    {
      q: 'Does the emoji picker need Tailwind or any other dependency?',
      a: "No. @zyncat/ui/emoji-picker ships compiled ESM with its 'use client' directive intact, so it drops into the Next.js App Router with no transpilePackages config; React 19 is its only peer dependency and the npm package has zero runtime dependencies. It composes the library's own Popover and Sheet underneath - no Tailwind and nothing extra to install for either.",
    },
  ],
};

export default emojiPicker;
