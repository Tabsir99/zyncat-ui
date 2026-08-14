import { useRef, type ReactElement, type ReactNode } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@zyncat/ui/modal';
import { Dialog } from '@zyncat/ui/dialog';
import { Sheet } from '@zyncat/ui/sheet';
import { Popover } from '@zyncat/ui/popover';
import { renderApp, settle } from './harness';

const BODY = 'surface body';
const PANEL_ID = 'surface-under-test';

interface TriggerProps {
  trigger: ReactElement;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

type TriggerCase = (props: TriggerProps) => ReactElement;

const ModalCase: TriggerCase = ({ children, ...rest }) => (
  <Modal {...rest} id={PANEL_ID}>
    <div role="dialog" aria-label="surface">
      {children}
    </div>
  </Modal>
);

const DialogCase: TriggerCase = ({ children, ...rest }) => (
  <Dialog {...rest} id={PANEL_ID} title="surface">
    {children}
  </Dialog>
);

const SheetCase: TriggerCase = ({ children, ...rest }) => (
  <Sheet {...rest} id={PANEL_ID}>
    <div role="dialog" aria-label="surface">
      {children}
    </div>
  </Sheet>
);

const PopoverCase: TriggerCase = ({ children, ...rest }) => (
  <Popover {...rest} id={PANEL_ID}>
    {children}
  </Popover>
);

const EVERY_SURFACE = [
  { name: 'Modal', haspopup: 'dialog', Surface: ModalCase },
  { name: 'Dialog', haspopup: 'dialog', Surface: DialogCase },
  { name: 'Sheet', haspopup: 'dialog', Surface: SheetCase },
  { name: 'Popover', haspopup: 'true', Surface: PopoverCase },
];

function trigger(): HTMLElement {
  return screen.getByRole('button', { name: 'open' });
}

describe.each(EVERY_SURFACE)('$name trigger', ({ haspopup, Surface }) => {
  test('the trigger says what kind of surface it opens, whether it is open, and which element it controls', async () => {
    const user = userEvent.setup();
    renderApp(<Surface trigger={<button type="button">open</button>}>{BODY}</Surface>);

    expect(trigger().getAttribute('aria-haspopup')).toBe(haspopup);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().getAttribute('aria-controls'), 'the trigger pointed at a surface that is not there').toBeNull();

    await user.click(trigger());
    await settle();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(PANEL_ID);
    expect(document.getElementById(PANEL_ID)!.contains(screen.getByText(BODY))).toBe(true);

    await user.keyboard('{Escape}');
    await settle();

    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().getAttribute('aria-controls')).toBeNull();
  });

  test('clicking the trigger opens the surface and reports the change exactly once', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(
      <Surface trigger={<button type="button">open</button>} onOpenChange={onOpenChange}>
        {BODY}
      </Surface>,
    );
    expect(onOpenChange, 'the surface reported a change on mount').not.toHaveBeenCalled();

    await user.click(trigger());
    await settle();

    expect(screen.getByText(BODY)).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(true);
  });

  test("the consumer's own click handler on the trigger still runs", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderApp(
      <Surface
        trigger={
          <button type="button" onClick={onClick}>
            open
          </button>
        }
      >
        {BODY}
      </Surface>,
    );

    await user.click(trigger());
    await settle();

    expect(onClick, "the consumer's handler was replaced").toHaveBeenCalledTimes(1);
    expect(screen.getByText(BODY), 'the surface did not open').toBeTruthy();
  });

  test("the consumer's own ref on the trigger still receives the element", async () => {
    const seen: HTMLElement[] = [];
    function WithRefs() {
      return (
        <Surface
          trigger={
            <button
              type="button"
              ref={(node: HTMLButtonElement | null) => {
                if (node) seen.push(node);
              }}
            >
              open
            </button>
          }
        >
          {BODY}
        </Surface>
      );
    }
    renderApp(<WithRefs />);

    expect(seen.length, "the consumer's ref never fired").toBeGreaterThan(0);
    expect(seen[seen.length - 1]).toBe(trigger());
  });
});

describe('a trigger holding an object ref', () => {
  test('the consumer can still measure the trigger element', async () => {
    let measured = 0;
    function WithObjectRef() {
      const held = useRef<HTMLButtonElement>(null);
      return (
        <div>
          <Modal
            id={PANEL_ID}
            trigger={
              <button type="button" ref={held}>
                open
              </button>
            }
          >
            <div role="dialog" aria-label="surface">
              {BODY}
            </div>
          </Modal>
          <button type="button" onClick={() => (measured = held.current ? held.current.offsetWidth : -1)}>
            measure
          </button>
        </div>
      );
    }
    const user = userEvent.setup();
    renderApp(<WithObjectRef />);

    await user.click(screen.getByRole('button', { name: 'measure' }));

    expect(measured, 'the consumer object ref was never populated').toBeGreaterThan(0);
    expect(measured).toBe(trigger().offsetWidth);
  });
});
