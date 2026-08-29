const MILLION = 1e6;
const TEN_THOUSAND = 1e4;
const THOUSAND = 1e3;
const ONE_DECIMAL = 1;
const TRAILING_ZERO = /\.0$/;
const THOUSANDS_BOUNDARY = /\B(?=(\d{3})+(?!\d))/g;

function whole(value: number): number {
  return Math.max(0, Math.round(Number(value) || 0));
}

export function compactCount(value: number): string {
  const n = whole(value);
  if (n >= MILLION) return (n / MILLION).toFixed(ONE_DECIMAL).replace(TRAILING_ZERO, '') + 'M';
  if (n >= TEN_THOUSAND) return Math.round(n / THOUSAND) + 'k';
  if (n >= THOUSAND) return (n / THOUSAND).toFixed(ONE_DECIMAL).replace(TRAILING_ZERO, '') + 'k';
  return String(n);
}

export function groupedCount(value: number): string {
  return String(whole(value)).replace(THOUSANDS_BOUNDARY, ',');
}
