import { describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp } from './harness';
import { CATEGORY_TITLES, Picker, gridReady, groupNames, installEmojiData } from './emoji-picker-support';

describe('EmojiPicker dataset', () => {
  test('opening before the dataset has landed is a loud failure, not a blank panel', () => {
    expect(() => renderApp(<Picker />)).toThrow(/emoji data/i);
  });

  test('a dataset handed over as an object is installed as it stands', async () => {
    await installEmojiData();

    renderApp(<Picker />);
    await gridReady();

    expect(groupNames()).toEqual(CATEGORY_TITLES);
    expect(screen.getByRole('option', { name: 'cat face' })).toBeTruthy();
  });
});
