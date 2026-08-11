export function tokenPx(token: string, fallback = 0): number {
  if (typeof document === 'undefined') return fallback;
  const root = document.documentElement;
  const v = getComputedStyle(root).getPropertyValue(token).trim();
  const n = parseFloat(v);
  if (Number.isNaN(n)) return fallback;
  return v.endsWith('rem') ? n * parseFloat(getComputedStyle(root).fontSize) : n;
}
