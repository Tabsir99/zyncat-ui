'use client';

// StatusBadge.tsx — a status as a badge, with the canonical
// tone + one-word label mapping LOCKED (CLAUDE.md §E).
//
//   <StatusBadge status="published" />            static, content-width
//   <StatusBadge status={s} morph />              MORPHS in place as `s` changes
//
// morph mode (transform/opacity + width): the chip eases to the active label's
// width (measured from a hidden ghost), the label ROLLS on change, the dot hue
// + glass tint cross-fade, and a one-shot glint fires on a terminal state.

import * as React from 'react';
import { Badge, type BadgeProps } from './Badge';

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

  // size the chip to the active label (the ghost holds its natural width) so it
  // eases between widths as the status changes instead of pinning to the widest
  React.useLayoutEffect(() => {
    if (ghostRef.current) setBoxW(ghostRef.current.offsetWidth);
  }, [status]);

  React.useEffect(() => {
    if (prev.current === status) return;
    prev.current = status;
    const next = POST_STATUS[status] || POST_STATUS.draft;
    const nk = keyRef.current++;

    // current word(s) roll out; new word enters from below
    setWords((ws) =>
      ws
        .map((w) => ({ ...w, cls: 'badge__word--out' }))
        .concat({ key: nk, label: next.label, cls: 'badge__word--in' }),
    );
    // paint the primed (--in) state, then release it so it eases to settled
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setWords((ws) => ws.map((w) => (w.key === nk ? { ...w, cls: '' } : w))),
      ),
    );
    // drop the outgoing word after its transition
    const drop = setTimeout(
      () => setWords((ws) => ws.filter((w) => !w.cls.includes('--out'))),
      280,
    );
    // glint when a post lands on a terminal state
    let glintT: ReturnType<typeof setTimeout> | undefined;
    if (TERMINAL[status] && labelRef.current) {
      const chip = labelRef.current.closest('.badge') as HTMLElement | null;
      if (chip) {
        chip.classList.remove('glass-glint');
        void chip.offsetWidth; // restart the one-shot
        chip.classList.add('glass-glint');
        glintT = setTimeout(() => chip.classList.remove('glass-glint'), 360);
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
