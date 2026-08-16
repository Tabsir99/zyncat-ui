import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { Dropdown } from '@zyncat/ui/dropdown';
import { Button } from '@zyncat/ui/button';

const ITEMS = [
  { id: 'rename', label: 'Rename' },
  { id: 'move', label: 'Move to', items: [{ id: 'drafts', label: 'Drafts' }] },
];

describe('Dropdown on the server', () => {
  test('the trigger renders with its menu wiring and no document present', () => {
    const html = renderToString(
      createElement(Dropdown, { items: ITEMS, trigger: createElement(Button, null, 'Actions') }),
    );

    expect(html).toContain('Actions');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
  });

  test('no menu or submenu is emitted on the server', () => {
    const html = renderToString(
      createElement(Dropdown, { items: ITEMS, trigger: createElement(Button, null, 'Actions') }),
    );

    expect(html).not.toContain('data-overlay-root');
    expect(html).not.toContain('role="menu"');
  });

  test('an open Dropdown still renders no portal without a document', () => {
    const html = renderToString(
      createElement(Dropdown, { items: ITEMS, open: true, trigger: createElement(Button, null, 'Actions') }),
    );

    expect(html).toContain('aria-expanded="true"');
    expect(html).not.toContain('role="menuitem"');
  });
});
