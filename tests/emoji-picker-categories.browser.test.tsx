import { beforeEach, describe, expect, test } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, settle } from './harness';
import {
  CATEGORY_LABELS,
  CATEGORY_TITLES,
  Picker,
  currentCategory,
  gridReady,
  groupNames,
  installEmojiData,
  listbox,
  openPanel,
  option,
  railLabels,
  selectedName,
} from './emoji-picker-support';

beforeEach(installEmojiData);

const recentNames = (): string[] =>
  within(screen.getByRole('group', { name: 'Recently Used' }))
    .queryAllByRole('option')
    .map((tile) => tile.getAttribute('aria-label') ?? '');

describe('EmojiPicker categories', () => {
  test('the rail lists every category the grid holds', async () => {
    renderApp(<Picker />);
    await gridReady();

    expect(railLabels()).toEqual(CATEGORY_LABELS);
    expect(groupNames()).toEqual(CATEGORY_TITLES);
  });

  test('clicking a category jumps the grid to its first tile', async () => {
    const user = userEvent.setup();
    renderApp(<Picker />);
    await gridReady();

    await user.click(screen.getByRole('button', { name: 'animals nature' }));

    expect(selectedName()).toBe('cat face');
  });

  test('the rail marks the category the scroll position is in', async () => {
    renderApp(<Picker />);
    await gridReady();

    expect(currentCategory()).toBe('smileys emotion');

    const scroller = listbox();
    scroller.scrollTop = scroller.scrollHeight;
    await waitFor(() => expect(currentCategory()).toBe('animals nature'));

    scroller.scrollTop = 0;
    await waitFor(() => expect(currentCategory()).toBe('smileys emotion'));
  });

  test('a picked emoji comes back as Recently Used the next time the panel opens', async () => {
    const user = userEvent.setup();
    renderApp(<Picker defaultOpen={false} />);

    await openPanel(user);
    await gridReady();
    expect(railLabels(), 'nothing has been picked yet').toEqual(CATEGORY_LABELS);

    await user.click(option('cat face'));
    await user.keyboard('{Escape}');
    await settle();

    await openPanel(user);
    await gridReady(4);

    expect(groupNames()).toEqual(['Recently Used', ...CATEGORY_TITLES]);
    expect(railLabels()).toEqual(['recent', ...CATEGORY_LABELS]);
    expect(recentNames()).toEqual(['cat face']);
  });

  test('the most recent pick leads the recents', async () => {
    const user = userEvent.setup();
    renderApp(<Picker defaultOpen={false} />);

    await openPanel(user);
    await gridReady();
    await user.click(option('cat face'));
    await user.click(option('dog face'));

    await user.keyboard('{Escape}');
    await settle();
    await openPanel(user);
    await gridReady(4);

    expect(recentNames()).toEqual(['dog face', 'cat face']);
  });

  test('a recent emoji picks the same way as one from its own category', async () => {
    const user = userEvent.setup();
    const picks: string[] = [];
    renderApp(<Picker defaultOpen={false} onSelect={(shortcode) => picks.push(shortcode)} />);

    await openPanel(user);
    await gridReady();
    await user.click(option('cat face'));

    await user.keyboard('{Escape}');
    await settle();
    await openPanel(user);
    await gridReady(4);

    await user.click(within(screen.getByRole('group', { name: 'Recently Used' })).getByRole('option'));

    expect(picks).toEqual(['cat', 'cat']);
  });
});
