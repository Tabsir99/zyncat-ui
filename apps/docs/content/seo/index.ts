import confetti from './confetti';
import facebookFeed from './facebook-feed';
import flowField from './flow-field';
import instagramFeed from './instagram-feed';
import lens from './lens';
import morphingText from './morphing-text';
import odometer from './odometer';
import type { PageSeo } from './types';
import typingLines from './typing-lines';
import weightField from './weight-field';

export const SEO: Record<string, PageSeo> = {
  confetti,
  'facebook-feed': facebookFeed,
  'flow-field': flowField,
  'instagram-feed': instagramFeed,
  lens,
  'morphing-text': morphingText,
  odometer,
  'typing-lines': typingLines,
  'weight-field': weightField,
};

export type { PageSeo, SeoFaq } from './types';
