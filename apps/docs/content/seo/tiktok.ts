import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'TikTok UI Clone - React Post Component',
  description:
    'A TikTok UI clone for React: the desktop web player with the photo carousel and the mobile viewport, pinned to TikTok metrics. No TikTok API, no real videos.',
  keywords: [
    'tiktok ui',
    'tiktok clone',
    'tiktok interface',
    'tiktok mockup',
    'tiktok ui overlay',
    'tiktok clone app',
    'tiktok post generator',
    'tik tok ui',
    'tik tok screen',
    'tiktok user interface',
    'tiktok mockup generator',
    'tiktok interface overlay',
    'tiktok video mockup',
    'tiktok ui template',
  ],
  lede: 'A React TikTok UI component - the web player, its photo carousel and the mobile viewport. For clones and mockups.',
  faq: [
    {
      q: 'How do I build a TikTok clone UI in React?',
      a: 'Import it and pick a surface: <TikTok surface="desktop" ratio="3:2" name="Lena" location="Shariatpur" caption="Golden hour on the coast road" media={[shotA, shotB]} likes={3149} comments={201} saves={480} shares={789} />. surface takes desktop or mobile, ratio letterboxes the media at 3:2, 4:3, 1:1, 16:9, 9:16 or 3:4, and every value on screen is a prop. It is the TikTok UI only, so the data layer, the routing and the auth in your TikTok clone project stay yours.',
    },
    {
      q: 'Does TikTok have an API this component uses, or does it show real videos?',
      a: 'No to both. There is no TikTok API call, no login, no network request and no real videos anywhere in it - the component is the TikTok user interface, not an embed. media, avatar and sticker take a URL string or your own node, so a <video>, an <img> or a next/image element renders exactly what you pass. Nothing autoplays either: muted toggles the speaker glyph and reports through onMutedChange, and you wire that to your own player.',
    },
    {
      q: 'Which TikTok surfaces and interactions does the replica cover?',
      a: 'Two surfaces behind one prop. desktop is the 1584x912 web player - the pin chip, creator name, one-line caption with "more", the blurred saturated letterbox behind the frame, the mute chip and the "See translation" line that translation controls. mobile is the 452x822 mobile-web viewport with the menu and search buttons, a two-line caption and the music + sound line. liked and followed toggle on both surfaces while saved and muted are desktop only, each with a default and an onChange prop, and onAction fires for comment, share, menu and search. Counts print exact below 10,000 and then abbreviate to 184.2K or 1.4M.',
    },
    {
      q: 'How does the TikTok photo carousel work?',
      a: 'Pass media as an array on the desktop surface and each entry becomes a slide, up to ten; slides can raise the count on its own. Drag it, press the chevrons or use the left and right arrow keys, and read or drive the 1-based position with slide, defaultSlide and onSlideChange. The track is a real carousel for assistive tech - aria-roledescription="carousel" with each slide labelled "2 of 3" - and under prefers-reduced-motion the page snaps instead of gliding.',
    },
    {
      q: 'Is this a TikTok UI kit, a Figma mockup or an overlay PNG?',
      a: 'None of the three. Searching "tiktok ui", "tiktok mockup" or "tiktok ui overlay" returns Figma community files, PSDs and transparent PNGs you cannot ship, and a PNG cannot be tabbed into. This is a working React component in plain CSS and semantic HTML, so the heart, bookmark, follow badge and mute chip are real buttons with aria-label and aria-pressed. As a TikTok mockup generator it beats a screenshot because it redraws live at the platform\'s own pixel metrics and never ages; those metrics are pinned constants with no --tiktok-* knob, and no wordmark or logo ships with it.',
    },
    {
      q: 'Can I use this TikTok UI clone in Next.js?',
      a: "Yes. @zyncat/ui/tiktok ships compiled ESM with its 'use client' directive intact, so it drops into the Next.js App Router on React 19 with no transpilePackages config and zero runtime dependencies; link @zyncat/ui/styles.css once at the root for the motion tokens. The post markup is in the server-rendered HTML, which is the difference between this and embedding a TikTok video in HTML - an oEmbed iframe fetches from TikTok at runtime and you cannot restyle it.",
    },
  ],
};

export default seo;
