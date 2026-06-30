'use client';

// StatusBadge.tsx — a status as a badge, with the canonical
// tone + one-word label mapping LOCKED (CLAUDE.md §E).
//
//   <StatusBadge status="published" />            static, content-width
//   <StatusBadge status={s} morph />              MORPHS in place as `s` changes
//
// morph mode: the chip eases its REAL width to the active label's (measured from a
// hidden ghost) while the label ROLLS, and the box CLIPS its content so a shrink is
// the exact mirror of a grow — neither word ever spills. The dot hue + glass tint
// cross-fade; a one-shot glint fires on a terminal state.

import * as React from 'react';
import { Badge, type BadgeProps } from './Badge';
import { UIMotion } from '../../tokens/motion-tokens';

const SM = UIMotion;

export type PostStatus = 'draft' | 'scheduled' | 'processing' | 'published' | 'failed';

export const POST_STATUS: Record<
  PostStatus,
  { tone: BadgeProps['tone']; label: string; live?: boolean }
> = {
  draft: { tone: 'neutral', label: 'Draft' },
  scheduled: { tone: 'info', label: 'Scheduled' },
  processing: { tone: 'warning', label: 'Processing', live: true },
  published: { tone: 'success', label: 'Published' },
  failed: { tone: 'danger', label: 'Failed' },
};

const TERMINAL: Partial<Record<PostStatus, boolean>> = { published: true, failed: true };

export interface StatusBadgeProps extends Omit<BadgeProps, 'children' | 'tone'> {
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

  const prev = React.useRef(status);
  const keyRef = React.useRef(1);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const ghostRef = React.useRef<HTMLSpanElement>(null);
  const [words, setWords] = React.useState<Word[]>([{ key: 0, label: s.label, cls: '' }]);
  const [boxW, setBoxW] = React.useState<number>();

  // initial width only; on CHANGE the width eases in the rAF below, synced to
  // the word roll, so the chip never resizes ahead of the text.
  React.useLayoutEffect(() => {
    if (ghostRef.current) setBoxW(ghostRef.current.offsetWidth);
  }, []);

  React.useEffect(() => {
    if (prev.current === status) return;
    prev.current = status;
    const next = POST_STATUS[status] || POST_STATUS.draft;
    const nk = keyRef.current++;
    const nextW = ghostRef.current?.offsetWidth; // ghost already holds the new label

    // add the new word primed below (invisible); the current word stays settled
    setWords((ws) => ws.concat({ key: nk, label: next.label, cls: 'badge__word--in' }));
    // next frame: roll the new word in, the old one out, and ease the box to the new
    // width — one symmetric tween; the overflow-clip hides the momentarily-wider word.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setWords((ws) =>
          ws.map((w) => (w.key === nk ? { ...w, cls: '' } : { ...w, cls: 'badge__word--out' })),
        );
        if (nextW) setBoxW(nextW);
      }),
    );
    // the old word has finished rolling out → drop it. Width already settled in the
    // rAF, identically for grow and shrink — the drop only prunes the DOM.
    const drop = setTimeout(
      () => setWords((ws) => ws.filter((w) => !w.cls.includes('--out'))),
      SM.dur.base * 1000 + 80,
    );
    // glint when a post lands on a terminal state
    let glintT: ReturnType<typeof setTimeout> | undefined;
    if (TERMINAL[status] && labelRef.current) {
      const chip = labelRef.current.closest('.badge') as HTMLElement | null;
      if (chip) {
        chip.classList.remove('glass-glint');
        void chip.offsetWidth; // restart the one-shot
        chip.classList.add('glass-glint');
        glintT = setTimeout(() => chip.classList.remove('glass-glint'), SM.dur.slow * 1000 + 80);
      }
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(drop);
      clearTimeout(glintT);
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
