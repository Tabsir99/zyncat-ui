import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@zyncat/ui/modal';
import { Sheet } from '@zyncat/ui/sheet';
import { renderApp, settle } from './harness';

function button(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

function PageModal({ open }: { open: boolean }) {
  return (
    <div>
      <button type="button">page control</button>
      <div data-testid="page-content" style={{ height: '300vh' }} />
      <Modal open={open} id="surface">
        <div role="dialog" aria-label="surface">
          <button type="button">inside</button>
        </div>
      </Modal>
    </div>
  );
}

describe('page-wide scroll lock', () => {
  test('the page stops scrolling while a surface is open and scrolls again once it closes', async () => {
    const view = renderApp(<PageModal open={false} />);
    expect(document.body.style.overflow).toBe('');

    view.rerender(<PageModal open />);
    await settle();
    expect(document.body.style.overflow, 'the page was not locked').toBe('hidden');

    view.rerender(<PageModal open={false} />);
    await settle();
    expect(document.body.style.overflow, 'the page was left locked').toBe('');
  });

  test('page content keeps its width when the scroll lock hides the page scrollbar', async () => {
    const view = renderApp(<PageModal open={false} />);
    const content = screen.getByTestId('page-content');
    const before = content.getBoundingClientRect().width;

    view.rerender(<PageModal open />);
    await settle();

    expect(content.getBoundingClientRect().width, 'the page jumped sideways when the surface opened').toBe(before);
  });

  test('the page behind the surface is inert while it is open and live again once it closes', async () => {
    const view = renderApp(<PageModal open={false} />);
    const control = button('page control');
    expect(control.closest('[inert]')).toBeNull();

    view.rerender(<PageModal open />);
    await settle();
    expect(control.closest('[inert]'), 'the page stayed interactive behind the surface').not.toBeNull();

    view.rerender(<PageModal open={false} />);
    await settle();
    expect(control.closest('[inert]'), 'the page was left inert').toBeNull();
  });

  test('the surface content is never inert', async () => {
    const view = renderApp(<PageModal open={false} />);

    view.rerender(<PageModal open />);
    await settle();

    expect(button('inside').closest('[inert]')).toBeNull();
  });
});

describe('nested scroll locks', () => {
  function TwoSurfaces({ modalOpen, sheetOpen }: { modalOpen: boolean; sheetOpen: boolean }) {
    return (
      <div>
        <button type="button">page control</button>
        <Modal open={modalOpen}>
          <div role="dialog" aria-label="modal">
            <p>modal body</p>
          </div>
        </Modal>
        <Sheet open={sheetOpen}>
          <div role="dialog" aria-label="sheet">
            <p>sheet body</p>
          </div>
        </Sheet>
      </div>
    );
  }

  test('the lock survives the first surface closing and lifts only when the last one does', async () => {
    const view = renderApp(<TwoSurfaces modalOpen={false} sheetOpen={false} />);

    view.rerender(<TwoSurfaces modalOpen sheetOpen />);
    await settle();
    expect(document.body.style.overflow).toBe('hidden');

    view.rerender(<TwoSurfaces modalOpen={false} sheetOpen />);
    await settle();
    expect(document.body.style.overflow, 'the page unlocked while a surface was still open').toBe('hidden');
    expect(button('page control').closest('[inert]'), 'the page went live under an open surface').not.toBeNull();

    view.rerender(<TwoSurfaces modalOpen={false} sheetOpen={false} />);
    await settle();
    expect(document.body.style.overflow).toBe('');
    expect(button('page control').closest('[inert]')).toBeNull();
  });
});

describe('a container-scoped surface', () => {
  const BOX_WIDTH = 300;

  function ScopedApp({ open, onPageClick }: { open: boolean; onPageClick?: () => void }) {
    const [box, setBox] = useState<HTMLElement | null>(null);
    return (
      <div>
        <style>{'.scoped-box::-webkit-scrollbar { width: 15px; }'}</style>
        <button type="button" onClick={onPageClick}>
          page control
        </button>
        <input aria-label="page field" />
        <div
          ref={setBox}
          className="scoped-box"
          style={{ position: 'relative', width: BOX_WIDTH, height: 160, overflow: 'auto' }}
        >
          <div data-testid="box-content" style={{ height: 400 }}>
            <button type="button">box control</button>
          </div>
          <Modal open={open} container={box} id="surface">
            <div role="dialog" aria-label="surface">
              <button type="button">inside</button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }

  function scopedBox(): HTMLElement {
    return document.querySelector('.scoped-box') as HTMLElement;
  }

  test('the lock, the inert page and the scrim all stop at the container edge', async () => {
    const view = renderApp(<ScopedApp open={false} />);

    view.rerender(<ScopedApp open />);
    await settle();

    const box = scopedBox();
    expect(box.contains(document.getElementById('surface')), 'the surface was not mounted in the container').toBe(true);
    expect(document.body.style.overflow, 'a scoped surface locked the whole page').toBe('');
    expect(box.style.overflow, 'the container was not locked').toBe('hidden');
    expect(button('box control').closest('[inert]'), 'content in the container stayed live').not.toBeNull();
    expect(button('page control').closest('[inert]'), 'a scoped surface made the whole page inert').toBeNull();
  });

  test('the rest of the page is still reachable by pointer while a scoped surface is open', async () => {
    const user = userEvent.setup();
    const onPageClick = vi.fn();
    const view = renderApp(<ScopedApp open={false} onPageClick={onPageClick} />);

    view.rerender(<ScopedApp open onPageClick={onPageClick} />);
    await settle();

    const control = button('page control');
    const box = control.getBoundingClientRect();
    const covering = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    expect(covering, 'the scoped scrim covered the rest of the page').toBe(control);

    await user.click(control);
    expect(onPageClick).toHaveBeenCalledTimes(1);
  });

  test.fails('a field outside a container-scoped surface can still be typed into', async () => {
    const user = userEvent.setup();
    const view = renderApp(<ScopedApp open={false} />);

    view.rerender(<ScopedApp open />);
    await settle();

    const field = screen.getByLabelText('page field') as HTMLInputElement;
    await user.click(field);
    await user.keyboard('hello');

    expect(document.activeElement, 'the scoped surface pulled focus out of the page').toBe(field);
    expect(field.value).toBe('hello');
  });

  test('the container keeps its content width when its own scrollbar is hidden', async () => {
    const view = renderApp(<ScopedApp open={false} />);
    const content = screen.getByTestId('box-content');
    const before = content.getBoundingClientRect().width;

    view.rerender(<ScopedApp open />);
    await settle();

    expect(content.getBoundingClientRect().width, 'the container content jumped sideways').toBe(before);
  });
});
