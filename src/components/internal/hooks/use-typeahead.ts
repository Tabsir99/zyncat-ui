'use client';

import { useEffect, useRef } from 'react';

const TYPEAHEAD_RESET_MS = 600;

export interface Typeahead {
  push: (char: string) => string;
  buffered: () => boolean;
}

export function useTypeahead(): Typeahead {
  const state = useRef({ buffer: '', timer: 0 as ReturnType<typeof setTimeout> | 0 });
  const api = useRef<Typeahead>(null);

  api.current ||= {
    push: (char) => {
      const s = state.current;
      clearTimeout(s.timer);
      s.timer = setTimeout(() => (s.buffer = ''), TYPEAHEAD_RESET_MS);
      return (s.buffer += char.toLowerCase());
    },
    buffered: () => state.current.buffer.length > 0,
  };

  useEffect(() => () => clearTimeout(state.current.timer), []);
  return api.current;
}
