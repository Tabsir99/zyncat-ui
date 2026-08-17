import { beforeEach, describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, settle } from './harness';
import {
  CATEGORY_TITLES,
  Picker,
  SHEET,
  gridReady,
  groupNames,
  installEmojiData,
  optionNames,
  options,
  rail,
  searchField,
} from './emoji-picker-support';

beforeEach(installEmojiData);

async function typeQuery(text: string): Promise<void> {
  const user = userEvent.setup();
  await user.type(searchField(), text);
  await settle();
}

describe('EmojiPicker search', () => {
  test('the search prop renders the panel its own field', async () => {
    renderApp(<Picker search />);
    await gridReady();

    expect(searchField()).toBeTruthy();
  });

  test('the query prop drives the results and the panel renders no field of its own', async () => {
    renderApp(<Picker query="cat" />);
    await settle();

    expect(screen.queryByRole('combobox')).toBeNull();
    expect(optionNames()).toEqual(['cat face', 'black cat']);
  });

  test('typing in the panel field narrows the grid to a single results group', async () => {
    renderApp(<Picker search />);
    await gridReady();

    await typeQuery('cat');

    expect(groupNames()).toEqual(['Results']);
    expect(optionNames()).toEqual(['cat face', 'black cat']);
  });

  test('an empty query renders every category', async () => {
    renderApp(<Picker query="" />);
    await gridReady();

    expect(groupNames()).toEqual(CATEGORY_TITLES);
  });

  test('a query that matches nothing says so', async () => {
    renderApp(<Picker query="zzz" />);
    await settle();

    expect(options()).toHaveLength(0);
    expect(screen.getByText('No emojis found')).toBeTruthy();
  });

  test('every token in the query has to hit a word', async () => {
    const view = renderApp(<Picker query="red heart" />);
    await settle();
    expect(optionNames()).toEqual(['red heart']);

    view.rerender(<Picker query="cat heart" />);
    await settle();

    expect(options(), 'no emoji answers both tokens').toHaveLength(0);
    expect(screen.getByText('No emojis found')).toBeTruthy();
  });

  test('a shortcode match ranks above a name match', async () => {
    renderApp(<Picker query="heart" />);
    await settle();

    expect(optionNames()).toEqual(['red heart', 'face blowing a kiss', 'smiling face with heart-eyes']);
  });

  test('a name match ranks above a tag match', async () => {
    renderApp(<Picker query="party" />);
    await settle();

    expect(optionNames()).toEqual(['party popper', 'balloon', 'birthday cake']);
  });

  test('a tag-only match is still found', async () => {
    renderApp(<Picker query="feline" />);
    await settle();

    expect(optionNames()).toEqual(['cat face', 'black cat']);
  });

  test('a prefix of a shortcode matches', async () => {
    renderApp(<Picker query="thin" />);
    await settle();

    expect(optionNames()).toEqual(['thinking face']);
  });

  test('three characters match mid-word, two characters do not', async () => {
    const view = renderApp(<Picker query="ake" />);
    await settle();
    expect(optionNames()).toEqual(['birthday cake']);

    view.rerender(<Picker query="ak" />);
    await settle();

    expect(options(), 'a two-character token only matches a word start').toHaveLength(0);
  });

  test('search is word search, not fuzzy matching', async () => {
    renderApp(<Picker query="ct" />);
    await settle();

    expect(options(), '"ct" is a subsequence of "cat", not a word match').toHaveLength(0);
    expect(screen.getByText('No emojis found')).toBeTruthy();
  });

  test('clearing the query brings every category back', async () => {
    const view = renderApp(<Picker query="cat" />);
    await settle();
    expect(groupNames()).toEqual(['Results']);

    view.rerender(<Picker query="" />);
    await gridReady();

    expect(groupNames()).toEqual(CATEGORY_TITLES);
  });

  test('the category rail steps aside while results are showing', async () => {
    const view = renderApp(<Picker query="" />);
    await gridReady();
    expect(rail()).toBeTruthy();

    view.rerender(<Picker query="cat" />);
    await settle();
    expect(rail(), 'there are no categories to rail through').toBeNull();

    view.rerender(<Picker query="" />);
    await gridReady();
    expect(rail()).toBeTruthy();
  });

  test('in sheet mode the panel searches from its own field, not from the query prop', async () => {
    renderApp(<Picker breakpoint={SHEET} query="cat" />);
    await gridReady();

    expect(searchField()).toHaveProperty('value', '');
    expect(groupNames(), 'an outside query cannot reach a sheet').toEqual(CATEGORY_TITLES);

    await typeQuery('cat');

    expect(optionNames()).toEqual(['cat face', 'black cat']);
  });
});
