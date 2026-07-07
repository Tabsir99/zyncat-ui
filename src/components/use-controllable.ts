'use client';

/* useControllable - the library's one controlled/uncontrolled state hook.
   `meta` rides along to onChange for callers that report what caused the
   change (e.g. Select passes the committed option). */
import { useCallback, useState } from 'react';

export function useControllable<T, Meta = unknown>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T, meta?: Meta) => void,
): [T, (next: T, meta?: Meta) => void] {
  const controlled = value !== undefined;
  const [inner, setInner] = useState<T>(defaultValue);
  const val = controlled ? (value as T) : inner;
  const commit = useCallback(
    (next: T, meta?: Meta) => {
      if (!controlled) setInner(next);
      if (onChange) onChange(next, meta);
    },
    [controlled, onChange],
  );
  return [val, commit];
}
