import { expect, test } from 'vitest';
import { UIMotion } from '@zyncat/ui/motion-tokens';

const rootFontSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

test('the shipped space tokens arrive as pixels and ratios, not as raw rem', () => {
  expect(UIMotion.dist.sm, 'a rem distance reached the engine unconverted').toBe(rootFontSize() * 0.5);
  expect(UIMotion.dist.md, 'a rem distance reached the engine unconverted').toBe(rootFontSize());
  expect(UIMotion.dist.lg, 'a rem distance reached the engine unconverted').toBe(rootFontSize() * 1.5);

  expect(UIMotion.scale.panel).toBe(0.98);
  expect(UIMotion.scale.floating).toBe(0.96);
  expect(UIMotion.scale.chip).toBe(0.9);
});
