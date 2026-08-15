import { act, screen, waitFor, type RenderResult } from '@testing-library/react';
import { expect } from 'vitest';
import { Toaster, type ToasterProps } from '@zyncat/ui/toast';
import { toast } from '@zyncat/ui/toast-store';
import { nextFrame, renderApp, settle } from './harness';

export const NEVER = Number.POSITIVE_INFINITY;

export function stackOrNull(): HTMLElement | null {
  return screen.queryByRole('list', { name: 'Notifications' });
}

export function stack(): HTMLElement {
  return screen.getByRole('list', { name: 'Notifications' });
}

export function cards(): HTMLElement[] {
  const region = stackOrNull();
  return region ? Array.from(region.querySelectorAll<HTMLElement>('[role="status"],[role="alert"]')) : [];
}

export function strayCards(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('[role="status"],[role="alert"]'));
}

export function messages(): string[] {
  return cards().map((card) => card.textContent ?? '');
}

export function onStack(): string[] {
  return cards()
    .filter((card) => getComputedStyle(card).opacity !== '0')
    .map((card) => card.textContent ?? '');
}

export function bottoms(): number[] {
  return cards().map((card) => card.getBoundingClientRect().bottom);
}

export async function mountToaster(props: ToasterProps = {}): Promise<RenderResult> {
  const view = renderApp(<Toaster {...props} />);
  await settle();
  return view;
}

export async function fire(run: () => void): Promise<void> {
  await act(async () => {
    run();
  });
}

export async function frames(count = 2): Promise<void> {
  await act(async () => {
    for (let i = 0; i < count; i += 1) await nextFrame();
  });
}

export async function wait(ms: number): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}

export async function untilGone(text: string, timeout = 5000): Promise<void> {
  await waitFor(
    () => {
      expect(screen.queryByText(text)).toBeNull();
    },
    { timeout },
  );
}

export function clearToasts(): void {
  toast.dismiss();
}

export const DETACHED_COMMIT = 'commitStyles';

export function muteDetachedAnimationCommit(): void {
  window.addEventListener('unhandledrejection', (event) => {
    if (String(event.reason).includes(DETACHED_COMMIT)) event.preventDefault();
  });
}
