import { createRef } from 'react';
import { beforeEach, describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { cdp } from 'vitest/browser';
import type { EmojiPickerHandle } from '@zyncat/ui/emoji-picker';
import { finishAnimations, renderApp, settle } from './harness';
import {
  CATEGORY_LABELS,
  CATEGORY_TITLES,
  Picker,
  SHEET,
  TILE_COUNT,
  fromHandle,
  gridReady,
  groupNames,
  installEmojiData,
  keydown,
  listbox,
  option,
  options,
  railLabels,
  searchField,
  selectedOption,
  triggerButton,
} from './emoji-picker-support';

beforeEach(installEmojiData);

const handle = () => createRef<EmojiPickerHandle>();

const emulate = (features: { name: string; value: string }[]) =>
  (cdp() as unknown as { send(method: string, params?: unknown): Promise<unknown> }).send(
    'Emulation.setEmulatedMedia',
    { features },
  );

const marker = (): HTMLElement => {
  const found = listbox().querySelector<HTMLElement>('.on-emoji-marker');
  if (!found) throw new Error('the panel drew no focus marker');
  return found;
};

function expectCovers(highlight: HTMLElement, tile: HTMLElement) {
  const a = highlight.getBoundingClientRect();
  const b = tile.getBoundingClientRect();
  for (const edge of ['left', 'top', 'right', 'bottom'] as const)
    expect(Math.abs(a[edge] - b[edge]), `the ${edge} edge of the focus marker`).toBeLessThanOrEqual(1.5);
}

describe('EmojiPicker accessibility', () => {
  test('the grid is a listbox of options named by the emoji', async () => {
    renderApp(<Picker />);
    await gridReady();

    expect(listbox()).toBeTruthy();
    expect(options()).toHaveLength(TILE_COUNT);
    expect(option('cat face')).toBeTruthy();
  });

  test('each category is a labelled group inside the listbox', async () => {
    renderApp(<Picker />);
    await gridReady();

    expect(groupNames()).toEqual(CATEGORY_TITLES);
  });

  test('the category rail is a labelled group of category buttons', async () => {
    renderApp(<Picker />);
    await gridReady();

    expect(screen.getByRole('group', { name: 'Emoji categories' })).toBeTruthy();
    expect(railLabels()).toEqual(CATEGORY_LABELS);
  });

  test('the panel field is a combobox wired to the grid', async () => {
    renderApp(<Picker search />);
    await gridReady();

    const field = searchField();
    expect(field.getAttribute('aria-expanded')).toBe('true');
    expect(field.getAttribute('aria-autocomplete')).toBe('list');
    expect(field.getAttribute('aria-controls')).toBe(listbox().id);
  });

  test('the trigger advertises the panel it controls', async () => {
    const user = userEvent.setup();
    renderApp(<Picker defaultOpen={false} />);

    expect(triggerButton().getAttribute('aria-expanded')).toBe('false');

    await user.click(triggerButton());
    await settle();

    expect(triggerButton().getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(triggerButton().getAttribute('aria-controls') ?? '')).toBeTruthy();
  });

  test('nothing is selected and the field points nowhere until the grid is driven', async () => {
    renderApp(<Picker search />);
    await gridReady();

    expect(selectedOption()).toBeNull();
    expect(searchField().getAttribute('aria-activedescendant')).toBeNull();
  });

  test('the field points at the selected option and moves with it', async () => {
    const panel = handle();
    renderApp(<Picker search panelRef={panel} />);
    await gridReady();

    panel.current!.handleKey(keydown('ArrowRight'));
    const first = selectedOption();
    expect(first?.getAttribute('aria-label')).toBe('grinning face');
    expect(searchField().getAttribute('aria-activedescendant')).toBe(first!.id);

    panel.current!.handleKey(keydown('ArrowRight'));
    const second = selectedOption();
    expect(second?.getAttribute('aria-label')).toBe('grinning face with big eyes');
    expect(searchField().getAttribute('aria-activedescendant')).toBe(second!.id);
    expect(screen.queryAllByRole('option', { selected: true }), 'exactly one option is selected').toHaveLength(1);
  });

  test('the caption names the selected emoji and its shortcode', async () => {
    const user = userEvent.setup();
    renderApp(<Picker />);
    await gridReady();

    expect(screen.getByText('Pick an emoji…'), 'the caption idles until something is selected').toBeTruthy();

    await user.hover(option('cat face'));

    expect(screen.getByText('cat face')).toBeTruthy();
    expect(screen.getByText(':cat:')).toBeTruthy();
  });

  test('in sheet mode the panel is a dialog named Emoji picker', async () => {
    renderApp(<Picker breakpoint={SHEET} />);
    await gridReady();

    expect(screen.getByRole('dialog', { name: 'Emoji picker' })).toBeTruthy();
  });
});

describe('EmojiPicker focus marker', () => {
  test('the marker is invisible until something is selected', async () => {
    renderApp(<Picker />);
    await gridReady();

    expect(getComputedStyle(marker()).opacity).toBe('0');
  });

  test('the marker covers the first result of a filtered render', async () => {
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    await fromHandle(() => panel.current!.renderFiltered('cat'));
    await finishAnimations();

    expect(Number(getComputedStyle(marker()).opacity), 'the marker must be visible').toBeGreaterThan(0);
    expectCovers(marker(), option('cat face'));
  });

  test('the marker follows the selection to the next tile', async () => {
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    await fromHandle(() => panel.current!.renderFiltered('cat'));
    panel.current!.handleKey(keydown('ArrowRight'));
    await finishAnimations();

    expectCovers(marker(), option('black cat'));
  });

  test('the marker lands on the focused tile under reduced motion too', async () => {
    const panel = handle();
    await emulate([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    try {
      renderApp(<Picker panelRef={panel} />);
      await gridReady();

      await fromHandle(() => panel.current!.renderFiltered('cat'));
      await finishAnimations();

      expectCovers(marker(), option('cat face'));
    } finally {
      await emulate([]);
    }
  });
});
