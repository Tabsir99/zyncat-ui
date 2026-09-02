import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'Instagram UI Clone: React Feed Component',
  description:
    'An Instagram UI clone for React: one feed post, image or video, pinned to Instagram metrics, with double-tap to like. Zero dependencies and no Instagram API.',
  keywords: [
    'instagram clone app',
    'instagram clone',
    'instagram ui',
    'instagram app interface',
    'instagram interface',
    'clone instagram',
    'instagram ui design',
    'instagram clone project',
    'instagram ui figma',
    'instagram ui template',
  ],
  lede: "A React Instagram UI component - one feed post at Instagram's own metrics. For clones, mockups and references.",
  faq: [
    {
      q: 'How do I build an Instagram clone UI in React?',
      a: 'Import InstagramFeed from \'@zyncat/ui/instagram-feed\' and give it one post: <InstagramFeed handle="studio.zyncat" caption="Shot on the roof." media={<img src={photo} alt="" />} likes={2600} />. Each instance is a single feed post, so the feed in an Instagram clone project is your own array mapped over it. The component owns the interface and the interactions; the data, routing and auth stay yours.',
    },
    {
      q: 'Does this Instagram feed component fetch my real Instagram posts?',
      a: 'No. There is no Instagram API, no login and no network call in it - this is the Instagram UI, not an embed widget. The media and avatar props take an image URL or your own node (<img>, <video>, next/image), so the post renders exactly the content you pass it. If you want your live account embedded on a marketing site, you want an embed service instead.',
    },
    {
      q: 'Which parts of the Instagram post UI does it reproduce?',
      a: 'The header with the gradient story ring, handle, timestamp and Follow button; the 4:5 or 1:1 media frame, black and full-bleed when type="video", with the mute chip and the audio credit line; the action row of heart, comment, repost, share and bookmark glyphs with counts compacted to 760.4K; and the caption, clipped at 125 characters with a trailing "... more" and #tags and @mentions in Instagram\'s link blue. It is one post - not a carousel, a comments thread, a stories tray or a profile grid.',
    },
    {
      q: 'How do I get double-tap to like working on the post?',
      a: 'It is already wired. Double-tapping the media frame likes the post and bursts an 88px heart on a spring, while the heart glyph fills #ff3040 and the count steps up by one. Read it with onLikedChange, or drive it yourself with liked and defaultLiked. Under prefers-reduced-motion the heart burst is skipped and the like still registers.',
    },
    {
      q: 'Is this an Instagram UI kit or a Figma mockup?',
      a: 'Neither. Searching "instagram ui kit" or "instagram mockup" mostly returns Figma community files and PSDs you cannot ship. This is a working React component in plain CSS and semantic HTML - no Tailwind, no CSS-in-JS, zero runtime dependencies - so the heart, bookmark and mute chip are real buttons with aria-pressed that you reach by Tab, not layers in a design file.',
    },
    {
      q: 'Can I use this Instagram UI clone in Next.js?',
      a: "Yes. @zyncat/ui/instagram-feed ships compiled ESM with its 'use client' directive intact, so it works in the Next.js App Router on React 19 with no transpilePackages config. The post markup is in the server-rendered HTML, and media accepts a next/image element directly.",
    },
  ],
};

export default seo;
