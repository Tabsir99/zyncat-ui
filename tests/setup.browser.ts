import '../src/styles.css';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  cleanup();
  for (const animation of document.getAnimations()) animation.cancel();
  for (const host of Array.from(document.querySelectorAll('[data-overlay-root]'))) host.remove();
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  for (const child of Array.from(document.body.children) as HTMLElement[]) child.inert = false;
});
