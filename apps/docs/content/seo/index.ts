import confetti from './confetti';
import facebookFeed from './facebook-feed';
import flowField from './flow-field';
import instagramFeed from './instagram-feed';
import installation from './installation';
import introduction from './introduction';
import lens from './lens';
import morphingText from './morphing-text';
import odometer from './odometer';
import theming from './theming';
import tiktok from './tiktok';
import type { PageSeo } from './types';
import typingLines from './typing-lines';
import weightField from './weight-field';
import youtube from './youtube';

export const SEO: Record<string, PageSeo> = {
  confetti,
  'facebook-feed': facebookFeed,
  'flow-field': flowField,
  installation,
  'instagram-feed': instagramFeed,
  introduction,
  lens,
  'morphing-text': morphingText,
  odometer,
  theming,
  tiktok,
  'typing-lines': typingLines,
  'weight-field': weightField,
  youtube,
};

export type { PageSeo, SeoFaq } from './types';
