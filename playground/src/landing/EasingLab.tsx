import { useEffect, useRef, useState } from 'react';
import { Button } from '@zyncat/ui/button';
import { UIMotion, type Bezier } from '@zyncat/ui/motion-tokens';
import { Icon } from '../icon';

type EaseName = keyof typeof UIMotion.ease;

const EASES: { name: EaseName; role: string }[] = [
  { name: 'standard', role: 'color · fills' },
  { name: 'entrance', role: 'things arriving' },
  { name: 'exit', role: 'things leaving' },
  { name: 'spring', role: 'settle · snap' },
  { name: 'glide', role: 'travel · pills' },
];

// Plot space: x 6→94, y maps unit progress (with overshoot headroom) to 78→22.
const px = (t: number) => 6 + t * 88;
const py = (v: number) => 78 - v * 56;

function curvePath([x1, y1, x2, y2]: Bezier) {
  return `M ${px(0)} ${py(0)} C ${px(x1)} ${py(y1)}, ${px(x2)} ${py(y2)}, ${px(1)} ${py(1)}`;
}

function cb(b: Bezier) {
  return `cubic-bezier(${b.join(', ')})`;
}

export function EasingLab() {
  const [selected, setSelected] = useState<EaseName>('spring');
  const [run, setRun] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Fire the race once, the first time the lab scrolls into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun((r) => (r === 0 ? 1 : r));
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const bez = UIMotion.ease[selected];

  return (
    <div className="ld-lab" ref={rootRef}>
      <div className="ld-lab__plot">
        <svg viewBox="0 0 100 100" role="img" aria-label={`Curve plot of --ease-${selected}`}>
          {/* progress = 0 and progress = 1 reference lines */}
          <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(0)} className="ld-lab__ref" />
          <line x1={px(0)} y1={py(1)} x2={px(1)} y2={py(1)} className="ld-lab__ref" />
          {/* control-point handles, like a curve editor */}
          <line x1={px(0)} y1={py(0)} x2={px(bez[0])} y2={py(bez[1])} className="ld-lab__handle" />
          <line x1={px(1)} y1={py(1)} x2={px(bez[2])} y2={py(bez[3])} className="ld-lab__handle" />
          <circle cx={px(bez[0])} cy={py(bez[1])} r="2.4" className="ld-lab__cp" />
          <circle cx={px(bez[2])} cy={py(bez[3])} r="2.4" className="ld-lab__cp" />
          <path d={curvePath(bez)} className="ld-lab__curve" />
          <circle cx={px(0)} cy={py(0)} r="2.8" className="ld-lab__node" />
          <circle cx={px(1)} cy={py(1)} r="2.8" className="ld-lab__node" />
        </svg>
        <p className="ld-lab__readout">
          --ease-{selected}: {cb(bez)}
        </p>
      </div>

      <div className="ld-lab__race">
        <div className="ld-lab__race-head">
          <span className="ld-lab__race-label">900ms · same distance · five curves</span>
          <Button
            size="sm"
            variant="secondary"
            iconLeft={<Icon name="play" size="sm" />}
            onClick={() => setRun((r) => r + 1)}
          >
            Race
          </Button>
        </div>
        {EASES.map(({ name, role }) => (
          <button
            key={name}
            type="button"
            className="ld-lab__lane"
            data-selected={name === selected || undefined}
            onClick={() => setSelected(name)}
            aria-pressed={name === selected}
          >
            <span className="ld-lab__lane-name">{name}</span>
            <span className="ld-lab__track">
              {run > 0 && (
                <i key={run} className="ld-lab__dot" style={{ animationTimingFunction: cb(UIMotion.ease[name]) }} />
              )}
            </span>
            <span className="ld-lab__lane-role">{role}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
