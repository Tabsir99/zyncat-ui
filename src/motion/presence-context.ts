'use client';

import { createContext, useContext } from 'react';

export interface PresenceState {
  /** False once the child has been removed from `children` but is still mounted for its exit. */
  isPresent: boolean;
  /** False for children present at the Presence's own first paint when `initial={false}`. */
  initial: boolean;
  /** Called by the child when its exit has finished; lets Presence drop it from the tree. */
  safeToRemove: () => void;
}

const DETACHED: PresenceState = { isPresent: true, initial: true, safeToRemove: () => {} };

export const PresenceContext = createContext<PresenceState>(DETACHED);

export const usePresence = (): PresenceState => useContext(PresenceContext);
