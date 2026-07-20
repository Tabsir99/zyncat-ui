'use client';

// Textarea.tsx - multiline input: TextField anatomy plus auto-grow, char meter, over-limit highlight, ⌘/Ctrl+↵ submit.

import './textarea.css';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ChangeEventHandler,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { FieldLabel, FieldMessage, resolveFieldMessage, type FieldMessagingProps } from '../input/field-chrome';
import type { DataAttributes } from '../../../dom-props';

const RING_C = (2 * Math.PI * 7).toFixed(2);

/** The native <textarea> props Textarea surfaces at the top level (the rest live in `htmlProps`). */
type TextareaNative = Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'disabled' | 'readOnly'>;

interface TextareaOwnProps extends FieldMessagingProps, TextareaNative {
  /** Controlled text value. @default '' */
  value?: string;
  /** Change handler - fired on each edit with the textarea change event. */
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  /** Fired on ⌘/Ctrl+Enter with the current text. */
  onSubmit?: (value: string) => void;
  /** Soft char limit: shows the meter + over-limit highlight. Does NOT truncate (use native maxLength for a hard stop). */
  max?: number;
  /** Rows shown before auto-grow kicks in. @default 3 */
  minRows?: number;
  /** Row cap - grows up to this, then the box scrolls. @default 10 */
  maxRows?: number;
  /** Remaining-chars threshold that flips the meter amber. Default 20. */
  warnAt?: number;
  /** Footer hint, left of the meter - e.g. a ⌘↵ affordance. */
  hint?: ReactNode;
  /** md (default) - lg (prominent composer). */
  size?: 'md' | 'lg';
  /** Extra class(es) merged onto the field root. */
  className?: string;
  /** Inline styles merged onto the field root. */
  style?: CSSProperties;
}

export interface TextareaProps extends TextareaOwnProps {
  /** Standard <textarea> attributes (name, maxLength, aria-*, onKeyDown, ...) forwarded to the textarea. */
  htmlProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof TextareaOwnProps | 'rows'> & DataAttributes;
}

export function Textarea({
  id,
  label,
  required,
  optional,
  placeholder,
  helper,
  error,
  warning,
  success,
  value = '',
  onChange,
  onSubmit,
  max,
  minRows = 3,
  maxRows = 10,
  warnAt = 20,
  hint,
  size,
  disabled,
  readOnly,
  className = '',
  style,
  htmlProps,
}: TextareaProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const text = value ?? '';
  const count = text.length;
  const over = max ? Math.max(count - max, 0) : 0;
  const remaining = max ? max - count : 0;
  const meterState = over ? 'is-over' : max && remaining <= warnAt ? 'is-near' : '';

  const { state, msg, msgIcon } = resolveFieldMessage(error, warning, success, helper);

  // Auto-grow without a caret jump: the .txa__stack wrapper animates its height and is overflow:clip while growing (a clip box can't scroll to the caret); scroll is enabled only past max-height.
  const resize = () => {
    const el = taRef.current,
      stack = stackRef.current;
    if (!el || !stack) return;
    const start = stack.offsetHeight; // capture the start height before mutating layout below
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    const content = el.offsetHeight;
    const maxPx = parseFloat(getComputedStyle(stack).maxHeight) || Infinity;
    const target = Math.min(content, maxPx);
    if (target === start) {
      stack.style.overflowY = content > maxPx ? 'auto' : 'clip';
      return;
    }
    stack.style.overflowY = 'clip';
    stack.style.height = start + 'px';
    void stack.offsetHeight; // force a reflow so the height transition runs from start
    stack.style.height = target + 'px';
  };
  useLayoutEffect(resize, [text, size]);
  /* re-measure on WIDTH changes only (window, splitter, panel collapse); the observer must
     ignore the height mutations resize() itself makes, or it would feed back on itself. */
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return undefined;
    let w = stack.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (stack.offsetWidth !== w) {
        w = stack.offsetWidth;
        resize();
      }
    });
    ro.observe(stack);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (onSubmit && (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit(text);
    }
    htmlProps?.onKeyDown && htmlProps.onKeyDown(e);
  };

  const cls = ['fld', 'fld--txa', size === 'lg' && 'fld--lg', state, className].filter(Boolean).join(' ');
  const boxCls = ['txa', disabled && 'is-disabled', readOnly && 'is-readonly'].filter(Boolean).join(' ');

  return (
    <div className={cls} style={style}>
      <FieldLabel id={id} label={label} required={required} optional={optional} />
      <div className={boxCls} style={{ '--txa-min-rows': minRows, '--txa-max-rows': maxRows } as CSSProperties}>
        <div className="txa__stack" ref={stackRef}>
          <div className="txa__mirror" ref={mirrorRef} aria-hidden="true">
            {over ? text.slice(0, max) : text}
            {over ? <mark>{text.slice(max)}</mark> : null}
            {'\n'}
          </div>
          <textarea
            id={id}
            className="txa__input"
            ref={taRef}
            rows={minRows}
            value={text}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onScroll={() => {
              if (mirrorRef.current) mirrorRef.current.scrollTop = taRef.current.scrollTop;
            }}
            aria-invalid={error ? true : undefined}
            {...htmlProps}
          />
        </div>
        {(max || hint) && (
          <div className="txa__bar">
            {hint && <span className="txa__hint">{hint}</span>}
            {max && (
              <span className={['txa__meter', meterState].filter(Boolean).join(' ')}>
                <span className="txa__count">{over || remaining <= warnAt ? remaining : `${count} / ${max}`}</span>
                <svg
                  className="txa__ring"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  style={{ '--txa-ring-c': RING_C, '--txa-ring-p': Math.min(count / max, 1) } as CSSProperties}
                >
                  <circle className="txa__ring-trk" cx="8" cy="8" r="7" />
                  <circle className="txa__ring-prg" cx="8" cy="8" r="7" />
                </svg>
              </span>
            )}
          </div>
        )}
      </div>
      <FieldMessage message={msg} icon={msgIcon} />
    </div>
  );
}
