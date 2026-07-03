'use client';

// Textarea.tsx - multiline input: TextField anatomy plus auto-grow, char meter, over-limit highlight, ⌘/Ctrl+↵ submit.

import './textarea.css';
import * as React from 'react';
import { Icon } from '../icon/Icon';
import { Collapse } from '../motion/Collapse';

const RING_C = (2 * Math.PI * 7).toFixed(2);

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size' | 'rows' | 'onSubmit'
> {
  id?: string;
  /** Label text (sentence case). */
  label?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  /** Neutral helper - shown when there's no validation message. */
  helper?: React.ReactNode;
  /** Sets the matching state (border + icon + colour). error wins over warning/success/helper. */
  error?: React.ReactNode;
  warning?: React.ReactNode;
  success?: React.ReactNode;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  /** Fired on ⌘/Ctrl+Enter with the current text. */
  onSubmit?: (value: string) => void;
  /** Soft char limit: shows the meter + over-limit highlight. Does NOT truncate (use native maxLength for a hard stop). */
  max?: number;
  /** Visible rows before growing (default 3) and the cap before it scrolls (default 10). */
  minRows?: number;
  maxRows?: number;
  /** Remaining-chars threshold that flips the meter amber. Default 20. */
  warnAt?: number;
  /** Footer hint, left of the meter - e.g. a ⌘↵ affordance. */
  hint?: React.ReactNode;
  /** md (default) - lg (prominent composer). */
  size?: 'md' | 'lg';
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
  ...rest
}: TextareaProps) {
  const taRef = React.useRef<HTMLTextAreaElement>(null);
  const stackRef = React.useRef<HTMLDivElement>(null);
  const mirrorRef = React.useRef<HTMLDivElement>(null);
  const text = value ?? '';
  const count = text.length;
  const over = max ? Math.max(count - max, 0) : 0;
  const remaining = max ? max - count : 0;
  const meterState = over ? 'is-over' : max && remaining <= warnAt ? 'is-near' : '';

  const state = error ? 'is-error' : warning ? 'is-warning' : success ? 'is-success' : '';
  const msg = error || warning || success || helper;
  const msgIcon = error ? 'warning-circle' : warning ? 'warning' : success ? 'check-circle' : null;

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
  React.useLayoutEffect(resize, [text, size]);
  React.useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onSubmit && (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit(text);
    }
    rest.onKeyDown && rest.onKeyDown(e);
  };

  const cls = ['fld', 'fld--txa', size === 'lg' && 'fld--lg', state, className]
    .filter(Boolean)
    .join(' ');
  const boxCls = ['txa', disabled && 'is-disabled', readOnly && 'is-readonly']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {label && (
        <label className="fld__label" htmlFor={id}>
          {label}
          {required && (
            <span className="fld__req" aria-hidden="true">
              *
            </span>
          )}
          {optional && <span className="fld__optional">(optional)</span>}
        </label>
      )}
      <div
        className={boxCls}
        style={{ '--txa-min-rows': minRows, '--txa-max-rows': maxRows } as React.CSSProperties}
      >
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
            {...rest}
          />
        </div>
        {(max || hint) && (
          <div className="txa__bar">
            {hint && <span className="txa__hint">{hint}</span>}
            {max && (
              <span className={['txa__meter', meterState].filter(Boolean).join(' ')}>
                <span className="txa__count">
                  {over || remaining <= warnAt ? remaining : `${count} / ${max}`}
                </span>
                <svg
                  className="txa__ring"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  style={
                    {
                      '--txa-ring-c': RING_C,
                      '--txa-ring-p': Math.min(count / max, 1),
                    } as React.CSSProperties
                  }
                >
                  <circle className="txa__ring-trk" cx="8" cy="8" r="7" />
                  <circle className="txa__ring-prg" cx="8" cy="8" r="7" />
                </svg>
              </span>
            )}
          </div>
        )}
      </div>
      <Collapse open={!!msg} className="fld__msg-wrap">
        <div className="fld__msg">
          {msgIcon && <Icon name={msgIcon} size="sm" weight="fill" />}
          {msg}
        </div>
      </Collapse>
    </div>
  );
}
