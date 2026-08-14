import { describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { Select, type SelectOption } from '@zyncat/ui/select';
import { Modal } from '@zyncat/ui/modal';
import { renderApp, settle } from './harness';

const FRUITS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function trigger(): HTMLElement {
  return screen.getByRole('combobox');
}

function ModalWithSelect({ open }: { open?: boolean }) {
  return (
    <Modal open={open} defaultOpen={open === undefined ? true : undefined}>
      <div role="dialog" aria-label="Settings">
        <Select options={FRUITS} ariaLabel="Fruit" />
      </div>
    </Modal>
  );
}

async function openMenu(user: UserEvent): Promise<void> {
  await user.click(trigger());
  await settle();
}

describe('Select inside a Modal', () => {
  test('Escape closes the Select first and leaves the Modal open, then closes the Modal', async () => {
    const user = userEvent.setup();
    renderApp(<ModalWithSelect />);
    await settle();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();

    await openMenu(user);
    expect(screen.getByRole('listbox')).toBeTruthy();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByRole('listbox'), 'the Select stayed open').toBeNull();
    expect(screen.queryByRole('dialog'), 'the Modal closed on the same Escape').not.toBeNull();
    expect(document.activeElement).toBe(trigger());

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('the Select menu opens above the modal scrim and is not made inert by it', async () => {
    const user = userEvent.setup();
    renderApp(<ModalWithSelect />);
    await settle();
    await openMenu(user);

    const listbox = screen.getByRole('listbox');
    expect(listbox.closest('[inert]'), 'the menu was inerted by the modal').toBeNull();

    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    await settle();

    expect(trigger().textContent).toContain('Cherry');
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
  });

  test('the modal focus trap lets focus move into the Select menu and back to its trigger', async () => {
    const user = userEvent.setup();
    renderApp(<ModalWithSelect />);
    await settle();
    expect(document.activeElement).toBe(trigger());

    await openMenu(user);
    expect(document.activeElement).toBe(screen.getByRole('listbox'));

    await user.keyboard('{ArrowDown}{Enter}');
    await settle();

    expect(document.activeElement).toBe(trigger());
    expect(trigger().textContent).toContain('Banana');
  });

  test('closing the Modal while the Select menu is open tears both down and unlocks the page', async () => {
    const user = userEvent.setup();
    const view = renderApp(<ModalWithSelect open />);
    await settle();
    await openMenu(user);
    expect(screen.getByRole('listbox')).toBeTruthy();

    view.rerender(<ModalWithSelect open={false} />);
    await settle();

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(Array.from(document.body.children).some((child) => (child as HTMLElement).inert)).toBe(false);
  });
});

describe('Two Selects on one page', () => {
  test('opening the second Select closes the first, leaving exactly one menu', async () => {
    const user = userEvent.setup();
    renderApp(
      <>
        <Select options={FRUITS} ariaLabel="First" />
        <Select options={FRUITS} ariaLabel="Second" />
      </>,
    );

    const first = screen.getByRole('combobox', { name: 'First' });
    const second = screen.getByRole('combobox', { name: 'Second' });

    await user.click(first);
    await settle();
    expect(first.getAttribute('aria-expanded')).toBe('true');

    await user.click(second);
    await settle();

    expect(first.getAttribute('aria-expanded')).toBe('false');
    expect(second.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getAllByRole('listbox')).toHaveLength(1);
  });

  test('each Select commits into its own value', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    renderApp(
      <>
        <Select options={FRUITS} ariaLabel="First" onChange={(value) => calls.push('first:' + value)} />
        <Select options={FRUITS} ariaLabel="Second" onChange={(value) => calls.push('second:' + value)} />
      </>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Second' }));
    await settle();
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    await settle();

    expect(calls).toEqual(['second:cherry']);
    expect(screen.getByRole('combobox', { name: 'Second' }).textContent).toContain('Cherry');
    expect(screen.getByRole('combobox', { name: 'First' }).textContent).toContain('Select an option');
  });
});
