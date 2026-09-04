import pc from 'picocolors';

const env = process.env;
const truecolor = pc.isColorSupported && (/truecolor|24bit/i.test(env.COLORTERM ?? '') || env.TERM === 'xterm-kitty');

type Paint = (text: string) => string;

const hexToRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const rgbToHex = ([r, g, b]: [number, number, number]) =>
  `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

export function fg(hex: string, fallback: Paint = pc.cyan): Paint {
  if (!truecolor) return pc.isColorSupported ? fallback : (text) => text;
  const [r, g, b] = hexToRgb(hex);
  return (text) => `\x1b[38;2;${r};${g};${b}m${text}\x1b[39m`;
}

export function lerpHex(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
}

export const teal = { 200: '#a4e5e7', 300: '#6dcfd1', 400: '#28b5b9', 500: '#009ea3', 600: '#00888c' } as const;

export const accent = fg(teal[400]);
export const accentDeep = fg(teal[500]);
export const accentBright = fg(teal[300]);
export const { dim, bold, red } = pc;

export function gradientText(text: string, from: string, to: string): string {
  if (!truecolor) return pc.isColorSupported ? pc.cyan(text) : text;
  const chars = [...text];
  const span = Math.max(1, chars.length - 1);
  return chars.map((char, i) => fg(lerpHex(from, to, i / span))(char)).join('');
}
