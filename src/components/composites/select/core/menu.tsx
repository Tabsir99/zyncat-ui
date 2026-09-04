'use client';

import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';

import type { Layer } from '../../../../engine';
import { resolveMotionTiming } from '../../../../motion/motion-timing';
import { Presence } from '../../../../motion/presence';
import type { DisableableAnimation } from '../../../../motion/timing';
import { useMotion, type MotionSpecs } from '../../../../motion/use-motion';
import { UIMotion, type MotionTransition } from '../../../../tokens/motion-tokens';
import { menuHighlightAttrs, type MenuHighlightProps } from '../../../internal/menu/highlight';
import { OverlayPortal, useOutsidePress, useOverlayEntry } from '../../../internal/overlay/layer';
import { useAnchorPosition } from '../../../internal/overlay/position';

const SELECT_MENU_TIMING = {
  open: { duration: 'base', ease: 'entrance' },
  close: { duration: 'base', ease: 'exit' },
} as const;

function selectMenuLayers(animation: DisableableAnimation | undefined, dir: 'open' | 'close'): Layer[] {
  const t = resolveMotionTiming(animation, SELECT_MENU_TIMING)[dir];
  const fade = (d: MotionTransition) => ({ duration: d.duration === 0 ? 0 : UIMotion.dur.fast, ease: d.ease });
  const drop = -UIMotion.dist.sm;
  return dir === 'open'
    ? [
        { y: [drop, 0], scale: [UIMotion.scale.floating, 1], timing: t },
        { opacity: [0, 1], timing: fade(t) },
      ]
    : [
        { y: [drop], scale: [UIMotion.scale.floating], timing: t },
        { opacity: [0], timing: fade(t) },
      ];
}

export interface SelectMenuProps extends MenuHighlightProps {
  open: boolean;
  menuId: string;
  requestClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  multiple?: boolean;
  animation?: DisableableAnimation;
  children?: ReactNode;
}

function MenuSurface({
  menuId,
  requestClose,
  triggerRef,
  multiple,
  highlight,
  rail,
  animate,
  exit,
  children,
}: Omit<SelectMenuProps, 'open' | 'animation'> & MotionSpecs) {
  const menuRef = useRef<HTMLDivElement>(null);
  const entry = useOverlayEntry({ nodeRef: menuRef, dismissible: true, requestClose });
  useMotion(menuRef, { animate, exit });
  useLayoutEffect(() => {
    const apply = () => {
      const t = triggerRef.current;
      if (t && menuRef.current) menuRef.current.style.minWidth = t.getBoundingClientRect().width + 'px';
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useAnchorPosition({ side: 'bottom', align: 'start', arrow: false, triggerRef, panelRef: menuRef });
  useOutsidePress({ entry, refs: [menuRef, triggerRef], enabled: true, onPress: requestClose });

  return (
    <div
      ref={menuRef}
      className="zc-menu-surface zc-select__menu"
      id={menuId}
      role="presentation"
      data-multiple={multiple ? 'true' : undefined}
      {...menuHighlightAttrs({ highlight, rail })}
    >
      {children}
    </div>
  );
}

export function SelectMenu({
  open,
  menuId,
  requestClose,
  triggerRef,
  multiple,
  highlight,
  rail,
  animation,
  children,
}: SelectMenuProps) {
  return (
    <OverlayPortal>
      <Presence>
        {open && (
          <MenuSurface
            key="menu"
            animate={selectMenuLayers(animation, 'open')}
            exit={selectMenuLayers(animation, 'close')}
            menuId={menuId}
            requestClose={requestClose}
            triggerRef={triggerRef}
            multiple={multiple}
            highlight={highlight}
            rail={rail}
          >
            {children}
          </MenuSurface>
        )}
      </Presence>
    </OverlayPortal>
  );
}
