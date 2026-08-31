import {
  clickActivates,
  declinePointerDown,
  pointerDownActivates,
  type ActivateOn,
} from '../../internal/utils/activation';
import { getEmojiData } from './data';
import { createEmojiGrid } from './dom';
import { createNavigator } from './navigation';
import { createScaffold } from './scaffold';
import { getRankedEmojiIds } from './search';
import type { GetEmojiUrl } from './types';

const STORAGE_KEY = 'recentEmojis';
const MAX_RECENT = 18;
const SPY_READING_LINE = 12;

export interface EmojiPickerOptions {
  onSelect: (shortcode: string, id: string) => void;
  getEmojiUrl: GetEmojiUrl;
  listboxId: string;
  getFocusHost?: () => HTMLElement | null;
  getActivateOn?: () => ActivateOn | undefined;
  onCategoriesChange?: (keys: string[]) => void;
  onActiveCategoryChange?: (key: string | null) => void;
}

export type EmojiPickerApi = ReturnType<typeof createEmojiPicker>;

export function createEmojiPicker(root: HTMLElement, options: EmojiPickerOptions) {
  const emojiData = getEmojiData();
  if (!emojiData) throw new Error('Emoji data not found');

  let recent: string[] =
    typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') : [];
  let activeKey: string | null = null;
  let spyFrame = 0;

  const ui = createScaffold(root, emojiData, options.getEmojiUrl, options.listboxId);
  const area = createEmojiGrid(ui.scroll, options.getEmojiUrl, `${options.listboxId}-o`);

  let activeTile: HTMLButtonElement | null = null;
  const nav = createNavigator(area.buttons, area.sections, (btn) => {
    activeTile?.removeAttribute('aria-selected');
    btn?.setAttribute('aria-selected', 'true');
    activeTile = btn;
    const host = options.getFocusHost?.();
    if (btn) host?.setAttribute('aria-activedescendant', btn.id);
    else host?.removeAttribute('aria-activedescendant');
    ui.positionMarker(btn);
    ui.setCaption(btn);
  });

  const spy = () => {
    spyFrame = 0;
    const line = ui.scroll.scrollTop + SPY_READING_LINE;
    let current = 0;
    for (let i = 0; i < area.sections.length; i++) {
      if (area.sections[i].header.offsetTop <= line) current = i;
      else break;
    }
    const key = area.sections[current]?.key ?? null;
    if (key === activeKey) return;
    activeKey = key;
    options.onActiveCategoryChange?.(key);
  };

  const scheduleSpy = () => {
    if (!spyFrame) spyFrame = requestAnimationFrame(spy);
  };

  const selectById = (id: string) => {
    const shortcode = emojiData.emojis[id]?.shortcodes[0];
    if (!shortcode) return;
    recent = [id, ...recent.filter((x) => x !== id)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    options.onSelect(shortcode, id);
  };

  const selectFocused = () => {
    const id = area.buttons[nav.getFocusedIdx()]?.dataset.id;
    if (id) selectById(id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest('button');
    if (btn?.dataset.idx) nav.setFocus(parseInt(btn.dataset.idx));
  };

  const selectPressed = (e: Event) => {
    const btn = (e.target as HTMLElement).closest('button');
    if (btn?.dataset.id && ui.scroll.contains(btn)) selectById(btn.dataset.id);
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (options.getActivateOn?.() !== 'pointerdown') return declinePointerDown();
    if (pointerDownActivates(e, true)) selectPressed(e);
  };

  const handleClick = (e: PointerEvent) => {
    e.preventDefault();
    if (clickActivates(e)) selectPressed(e);
  };

  ui.scroll.addEventListener('scroll', scheduleSpy, { passive: true });
  ui.scroll.addEventListener('mousemove', handleMouseMove, { passive: true });
  root.addEventListener('pointerdown', handlePointerDown);
  root.addEventListener('click', handleClick);

  const beginRender = (keys: string[]) => {
    area.clear();
    nav.reset();
    ui.mountMarker();
    activeKey = null;
    options.onCategoriesChange?.(keys);
    options.onActiveCategoryChange?.(null);
  };

  const renderAll = () => {
    const keys = emojiData.categories.map((c) => c.id);
    const hasRecent = recent.length > 0;
    beginRender(hasRecent ? ['recent', ...keys] : keys);
    if (hasRecent) area.addCategory('Recently Used', 'recent', recent);

    let i = 0;
    const step = () => {
      const category = emojiData.categories[i++];
      if (!category) return;
      area.addCategory(category.id.replace('-', ' & '), category.id, category.emojis);
      spy();
      area.timers.push(window.setTimeout(step, 0));
    };
    step();
  };

  const renderFiltered = (query: string) => {
    beginRender([]);
    const ids = getRankedEmojiIds(query);
    if (!ids.length) return area.showEmpty('No emojis found');
    area.addCategory('Results', 'search', ids);
    nav.setFocus(0, false);
  };

  const scrollToCategory = (key: string) => {
    const section = area.sections[area.indexOfKey(key)];
    if (!section) return;
    area.buttons[section.start].scrollIntoView({ block: 'start', behavior: 'smooth' });
    nav.setFocus(section.start, false);
  };

  const destroy = () => {
    area.destroy();
    if (spyFrame) cancelAnimationFrame(spyFrame);
    ui.scroll.removeEventListener('scroll', scheduleSpy);
    ui.scroll.removeEventListener('mousemove', handleMouseMove);
    root.removeEventListener('pointerdown', handlePointerDown);
    root.removeEventListener('click', handleClick);
    root.innerHTML = '';
  };

  return {
    renderAll,
    renderFiltered,
    scrollToCategory,
    handleKey: (event: KeyboardEvent) => nav.handleKey(event, selectFocused),
    selectFocused,
    destroy,
  };
}
