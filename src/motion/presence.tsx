'use client';

import {
  Children,
  createElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { flip, measure, type Box, type Playback, type Timing } from '../engine';

export type Plays = Playback | Playback[] | null | undefined | void;

const toList = (plays: Plays): Playback[] => (!plays ? [] : Array.isArray(plays) ? plays : [plays]);

const allSettled = (plays: Playback[]): Promise<void> =>
  plays.length ? Promise.all(plays.map((play) => play.finished)).then((): void => {}) : Promise.resolve();

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
  /** Keyed children. Each must render exactly one element. */
  children?: ReactNode;
  /** Animate the children already present on first paint. @default true */
  initial?: boolean;
  /** Plays when a child is added. */
  enter?: (el: HTMLElement) => Plays;
  /** Plays when a child is removed; it stays mounted until these finish. */
  exit?: (el: HTMLElement) => Plays;
  /** Reflow surviving children with FLIP at this timing. */
  flip?: Timing | false;
  /** Tag for the container element this renders. @default 'div' */
  as?: string;
  [prop: string]: unknown;
}

export function Presence({
  children,
  initial = true,
  enter,
  exit,
  flip: reflow = false,
  as = 'div',
  ...rest
}: PresenceProps) {
  const incoming = toEntries(children);
  const signature = incoming.map((entry) => entry.key).join('|');
  const [shown, setShown] = useState<Entry[]>(incoming);

  const host = useRef<HTMLElement | null>(null);
  const phase = useRef(new Map<string, 'in' | 'out'>());
  const playing = useRef(new Map<string, Playback[]>());
  const boxes = useRef(new Map<string, Box>());
  const bornAtMount = useRef(new Set(incoming.map((entry) => entry.key)));
  const spec = useRef({ enter, exit, reflow });
  spec.current = { enter, exit, reflow };

  useLayoutEffect(() => {
    setShown((previous) => {
      const fresh = new Map(incoming.map((entry) => [entry.key, entry.node]));
      const merged: Entry[] = [];
      for (const entry of previous) {
        const replacement = fresh.get(entry.key);
        if (replacement) merged.push({ key: entry.key, node: replacement, exiting: false });
        else merged.push(entry.exiting ? entry : { ...entry, exiting: true });
      }
      const seen = new Set(previous.map((entry) => entry.key));
      for (const entry of incoming) if (!seen.has(entry.key)) merged.push(entry);
      return merged;
    });
  }, [signature]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const container = host.current;
    if (!container) return;
    const els = Array.from(container.children) as HTMLElement[];
    const { enter: playEnter, exit: playExit, reflow: flipTiming } = spec.current;

    const stop = (key: string) => {
      for (const play of playing.current.get(key) ?? []) play.stop();
      playing.current.delete(key);
    };

    shown.forEach((entry, index) => {
      const el = els[index];
      if (!el) return;
      const at = phase.current.get(entry.key);

      if (entry.exiting) {
        if (at === 'out') return;
        phase.current.set(entry.key, 'out');
        stop(entry.key);
        const plays = toList(playExit?.(el));
        playing.current.set(entry.key, plays);
        allSettled(plays).then(() => {
          if (phase.current.get(entry.key) !== 'out') return;
          phase.current.delete(entry.key);
          playing.current.delete(entry.key);
          boxes.current.delete(entry.key);
          setShown((previous) => previous.filter((e) => e.key !== entry.key || !e.exiting));
        });
        return;
      }

      if (at === undefined) {
        phase.current.set(entry.key, 'in');
        stop(entry.key);
        const skip = !initial && bornAtMount.current.has(entry.key);
        if (!skip && playEnter) playing.current.set(entry.key, toList(playEnter(el)));
        return;
      }

      const was = boxes.current.get(entry.key);
      if (flipTiming && was) flip(el, was, { scale: false, timing: flipTiming });
    });

    if (!flipTiming) return;
    shown.forEach((entry, index) => {
      if (els[index]) boxes.current.set(entry.key, measure(els[index]));
    });
  }, [shown, initial]);

  useLayoutEffect(
    () => () => {
      for (const plays of playing.current.values()) for (const play of plays) play.stop();
    },
    [],
  );

  const fresh = new Map(incoming.map((entry) => [entry.key, entry.node]));
  return createElement(
    as,
    { ...rest, ref: host },
    shown.map((entry) => fresh.get(entry.key) ?? entry.node),
  );
}
