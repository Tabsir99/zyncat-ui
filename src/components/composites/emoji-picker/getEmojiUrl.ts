import type { GetEmojiUrl } from './types';

const TWEMOJI = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets';
const NOTO_ANIMATED = 'https://fonts.gstatic.com/s/e/notoemoji/latest';

export const getEmojiUrl: GetEmojiUrl = (hexId, source): string => {
  const lower = hexId.toLowerCase();
  switch (source) {
    case 'inline':
      return `${TWEMOJI}/svg/${lower}.svg`;
    case 'picker-grid':
      return `${TWEMOJI}/72x72/${lower}.png`;
    case 'category-bar':
    case 'callout-icon':
      return `${NOTO_ANIMATED}/${lower.replace(/-/g, '_')}/512.webp`;
  }
};
