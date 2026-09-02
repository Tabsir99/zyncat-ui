import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'Facebook UI Clone - React News Feed Post',
  description:
    "A Facebook UI clone for React: the news feed post card, the reels stage and the story, pinned to Facebook's real pixel metrics. No Facebook API, no login.",
  keywords: ['facebook post generator', 'facebook post mockup', 'facebook ui', 'newsfeed ui', 'news feed ui'],
  lede: 'A React Facebook UI component - the news feed post, the reel and the story. For clones, mockups and references.',
  faq: [
    {
      q: 'How do I build a Facebook clone UI in React?',
      a: 'Import the component and pick a surface: <FacebookFeed surface="post" width="web" name="Alpenglow Daily" caption="Three days above the fog line" media={photo} likes={12400} />. surface takes post, reel or story, width takes mobile (the 390px square-cornered card) or web (the 680px rounded one), and ratio frames the media at 4:5, 1.1:1, 1:1, 3:4 or 16:9. It is the Facebook UI only, so you keep your own data layer and your own backend.',
    },
    {
      q: 'Does this Facebook news feed use the Facebook API or show real posts?',
      a: 'No. There is no Facebook API, no Graph API call, no login and no real posts - it replicates how the news feed looks and behaves, and nothing more. Every value on screen is a prop you pass: name, caption, stamp, avatar, media, likes, comments and shares, with counts rendered exact below 1,000 and then compacted to 1.2K, 48K or 1.4M the way Facebook does.',
    },
    {
      q: 'Which Facebook surfaces does the replica cover?',
      a: 'Three, behind one surface prop. post is the news feed card - caption above the media the way Facebook does it, the blurred saturated letterbox behind the frame, the like, comment and share bar, and the like/love reaction pips. reel is the reels stage at 557x878 around a 9:16 clip or 1601x886 around a 16:9 one, and story is a 486x864 stage with the segmented progress track that segments and segment drive.',
    },
    {
      q: 'Can I use it as a Facebook post mockup instead of a screenshot?',
      a: "Yes - a mockup is what a replica is for. It draws a live Facebook post card in the DOM at the platform's real metrics, so it stays sharp at any zoom and never ages out of date the way a PSD, a Figma frame or an old screenshot does. It is a React component rather than a fake-post image generator: nothing is submitted anywhere, and the content is whatever you pass in props.",
    },
    {
      q: 'What is actually interactive in the Facebook feed component?',
      a: 'Two toggles and one report. liked toggles the thumb on the feed card and the reels rail and adds one to the displayed reaction count, muted toggles the speaker on reels and stories, and both are controllable through liked/defaultLiked/onLikedChange and muted/defaultMuted/onMutedChange. Everything else is stateless and reports through onAction: comment, share, follow, menu, dismiss, more, search and play, each fired by a real button carrying an aria-label.',
    },
    {
      q: 'Can I use this Facebook UI clone in Next.js?',
      a: "Yes. @zyncat/ui/facebook-feed ships compiled ESM with its 'use client' directive intact, so it drops into the Next.js App Router with no transpilePackages config and zero runtime dependencies. media and avatar take a URL string or your own node, so next/image, a plain <img> or a <video> all work - nothing autoplays and no request is made for you. Being a replica, its metrics are pinned constants your theme cannot move; only the type reads --font-sans.",
    },
  ],
};

export default seo;
