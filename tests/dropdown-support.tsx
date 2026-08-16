import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import type { DropdownGroup, DropdownItem } from '@zyncat/ui/dropdown';
import { settle } from './harness';

export const ACTIONS: DropdownItem[] = [
  { id: 'rename', label: 'Rename', shortcut: 'R' },
  { id: 'duplicate', label: 'Duplicate', disabled: true },
  {
    id: 'move',
    label: 'Move to',
    items: [
      { id: 'drafts', label: 'Drafts' },
      { id: 'archive', label: 'Archive', items: [{ id: 'q1', label: 'Q1' }] },
    ],
  },
  { id: 'delete', label: 'Delete', danger: true },
];

export const SECTIONS: DropdownGroup[] = [
  { label: 'Edit', items: [{ id: 'rename', label: 'Rename' }] },
  { label: 'Danger zone', items: [{ id: 'delete', label: 'Delete', danger: true }] },
];

export function trigger(name = 'Actions'): HTMLElement {
  return screen.getByRole('button', { name });
}

export function isOpen(name?: string): boolean {
  return trigger(name).getAttribute('aria-expanded') === 'true';
}

export function menus(): HTMLElement[] {
  return screen.queryAllByRole('menu');
}

export function item(name: string): HTMLElement {
  return screen.getByRole('menuitem', { name });
}

export async function openMenu(user: UserEvent, name?: string): Promise<void> {
  await user.click(trigger(name));
  await settle();
}
