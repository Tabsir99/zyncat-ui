'use client';

import './badge.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Badge, type BadgeProps } from './Badge';
import { UIMotion } from '../../../tokens/motion-tokens';
import { fireGlint } from '../../internal/glass/glint';

const SM = UIMotion;

export type PostStatus = 'draft' | 'scheduled' | 'processing' | 'published' | 'failed';

export const POST_STATUS: Record<PostStatus, { tone: BadgeProps['tone']; label: string; live?: boolean }> = {
  draft: { tone: 'neutral', label: 'Draft' },
  scheduled: { tone: 'info', label: 'Scheduled' },
  processing: { tone: 'warning', label: 'Processing', live: true },
  published: { tone: 'success', label: 'Published' },
  failed: { tone: 'danger', label: 'Failed' },
};

const TERMINAL: Partial<Record<PostStatus, boolean>> = { published: true, failed: true };

export interface StatusBadgeProps extends Omit<BadgeProps, 'children' | 'tone'> {
  /** Lifecycle state - maps to a canonical `tone` + label (`processing` also pulses live). Unknown falls back to `draft`. */
  status: PostStatus;
  /** Morph in place as `status` changes instead of swapping. */
  morph?: boolean;
}

export function StatusBadge({ status, morph = false, ...rest }: StatusBadgeProps) {
  if (!morph) {
    const s = POST_STATUS[status] || POST_STATUS.draft;
    return (
      <Badge tone={s.tone} dot live={!!s.live} {...rest}>
        {s.label}
      </Badge>
    );
  }
  return <StatusMorph status={status} {...rest} />;
}

interface StatusMorphProps extends Omit<BadgeProps, 'children' | 'tone'> {
  status: PostStatus;
}

interface Word {
  key: number;
  label: string;
  cls: string;
}

function StatusMorph({ status, className = '', ...rest }: StatusMorphProps) {
  const s = POST_STATUS[status] || POST_STATUS.draft;

  const prev = useRef(status);
  const keyRef = useRef(1);
  const labelRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const [words, setWords] = useState<Word[]>([{ key: 0, label: s.label, cls: '' }]);
  const [boxW, setBoxW] = useState<number>();

  useLayoutEffect(() => {
    if (ghostRef.current) setBoxW(ghostRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    if (prev.current === status) return;
    prev.current = status;
    const next = POST_STATUS[status] || POST_STATUS.draft;
    const nk = keyRef.current++;
    const nextW = ghostRef.current?.offsetWidth;

    setWords((ws) => ws.concat({ key: nk, label: next.label, cls: 'badge__word--in' }));
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setWords((ws) => ws.map((w) => (w.key === nk ? { ...w, cls: '' } : { ...w, cls: 'badge__word--out' })));
        if (nextW) setBoxW(nextW);
      }),
    );
    const drop = setTimeout(
      () => setWords((ws) => ws.filter((w) => !w.cls.includes('--out'))),
      SM.dur.base * 1000 + 80,
    );
    let stopGlint: (() => void) | undefined;
    if (TERMINAL[status] && labelRef.current) {
      const chip = labelRef.current.closest('.badge') as HTMLElement | null;
      if (chip) stopGlint = fireGlint(chip);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(drop);
      stopGlint?.();
    };
  }, [status]);

  return (
    <Badge
      tone={s.tone}
      dot
      live={!!s.live}
      className={['badge--morph', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <span className="badge__morph" ref={labelRef} style={boxW ? { width: boxW } : undefined}>
        <span className="badge__ghost" ref={ghostRef} aria-hidden="true">
          {s.label}
        </span>
        {words.map((w) => (
          <span key={w.key} className={['badge__word', w.cls].filter(Boolean).join(' ')}>
            {w.label}
          </span>
        ))}
      </span>
    </Badge>
  );
}
