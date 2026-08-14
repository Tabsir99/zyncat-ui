import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { Select } from '@zyncat/ui/select';
import { MultiSelect } from '@zyncat/ui/multi-select';

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Select on the server', () => {
  test('a Select renders its trigger without a document present', () => {
    const html = renderToString(
      createElement(Select, { options: FRUITS, placeholder: 'Pick a fruit', ariaLabel: 'Fruit' }),
    );

    expect(html).toContain('Pick a fruit');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-expanded="false"');
  });

  test('a Select renders the selected label from its value on the server', () => {
    const html = renderToString(createElement(Select, { options: FRUITS, value: 'cherry', ariaLabel: 'Fruit' }));

    expect(html).toContain('Cherry');
  });

  test('a MultiSelect renders its trigger and summary without a document present', () => {
    const html = renderToString(
      createElement(MultiSelect, { options: FRUITS, defaultValue: ['apple', 'cherry'], ariaLabel: 'Fruit' }),
    );

    expect(html).toContain('Apple');
    expect(html.replace(/<!--.*?-->/g, '')).toContain('+1');
  });

  test('neither component emits its portalled menu on the server', () => {
    const html = renderToString(createElement(Select, { options: FRUITS, ariaLabel: 'Fruit' }));

    expect(html).not.toContain('data-overlay-root');
    expect(html).not.toContain('role="listbox"');
  });
});
