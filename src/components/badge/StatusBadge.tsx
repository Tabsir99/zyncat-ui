'use client';

// StatusBadge.tsx — a status as a badge, with the canonical
// tone + one-word label mapping LOCKED (CLAUDE.md §E).
//
//   <StatusBadge status="published" />            static, content-width
//   <StatusBadge status={s} morph />              MORPHS in place as `s` changes
//
// morph mode (transform/opacity only): the chip holds a steady width (a hidden
// ghost of every reachable label sets it), the label ROLLS on change, the dot
// hue + glass tint cross-fade, and a one-shot glint fires on a terminal state.

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

const ORDER: PostStatus[] = ['draft', 'scheduled', 'processing', 'published', 'failed'];
const TERMINAL: Partial<Record<PostStatus, boolean>> = { published: true, failed: true };

export interface StatusBadgeProps extends Omit<BadgeProps, 'children' | 'tone'> {
  status: PostStatus;
  /** Morph in place as `status` changes instead of swapping. */
  morph?: boolean;
  /** Reachable statuses used to size the morph chip. */
  slots?: PostStatus[];
}

export function StatusBadge({ status, morph = false, slots, ...rest }: StatusBadgeProps) {
  if (!morph) {
    const s = POST_STATUS[status] || POST_STATUS.draft;
    return (
      <Badge tone={s.tone} dot live={!!s.live} {...rest}>
        {s.label}
      </Badge>
    );
  }
  return <StatusMorph status={status} slots={slots} {...rest} />;
}

interface StatusMorphProps extends Omit<BadgeProps, 'children' | 'tone'> {
  status: PostStatus;
  slots?: PostStatus[];
}

interface Word {
  key: number;
  label: string;
  cls: string;
}

function StatusMorph({ status, slots, className = '', ...rest }: StatusMorphProps) {
  const s = POST_STATUS[status] || POST_STATUS.draft;
  const candidates = slots && slots.length ? slots : ORDER;

  const prev = React.useRef(status);
  const keyRef = React.useRef(1);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const [words, setWords] = React.useState<Word[]>([{ key: 0, label: s.label, cls: '' }]);

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
      <span className="badge__morph" ref={labelRef}>
        {candidates.map((c) => (
          <span key={'ghost-' + c} className="badge__ghost" aria-hidden="true">
            {POST_STATUS[c].label}
          </span>
        ))}
        {words.map((w) => (
          <span key={w.key} className={['badge__word', w.cls].filter(Boolean).join(' ')}>
            {w.label}
          </span>
        ))}
      </span>
    </Badge>
  );
}
