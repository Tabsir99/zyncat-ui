'use client';

/* useListbox - one listbox brain for both Select and MultiSelect: open/query state, refs/ids,
   option filtering, placement, the keyboard machine, glide-pill tracking and commit.
   Variant-blind - it holds no selection state and never inspects the value shape. The public
   components own their value and hand it two opaque callbacks (isSelected / onCommit) plus a
   close policy. */
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useGlide } from '../../motion/glide';
import { normalize, matches, type SelectOption, type SelectGroup } from './types';

export interface UseListboxArgs {
  options: SelectOption[] | SelectGroup[];
  disabled: boolean;
  loading: boolean;
  searchable: boolean;
  id?: string;
  idPrefix: string;
  isSelected: (value: string) => boolean;
  onCommit: (opt: SelectOption) => void;
  closeOnCommit: boolean;
}

export type ListboxState = ReturnType<typeof useListbox>;

export function useListbox({
  options,
  disabled,
  loading,
  searchable,
  id,
  idPrefix,
  isSelected,
  onCommit,
  closeOnCommit,
}: UseListboxArgs) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const typeahead = useRef<{ buf: string; t: ReturnType<typeof setTimeout> | number }>({
    buf: '',
    t: 0,
  });

  const triggerRef = useRef<HTMLButtonElement>(null),
    listRef = useRef<HTMLDivElement>(null),
    searchRef = useRef<HTMLInputElement>(null);
  const autoId = useId();
  const baseId = id || idPrefix + autoId;
  const menuId = baseId + '-menu';
  const listId = baseId + '-list';
  const glide = useGlide(listRef);

  const { groups, flat } = useMemo(() => normalize(options), [options]);
  // navItems is the flat, group-ordered visible set - the index space the keyboard machine,
  // aria-activedescendant and the glide pill all address. Re-derived only when a filter changes.
  const navItems = useMemo(() => flat.filter((o) => matches(o, query)), [flat, query]);

  const show = () => {
    if (!disabled && !loading) setOpen(true);
  };
  const hide = () => setOpen(false);
  const returnFocus = () => triggerRef.current && triggerRef.current.focus();

  function commit(opt: SelectOption) {
    if (!opt || opt.disabled) return;
    onCommit(opt);
    if (closeOnCommit) {
      hide();
      returnFocus();
    }
  }

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  // placement under the trigger, flips above when cramped; layout effect lands coords before paint so the entrance plays in place
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const t = triggerRef.current,
        menu = document.getElementById(menuId);
      if (!t || !menu) return;
      const r = t.getBoundingClientRect(),
        gap = 4;
      menu.style.minWidth = r.width + 'px';
      menu.style.left = Math.round(r.left) + 'px';
      const mh = menu.offsetHeight,
        room = window.innerHeight - r.bottom;
      const above = room < mh + gap && r.top > room;
      menu.style.top = Math.round(above ? r.top - mh - gap : r.bottom + gap) + 'px';
      menu.setAttribute('data-placement', above ? 'top' : 'bottom');
    };
    place();
    const onScroll = () => place();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, menuId, navItems.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const sel = navItems.findIndex((o) => isSelected(o.value) && !o.disabled);
    const first = navItems.findIndex((o) => !o.disabled);
    setActiveIdx(sel >= 0 ? sel : first);
    const ref = searchable ? searchRef : listRef;
    setTimeout(() => {
      if (ref.current) ref.current.focus();
    }, 0); // after the menu paints
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep the active row in view (manual - never scrollIntoView)
  useEffect(() => {
    const list = listRef.current;
    if (!open || activeIdx < 0 || !list) return;
    const el = list.querySelector('[data-idx="' + activeIdx + '"]') as HTMLElement | null;
    if (!el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
  }, [activeIdx, open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drive the glide pill from the active row. It lives in the scroll list (not per-option), so it
  // is never clipped by the searchable rows' collapse wrapper and animates real size between rows.
  useLayoutEffect(() => {
    const list = listRef.current;
    const el =
      open &&
      activeIdx >= 0 &&
      list &&
      list.querySelector<HTMLElement>('[data-idx="' + activeIdx + '"]');
    if (el) glide.enter(el);
    else glide.leave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIdx, query]);

  function moveActive(dir: number) {
    if (!navItems.length) return;
    let i = activeIdx;
    for (let s = 0; s < navItems.length; s++) {
      i = (i + dir + navItems.length) % navItems.length;
      if (!navItems[i].disabled) return setActiveIdx(i);
    }
  }
  function edgeActive(toEnd: boolean) {
    const order = [...navItems.keys()];
    if (toEnd) order.reverse();
    for (const i of order) if (!navItems[i].disabled) return setActiveIdx(i);
  }
  function typeAhead(ch: string) {
    const ta = typeahead.current;
    clearTimeout(ta.t);
    ta.buf += ch.toLowerCase();
    ta.t = setTimeout(() => (ta.buf = ''), 600);
    const i = navItems.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(ta.buf));
    if (i >= 0) setActiveIdx(i);
  }

  function onMenuKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        hide();
        returnFocus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveActive(-1);
        break;
      case 'Home':
        e.preventDefault();
        edgeActive(false);
        break;
      case 'End':
        e.preventDefault();
        edgeActive(true);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIdx >= 0) commit(navItems[activeIdx]);
        break;
      case 'Tab':
        hide();
        break;
      default:
        if (!searchable && e.key.length === 1 && !e.metaKey && !e.ctrlKey) typeAhead(e.key);
    }
  }

  /* option ids are keyed by VALUE, not list position - under filtering an option keeps
     its id as the visible set narrows, so aria-activedescendant never re-points mid-query */
  const optId = (value: string) => baseId + '-opt-' + encodeURIComponent(value);
  const active = activeIdx >= 0 ? navItems[activeIdx] : undefined;
  const adId = open && active ? optId(active.value) : undefined;

  return {
    open,
    query,
    setQuery,
    triggerRef,
    listRef,
    searchRef,
    baseId,
    menuId,
    listId,
    optId,
    adId,
    groups,
    flat,
    navItems,
    glide,
    isSelected,
    show,
    hide,
    commit,
    activeIdx,
    setActiveIdx,
    onMenuKeyDown,
  };
}
