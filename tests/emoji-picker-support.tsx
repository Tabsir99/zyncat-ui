import { useState, type ReactElement, type Ref } from 'react';
import { expect } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { Button } from '@zyncat/ui/button';
import {
  EmojiPickerPanel,
  loadEmojiData,
  type Emoji,
  type EmojiData,
  type EmojiPickerHandle,
  type EmojiPickerPanelProps,
  type GetEmojiUrl,
} from '@zyncat/ui/emoji-picker';
import { finishAnimations, settle } from './harness';

export const POPOVER = '(max-width: 1px)';
export const SHEET = '(min-width: 1px)';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const emojiUrl: GetEmojiUrl = (hexId, source) => `${PIXEL}#${source}-${hexId}`;

const make = (id: string, name: string, shortcodes: string[], tags: string[] = []): Emoji => ({
  id,
  name,
  unicode: `[${name}]`,
  tags,
  skins: [{ unified: id, native: `[${name}]` }],
  group: 0,
  shortcodes,
});

const pebbles = (start: number, count: number): Emoji[] =>
  Array.from({ length: count }, (_, i) => make(`FF${start + i}`, `pebble ${start + i}`, [`pebble_${start + i}`]));

const FACES = [
  make('1F600', 'grinning face', ['grinning'], ['happy', 'smile']),
  make('1F603', 'grinning face with big eyes', ['smiley'], ['happy']),
  make('1F604', 'grinning face with smiling eyes', ['smile'], ['happy']),
  make('1F60D', 'smiling face with heart-eyes', ['heart_eyes'], ['love']),
  make('1F618', 'face blowing a kiss', ['kissing_heart'], ['love']),
  make('2764', 'red heart', ['heart'], ['love', 'like']),
  make('1F622', 'crying face', ['cry'], ['sad', 'tear']),
  make('1F62D', 'loudly crying face', ['sob'], ['sad']),
  make('1F914', 'thinking face', ['thinking'], ['hmm']),
  make('1F634', 'sleeping face', ['sleeping'], ['tired']),
  make('1F644', 'face with rolling eyes', ['roll_eyes'], ['sarcasm']),
  make('1F921', 'clown face', ['clown_face'], ['circus']),
];

const CREATURES = [
  make('1F431', 'cat face', ['cat'], ['animal', 'feline', 'pet']),
  make('1F408', 'black cat', ['black_cat'], ['animal', 'feline', 'unlucky']),
  make('1F436', 'dog face', ['dog'], ['animal', 'pet']),
  make('1F984', 'unicorn', ['unicorn'], ['animal', 'myth']),
  make('1F41D', 'honeybee', ['bee'], ['insect']),
  make('1F337', 'tulip', ['tulip'], ['flower', 'plant']),
  make('1F332', 'evergreen tree', ['evergreen_tree'], ['plant']),
  make('2B50', 'star', ['star'], ['night', 'sky']),
  make('1F31F', 'glowing star', ['star2'], ['night', 'sky']),
  make('1F308', 'rainbow', ['rainbow'], ['sky', 'pride']),
];

const TREATS = [
  make('1F382', 'birthday cake', ['birthday'], ['party', 'celebration']),
  make('1F389', 'party popper', ['tada'], ['celebration', 'congratulations']),
  make('1F388', 'balloon', ['balloon'], ['party', 'birthday']),
];

const GROUPS = [
  { id: 'smileys-emotion', icon: '1F600', emojis: [...FACES, ...pebbles(1, 8)] },
  { id: 'animals-nature', icon: '1F431', emojis: [...CREATURES, ...pebbles(9, 50)] },
  { id: 'food-drink', icon: '1F382', emojis: [...TREATS, ...pebbles(59, 17)] },
];

export const EMOJI_DATA: EmojiData = {
  emojis: Object.fromEntries(GROUPS.flatMap((group) => group.emojis).map((emoji) => [emoji.id, emoji])),
  categories: GROUPS.map(({ id, icon, emojis }) => ({ id, icon, emojis: emojis.map((emoji) => emoji.id) })),
};

export const CATEGORY_TITLES = ['smileys & emotion', 'animals & nature', 'food & drink'];
export const CATEGORY_LABELS = ['smileys emotion', 'animals nature', 'food drink'];
export const TILE_COUNT = GROUPS.reduce((total, group) => total + group.emojis.length, 0);

export async function installEmojiData(): Promise<void> {
  localStorage.clear();
  await loadEmojiData(EMOJI_DATA);
}

type PickerProps = Omit<EmojiPickerPanelProps, 'open' | 'onOpenChange' | 'onSelect' | 'getEmojiUrl' | 'ref'> & {
  getEmojiUrl?: GetEmojiUrl;
  onSelect?: (shortcode: string, hexId: string) => void;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  panelRef?: Ref<EmojiPickerHandle>;
};

export function Picker({
  defaultOpen = true,
  onOpenChange,
  onSelect,
  getEmojiUrl = emojiUrl,
  panelRef,
  trigger,
  breakpoint = POPOVER,
  ...rest
}: PickerProps): ReactElement {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <EmojiPickerPanel
      {...rest}
      ref={panelRef}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange?.(next);
      }}
      onSelect={onSelect ?? (() => {})}
      getEmojiUrl={getEmojiUrl}
      breakpoint={breakpoint}
      trigger={trigger ?? <Button>Add reaction</Button>}
    />
  );
}

export const triggerButton = (name = 'Add reaction'): HTMLElement => screen.getByRole('button', { name });

export const listbox = (): HTMLElement => screen.getByRole('listbox', { name: 'Emoji' });

export const options = (): HTMLElement[] => screen.queryAllByRole('option');

export const option = (name: string): HTMLElement => screen.getByRole('option', { name });

export const optionNames = (): string[] => options().map((tile) => tile.getAttribute('aria-label') ?? '');

export const selectedName = (): string | null => {
  const [selected] = screen.queryAllByRole('option', { selected: true });
  return selected?.getAttribute('aria-label') ?? null;
};

export const selectedOption = (): HTMLElement | null => screen.queryAllByRole('option', { selected: true })[0] ?? null;

export const groupNames = (): string[] =>
  within(listbox())
    .queryAllByRole('group')
    .map((group) => group.getAttribute('aria-label') ?? '');

export const rail = (): HTMLElement | null => screen.queryByRole('group', { name: 'Emoji categories' });

export const railLabels = (): string[] => {
  const bar = rail();
  return bar
    ? within(bar)
        .queryAllByRole('button')
        .map((button) => button.getAttribute('aria-label') ?? '')
    : [];
};

export const currentCategory = (): string | null => {
  const [current] = screen.queryAllByRole('button', { current: true });
  return current?.getAttribute('aria-label') ?? null;
};

export const searchField = (): HTMLElement => screen.getByRole('combobox', { name: 'Search emoji' });

export const focusMarker = (): HTMLElement | null => listbox().querySelector('.on-emoji-marker');

export const boxOf = (el: Element): Record<string, number> => {
  const rect = el.getBoundingClientRect();
  return {
    left: Math.round(rect.left),
    top: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
};

export const keydown = (key: string): KeyboardEvent =>
  new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

export async function fromHandle(run: () => void): Promise<void> {
  await act(async () => {
    run();
  });
}

export async function openPanel(user: UserEvent, name = 'Add reaction'): Promise<void> {
  await user.click(triggerButton(name));
  await settle();
}

export async function gridReady(groups = 3): Promise<void> {
  await waitFor(() => expect(groupNames()).toHaveLength(groups));
  await finishAnimations();
}
