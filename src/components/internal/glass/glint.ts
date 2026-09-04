import { UIMotion } from '../../../tokens/motion-tokens';

export function fireGlint(el: HTMLElement): () => void {
  el.classList.remove('zc-glass-glint');
  void el.offsetWidth;
  el.classList.add('zc-glass-glint');
  const id = setTimeout(() => el.classList.remove('zc-glass-glint'), UIMotion.dur.slow * 1000 + 80);
  return () => clearTimeout(id);
}
