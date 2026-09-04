import { getEmojiData, type Emoji } from './data';
import type { GetEmojiUrl } from './types';

export const COLUMN_COUNT = 8;

export interface GridSection {
  key: string;
  header: HTMLElement;
  start: number;
  count: number;
}

export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  node.className = className;
  return node;
};

const attr = (value: string) => value.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export function createEmojiGrid(scroll: HTMLDivElement, getEmojiUrl: GetEmojiUrl, tileIdPrefix: string) {
  const buttons: HTMLButtonElement[] = [];
  const sections: GridSection[] = [];
  const timers: number[] = [];

  const swapInNativeGlyph = (e: Event) => {
    const img = e.target as HTMLImageElement;
    if (img.matches?.('.zc-on-emoji-btn-img')) img.parentElement!.textContent = img.alt;
  };
  scroll.addEventListener('error', swapInNativeGlyph, true);

  const tile = (emoji: Emoji, idx: number, order: number) =>
    `<button type="button" role="option" tabindex="-1" class="zc-on-emoji-btn" id="${attr(tileIdPrefix + idx)}" aria-label="${attr(emoji.name)}" data-id="${emoji.id}" data-idx="${idx}" style="--i:${order}">` +
    `<img class="zc-on-emoji-btn-img" src="${attr(getEmojiUrl(emoji.id, 'picker-grid'))}" loading="lazy" draggable="false" alt="${attr(emoji.unicode)}"></button>`;

  const addCategory = (title: string, key: string, ids: string[]) => {
    const data = getEmojiData();
    if (!data) return;

    const header = el('div', 'zc-on-emoji-header');
    header.textContent = title;
    header.setAttribute('aria-hidden', 'true');
    scroll.appendChild(header);

    const start = buttons.length;
    const emojis = ids.map((id) => data.emojis[id]).filter(Boolean);
    const grid = el('div', 'zc-on-emoji-grid');
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', title);
    grid.style.setProperty('--cols', String(COLUMN_COUNT));
    grid.style.setProperty('--rows', String(Math.ceil(emojis.length / COLUMN_COUNT)));
    grid.innerHTML = emojis.map((emoji, i) => tile(emoji, start + i, i)).join('');
    scroll.appendChild(grid);

    buttons.push(...(grid.children as HTMLCollectionOf<HTMLButtonElement>));
    if (emojis.length) sections.push({ key, header, start, count: emojis.length });
  };

  const indexOfKey = (key: string) => sections.findIndex((s) => s.key === key);

  const showEmpty = (message: string) => {
    scroll.insertAdjacentHTML('beforeend', `<div class="zc-on-emoji-empty">${attr(message)}</div>`);
  };

  const clear = () => {
    timers.forEach(clearTimeout);
    timers.length = 0;
    scroll.innerHTML = '';
    buttons.length = 0;
    sections.length = 0;
  };

  const destroy = () => {
    clear();
    scroll.removeEventListener('error', swapInNativeGlyph, true);
  };

  return { buttons, sections, timers, addCategory, showEmpty, clear, indexOfKey, destroy };
}
