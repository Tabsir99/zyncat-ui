import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Avatar Component',
  description:
    'A React avatar component: a photo, initials or a silhouette, with a deterministic color palette and an optional online or offline status dot.',
  keywords: [
    'avatar',
    'react avatar',
    'avatar component',
    'react avatar component',
    'avatar initials',
    'user avatar',
    'profile avatar',
    'avatar group',
  ],
  lede: 'A React avatar component - photo, initials or silhouette, with an optional presence dot. For profiles and lists.',
  faq: [
    {
      q: 'What does Avatar show when there is no image?',
      a: 'It falls back in order: your own icon node if you pass one, then initials computed from name, then a generic silhouette if neither is set. Passing src alone still falls back the same way if the image fails to load.',
    },
    {
      q: 'How are the initials and their background color picked?',
      a: 'initials takes the first letter of the first and last words in name (just the first letter alone at size="xs"), uppercased. The background comes from one of six palette slots - blue, violet, plum, rose, clay, moss - hashed deterministically from name, or pin it yourself with paletteIndex (1-6); with neither name nor paletteIndex, it renders neutral.',
    },
    {
      q: 'How do I show an online or away presence indicator?',
      a: 'Set status to "online", "away", "busy" or "offline" and a dot renders at the bottom-right corner, with role="img" and an aria-label matching the status. It is hidden by default.',
    },
    {
      q: 'How do I stack several avatars with a +N overflow?',
      a: 'Use AvatarGroup from @zyncat/ui/avatar-group - it clones each Avatar child to a uniform size, shows up to max of them (default 5), and renders the rest as a single "+N" chip.',
    },
  ],
};

export default seo;
