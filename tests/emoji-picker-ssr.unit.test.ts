import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { EmojiPickerPanel, type EmojiPickerPanelProps, type GetEmojiUrl } from '@zyncat/ui/emoji-picker';

const getEmojiUrl: GetEmojiUrl = (hexId, source) => `/emoji/${source}/${hexId}.png`;

const panel = (props: Partial<EmojiPickerPanelProps>) =>
  renderToString(
    createElement(EmojiPickerPanel, {
      open: false,
      onOpenChange: () => {},
      onSelect: () => {},
      getEmojiUrl,
      trigger: createElement('button', { type: 'button' }, 'Add reaction'),
      ...props,
    }),
  );

describe('EmojiPicker on the server', () => {
  test('the trigger renders with its panel wiring and no document present', () => {
    const html = panel({});

    expect(html).toContain('Add reaction');
    expect(html).toContain('aria-haspopup');
    expect(html).toContain('aria-expanded="false"');
  });

  test('no grid is emitted on the server, even when the panel is open', () => {
    const html = panel({ open: true, search: true });

    expect(html).toContain('aria-expanded="true"');
    expect(html).not.toContain('data-overlay-root');
    expect(html).not.toContain('role="listbox"');
    expect(html).not.toContain('role="option"');
  });

  test('an anchored panel with no trigger renders nothing at all', () => {
    expect(panel({ open: true, trigger: null, query: 'cat' })).toBe('');
  });

  test('rendering never reaches for the emoji dataset', () => {
    expect(() => panel({ open: true, search: true, query: 'cat' })).not.toThrow();
  });
});
