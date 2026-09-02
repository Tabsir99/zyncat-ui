import type { DataAttributes } from '../../../dom-props';

export type MenuHighlight = 'neutral' | 'accent';

export interface MenuHighlightProps {
  highlight?: MenuHighlight;
  rail?: boolean;
}

export function menuHighlightAttrs({ highlight, rail }: MenuHighlightProps): DataAttributes {
  return { 'data-highlight': highlight === 'accent' ? 'accent' : undefined, 'data-rail': rail ? 'true' : undefined };
}
