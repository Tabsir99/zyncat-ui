// Deferred Motion feature bundle. Loaded async by <LazyMotion> so the engine
// (layout projection + drag + gestures) lands in its own chunk, off the initial
// path. domMax — not domAnimation — because the DS uses layoutId + drag.
import { domMax } from 'motion/react';

export default domMax;
