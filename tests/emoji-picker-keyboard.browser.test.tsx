import { createRef } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { EmojiPickerHandle } from '@zyncat/ui/emoji-picker';
import { renderApp, settle } from './harness';
import {
  CATEGORY_TITLES,
  Picker,
  TILE_COUNT,
  fromHandle,
  gridReady,
  groupNames,
  installEmojiData,
  keydown,
  option,
  optionNames,
  options,
  searchField,
  selectedName,
} from './emoji-picker-support';

beforeEach(installEmojiData);

const handle = () => createRef<EmojiPickerHandle>();

describe('EmojiPicker keyboard', () => {
  test('the arrow keys are consumed and reported as consumed', async () => {
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    const event = keydown('ArrowRight');
    expect(panel.current!.handleKey(event)).toBe(true);
    expect(event.defaultPrevented).toBe(true);
  });

  test('a key the grid has no use for is handed straight back', async () => {
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    const event = keydown('a');
    expect(panel.current!.handleKey(event)).toBe(false);
    expect(event.defaultPrevented, 'an unconsumed key belongs to the caller').toBe(false);
  });

  test('the first arrow lands on the first tile', async () => {
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    expect(selectedName(), 'nothing is selected before the first key').toBeNull();

    panel.current!.handleKey(keydown('ArrowRight'));

    expect(selectedName()).toBe('grinning face');
  });

  test('ArrowRight steps one tile and ArrowDown steps a row of eight', async () => {
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    panel.current!.handleKey(keydown('ArrowRight'));
    panel.current!.handleKey(keydown('ArrowRight'));
    expect(selectedName()).toBe('grinning face with big eyes');

    panel.current!.handleKey(keydown('ArrowDown'));
    expect(selectedName(), 'one row down is eight tiles on').toBe('sleeping face');
  });

  test('ArrowDown keeps the column it started in', async () => {
    const user = userEvent.setup();
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    await user.hover(option('smiling face with heart-eyes'));
    expect(selectedName(), 'the fourth tile of the first row').toBe(optionNames()[3]);

    panel.current!.handleKey(keydown('ArrowDown'));
    expect(selectedName()).toBe('clown face');

    panel.current!.handleKey(keydown('ArrowDown'));
    expect(selectedName()).toBe('pebble 8');
  });

  test('ArrowRight past the end of a category lands on the next one', async () => {
    const user = userEvent.setup();
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    await user.hover(option('pebble 8'));

    panel.current!.handleKey(keydown('ArrowRight'));
    expect(selectedName(), 'the first tile of animals & nature').toBe('cat face');

    panel.current!.handleKey(keydown('ArrowLeft'));
    expect(selectedName(), 'and back to the last tile of smileys & emotion').toBe('pebble 8');
  });

  test('ArrowUp on the first row stays where it is', async () => {
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    panel.current!.handleKey(keydown('ArrowRight'));
    panel.current!.handleKey(keydown('ArrowUp'));

    expect(selectedName()).toBe('grinning face');
  });

  test('Enter picks the selected emoji, with its shortcode and hex id', async () => {
    const onSelect = vi.fn();
    const panel = handle();
    renderApp(<Picker panelRef={panel} onSelect={onSelect} />);
    await gridReady();

    panel.current!.handleKey(keydown('ArrowRight'));
    const event = keydown('Enter');
    expect(panel.current!.handleKey(event)).toBe(true);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('grinning', '1F600');
    expect(event.defaultPrevented).toBe(true);
  });

  test('Enter before anything is selected picks nothing', async () => {
    const onSelect = vi.fn();
    const panel = handle();
    renderApp(<Picker panelRef={panel} onSelect={onSelect} />);
    await gridReady();

    panel.current!.handleKey(keydown('Enter'));

    expect(onSelect).not.toHaveBeenCalled();
  });

  test('selectFocused picks the selected emoji without a key', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const panel = handle();
    renderApp(<Picker panelRef={panel} onSelect={onSelect} />);
    await gridReady();

    await user.hover(option('cat face'));
    panel.current!.selectFocused();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('cat', '1F431');
  });

  test('renderFiltered and renderAll drive the grid from the handle', async () => {
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    await fromHandle(() => panel.current!.renderFiltered('cat'));
    expect(optionNames()).toEqual(['cat face', 'black cat']);

    await fromHandle(() => panel.current!.renderAll());
    await waitFor(() => expect(groupNames()).toHaveLength(3));

    expect(groupNames()).toEqual(CATEGORY_TITLES);
    expect(options()).toHaveLength(TILE_COUNT);
  });

  test('an empty result set consumes no keys at all', async () => {
    const panel = handle();
    renderApp(<Picker panelRef={panel} />);
    await gridReady();

    await fromHandle(() => panel.current!.renderFiltered('zzz'));
    const event = keydown('ArrowDown');

    expect(panel.current!.handleKey(event)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByText('No emojis found')).toBeTruthy();
  });

  test('clicking a tile picks it', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderApp(<Picker onSelect={onSelect} />);
    await gridReady();

    await user.click(option('cat face'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('cat', '1F431');
  });

  test('hovering a tile moves the selection to it', async () => {
    const user = userEvent.setup();
    renderApp(<Picker />);
    await gridReady();

    await user.hover(option('dog face'));

    expect(selectedName()).toBe('dog face');
  });

  test('typing in the panel field and pressing Enter picks the top result', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderApp(<Picker search onSelect={onSelect} />);
    await gridReady();

    await user.type(searchField(), 'heart');
    await settle();
    expect(selectedName(), 'the top result is selected as you type').toBe('red heart');

    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('heart', '2764');
  });

  test('ArrowDown from the panel field walks the results', async () => {
    const user = userEvent.setup();
    renderApp(<Picker search />);
    await gridReady();

    await user.type(searchField(), 'heart');
    await settle();

    await user.keyboard('{ArrowDown}');

    expect(selectedName()).toBe('smiling face with heart-eyes');
  });

  test('the horizontal arrows move the caret while the field has text', async () => {
    const user = userEvent.setup();
    renderApp(<Picker search />);
    await gridReady();

    await user.type(searchField(), 'heart');
    await settle();

    await user.keyboard('{ArrowLeft}');

    expect(searchField()).toHaveProperty('selectionStart', 4);
    expect(selectedName(), 'the grid must not steal the caret key').toBe('red heart');
  });

  test('the horizontal arrows drive the grid while the field is empty', async () => {
    const user = userEvent.setup();
    renderApp(<Picker search />);
    await gridReady();

    searchField().focus();
    await user.keyboard('{ArrowRight}');

    expect(selectedName()).toBe('grinning face');
  });
});
