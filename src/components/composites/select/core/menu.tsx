'use client';

/* The portaled, animated menu surface - the overlay-stack membership, anchored placement
   and the open/close motion. Selection and list rendering live elsewhere; this file only
   mounts the surface. */
import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion } from '../../../../tokens/motion-tokens';
import { OverlayPortal, useOverlayEntry, useOutsidePress } from '../../../internal/overlay/layer';
import { useAnchorPosition } from '../../../internal/overlay/position';

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
function MenuSurface({ menuId, close, triggerRef, multiple, children }: Omit<SelectMenuProps, 'open'>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const entry = useOverlayEntry({ nodeRef: menuRef, dismissible: true, requestClose: close });
  /* Width policy is the menu's, not the positioner's: never paint narrower than the control.
     Declared before useAnchorPosition so placement measures the widened panel. */
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
export function SelectMenu({ open, menuId, close, triggerRef, multiple, children }: SelectMenuProps) {
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
