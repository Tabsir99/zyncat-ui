import { UIMotion } from '../../tokens/motion-tokens';

/* Restart the one-shot `.glass-glint` light sweep on `el`: remove - reflow -
   re-add so the CSS animation fires from the top, then strip the class once it
   has ended. Returns a cleanup that clears the pending timer. The `.glass-glint`
   class itself lives in glass.css, shipped by the glass surface that fires it. */
export function fireGlint(el: HTMLElement): () => void {
  el.classList.remove('glass-glint');
  void el.offsetWidth; // force reflow so the re-add restarts the animation
  el.classList.add('glass-glint');
  const id = setTimeout(() => el.classList.remove('glass-glint'), UIMotion.dur.slow * 1000 + 80);
  return () => clearTimeout(id);
}
