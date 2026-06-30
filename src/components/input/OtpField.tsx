'use client';

// OtpField.tsx — segmented one-time-code input: mono slots, auto-advance, arrow nav, paste-to-fill, grouping.

import { useRef } from 'react';
import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';

export interface OtpFieldProps {
  /** Number of slots. @default 6 */
  length?: number;
  /** Controlled value (digit string). */
  value?: string;
  /** Called with the next value string. */
  onChange?: (value: string) => void;
  /** Insert a separator every N slots (e.g. 3 → "•••–•••"). */
  group?: number;
  /** Error state (red slots + ring). */
  error?: boolean;
  disabled?: boolean;
  size?: 'sm';
  className?: string;
}

export function OtpField({
  length = 6,
  value = '',
  onChange,
  group,
  error,
  disabled,
  size,
  className = '',
}: OtpFieldProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = String(value).slice(0, length).padEnd(length).split('');
  const emit = (s: string) => onChange && onChange(s.replace(/ +$/, '').slice(0, length));
  const setAt = (i: number, ch: string) => {
    const a = chars.slice();
    a[i] = ch || ' ';
    emit(a.join(''));
  };
  // place caret at the end (no selection highlight); replacement handled by slice(-1)
  const caretEnd = (el: HTMLInputElement | null) => {
    if (!el) return;
    const n = el.value.length;
    try {
      el.setSelectionRange(n, n);
    } catch {}
  };
  const go = (j: number) => {
    const el = refs.current[j];
    if (el) {
      el.focus();
      caretEnd(el);
    }
  };

  const cls = ['otp', size === 'sm' ? 'otp--sm' : '', error ? 'is-error' : '', className]
    .filter(Boolean)
    .join(' ');

  const cells: ReactNode[] = [];
  for (let i = 0; i < length; i++) {
    if (group && i > 0 && i % group === 0)
      cells.push(<span key={`sep${i}`} className="otp__sep" />);
    cells.push(
      <input
        key={i}
        ref={(el) => {
          refs.current[i] = el;
        }}
        className="otp__slot"
        inputMode="numeric"
        autoComplete="one-time-code"
        disabled={disabled}
        value={chars[i].trim()}
        data-filled={chars[i].trim() ? 'true' : 'false'}
        onFocus={(e: FocusEvent<HTMLInputElement>) => caretEnd(e.target)}
        onMouseDown={(e: MouseEvent<HTMLInputElement>) => {
          e.preventDefault();
          go(i);
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const ch = e.target.value.replace(/[^\d]/g, '').slice(-1);
          setAt(i, ch);
          if (ch && i < length - 1) go(i + 1);
        }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Backspace' && !chars[i].trim() && i > 0) {
            e.preventDefault();
            setAt(i - 1, '');
            go(i - 1);
          } else if (e.key === 'ArrowLeft' && i > 0) {
            e.preventDefault();
            go(i - 1);
          } else if (e.key === 'ArrowRight' && i < length - 1) {
            e.preventDefault();
            go(i + 1);
          }
        }}
        onPaste={(e: ClipboardEvent<HTMLInputElement>) => {
          e.preventDefault();
          const d = (e.clipboardData.getData('text') || '').replace(/[^\d]/g, '');
          emit(chars.slice(0, i).join('') + d);
          refs.current[Math.min(i + d.length, length - 1)]?.focus();
        }}
      />,
    );
  }
  return <div className={cls}>{cells}</div>;
}
