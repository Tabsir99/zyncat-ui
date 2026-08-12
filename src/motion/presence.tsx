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
import { animate, flip, measure, type Box, type Layer, type Playback, type Timing } from '../engine';

export type Plays = Playback | Playback[] | null | undefined | void;
export type Motion = Layer | Layer[] | ((el: HTMLElement) => Plays);

const toList = (plays: Plays): Playback[] => (!plays ? [] : Array.isArray(plays) ? plays : [plays]);

const run = (motion: Motion | undefined, el: HTMLElement): Playback[] => {
  if (!motion) return [];
  if (typeof motion === 'function') return toList(motion(el));
  return [Array.isArray(motion) ? animate(el, ...motion) : animate(el, motion)];
};

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
  enter?: Motion;
  /** Plays when a child is removed; it stays mounted until these finish. */
  exit?: Motion;
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
      const live = new Set(incoming.map((entry) => entry.key));
      const merged: Entry[] = incoming.map((entry) => ({ ...entry }));
      previous.forEach((entry, index) => {
        if (live.has(entry.key)) return;
        merged.splice(index, 0, entry.exiting ? entry : { ...entry, exiting: true });
      });
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

    const settledBoxes = boxes.current;
    if (flipTiming) {
      const nextBoxes = new Map<string, Box>();
      shown.forEach((entry, index) => {
        if (els[index]) nextBoxes.set(entry.key, measure(els[index]));
      });
      boxes.current = nextBoxes;
    }

    shown.forEach((entry, index) => {
      const el = els[index];
      if (!el) return;
      const at = phase.current.get(entry.key);

      if (entry.exiting) {
        if (at === 'out') return;
        phase.current.set(entry.key, 'out');
        const plays = run(playExit, el);
        stop(entry.key);
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
        if (!skip) playing.current.set(entry.key, run(playEnter, el));
        return;
      }

      const was = settledBoxes.get(entry.key);
      if (flipTiming && was) flip(el, was, { scale: false, timing: flipTiming });
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
