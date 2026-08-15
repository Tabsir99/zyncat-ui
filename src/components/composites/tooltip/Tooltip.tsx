'use client';

import './tooltip.css';
import {
  Fragment,
  useEffect,
  useId,
  useRef,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { store, useHostElection, OPEN_DELAY, CLOSE_GRACE, type Placement } from './tooltip-store';
import { TooltipHost } from './tooltip-host';
import type { DataAttributes } from '../../../dom-props';
import { cx } from '../../internal/utils/cx';

export interface TooltipProps {
  /** The hint - a string or small node; never interactive content. */
  content: ReactNode;
  /** Optional keyboard hint, rendered as mono metadata ("⌘↩", "S"). */
  shortcut?: string | null;
  /** Preferred side; flips automatically when out of viewport room. */
  placement?: Placement;
  /** Suppress the tooltip entirely (trigger renders untouched). */
  disabled?: boolean;
  /** ms before a cold hover shows; warm hovers + focus are instant. Default 350. */
  openDelay?: number;
  /** ms the bubble lingers after leaving (bridges moving to a neighbour). Default 140. */
  closeDelay?: number;
  /** Stable id for this trigger's store entry - lets overlapping triggers race safely under
   *  the one shared tooltip host. Not rendered to the DOM. Auto-generated when omitted. */
  id?: string;
  /** Exactly one element. */
  children: ReactElement;
  /** Standard <span> attributes forwarded to the anchor wrapper. */
  htmlProps?: HTMLAttributes<HTMLSpanElement> & DataAttributes;
}

export function Tooltip({
  content,
  shortcut = null,
  placement = 'top',
  disabled = false,
  openDelay = OPEN_DELAY,
  closeDelay = CLOSE_GRACE,
  id,
  children,
  htmlProps,
}: TooltipProps) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const myId = id || 'tip-' + useId();
  const isHost = useHostElection();

  const anchorEl = (): HTMLElement | null => (wrapRef.current?.firstElementChild as HTMLElement) ?? null;

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      store.close(myId, 0);
    },
    [],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  function show(immediate: boolean) {
    if (disabled) return;
    clearTimeout(openTimer.current);
    if (!anchorEl()) return;
    const open = () =>
      store.open({
        id: myId,
        content,
        shortcut,
        placement,
        anchor: anchorEl,
        rect: () => anchorEl()!.getBoundingClientRect(),
      });
    if (immediate || store.isWarm()) open();
    else openTimer.current = setTimeout(open, openDelay);
  }
  function hide() {
    clearTimeout(openTimer.current);
    store.close(myId, closeDelay);
  }

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') show(false);
  };
  const onFocusIn = (e: FocusEvent) => {
    if ((e.target as HTMLElement).matches(':focus-visible')) show(true);
  };

  return (
    <Fragment>
      <span
        {...htmlProps}
        ref={wrapRef}
        className={cx('tooltip-anchor', htmlProps?.className)}
        onPointerEnter={onEnter}
        onPointerLeave={hide}
        onPointerDown={hide}
        onFocus={onFocusIn}
        onBlur={hide}
      >
        {children}
      </span>
      {isHost && <TooltipHost />}
    </Fragment>
  );
}
