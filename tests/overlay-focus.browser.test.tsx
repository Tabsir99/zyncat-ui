import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@zyncat/ui/modal';
import { Dialog } from '@zyncat/ui/dialog';
import { Popover } from '@zyncat/ui/popover';
import { renderApp, settle } from './harness';

const PANEL_ID = 'surface-under-test';

function panel(): HTMLElement {
  return document.getElementById(PANEL_ID) as HTMLElement;
}

function button(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

describe('modal focus containment', () => {
  function ThreeControls() {
    return (
      <div>
        <button type="button">page control</button>
        <Modal defaultOpen id={PANEL_ID}>
          <div role="dialog" aria-label="surface">
            <button type="button">first</button>
            <button type="button">second</button>
            <button type="button">third</button>
          </div>
        </Modal>
      </div>
    );
  }

  test('focus lands on the first control inside the surface when it opens', async () => {
    renderApp(<ThreeControls />);
    await settle();

    expect(document.activeElement).toBe(button('first'));
  });

  test('Tab from the last control inside the surface wraps back to the first', async () => {
    const user = userEvent.setup();
    renderApp(<ThreeControls />);
    await settle();

    await user.tab();
    expect(document.activeElement).toBe(button('second'));
    await user.tab();
    expect(document.activeElement).toBe(button('third'));
    await user.tab();
    expect(document.activeElement).toBe(button('first'));
  });

  test('Shift+Tab from the first control inside the surface wraps to the last', async () => {
    const user = userEvent.setup();
    renderApp(<ThreeControls />);
    await settle();

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(button('third'));
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(button('second'));
  });

  test('a control on the page behind the surface cannot take focus while it is open', async () => {
    renderApp(<ThreeControls />);
    await settle();

    const behind = button('page control');
    behind.focus();

    expect(document.activeElement).not.toBe(behind);
    expect(panel().contains(document.activeElement)).toBe(true);
  });

  test('a surface with nothing focusable inside takes focus itself and keeps it on Tab', async () => {
    const user = userEvent.setup();
    renderApp(
      <div>
        <button type="button">page control</button>
        <Modal defaultOpen id={PANEL_ID}>
          <div role="dialog" aria-label="surface">
            nothing to focus in here
          </div>
        </Modal>
      </div>,
    );
    await settle();

    expect(document.activeElement).toBe(panel());

    await user.tab();
    expect(document.activeElement).toBe(panel());

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(panel());
  });

  test('the wrap point follows controls revealed inside the surface after it opened', async () => {
    const user = userEvent.setup();
    function Revealing() {
      const [shown, setShown] = useState(false);
      return (
        <Modal defaultOpen id={PANEL_ID}>
          <div role="dialog" aria-label="surface">
            <button type="button" onClick={() => setShown(true)}>
              reveal
            </button>
            {shown && <button type="button">revealed</button>}
          </div>
        </Modal>
      );
    }
    renderApp(<Revealing />);
    await settle();

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(button('reveal'));

    await user.click(button('reveal'));
    await user.tab({ shift: true });

    expect(document.activeElement).toBe(button('revealed'));
  });
});

describe('modal focus return', () => {
  test('focus returns to the trigger after Escape closes the surface', async () => {
    const user = userEvent.setup();
    renderApp(
      <Modal id={PANEL_ID} trigger={<button type="button">open</button>}>
        <div role="dialog" aria-label="surface">
          <button type="button">inside</button>
        </div>
      </Modal>,
    );
    const trigger = button('open');

    await user.click(trigger);
    await settle();
    expect(document.activeElement).toBe(button('inside'));

    await user.keyboard('{Escape}');
    await settle();

    expect(document.activeElement).toBe(trigger);
  });

  test('focus returns to the trigger after a dialog is closed with its close button', async () => {
    const user = userEvent.setup();
    renderApp(
      <Dialog trigger={<button type="button">open</button>} title="Settings">
        dialog body
      </Dialog>,
    );
    const trigger = button('open');

    await user.click(trigger);
    await settle();

    await user.click(button('Close dialog'));
    await settle();

    expect(document.activeElement).toBe(trigger);
  });

  test('a dialog opens with its close button focused', async () => {
    renderApp(
      <Dialog defaultOpen title="Settings">
        <button type="button">save</button>
      </Dialog>,
    );
    await settle();

    expect(document.activeElement).toBe(button('Close dialog'));
  });
});

describe('popover focus', () => {
  function PopoverPage() {
    return (
      <div>
        <button type="button">elsewhere</button>
        <Popover id={PANEL_ID} trigger={<button type="button">open</button>}>
          <button type="button">inside</button>
        </Popover>
      </div>
    );
  }

  test('opening a popover leaves focus on the trigger', async () => {
    const user = userEvent.setup();
    renderApp(<PopoverPage />);

    await user.click(button('open'));
    await settle();

    expect(screen.getByRole('button', { name: 'inside' })).toBeTruthy();
    expect(document.activeElement).toBe(button('open'));
  });

  test('a control outside an open popover can still take focus and the panel stays open', async () => {
    const user = userEvent.setup();
    renderApp(<PopoverPage />);

    await user.click(button('open'));
    await settle();

    const elsewhere = button('elsewhere');
    elsewhere.focus();

    expect(document.activeElement).toBe(elsewhere);
    expect(screen.getByRole('button', { name: 'inside' })).toBeTruthy();
  });

  test('focus returns to the trigger when the popover closes while a control inside it had focus', async () => {
    const user = userEvent.setup();
    renderApp(<PopoverPage />);

    await user.click(button('open'));
    await settle();
    button('inside').focus();
    expect(document.activeElement).toBe(button('inside'));

    await user.keyboard('{Escape}');
    await settle();

    expect(document.activeElement).toBe(button('open'));
  });
});
