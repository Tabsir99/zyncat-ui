import type { ReactElement, ReactNode } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@zyncat/ui/modal';
import { Dialog } from '@zyncat/ui/dialog';
import { Sheet } from '@zyncat/ui/sheet';
import { Popover } from '@zyncat/ui/popover';
import { renderApp, settle } from './harness';

const BODY = 'surface body';

interface SurfaceProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  dismissible?: boolean;
  children?: ReactNode;
}

type SurfaceCase = (props: SurfaceProps) => ReactElement;

const ModalCase: SurfaceCase = ({ children, ...rest }) => (
  <Modal {...rest}>
    <div role="dialog" aria-label="surface">
      {children}
    </div>
  </Modal>
);

const DialogCase: SurfaceCase = ({ children, ...rest }) => (
  <Dialog {...rest} title="surface">
    {children}
  </Dialog>
);

const SheetCase: SurfaceCase = ({ children, ...rest }) => (
  <Sheet {...rest}>
    <div role="dialog" aria-label="surface">
      {children}
    </div>
  </Sheet>
);

const PopoverCase: SurfaceCase = ({ children, ...rest }) => (
  <Popover {...rest} trigger={<button type="button">anchor</button>}>
    {children}
  </Popover>
);

const EVERY_SURFACE = [
  { name: 'Modal', Surface: ModalCase },
  { name: 'Dialog', Surface: DialogCase },
  { name: 'Sheet', Surface: SheetCase },
  { name: 'Popover', Surface: PopoverCase },
];

const SCRIM_BACKED = EVERY_SURFACE.slice(0, 3);

function emptyAreaOutsideThePanel(): HTMLElement {
  return document.elementFromPoint(4, 4) as HTMLElement;
}

describe.each(EVERY_SURFACE)('$name dismissal', ({ Surface }) => {
  test('Escape closes the surface and reports the change exactly once', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(
      <Surface defaultOpen onOpenChange={onOpenChange}>
        {BODY}
      </Surface>,
    );
    await settle();
    expect(screen.getByText(BODY)).toBeTruthy();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByText(BODY)).toBeNull();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(false);
  });

  test('Escape leaves a surface open and silent when dismissible is false', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(
      <Surface defaultOpen dismissible={false} onOpenChange={onOpenChange}>
        {BODY}
      </Surface>,
    );
    await settle();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.getByText(BODY)).toBeTruthy();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('a control inside the surface can swallow Escape by preventing the default', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(
      <Surface defaultOpen onOpenChange={onOpenChange}>
        <input
          aria-label="filter"
          onKeyDown={(event) => {
            if (event.key === 'Escape') event.preventDefault();
          }}
        />
      </Surface>,
    );
    await settle();
    await user.click(screen.getByLabelText('filter'));

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.getByLabelText('filter')).toBeTruthy();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('a controlled surface reports the dismissal but stays open until the consumer changes the prop', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const view = renderApp(
      <Surface open onOpenChange={onOpenChange}>
        {BODY}
      </Surface>,
    );
    await settle();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.getByText(BODY), 'a controlled surface closed itself').toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(false);

    view.rerender(
      <Surface open={false} onOpenChange={onOpenChange}>
        {BODY}
      </Surface>,
    );
    await settle();

    expect(screen.queryByText(BODY)).toBeNull();
    expect(onOpenChange, 'a consumer-driven prop change fired the callback again').toHaveBeenCalledTimes(1);
  });
});

describe.each(SCRIM_BACKED)('$name scrim dismissal', ({ Surface }) => {
  function openSurface(onOpenChange: (open: boolean) => void, dismissible = true) {
    renderApp(
      <Surface defaultOpen dismissible={dismissible} onOpenChange={onOpenChange}>
        <button type="button">action</button>
      </Surface>,
    );
  }

  test('clicking the empty area outside the panel closes the surface', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    openSurface(onOpenChange);
    await settle();

    await user.click(emptyAreaOutsideThePanel());
    await settle();

    expect(screen.queryByRole('button', { name: 'action' })).toBeNull();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(false);
  });

  test('clicking a control inside the panel keeps the surface open', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    openSurface(onOpenChange);
    await settle();

    await user.click(screen.getByRole('button', { name: 'action' }));
    await settle();

    expect(screen.getByRole('button', { name: 'action' })).toBeTruthy();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('a drag that starts inside the panel and ends outside it does not close the surface', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    openSurface(onOpenChange);
    await settle();

    await user.pointer([
      { target: screen.getByRole('button', { name: 'action' }), keys: '[MouseLeft>]' },
      { target: emptyAreaOutsideThePanel() },
      { keys: '[/MouseLeft]' },
    ]);
    await settle();

    expect(screen.getByRole('button', { name: 'action' })).toBeTruthy();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('the empty area outside the panel does not dismiss when dismissible is false', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    openSurface(onOpenChange, false);
    await settle();

    await user.click(emptyAreaOutsideThePanel());
    await settle();

    expect(screen.getByRole('button', { name: 'action' })).toBeTruthy();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe('Popover outside dismissal', () => {
  function renderPopover(onOpenChange: (open: boolean) => void, dismissible = true) {
    return renderApp(
      <div>
        <button type="button">elsewhere</button>
        <PopoverCase defaultOpen dismissible={dismissible} onOpenChange={onOpenChange}>
          <button type="button">action</button>
        </PopoverCase>
      </div>,
    );
  }

  test('pressing something outside the panel closes the popover', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderPopover(onOpenChange);
    await settle();

    await user.click(screen.getByRole('button', { name: 'elsewhere' }));
    await settle();

    expect(screen.queryByRole('button', { name: 'action' })).toBeNull();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(false);
  });

  test('pressing something outside does nothing when dismissible is false', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderPopover(onOpenChange, false);
    await settle();

    await user.click(screen.getByRole('button', { name: 'elsewhere' }));
    await settle();

    expect(screen.getByRole('button', { name: 'action' })).toBeTruthy();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('pressing the trigger again closes the popover exactly once', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderPopover(onOpenChange);
    await settle();

    await user.click(screen.getByRole('button', { name: 'anchor' }));
    await settle();

    expect(screen.queryByRole('button', { name: 'action' })).toBeNull();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(false);
  });
});

describe('Dialog close button', () => {
  test('the close button dismisses the dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(
      <Dialog defaultOpen title="Settings" onOpenChange={onOpenChange}>
        {BODY}
      </Dialog>,
    );
    await settle();

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    await settle();

    expect(screen.queryByText(BODY)).toBeNull();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(false);
  });

  test('no close button is offered when the dialog is not dismissible', async () => {
    renderApp(
      <Dialog defaultOpen dismissible={false} title="Settings">
        {BODY}
      </Dialog>,
    );
    await settle();

    expect(screen.getByText(BODY)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Close dialog' })).toBeNull();
  });
});

describe('Sheet drag dismissal', () => {
  const PANEL_ID = 'sheet-under-test';
  const PANEL_WIDTH = 200;

  function renderSheet(onOpenChange: (open: boolean) => void, dismissible = true) {
    renderApp(
      <Sheet defaultOpen id={PANEL_ID} dismissible={dismissible} onOpenChange={onOpenChange}>
        <div role="dialog" aria-label="surface" style={{ width: PANEL_WIDTH }}>
          {BODY}
        </div>
      </Sheet>,
    );
  }

  async function dragPanelRight(distance: number) {
    const panel = document.getElementById(PANEL_ID) as HTMLElement;
    const box = panel.getBoundingClientRect();
    const x = Math.round(box.left + 10);
    const y = Math.round(box.top + 10);
    const move = (clientX: number) =>
      window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX, clientY: y }));

    await act(async () => {
      panel.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1, clientX: x, clientY: y }),
      );
      move(x + 8);
      move(x + distance);
      window.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, pointerId: 1, clientX: x + distance, clientY: y }),
      );
    });
  }

  test('dragging the sheet towards its docked edge past the threshold dismisses it', async () => {
    const onOpenChange = vi.fn();
    renderSheet(onOpenChange);
    await settle();

    await dragPanelRight(PANEL_WIDTH);
    await settle();

    expect(screen.queryByText(BODY)).toBeNull();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(false);
  });

  test('the same drag does nothing when the sheet is not dismissible', async () => {
    const onOpenChange = vi.fn();
    renderSheet(onOpenChange, false);
    await settle();

    await dragPanelRight(PANEL_WIDTH);
    await settle();

    expect(screen.getByText(BODY)).toBeTruthy();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
