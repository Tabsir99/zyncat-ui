'use client';

import { useEffect, useId, useMemo, useSyncExternalStore } from 'react';
import { createEmojiPicker, type EmojiPickerApi } from '../picker';
import type { GetEmojiUrl } from '../types';

export interface UseEmojiPickerOptions {
  onSelect: (shortcode: string, hexId: string) => void;
  getEmojiUrl: GetEmojiUrl;
  /** Drive the results from outside — a `:` chip in a document, your own input. */
  query?: string;
}

export type EmojiPickerStore = ReturnType<typeof createEmojiPickerStore>;

type Handlers = Pick<UseEmojiPickerOptions, 'onSelect' | 'getEmojiUrl'>;

const FOCUSABLE = 'input, textarea, [tabindex]';
const NO_CATEGORIES: string[] = [];
const notActive = () => false;

export function createEmojiPickerStore(listboxId: string, handlers: Handlers) {
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());

  let api: EmojiPickerApi | null = null;
  let focusHost: HTMLElement | null = null;
  let categories = NO_CATEGORIES;
  let active: string | null = null;
  let query = '';
  let drawn = false;

  const draw = () => {
    if (!api) return;
    drawn = true;
    if (query) api.renderFiltered(query);
    else api.renderAll();
  };

  return {
    /** Spread onto the field that drives the picker: combobox roles, already pointing at the grid. */
    searchProps: {
      role: 'combobox',
      'aria-expanded': true,
      'aria-autocomplete': 'list',
      'aria-controls': listboxId,
    } as const,
    /** Callback ref for the element the picker takes over. The grid is built the moment the node
     *  arrives, which for a popover is a commit or two after the hook first ran. */
    mount: (node: HTMLDivElement | null) => {
      api?.destroy();
      drawn = false;
      api = node
        ? createEmojiPicker(node, {
            listboxId,
            getEmojiUrl: (...args) => handlers.getEmojiUrl(...args),
            getFocusHost: () => focusHost,
            onSelect: (...args) => handlers.onSelect(...args),
            onCategoriesChange: (keys) => {
              categories = keys;
              emit();
            },
            onActiveCategoryChange: (key) => {
              active = key;
              emit();
            },
          })
        : null;
      draw();
    },
    /** Callback ref for the field that keeps focus while the grid is navigated, or anything wrapping it.
     *  The picker moves `aria-activedescendant` on it directly, so running the marker down 1900 tiles
     *  never costs a render. */
    searchRef: (node: HTMLElement | null) => {
      focusHost = node?.matches(FOCUSABLE) ? node : (node?.querySelector<HTMLElement>(FOCUSABLE) ?? null);
    },
    setHandlers: (next: Handlers) => {
      handlers = next;
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getCategories: () => categories,
    isActive: (key: string) => active === key,
    render: (next = '') => {
      if (drawn && next === query) return;
      query = next;
      draw();
    },
    scrollToCategory: (key: string) => api?.scrollToCategory(key),
    renderAll: () => {
      query = '';
      draw();
    },
    renderFiltered: (next: string) => {
      query = next;
      draw();
    },
    handleKey: (event: KeyboardEvent) => api?.handleKey(event) ?? false,
    selectFocused: () => api?.selectFocused(),
  };
}

export function useEmojiPicker({ onSelect, getEmojiUrl, query }: UseEmojiPickerOptions): EmojiPickerStore {
  const listboxId = useId();
  const store = useMemo(() => createEmojiPickerStore(listboxId, { onSelect, getEmojiUrl }), [listboxId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    store.setHandlers({ onSelect, getEmojiUrl });
  });

  useEffect(() => {
    store.render(query);
  }, [store, query]);

  return store;
}

/** Category keys the grid currently holds; empty while showing search results. */
export const useCategories = (store: EmojiPickerStore): string[] =>
  useSyncExternalStore(store.subscribe, store.getCategories, store.getCategories);

/** Whether the scroll position is inside this category. Subscribing per key means a scrollspy
 *  tick re-renders the two rows whose state flipped, not the panel. */
export const useIsActiveCategory = (store: EmojiPickerStore, key: string): boolean =>
  useSyncExternalStore(store.subscribe, () => store.isActive(key), notActive);
