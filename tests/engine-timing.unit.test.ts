import { expect, test } from 'vitest';
import { resolveTiming } from '../src/engine/ease';

const VISUAL_DURATIONS = [0.01, 0.05, 0.14, 0.2, 0.3, 0.45, 0.9, 1];
const BOUNCES = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.5, 0.75, 0.95];
const TOKEN_BOUNCE = 0.25;

const spring = (visualDuration: number, bounce: number) => resolveTiming({ type: 'spring', visualDuration, bounce });

const samplesOf = (easing: string): number[] => {
  expect(easing.startsWith('linear(') && easing.endsWith(')'), `not a linear() curve: ${easing}`).toBe(true);
  return easing.slice('linear('.length, -1).split(',').map(Number);
};

const peakOf = (visualDuration: number, bounce: number) =>
  Math.max(...samplesOf(spring(visualDuration, bounce).easing));

test('duration and delay are given in seconds and emitted in milliseconds', () => {
  const resolved = resolveTiming({ duration: 0.2, delay: 0.06 });

  expect(resolved.duration).toBeCloseTo(200, 6);
  expect(resolved.delay).toBeCloseTo(60, 6);
});

test('a single ease is one curve, while an array of eases is a per-segment list', () => {
  const bezier = resolveTiming({ duration: 0.2, ease: [0.2, 0, 0, 1] });
  expect(bezier.segments).toBeNull();
  expect(bezier.easing).toBe('cubic-bezier(0.2,0,0,1)');

  const named = resolveTiming({ duration: 0.2, ease: 'easeIn' });
  expect(named.segments).toBeNull();
  expect(named.easing).toBe('cubic-bezier(0.42,0,1,1)');

  const beziers = resolveTiming({
    duration: 0.2,
    ease: [
      [0.2, 0, 0, 1],
      [0.4, 0, 1, 1],
    ],
  });
  expect(beziers.easing).toBe('linear');
  expect(beziers.segments).toEqual(['cubic-bezier(0.2,0,0,1)', 'cubic-bezier(0.4,0,1,1)']);

  const names = resolveTiming({ duration: 0.2, ease: ['easeIn', 'easeOut'] });
  expect(names.easing).toBe('linear');
  expect(names.segments).toEqual(['cubic-bezier(0.42,0,1,1)', 'cubic-bezier(0,0,0.58,1)']);
});

test('bounce never overshoots at zero, and more bounce is never less overshoot', () => {
  for (const visual of VISUAL_DURATIONS) {
    expect(peakOf(visual, 0), `bounce 0 overshot at visualDuration ${visual}`).toBe(1);

    const peaks = BOUNCES.map((bounce) => peakOf(visual, bounce));
    for (let i = 1; i < peaks.length; i++) {
      expect(
        peaks[i],
        `bounce ${BOUNCES[i]} overshoots less than ${BOUNCES[i - 1]} at visualDuration ${visual}`,
      ).toBeGreaterThanOrEqual(peaks[i - 1]);
    }

    expect(peakOf(visual, TOKEN_BOUNCE), `the token bounce did not overshoot at ${visual}`).toBeGreaterThan(1);
  }
});

test('a spring runs at least its visual duration and at most 2.5x it, never beyond 4 seconds', () => {
  for (const visual of [...VISUAL_DURATIONS, 2, 4]) {
    for (const bounce of BOUNCES) {
      const { duration } = spring(visual, bounce);

      expect(duration, `visualDuration ${visual} bounce ${bounce} finished early`).toBeGreaterThanOrEqual(
        visual * 1000,
      );
      expect(duration, `visualDuration ${visual} bounce ${bounce} ran away`).toBeLessThanOrEqual(
        Math.min(4000, visual * 2500),
      );
    }
  }
});

test('every spring curve arrives at exactly its target', () => {
  for (const visual of VISUAL_DURATIONS) {
    for (const bounce of BOUNCES) {
      const samples = samplesOf(spring(visual, bounce).easing);

      expect(samples.every(Number.isFinite), `non-finite sample at ${visual}/${bounce}`).toBe(true);
      expect(samples[samples.length - 1], `did not arrive at ${visual}/${bounce}`).toBe(1);
    }
  }
});
