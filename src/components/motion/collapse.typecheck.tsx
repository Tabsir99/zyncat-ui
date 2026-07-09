// Type-contract check for the Collapse timing API, enforced by `pnpm typecheck`:
// motion tokens (single or per-direction) compile; raw CSS values must not.
// Never imported at runtime - it exists only to fail the build on contract drift.

import { Collapse } from './Collapse';

export const ok = (
  <>
    <Collapse open duration="fast" ease="exit" />
    <Collapse open duration={{ open: 'slow', close: 'fast' }} ease={{ open: 'entrance', close: 'exit' }} />
    <Collapse open duration={{ close: 'fast' }} />
  </>
);

export const bad = (
  <>
    {/* @ts-expect-error - raw CSS strings must not type-check */}
    <Collapse open duration="200ms" />
    {/* @ts-expect-error - numbers must not type-check */}
    <Collapse open duration={200} />
    {/* @ts-expect-error - free-string eases must not type-check */}
    <Collapse open ease="ease-in-out" />
    {/* @ts-expect-error - unknown directions must not type-check */}
    <Collapse open duration={{ enter: 'fast' }} />
  </>
);
