import { unicode, unicodeOr } from '@clack/prompts';

import { accent, accentBright, accentDeep, bold, dim, fg, gradientText, lerpHex, teal } from './palette';

export const SPINNER_FRAMES = unicode ? ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] : ['-', '\\', '|', '/'];
export const SPINNER_DELAY = 80;

export const check = accent(unicodeOr('✓', '+'));
export const skip = dim(unicodeOr('◌', 'o'));
export const arrow = dim(unicodeOr('→', '->'));

const BAR_FILLED = unicodeOr('━', '=');
const BAR_HALF = unicodeOr('╸', '-');
const BAR_REST = unicodeOr('─', '-');

export function wordmark(version: string): string {
  return `${gradientText('zyncat', teal[300], teal[500])} ${bold('ui')} ${dim(`v${version}`)}`;
}

const SHIMMER_TAIL = 14;

export function shimmer(text: string, tick: number): string {
  const chars = [...text];
  const head = (tick * 1.5) % (chars.length + SHIMMER_TAIL);
  return chars
    .map((char, i) => {
      if (char === ' ') return char;
      const distance = Math.abs(i - head);
      if (distance < 1) return accentBright(char);
      if (distance < 2.5) return accent(char);
      if (distance < 4) return accentDeep(char);
      return dim(char);
    })
    .join('');
}

export function styleFrame(frame: string): string {
  return accent(frame);
}

export function bar(ratio: number, width = 22): string {
  const clamped = Math.min(1, Math.max(0, ratio));
  const cells = clamped * width;
  const filled = Math.floor(cells);
  const half = cells - filled >= 0.5 && filled < width;
  let out = '';
  for (let i = 0; i < filled; i++)
    out += fg(lerpHex(teal[500], teal[300], filled <= 1 ? 1 : i / (filled - 1)))(BAR_FILLED);
  if (half) out += accentDeep(BAR_HALF);
  out += dim(BAR_REST.repeat(width - filled - (half ? 1 : 0)));
  return out;
}

export function kilobytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

export function seconds(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

const LABEL_WIDTH = 13;

export function row(label: string, value: string): string {
  return `${label.padEnd(LABEL_WIDTH)} ${dim(value)}`;
}
