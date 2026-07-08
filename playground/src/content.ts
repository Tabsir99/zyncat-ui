// Per-slug static docs: a canonical usage example and the prop reference for
// each component. Read by registry.tsx and prerendered by PageView for SEO.
// One file per group, authored from each component's exported prop interface.
import type { ComponentDoc } from './content/types';
import { primitives } from './content/primitives';
import { forms } from './content/forms';
import { data } from './content/data';
import { datetime } from './content/datetime';
import { overlays } from './content/overlays';

export type { ComponentDoc } from './content/types';

export const CONTENT: Record<string, ComponentDoc> = { ...primitives, ...forms, ...data, ...datetime, ...overlays };
