import { data } from './data';
import { datetime } from './datetime';
import { forms } from './forms';
import { overlays } from './overlays';
import { primitives } from './primitives';
import type { ComponentDoc } from './types';

export type { ComponentDoc } from './types';

export const CONTENT: Record<string, ComponentDoc> = { ...primitives, ...forms, ...data, ...datetime, ...overlays };
