// Per-slug static docs: a canonical usage example and the prop reference for
// each component. Read by registry.tsx and prerendered by PageView for SEO.
// Authored from each component's exported prop interface in ../src.
import type { PropRow } from './PropsTable';

export interface ComponentDoc {
  example: string;
  props: PropRow[];
}

export const CONTENT: Record<string, ComponentDoc> = {};
