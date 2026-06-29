'use client';

/* select-core.tsx — the shared MECHANICS under Select + MultiSelect.
   ─────────────────────────────────────────────────────────────────────────
   Per CLAUDE.md A9, the two selects are SEPARATE components: they own their
   selection state, commit semantics, and row indicators themselves. This core
   holds only what is genuinely variant-blind, and it holds NO selection state:

     hooks      useControllable (value plumbing) · useSelectMenu (the listbox
                machinery: roving active row, keyboard model, typeahead,
                outside-dismiss, fixed-coords placement + flip, focus seeding,
                keep-active-in-view)
     pure fns   normalize (flat|grouped options) · matches (filter predicate)
     chrome     SelectTrigger · SelectMenu (Motion existence) · SearchField ·
                FilterRow · EmptyRow · LoadingRows — presentational only

   The menu is a plain React-owned node lifted by z-index (NOT the Popover API:
   React can't remove a [popover] once promoted to the top layer — verified),
   positioned in JS because anchor() needs the top layer. */
import * as React from 'react';
import { m as coreMotion, AnimatePresence as CoreAnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';
import { IconSlot } from '../icon/IconSlot';

const coreSM = UIMotion;
const {
  useState: coreUseState,
  useEffect: coreUseEffect,
  useLayoutEffect: coreUseLayoutEffect,
  useRef: coreUseRef,
} = React;

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  /** Your own icon node shown before the label. */
  icon?: React.ReactNode;
  disabled?: boolean;
}
export interface SelectGroup {
  label?: string;
  options: SelectOption[];
}

interface NormalizedGroup {
  label: string | null | undefined;
  options: SelectOption[];
}

/* Controlled/uncontrolled value in one line. setValue writes internal only
   when uncontrolled, always fires onChange. */
export function useControllable<T, O = SelectOption>(
  controlled: T | undefined,
  initial: T,
  onChange?: (next: T, opt?: O) => void,
): [T, (next: T, opt?: O) => void] {
  const [internal, setInternal] = coreUseState<T>(initial);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : internal;
  const setValue = (next: T, opt?: O) => {
    if (!isControlled) setInternal(next);
    onChange && onChange(next, opt);
  };
  return [value, setValue];
}

/* Flat list OR grouped input → uniform [{label?, options}] groups + flat array. */
export function normalize(options: SelectOption[] | SelectGroup[]): {
  groups: NormalizedGroup[];
  flat: SelectOption[];
} {
  const grouped =
    options.length > 0 && options[0] && Array.isArray((options[0] as SelectGroup).options);
  const groups: NormalizedGroup[] = grouped
    ? (options as SelectGroup[]).map((g) => ({ label: g.label, options: g.options || [] }))
    : [{ label: null, options: options as SelectOption[] }];
  return { groups, flat: groups.flatMap((g) => g.options) };
}

export const matches = (o: SelectOption, q: string) =>
  !q || (o.label + ' ' + (o.description || '')).toLowerCase().includes(q.toLowerCase());

/* Enter: decelerate-and-settle from the trigger; exit: accelerate away.
   Opacity rides a faster clock than the slide. */
const selectMenuVariants = {
  closed: {
    opacity: 0,
    y: -6,
    scale: 0.96,
    transition: {
      duration: coreSM.dur.base,
      ease: coreSM.ease.exit,
      opacity: { duration: coreSM.dur.fast, ease: coreSM.ease.exit },
    },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: coreSM.dur.base,
      ease: coreSM.ease.entrance,
      opacity: { duration: coreSM.dur.fast, ease: coreSM.ease.entrance },
    },
  },
};

export interface UseSelectMenuArgs {
  open: boolean;
  close: () => void;
  returnFocus: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  searchRef: React.RefObject<HTMLInputElement | null>;
  menuId: string;
  navItems: SelectOption[];
  isSelected: (value: string) => boolean;
  commit: (opt: SelectOption) => void;
  searchable: boolean;
}

/* The whole open-menu interaction machine. Variant-blind: it roams rows,
   handles keys, places and dismisses the menu — selection itself stays with
   the caller (isSelected reads it, commit writes it).
   Returns { activeIdx, setActiveIdx, onMenuKeyDown }. */
export function useSelectMenu({
  open,
  close,
  returnFocus,
  triggerRef,
  listRef,
  searchRef,
  menuId,
  navItems,
  isSelected,
  commit,
  searchable,
}: UseSelectMenuArgs) {
  const [activeIdx, setActiveIdx] = coreUseState(-1);
  const typeahead = coreUseRef<{ buf: string; t: ReturnType<typeof setTimeout> | number }>({
    buf: '',
    t: 0,
  });

  // outside-click dismiss (the menu isn't in the top layer, so we own this)
  coreUseEffect(() => {
    if (!open) return undefined;
    const onDocPointer = (e: PointerEvent) => {
      const t = triggerRef.current,
        menu = document.getElementById(menuId);
      const target = e.target as Node;
      if ((t && t.contains(target)) || (menu && menu.contains(target))) return;
      close();
    };
    document.addEventListener('pointerdown', onDocPointer, true);
    return () => document.removeEventListener('pointerdown', onDocPointer, true);
  }, [open, menuId]); // eslint-disable-line react-hooks/exhaustive-deps

  // fixed-coords placement under the trigger; flips above when out of room;
  // re-measures on scroll/resize. Layout effect: coords land before first
  // paint, so Motion's entrance plays at the final position.
  coreUseLayoutEffect(() => {
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

  // on open: seed active at the selection (or first enabled) + move focus in
  coreUseEffect(() => {
    if (!open) return;
    const sel = navItems.findIndex((o) => isSelected(o.value) && !o.disabled);
    const first = navItems.findIndex((o) => !o.disabled);
    setActiveIdx(sel >= 0 ? sel : first);
    const ref = searchable ? searchRef : listRef;
    setTimeout(() => {
      if (ref.current) ref.current.focus();
    }, 0); // after the menu paints
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep the active row in view (manual — never scrollIntoView)
  coreUseEffect(() => {
    const list = listRef.current;
    if (!open || activeIdx < 0 || !list) return;
    const el = list.querySelector('[data-idx="' + activeIdx + '"]') as HTMLElement | null;
    if (!el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
  }, [activeIdx, open]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // keyboard while OPEN (shared by search input + list)
  function onMenuKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
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
        close();
        break;
      default:
        if (!searchable && e.key.length === 1 && !e.metaKey && !e.ctrlKey) typeAhead(e.key);
    }
  }

  return { activeIdx, setActiveIdx, onMenuKeyDown };
}

/* ── Presentational chrome (stateless) ─────────────────────────────────────*/

export interface SelectTriggerProps {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  baseId: string;
  open: boolean;
  disabled?: boolean;
  invalid?: boolean;
  ariaLabel?: string;
  adId?: string;
  show: () => void;
  hide: () => void;
  leading?: React.ReactNode;
  text?: string;
  isPlaceholder?: boolean;
  count?: number;
}

export function SelectTrigger({
  triggerRef,
  baseId,
  open,
  disabled,
  invalid,
  ariaLabel,
  adId,
  show,
  hide,
  leading,
  text,
  isPlaceholder,
  count,
}: SelectTriggerProps) {
  return (
    <button
      type="button"
      ref={triggerRef}
      id={baseId + '-trigger'}
      className="select__trigger"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={baseId + '-list'}
      aria-activedescendant={adId}
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      onClick={() => (open ? hide() : show())}
      onKeyDown={(e) => {
        if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault();
          show();
        }
      }}
    >
      {leading && (
        <span className="select__leading">
          <IconSlot size="sm">{leading}</IconSlot>
        </span>
      )}
      <span className="select__value" data-placeholder={isPlaceholder ? 'true' : undefined}>
        {text}
      </span>
      {count != null && count > 0 && <span className="select__count">+{count}</span>}
      <span className="select__caret">
        <Icon name="caret-down" size="sm" />
      </span>
    </button>
  );
}

export interface SelectMenuProps {
  open: boolean;
  menuId: string;
  children?: React.ReactNode;
}

/* Existence: mounted only while open, unmounted after the exit plays. */
export function SelectMenu({ open, menuId, children }: SelectMenuProps) {
  return (
    <CoreAnimatePresence>
      {open && (
        <coreMotion.div
          className="select__menu"
          id={menuId}
          role="presentation"
          variants={selectMenuVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          {children}
        </coreMotion.div>
      )}
    </CoreAnimatePresence>
  );
}

export interface SearchFieldProps {
  searchRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  onQuery: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  listId: string;
  adId?: string;
}

export function SearchField({
  searchRef,
  query,
  onQuery,
  onKeyDown,
  placeholder,
  listId,
  adId,
}: SearchFieldProps) {
  return (
    <div className="select__search">
      <Icon name="magnifying-glass" size="sm" />
      <input
        ref={searchRef}
        className="select__search-input"
        type="text"
        value={query}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-controls={listId}
        aria-activedescendant={adId}
        onChange={(e) => onQuery(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

export interface FilterRowProps {
  visible: boolean;
  children?: React.ReactNode;
}

/* Collapse wrapper for filterable rows — rows ease out instead of popping. */
export function FilterRow({ visible, children }: FilterRowProps) {
  return (
    <div
      className="collapse collapse--fade"
      data-open={visible ? 'true' : 'false'}
      data-axis="height"
    >
      <div className="collapse__inner">{children}</div>
    </div>
  );
}

export function EmptyRow({ query }: { query: string }) {
  return (
    <div className="select__empty">
      {query ? 'No matches for “' + query + '”' : 'No options available'}
    </div>
  );
}

export function LoadingRows() {
  return (
    <div className="select__loading" aria-busy="true" aria-live="polite">
      {[0, 1, 2].map((i) => (
        <div className="select__skeleton" key={i}>
          <span className="select__skeleton-dot" data-pulse></span>
          <span className="select__skeleton-bar" data-pulse></span>
        </div>
      ))}
    </div>
  );
}
