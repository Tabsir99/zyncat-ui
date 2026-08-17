import { useEffect, useRef } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from '@zyncat/ui/dialog';
import { Button } from '@zyncat/ui/button';
import { EmojiPickerPanel, type EmojiPickerHandle } from '@zyncat/ui/emoji-picker';
import type { VirtualAnchor } from '@zyncat/ui/popover';
import { overlayRoots, renderApp, settle } from './harness';
import {
  CATEGORY_TITLES,
  POPOVER,
  Picker,
  SHEET,
  TILE_COUNT,
  emojiUrl,
  gridReady,
  groupNames,
  installEmojiData,
  listbox,
  openPanel,
  option,
  optionNames,
  options,
  searchField,
  triggerButton,
} from './emoji-picker-support';

beforeEach(installEmojiData);

const anchorAt = (top: number): VirtualAnchor => ({ getBoundingClientRect: () => new DOMRect(24, top, 120, 24) });

const verticalGap = (panel: DOMRect, anchor: DOMRect): number =>
  panel.top >= anchor.bottom ? panel.top - anchor.bottom : anchor.top - panel.bottom;

const popoverPanel = (): HTMLElement => {
  const id = triggerButton().getAttribute('aria-controls');
  const panel = id ? document.getElementById(id) : null;
  if (!panel) throw new Error('the trigger points at no panel');
  return panel;
};

describe('EmojiPicker panel', () => {
  test('nothing is rendered until the panel is open', async () => {
    const onOpenChange = vi.fn();
    renderApp(<Picker defaultOpen={false} onOpenChange={onOpenChange} />);
    await settle();

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(options()).toHaveLength(0);
    expect(onOpenChange, 'no callback on mount').not.toHaveBeenCalled();
  });

  test('the trigger opens the panel and reports the change once', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(<Picker defaultOpen={false} onOpenChange={onOpenChange} />);

    await openPanel(user);

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(listbox()).toBeTruthy();
  });

  test('a panel told to stay shut never opens itself', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(
      <EmojiPickerPanel
        open={false}
        onOpenChange={onOpenChange}
        onSelect={() => {}}
        getEmojiUrl={emojiUrl}
        breakpoint={POPOVER}
        trigger={<Button>Add reaction</Button>}
      />,
    );

    await user.click(triggerButton());
    await settle();

    expect(onOpenChange.mock.calls.map(([next]) => next)).toEqual([true]);
    expect(screen.queryByRole('listbox'), 'the consumer never changed open').toBeNull();
  });

  test('Escape and an outside press each ask to close exactly once', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(
      <div>
        <Picker defaultOpen={false} onOpenChange={onOpenChange} search />
        <button type="button">Elsewhere</button>
      </div>,
    );

    await openPanel(user);
    await user.keyboard('{Escape}');
    await settle();

    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('listbox')).toBeNull();

    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
    await settle();

    expect(onOpenChange).toHaveBeenCalledTimes(4);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  test('an open panel shows every category and every emoji in the data', async () => {
    renderApp(<Picker />);
    await gridReady();

    expect(groupNames()).toEqual(CATEGORY_TITLES);
    expect(options()).toHaveLength(TILE_COUNT);
    expect(optionNames()[0]).toBe('grinning face');
  });

  test('getEmojiUrl builds each tile image at the picker-grid call site', async () => {
    const getEmojiUrl = vi.fn(emojiUrl);
    renderApp(<Picker getEmojiUrl={getEmojiUrl} />);
    await gridReady();

    expect(getEmojiUrl).toHaveBeenCalledWith('1F431', 'picker-grid');
    expect(option('cat face').querySelector('img')?.getAttribute('src')).toBe(emojiUrl('1F431', 'picker-grid'));
  });

  test('className is merged onto the panel frame around the grid', async () => {
    renderApp(<Picker className="reaction-picker" />);
    await gridReady();

    const frame = document.querySelector('.reaction-picker');
    expect(frame, 'the consumer class must survive').toBeTruthy();
    expect(frame!.contains(listbox())).toBe(true);
  });

  test('popoverProps reach the popover underneath', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(<Picker onOpenChange={onOpenChange} popoverProps={{ dismissible: false }} />);
    await gridReady();

    await user.keyboard('{Escape}');
    await settle();

    expect(onOpenChange, 'dismissible false must reach the Popover').not.toHaveBeenCalled();
    expect(listbox()).toBeTruthy();
  });

  test('offset lifts the panel off its anchor by that many pixels', async () => {
    const anchor = anchorAt(24);
    const view = renderApp(<Picker popoverProps={{ anchor, side: 'bottom', align: 'start' }} />);
    await gridReady();

    const flush = popoverPanel().getBoundingClientRect();
    expect(Math.round(verticalGap(flush, anchor.getBoundingClientRect()))).toBe(0);

    view.rerender(<Picker popoverProps={{ anchor, side: 'bottom', align: 'start' }} offset={10} />);
    await settle();

    const lifted = popoverPanel().getBoundingClientRect();
    expect(Math.round(verticalGap(lifted, anchor.getBoundingClientRect()))).toBe(10);
  });

  test('below the breakpoint the panel docks as a sheet with its own search field', async () => {
    renderApp(<Picker breakpoint={SHEET} />);
    await gridReady();

    expect(screen.getByRole('dialog', { name: 'Emoji picker' })).toBeTruthy();
    expect(searchField(), 'sheet mode always renders the field').toBeTruthy();
    expect(groupNames()).toEqual(CATEGORY_TITLES);
  });

  test('above the breakpoint the panel is a popover with no dialog and no field of its own', async () => {
    renderApp(<Picker breakpoint={POPOVER} />);
    await gridReady();

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  test('sheetProps reach the sheet underneath', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderApp(<Picker breakpoint={SHEET} onOpenChange={onOpenChange} sheetProps={{ dismissible: false }} />);
    await gridReady();

    await user.keyboard('{Escape}');
    await settle();

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Emoji picker' })).toBeTruthy();
  });

  test('the grid is already live when an effect keyed on open first runs', async () => {
    const seen: string[][] = [];

    function Consumer({ open }: { open: boolean }) {
      const handle = useRef<EmojiPickerHandle>(null);
      useEffect(() => {
        if (!open) return;
        handle.current?.renderFiltered('cat');
        seen.push(optionNames());
      }, [open]);

      return (
        <EmojiPickerPanel
          ref={handle}
          open={open}
          onOpenChange={() => {}}
          onSelect={() => {}}
          getEmojiUrl={emojiUrl}
          breakpoint={POPOVER}
          trigger={<Button>Add reaction</Button>}
        />
      );
    }

    const view = renderApp(<Consumer open={false} />);
    view.rerender(<Consumer open />);
    await settle();

    expect(seen[0], 'the [open] effect never ran').toBeDefined();
    expect(seen[0]).toEqual(['cat face', 'black cat']);
  });

  test('opening moves focus into the search field', async () => {
    const user = userEvent.setup();
    renderApp(<Picker defaultOpen={false} search />);

    await openPanel(user);

    expect(document.activeElement).toBe(searchField());
  });

  test('closing a panel with no field of its own hands focus back to the trigger', async () => {
    const user = userEvent.setup();
    renderApp(<Picker defaultOpen={false} />);

    await openPanel(user);
    await user.keyboard('{Escape}');
    await settle();

    expect(document.activeElement).toBe(triggerButton());
  });

  test('closing a panel that owns its search field hands focus back to the trigger', async () => {
    const user = userEvent.setup();
    renderApp(<Picker defaultOpen={false} search />);

    await openPanel(user);
    expect(document.activeElement).toBe(searchField());

    await user.keyboard('{Escape}');
    await settle();

    expect(document.activeElement).toBe(triggerButton());
  });

  test('closing takes the grid with it and leaves the page clean', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp(<Picker defaultOpen={false} search />);

    await openPanel(user);
    await gridReady();
    expect(overlayRoots().length).toBeGreaterThan(0);

    await user.keyboard('{Escape}');
    await settle();

    expect(options()).toHaveLength(0);
    expect(screen.queryByRole('listbox')).toBeNull();

    unmount();
    await settle();
    expect(overlayRoots()).toHaveLength(0);
  });

  test('unmounting while the grid is still filling in tears the portal down', async () => {
    const { unmount } = renderApp(<Picker />);

    unmount();
    await settle();

    expect(overlayRoots()).toHaveLength(0);
    expect(options()).toHaveLength(0);
  });

  test('rapid toggling settles on the final state with one grid', async () => {
    const user = userEvent.setup();
    renderApp(<Picker defaultOpen={false} />);

    for (let i = 0; i < 5; i++) await user.click(triggerButton());
    await settle();
    await gridReady();

    expect(screen.getAllByRole('listbox')).toHaveLength(1);
    expect(options()).toHaveLength(TILE_COUNT);
  });

  test('reopening rebuilds the grid from scratch', async () => {
    const user = userEvent.setup();
    renderApp(<Picker defaultOpen={false} />);

    await openPanel(user);
    await gridReady();

    await user.keyboard('{Escape}');
    await settle();
    await openPanel(user);
    await gridReady();

    expect(screen.getAllByRole('listbox')).toHaveLength(1);
    expect(options()).toHaveLength(TILE_COUNT);
  });

  test('inside a Dialog, Escape closes the panel first and leaves the dialog open', async () => {
    const user = userEvent.setup();
    renderApp(
      <Dialog open title="Project settings">
        <Picker defaultOpen={false} />
      </Dialog>,
    );
    await settle();

    await openPanel(user);
    expect(listbox()).toBeTruthy();

    await user.keyboard('{Escape}');
    await settle();

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Project settings' }), 'the dialog must survive').toBeTruthy();
  });
});
