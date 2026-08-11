'use client';

import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion, type MotionTransition } from '../../../../tokens/motion-tokens';
import { resolveMotionTiming } from '../../../../motion/motion-timing';
import type { DisableableAnimation } from '../../../../motion/timing';
import { OverlayPortal, useOverlayEntry, useOutsidePress } from '../../../internal/overlay/layer';
import { useAnchorPosition } from '../../../internal/overlay/position';

const SELECT_MENU_TIMING = {
  open: { duration: 'base', ease: 'entrance' },
  close: { duration: 'base', ease: 'exit' },
} as const;

function selectMenuVariants(animation: DisableableAnimation | undefined) {
  const t = resolveMotionTiming(animation, SELECT_MENU_TIMING);
  const opacity = (d: MotionTransition) => ({ duration: d.duration === 0 ? 0 : UIMotion.dur.fast, ease: d.ease });
  return {
    closed: { opacity: 0, y: -6, scale: 0.96, transition: { ...t.close, opacity: opacity(t.close) } },
    open: { opacity: 1, y: 0, scale: 1, transition: { ...t.open, opacity: opacity(t.open) } },
  };
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

function MenuSurface({ menuId, close, triggerRef, multiple, animation, children }: Omit<SelectMenuProps, 'open'>) {
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
    <motion.div
      ref={menuRef}
      className="select__menu"
      id={menuId}
      role="presentation"
      data-multiple={multiple ? 'true' : undefined}
      variants={selectMenuVariants(animation)}
      initial="closed"
      animate="open"
      exit="closed"
    >
      {children}
    </motion.div>
  );
}

export function SelectMenu({ open, menuId, close, triggerRef, multiple, animation, children }: SelectMenuProps) {
  return (
    <OverlayPortal>
      <AnimatePresence>
        {open && (
          <MenuSurface menuId={menuId} close={close} triggerRef={triggerRef} multiple={multiple} animation={animation}>
            {children}
          </MenuSurface>
        )}
      </AnimatePresence>
    </OverlayPortal>
  );
}
