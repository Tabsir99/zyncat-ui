'use client';

import { Collapse } from './Collapse';

export const ok = (
  <>
    <Collapse open animation={{ duration: 'fast', ease: 'exit' }} />
    <Collapse
      open
      animation={{ duration: { open: 'slower', close: 'fast' }, ease: { open: 'entrance', close: 'exit' } }}
    />
    <Collapse open animation={{ duration: { close: 'fast' } }} />
    <Collapse open animation={null} />
    <Collapse open className="x" htmlProps={{ 'aria-label': 'panel', 'data-open-state': 'yes', onClick: () => {} }} />
  </>
);

export const bad = (
  <>
    {/* @ts-expect-error - raw CSS strings must not type-check */}
    <Collapse open animation={{ duration: '200ms' }} />
    {/* @ts-expect-error - numbers must not type-check */}
    <Collapse open animation={{ duration: 200 }} />
    {/* @ts-expect-error - free-string eases must not type-check */}
    <Collapse open animation={{ ease: 'ease-in-out' }} />
    {/* @ts-expect-error - unknown directions must not type-check */}
    <Collapse open animation={{ duration: { enter: 'fast' } }} />
    {/* @ts-expect-error - raw DOM attributes must not type-check at the top level */}
    <Collapse open onClick={() => {}} />
  </>
);
