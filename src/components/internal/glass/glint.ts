import { UIMotion } from '../../../tokens/motion-tokens';

export function fireGlint(el: HTMLElement): () => void {
  el.classList.remove('glass-glint');
  void el.offsetWidth;
  el.classList.add('glass-glint');
  const id = setTimeout(() => el.classList.remove('glass-glint'), UIMotion.dur.slow * 1000 + 80);
  return () => clearTimeout(id);
}
