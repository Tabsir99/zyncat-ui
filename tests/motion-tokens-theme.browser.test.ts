import { expect, test } from 'vitest';

const root = document.documentElement;
const rootFontSize = () => parseFloat(getComputedStyle(root).fontSize);

test('a theme retunes travel and rest scale through the custom properties', async () => {
  root.style.setProperty('--distance-md', '3rem');
  root.style.setProperty('--scale-floating', '0.5');

  const { UIMotion } = await import('@zyncat/ui/motion-tokens');

  expect(UIMotion.dist.md, 'the distance override was ignored').toBe(rootFontSize() * 3);
  expect(UIMotion.scale.floating, 'the scale override was ignored').toBe(0.5);
});
