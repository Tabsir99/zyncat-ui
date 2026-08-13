'use client';

import {
  Children,
  Fragment,
  createElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { PresenceContext } from './presence-context';

interface Entry {
  key: string;
  node: ReactElement;
  exiting: boolean;
}

function toEntries(children: ReactNode): Entry[] {
  const out: Entry[] = [];
  Children.forEach(children, (child, index) => {
    if (isValidElement(child)) out.push({ key: String(child.key ?? index), node: child, exiting: false });
  });
  return out;
}

export interface PresenceProps {
  /** Keyed children. A child animates out only if it renders a `<Motion>` carrying `exit`. */
  children?: ReactNode;
  /** Let children present on the first paint play their `animate`. @default true */
  initial?: boolean;
  /** `wait` holds entering children back until the outgoing ones have left. @default 'sync' */
  mode?: 'sync' | 'wait';
  /** Fires once the last exiting child has been removed. */
  onExitComplete?: () => void;
}

export function Presence({ children, initial = true, mode = 'sync', onExitComplete }: PresenceProps) {
  const incoming = toEntries(children);
  const signature = incoming.map((entry) => entry.key).join('|');
  const [shown, setShown] = useState<Entry[]>(incoming);
  const bornAtMount = useRef(new Set(incoming.map((entry) => entry.key)));
  const wasExiting = useRef(false);
  const complete = useRef(onExitComplete);
  complete.current = onExitComplete;
  const claims = useRef(new Map<string, Set<object>>());

  const drop = (key: string) =>
    setShown((previous) => {
      const next = previous.filter((entry) => entry.key !== key || !entry.exiting);
      return next.length === previous.length ? previous : next;
    });

  const claimExit = (key: string) => (): (() => void) => {
    let tokens = claims.current.get(key);
    if (!tokens) {
      tokens = new Set<object>();
      claims.current.set(key, tokens);
    }
    const token = {};
    const held = tokens;
    held.add(token);
    return () => {
      if (!held.delete(token) || held.size) return;
      if (claims.current.get(key) === held) claims.current.delete(key);
      drop(key);
    };
  };

  useLayoutEffect(() => {
    setShown((previous) => {
      const live = new Set(incoming.map((entry) => entry.key));
      const merged: Entry[] = incoming.map((entry) => ({ ...entry }));
      previous.forEach((entry, index) => {
        if (live.has(entry.key)) return;
        if (!claims.current.get(entry.key)?.size) return;
        merged.splice(index, 0, entry.exiting ? entry : { ...entry, exiting: true });
      });
      return merged;
    });
  }, [signature]); // eslint-disable-line react-hooks/exhaustive-deps

  const leaving = shown.some((entry) => entry.exiting);

  useEffect(() => {
    if (wasExiting.current && !leaving) complete.current?.();
    wasExiting.current = leaving;
  }, [leaving]);

  const fresh = new Map(incoming.map((entry) => [entry.key, entry.node]));
  const visible = mode === 'wait' && leaving ? shown.filter((entry) => entry.exiting) : shown;

  return createElement(
    Fragment,
    null,
    visible.map((entry) =>
      createElement(
        PresenceContext.Provider,
        {
          key: entry.key,
          value: {
            isPresent: !entry.exiting,
            initial: initial || !bornAtMount.current.has(entry.key),
            claimExit: claimExit(entry.key),
          },
        },
        fresh.get(entry.key) ?? entry.node,
      ),
    ),
  );
}
