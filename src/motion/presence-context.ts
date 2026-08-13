'use client';

import { createContext, useContext } from 'react';

export interface PresenceState {
  /** False once the child has been removed from `children` but is still mounted for its exit. */
  isPresent: boolean;
  /** False for children present at the Presence's own first paint when `initial={false}`. */
  initial: boolean;
  /** Claims responsibility for animating this child out; call the returned release once the
   *  exit has finished. A child nobody claims is dropped as soon as it leaves `children`. */
  claimExit: () => () => void;
}

const DETACHED: PresenceState = { isPresent: true, initial: true, claimExit: () => () => {} };

export const PresenceContext = createContext<PresenceState>(DETACHED);

export const usePresence = (): PresenceState => useContext(PresenceContext);
