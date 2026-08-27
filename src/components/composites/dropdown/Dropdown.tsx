'use client';

import './dropdown.css';

import {
  Fragment,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type RefObject,
} from 'react';

import type { DataAttributes } from '../../../dom-props';
import { resolveMotionTiming } from '../../../motion/motion-timing';
import { Presence } from '../../../motion/presence';
import { popIn, popOut } from '../../../motion/presets';
import type { DisableableAnimation } from '../../../motion/timing';
import { UIMotion } from '../../../tokens/motion-tokens';
import { useControllable } from '../../internal/hooks/use-controllable';
import { ovCloneTrigger, OverlayPortal } from '../../internal/overlay/layer';
import { MenuPanel } from './menu-panel';
import {
  levelKey,
  resolveLevels,
  ROOT_LEVEL,
  type DropdownItem,
  type DropdownItems,
  type MenuChain,
  type SeedFocus,
} from './types';

export type { DropdownItem, DropdownGroup } from './types';

const DROPDOWN_TIMING = {
  open: { duration: 'base', ease: 'entrance' },
  close: { duration: 'fast', ease: 'exit' },
} as const;

export interface DropdownProps {
  /** The rows - a flat `DropdownItem[]`, or `DropdownGroup[]` to render divided sections.
   *  A row with its own `items` opens a submenu instead of committing. @default [] */
  items: DropdownItems;
  /** Cloned to toggle the menu, and used as the anchor. Gets the `aria-haspopup="menu"` wiring. */
  trigger: ReactElement;

  /** Controlled open state. Omit to stay uncontrolled. */
  open?: boolean;
  /** Initial state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Fires whenever the open state changes. Pair with `open` for controlled use. */
  onOpenChange?: (open: boolean) => void;
  /** Fires when a row commits - gets its `id` and the full item. Committing closes every level. */
  onSelect?: (id: string, item: DropdownItem) => void;

  /** Preferred side of the trigger; flips to the opposite side when cramped. @default 'bottom' */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Cross-axis alignment against the trigger. Submenus always align to their row. @default 'start' */
  align?: 'start' | 'center' | 'end';

  /** Base id for the menu and its rows; drives the trigger's `aria-controls`. Auto-generated when omitted. */
  id?: string;
  /** Accessible name for the menu - supply when the trigger's own label does not describe it. */
  ariaLabel?: string;
  /** Standard attributes (className, style, data-*, ...) forwarded to the top-level menu panel. */
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  /** Open/close timing - motion tokens only, or `null` to disable. @default open 'base'/'entrance', close 'fast'/'exit' */
  animation?: DisableableAnimation;
}

export function Dropdown({
  items = [],
  trigger,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  side = 'bottom',
  align = 'start',
  id,
  ariaLabel,
  htmlProps,
  animation,
}: DropdownProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const [path, setPath] = useState<string[]>([]);
  const [seed, setSeed] = useState({ key: ROOT_LEVEL, focus: 'first' as SeedFocus });

  const refs = useRef(new Map<string, RefObject<HTMLElement>>());
  const hoverDepth = useRef(-1);
  const autoId = useId();
  const menuId = id || 'dropdown-' + autoId;
  const timings = resolveMotionTiming(animation, DROPDOWN_TIMING);
  const levels = useMemo(() => resolveLevels(items, path), [items, path]);

  const refFor = (key: string): RefObject<HTMLElement> => {
    if (!refs.current.has(key)) refs.current.set(key, { current: null });
    return refs.current.get(key)!;
  };
  const triggerRef = refFor('trigger');

  const dismiss = (returnFocus: boolean) => {
    setPath([]);
    hoverDepth.current = -1;
    setOpen(false);
    if (returnFocus && triggerRef.current) triggerRef.current.focus();
  };

  const show = (focus: SeedFocus) => {
    setSeed({ key: ROOT_LEVEL, focus });
    setPath([]);
    setOpen(true);
  };

  const chain: MenuChain = {
    levels,
    menuId,
    side,
    align,
    ariaLabel,
    htmlProps,
    seed,
    hoverDepth,
    refFor,
    dismiss,
    openSub: (depth, item, focus) => {
      setSeed({ key: levelKey(depth + 1, item.id), focus });
      setPath([...path.slice(0, depth), item.id]);
    },
    closeSub: (depth) => {
      if (path.length > depth) setPath(path.slice(0, depth));
    },
    cancel: (depth) => {
      if (depth === 0) return dismiss(true);
      setPath(path.slice(0, depth - 1));
      const owner = refFor('row:' + levelKey(depth - 1, levels[depth].owner!.id)).current;
      if (owner) owner.focus();
    },
    select: (item) => {
      if (item.onSelect) item.onSelect();
      if (onSelect) onSelect(item.id, item);
      dismiss(true);
    },
  };

  return (
    <Fragment>
      {ovCloneTrigger(trigger, {
        open,
        onPress: () => (open ? dismiss(false) : show('first')),
        onKeyDown: (e) => {
          if (open || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
          e.preventDefault();
          show(e.key === 'ArrowDown' ? 'first' : 'last');
        },
        panelId: menuId,
        haspopup: 'menu',
        triggerRef,
      })}
      <OverlayPortal>
        <Presence>
          {open &&
            levels.map((level, depth) => (
              <MenuPanel
                key={level.key}
                chain={chain}
                depth={depth}
                animate={popIn(UIMotion.scale.floating, timings.open)}
                exit={popOut(UIMotion.scale.floating, timings.close)}
              />
            ))}
        </Presence>
      </OverlayPortal>
    </Fragment>
  );
}
