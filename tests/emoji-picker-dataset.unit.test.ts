import { describe, expect, test, vi } from 'vitest';
import { loadEmojiData, onEmojiDataLoaded, type EmojiData } from '@zyncat/ui/emoji-picker';

const DATA: EmojiData = {
  emojis: {
    '1F431': {
      id: '1F431',
      name: 'cat face',
      unicode: '[cat face]',
      tags: ['animal'],
      skins: [{ unified: '1F431', native: '[cat face]' }],
      group: 0,
      shortcodes: ['cat'],
    },
  },
  categories: [{ id: 'animals-nature', icon: '1F431', emojis: ['1F431'] }],
};

describe('EmojiPicker dataset notifications', () => {
  test('a waiting listener fires when the data lands, and a late one fires at once', async () => {
    const waiting = vi.fn();
    const cancelled = vi.fn();
    const stopCancelled = onEmojiDataLoaded(cancelled);

    onEmojiDataLoaded(waiting);
    stopCancelled();
    expect(waiting, 'nothing has been loaded yet').not.toHaveBeenCalled();

    await loadEmojiData(DATA);

    expect(waiting).toHaveBeenCalledTimes(1);
    expect(cancelled, 'an unsubscribed listener stays quiet').not.toHaveBeenCalled();

    const late = vi.fn();
    onEmojiDataLoaded(late);

    expect(late, 'the data is already there').toHaveBeenCalledTimes(1);
  });
});
