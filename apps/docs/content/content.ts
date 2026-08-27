// Per-slug static docs: a canonical usage example and the prop reference for
// each component. Read by registry.tsx and prerendered by PageView for SEO.
// One file per group, authored from each component's exported prop interface.
import { data } from './data';
import { datetime } from './datetime';
import { forms } from './forms';
import { overlays } from './overlays';
import { primitives } from './primitives';
import type { ComponentDoc } from './types';

export type { ComponentDoc } from './types';

export const CONTENT: Record<string, ComponentDoc> = { ...primitives, ...forms, ...data, ...datetime, ...overlays };
