'use client';

/* select-core - shared listbox mechanics for Select + MultiSelect; holds no selection state.
   Selection stays with the public components: they own their value shape and hand
   this module two opaque callbacks (isSelected / onCommit) plus a close policy. */
import './select.css';
import {
  Fragment,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';
import { IconSlot } from '../icon/IconSlot';
import { Collapse } from '../motion/Collapse';
import { GlidePill, useGlide } from '../motion/glide';
import { OverlayPortal, useOverlayEntry, useOutsidePress } from '../overlay/layer';

export interface SelectOption {
  /** The stored value - what `onChange` returns and `value` matches; must be unique. */
  value: string;
  /** Primary row text, and the trigger label once selected; also matched by `searchable`. */
  label: string;
  /** Optional secondary line under the label; also matched by `searchable`. */
  description?: string;
  /** Your own icon node shown before the label. */
  icon?: ReactNode;
  /** Not selectable - skipped by keyboard nav and typeahead, and marked `aria-disabled`. @default false */
  disabled?: boolean;
}
export interface SelectGroup {
  /** Section heading rendered above the options; omit for an unlabeled group. */
  label?: string;
  /** The options in this section. */
  options: SelectOption[];
}

interface NormalizedGroup {
  label: string | null | undefined;
  options: SelectOption[];
}

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

/* Enter decelerates from the trigger, exit accelerates away; opacity rides a faster clock than the slide. */
const selectMenuVariants = {
  closed: {
    opacity: 0,
    y: -6,
    scale: 0.96,
    transition: {
      duration: UIMotion.dur.base,
      ease: UIMotion.ease.exit,
      opacity: { duration: UIMotion.dur.fast, ease: UIMotion.ease.exit },
    },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: UIMotion.dur.base,
      ease: UIMotion.ease.entrance,
      opacity: { duration: UIMotion.dur.fast, ease: UIMotion.ease.entrance },
    },
  },
};

export interface UseSelectMenuArgs {
  open: boolean;
  close: () => void;
  returnFocus: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
  searchRef: RefObject<HTMLInputElement | null>;
  menuId: string;
  navItems: SelectOption[];
  isSelected: (value: string) => boolean;
  commit: (opt: SelectOption) => void;
  searchable: boolean;
}

/* The open-menu interaction machine - variant-blind; selection stays with the caller (isSelected/commit). */
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
  const [activeIdx, setActiveIdx] = useState(-1);
  const typeahead = useRef<{ buf: string; t: ReturnType<typeof setTimeout> | number }>({
    buf: '',
    t: 0,
  });

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

export interface SelectTriggerProps {
  triggerRef: RefObject<HTMLButtonElement | null>;
  baseId: string;
  open: boolean;
  disabled?: boolean;
  invalid?: boolean;
  ariaLabel?: string;
  adId?: string;
  show: () => void;
  hide: () => void;
  leading?: ReactNode;
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
  close: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  multiple?: boolean;
  children?: ReactNode;
}

/* The mounted surface joins the overlay stack: dialog focus traps defer to it,
   Escape unwinds menu-then-dialog, and light dismiss comes from the stack too. */
function MenuSurface({
  menuId,
  close,
  triggerRef,
  multiple,
  children,
}: Omit<SelectMenuProps, 'open'>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const entry = useOverlayEntry({ nodeRef: menuRef, dismissible: true, requestClose: close });
  useOutsidePress({ entry, refs: [menuRef, triggerRef], enabled: true, onPress: close });
  return (
    <motion.div
      ref={menuRef}
      className="select__menu"
      id={menuId}
      role="presentation"
      data-multiple={multiple ? 'true' : undefined}
      variants={selectMenuVariants}
      initial="closed"
      animate="open"
      exit="closed"
    >
      {children}
    </motion.div>
  );
}

/* Body-portaled (via layer.tsx) so an ancestor transform/filter can never become
   the containing block of the fixed-position menu - the playground could not
   catch that; any transformed wrapper in a real app would. */
export function SelectMenu({
  open,
  menuId,
  close,
  triggerRef,
  multiple,
  children,
}: SelectMenuProps) {
  return (
    <OverlayPortal>
      <AnimatePresence>
        {open && (
          <MenuSurface menuId={menuId} close={close} triggerRef={triggerRef} multiple={multiple}>
            {children}
          </MenuSurface>
        )}
      </AnimatePresence>
    </OverlayPortal>
  );
}

export interface SearchFieldProps {
  searchRef: RefObject<HTMLInputElement | null>;
  query: string;
  onQuery: (value: string) => void;
  onKeyDown: (e: KeyboardEvent) => void;
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
  children?: ReactNode;
}

/* Collapse wrapper for filterable rows - rows ease out instead of popping. */
export function FilterRow({ visible, children }: FilterRowProps) {
  return (
    <Collapse open={visible} fade>
      {children}
    </Collapse>
  );
}

export function EmptyRow({ query }: { query: string }) {
  return (
    <div className="select__empty">
      {query ? 'No matches for "' + query + '"' : 'No options available'}
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

/* One listbox brain for both variants: open/query/refs/ids, option filtering,
   glide-pill tracking and the keyboard machine. Never inspects the value shape. */
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

  const triggerRef = useRef<HTMLButtonElement>(null),
    listRef = useRef<HTMLDivElement>(null),
    searchRef = useRef<HTMLInputElement>(null);
  const baseId = id || idPrefix + useId();
  const menuId = baseId + '-menu';
  const listId = baseId + '-list';
  const glide = useGlide(listRef);

  const { groups, flat } = normalize(options);
  const navItems: SelectOption[] = [];
  groups.forEach((g) =>
    g.options.forEach((o) => {
      if (matches(o, query)) navItems.push(o);
    }),
  );

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

  const { activeIdx, setActiveIdx, onMenuKeyDown } = useSelectMenu({
    open,
    close: hide,
    returnFocus,
    triggerRef,
    listRef,
    searchRef,
    menuId,
    navItems,
    isSelected,
    commit,
    searchable,
  });

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

export interface ListboxPanelProps {
  lb: ListboxState;
  loading: boolean;
  searchable: boolean;
  searchPlaceholder?: string;
  ariaLabel?: string;
  multiple?: boolean;
  /** Row check-slot renderer; the default is the single-select checkmark. */
  check?: (selected: boolean) => ReactNode;
}

const defaultCheck = (selected: boolean) =>
  selected ? <Icon key="on" name="check" size="sm" weight="bold" /> : null;

/* The shared menu render - search field, listbox, group loop, option rows, glide pill. */
export function ListboxPanel({
  lb,
  loading,
  searchable,
  searchPlaceholder,
  ariaLabel,
  multiple,
  check = defaultCheck,
}: ListboxPanelProps) {
  let vIdx = -1;
  return (
    <SelectMenu
      open={lb.open}
      menuId={lb.menuId}
      close={lb.hide}
      triggerRef={lb.triggerRef}
      multiple={multiple}
    >
      {searchable && !loading && (
        <SearchField
          searchRef={lb.searchRef}
          query={lb.query}
          onQuery={lb.setQuery}
          onKeyDown={lb.onMenuKeyDown}
          placeholder={searchPlaceholder}
          listId={lb.listId}
          adId={lb.adId}
        />
      )}

      <div
        className="select__list"
        ref={lb.listRef}
        id={lb.listId}
        role="listbox"
        aria-multiselectable={multiple || undefined}
        tabIndex={-1}
        aria-label={ariaLabel}
        onKeyDown={searchable ? undefined : lb.onMenuKeyDown}
      >
        <GlidePill className="select__glide" rect={lb.glide.rect} active={lb.glide.active} />
        {loading ? (
          <LoadingRows />
        ) : (
          <Fragment>
            {lb.groups.map((g, gi) => (
              <div
                className="select__group"
                role="group"
                aria-label={g.label || undefined}
                key={gi}
              >
                {g.label && g.options.some((o) => matches(o, lb.query)) && (
                  <div className="select__group-label">{g.label}</div>
                )}
                {g.options.map((opt) => {
                  const visible = matches(opt, lb.query);
                  const i = visible ? ((vIdx += 1), vIdx) : -1;
                  const isSel = lb.isSelected(opt.value);
                  const row = (
                    <div
                      key={opt.value}
                      id={visible ? lb.optId(opt.value) : undefined}
                      data-idx={visible ? i : undefined}
                      className="select__option"
                      role="option"
                      aria-selected={isSel}
                      aria-hidden={!visible || undefined}
                      aria-disabled={opt.disabled || undefined}
                      data-selected={isSel ? 'true' : undefined}
                      data-active={visible && i === lb.activeIdx ? 'true' : undefined}
                      data-disabled={opt.disabled ? 'true' : undefined}
                      onMouseEnter={() => visible && !opt.disabled && lb.setActiveIdx(i)}
                      onMouseDown={(e) => e.preventDefault() /* keep focus on list */}
                      onClick={() => visible && lb.commit(opt)}
                    >
                      {opt.icon && (
                        <span className="select__option-icon">
                          <IconSlot size="sm">{opt.icon}</IconSlot>
                        </span>
                      )}
                      <span className="select__option-text">
                        <span className="select__option-label">{opt.label}</span>
                        {opt.description && (
                          <span className="select__option-desc">{opt.description}</span>
                        )}
                      </span>
                      <span className="select__option-check">{check(isSel)}</span>
                    </div>
                  );
                  return searchable ? (
                    <FilterRow key={opt.value} visible={visible}>
                      {row}
                    </FilterRow>
                  ) : (
                    row
                  );
                })}
              </div>
            ))}
            {lb.navItems.length === 0 && <EmptyRow query={lb.query} />}
          </Fragment>
        )}
      </div>
    </SelectMenu>
  );
}
