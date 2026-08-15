import type { Mock } from 'vitest';
import { screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { TOKENS_READ, settle, type Phase, type Sighting } from './harness';

export const lastReported = (fn: Mock): unknown => fn.mock.lastCall?.[0];

export const YEAR = new Date().getFullYear();

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const pad2 = (n: number): string => String(n).padStart(2, '0');

export const isoDate = (month: number, dayOfMonth: number, year: number = YEAR): string =>
  `${year}-${pad2(month)}-${pad2(dayOfMonth)}`;

export const dayName = (month: number, dayOfMonth: number, year: number = YEAR): string =>
  `${MONTH_NAMES[month - 1]} ${dayOfMonth}, ${year}`;

export const monthName = (month: number, year: number = YEAR): string => `${MONTH_NAMES[month - 1]} ${year}`;

export const shortDate = (month: number, dayOfMonth: number, year?: number): string =>
  `${MONTH_NAMES[month - 1].slice(0, 3)} ${pad2(dayOfMonth)}` + (year === undefined ? '' : `, ${year}`);

export const todayParts = (): { month: number; dayOfMonth: number; year: number } => {
  const now = new Date();
  return { month: now.getMonth() + 1, dayOfMonth: now.getDate(), year: now.getFullYear() };
};

export const fieldTrigger = (name: string): HTMLButtonElement =>
  screen.getByRole('button', { name }) as HTMLButtonElement;

export async function openPicker(user: UserEvent, triggerName: string): Promise<void> {
  await user.click(fieldTrigger(triggerName));
  await settle();
}

export const calendar = (): HTMLElement => screen.getByRole('grid', { name: 'Calendar' });

export const monthGrid = (name: string): HTMLElement => screen.getByRole('grid', { name });

export const dayCells = (grid: HTMLElement): HTMLButtonElement[] =>
  within(grid).getAllByRole('gridcell') as HTMLButtonElement[];

export const dayCell = (grid: HTMLElement, name: string): HTMLButtonElement =>
  within(grid).getByRole('gridcell', { name }) as HTMLButtonElement;

export const dayNames = (grid: HTMLElement): string[] =>
  dayCells(grid).map((cell) => cell.getAttribute('aria-label') ?? '');

export const focusedName = (): string | null => document.activeElement?.getAttribute('aria-label') ?? null;

export const tabbableDays = (grid: HTMLElement): HTMLButtonElement[] =>
  dayCells(grid).filter((cell) => cell.tabIndex === 0);

export function inspect(el: HTMLElement, phase: Phase): Sighting {
  const style = getComputedStyle(el);
  const tokens: Record<string, string> = {};
  for (const name of TOKENS_READ) tokens[name] = style.getPropertyValue(name).trim();
  return { phase, connected: el.isConnected, height: el.offsetHeight, width: el.offsetWidth, tokens };
}

export function unreachable(phase: Phase): Sighting {
  return { phase, connected: false, height: -1, width: -1, tokens: {} };
}
