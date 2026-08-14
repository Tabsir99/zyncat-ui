import {
  StrictMode,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { act, render, type RenderOptions, type RenderResult } from '@testing-library/react';

export type Phase = 'callback-ref' | 'layout-effect' | 'effect';

export interface Sighting {
  phase: Phase;
  connected: boolean;
  height: number;
  width: number;
  tokens: Record<string, string>;
}

export interface Ledger {
  sightings: Sighting[];
  commits: number;
}

export const TOKENS_READ = ['--duration-base', '--ease-entrance'] as const;

export function ledger(): Ledger {
  return { sightings: [], commits: 0 };
}

function look(el: HTMLElement, phase: Phase): Sighting {
  const style = getComputedStyle(el);
  const tokens: Record<string, string> = {};
  for (const name of TOKENS_READ) tokens[name] = style.getPropertyValue(name).trim();
  return { phase, connected: el.isConnected, height: el.offsetHeight, width: el.offsetWidth, tokens };
}

export function Probe({ on, children }: { on: Ledger; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  on.commits += 1;

  useLayoutEffect(() => {
    if (ref.current) on.sightings.push(look(ref.current, 'layout-effect'));
  }, []);

  useEffect(() => {
    if (ref.current) on.sightings.push(look(ref.current, 'effect'));
  }, []);

  return (
    <div
      data-probe=""
      ref={(el) => {
        ref.current = el;
        if (el) on.sightings.push(look(el, 'callback-ref'));
      }}
    >
      {children}
    </div>
  );
}

export function useOpenProbe(open: boolean, ref: RefObject<HTMLElement | null>, on: Ledger) {
  useEffect(() => {
    if (!open) return;
    on.sightings.push(ref.current ? look(ref.current, 'effect') : missing('effect'));
  }, [open, ref, on]);
}

function missing(phase: Phase): Sighting {
  return { phase, connected: false, height: -1, width: -1, tokens: {} };
}

export function firstSighting(on: Ledger, phase: Phase): Sighting | undefined {
  return on.sightings.find((s) => s.phase === phase);
}

function StrictWrapper({ children }: { children: ReactNode }): ReactElement {
  return <StrictMode>{children}</StrictMode>;
}

export function renderApp(ui: ReactElement, options?: RenderOptions): RenderResult {
  return render(ui, { wrapper: StrictWrapper, ...options });
}

export function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function terminating(animation: Animation): boolean {
  const timing = animation.effect?.getComputedTiming();
  return !!timing && timing.iterations !== Infinity && timing.endTime !== Infinity;
}

export function endlessAnimations(): Animation[] {
  return document.getAnimations().filter((a) => !terminating(a));
}

export async function settle(): Promise<void> {
  await act(async () => {
    await nextFrame();
    await Promise.allSettled(
      document
        .getAnimations()
        .filter(terminating)
        .map((a) => a.finished),
    );
    await nextFrame();
    await nextFrame();
  });
}

export async function finishAnimations(): Promise<void> {
  await act(async () => {
    for (const animation of document.getAnimations().filter(terminating)) animation.finish();
  });
  await settle();
}

export function overlayRoots(): HTMLElement[] {
  return Array.from(document.querySelectorAll('[data-overlay-root]'));
}
