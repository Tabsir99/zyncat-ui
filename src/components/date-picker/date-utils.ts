/* date-picker shared pure helpers — 'YYYY-MM-DD' civil-date math, month/weekday constants, tz-offset label. */

export const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const DOW: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const pad = (n: number): string => String(n).padStart(2, '0');
export const key = (d: Date): string =>
  d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
export function parse(k: string): Date {
  const p = k.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}
export const today = (): string => key(new Date());
export const add = (k: string, days: number): string => {
  const d = parse(k);
  d.setDate(d.getDate() + days);
  return key(d);
};
export const col = (d: Date): number => (d.getDay() + 6) % 7; // Monday-first column 0–6

/* 42 cells, Monday-first, covering the month of (y, m) */
export function grid(y: number, m: number): Date[] {
  const lead = (new Date(y, m, 1).getDay() + 6) % 7;
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) days.push(new Date(y, m, 1 - lead + i));
  return days;
}

/* 'Europe/Riga' → 'Europe/Riga · GMT+3'; dateKey gives the DST-correct offset for that date, else now. */
export function tzLabel(tz: string, dateKey?: string): string {
  try {
    const at = dateKey ? parse(dateKey) : new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(at);
    const name = parts.find((p) => p.type === 'timeZoneName');
    return tz.replace(/_/g, ' ') + (name ? ' · ' + name.value : '');
  } catch (_e) {
    return tz;
  }
}
