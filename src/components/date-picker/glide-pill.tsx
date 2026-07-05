'use client';

/* Date-picker glide entry point. The mechanism lives in ../motion/glide (shared, CSS-free);
   this module just pulls in date-picker.css so the .dp__glide cell styling ships with it. */

import './date-picker.css';

export { useGlide, GlidePill } from '../motion/glide';
export type { GlideRect, GlideApi, GlidePillProps } from '../motion/glide';
