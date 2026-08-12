'use client';

import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
import type { Layer } from '../../../../engine';
import { Presence } from '../../../../motion/presence';
import { UIMotion, type MotionTransition } from '../../../../tokens/motion-tokens';
import { resolveMotionTiming } from '../../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../../motion/timing';
import { OverlayPortal, useOverlayEntry, useOutsidePress } from '../../../internal/overlay/layer';
import { useAnchorPosition } from '../../../internal/overlay/position';

const SELECT_MENU_TIMING = {
  open: { duration: 'base', ease: 'entrance' },
  close: { duration: 'base', ease: 'exit' },
} as const;

function selectMenuLayers(animation: DisableableAnimation | undefined, dir: 'open' | 'close'): Layer[] {
  const t = resolveMotionTiming(animation, SELECT_MENU_TIMING)[dir];
  const fade = (d: MotionTransition) => ({ duration: d.duration === 0 ? 0 : UIMotion.dur.fast, ease: d.ease });
  return dir === 'open'
    ? [
        { y: [-6, 0], scale: [0.96, 1], timing: t },
        { opacity: [0, 1], timing: fade(t) },
      ]
    : [
        { y: [-6], scale: [0.96], timing: t },
        { opacity: [0], timing: fade(t) },
      ];
}

export interface SelectMenuProps {
  open: boolean;
  menuId: string;
  close: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  multiple?: boolean;
  /** Open/close timing - motion tokens only, or `null` to disable. */
  animation?: DisableableAnimation;
  children?: ReactNode;
}

function MenuSurface({ menuId, close, triggerRef, multiple, children }: Omit<SelectMenuProps, 'open' | 'animation'>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const entry = useOverlayEntry({ nodeRef: menuRef, dismissible: true, requestClose: close });
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
  useOutsidePress({ entry, refs: [menuRef, triggerRef], enabled: true, onPress: close });

  return (
    <div
      ref={menuRef}
      className="select__menu"
      id={menuId}
      role="presentation"
      data-multiple={multiple ? 'true' : undefined}
    >
      {children}
    </div>
  );
}

export function SelectMenu({ open, menuId, close, triggerRef, multiple, animation, children }: SelectMenuProps) {
  return (
    <OverlayPortal>
      <Presence
        style={{ display: 'contents' }}
        enter={selectMenuLayers(animation, 'open')}
        exit={selectMenuLayers(animation, 'close')}
      >
        {open && (
          <MenuSurface key="menu" menuId={menuId} close={close} triggerRef={triggerRef} multiple={multiple}>
            {children}
          </MenuSurface>
        )}
      </Presence>
    </OverlayPortal>
  );
}
