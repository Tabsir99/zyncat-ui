import { COLUMN_COUNT, type GridSection } from './dom';

const MOVES: Record<string, [number, number]> = {
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowDown: [0, 1],
  ArrowUp: [0, -1],
};

export function createNavigator(
  buttons: HTMLButtonElement[],
  sections: GridSection[],
  onFocus: (button: HTMLButtonElement | null) => void,
) {
  let focusedIdx = -1;
  let desiredCol = 0;

  const sectionOf = (idx: number) => sections.findIndex((s) => idx >= s.start && idx < s.start + s.count);

  const landAt = (si: number, rowStart: number, col: number) => {
    const s = sections[si];
    return s.start + rowStart + Math.min(col, Math.min(COLUMN_COUNT, s.count - rowStart) - 1);
  };

  const focusAt = (next: number, scroll = true) => {
    if (!buttons.length) return;
    const clamped = Math.max(0, Math.min(next, buttons.length - 1));
    if (clamped === focusedIdx) return;
    onFocus(buttons[clamped]);
    if (scroll) buttons[clamped].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    focusedIdx = clamped;
  };

  const setFocus = (next: number, scroll = true) => {
    focusAt(next, scroll);
    const si = sectionOf(focusedIdx);
    desiredCol = si >= 0 ? (focusedIdx - sections[si].start) % COLUMN_COUNT : 0;
  };

  const move = (dx: number, dy: number) => {
    if (focusedIdx < 0) return setFocus(0);
    const si = sectionOf(focusedIdx);
    if (si < 0) return;
    const s = sections[si];
    const local = focusedIdx - s.start;
    const rowStart = local - (local % COLUMN_COUNT);

    if (dx) {
      const next = focusedIdx + dx;
      if (next >= s.start && next < s.start + s.count) return setFocus(next);
      if (dx > 0 && si + 1 < sections.length) return setFocus(sections[si + 1].start);
      if (dx < 0 && si > 0) return setFocus(sections[si - 1].start + sections[si - 1].count - 1);
      return;
    }

    const targetRow = rowStart + dy * COLUMN_COUNT;
    if (targetRow >= 0 && targetRow < s.count) focusAt(landAt(si, targetRow, desiredCol));
    else if (dy > 0 && si + 1 < sections.length) focusAt(landAt(si + 1, 0, desiredCol));
    else if (dy < 0 && si > 0) {
      const prev = sections[si - 1];
      focusAt(landAt(si - 1, Math.floor((prev.count - 1) / COLUMN_COUNT) * COLUMN_COUNT, desiredCol));
    } else setFocus(dy > 0 ? buttons.length - 1 : 0);
  };

  const handleKey = (event: KeyboardEvent, onEnter: () => void): boolean => {
    if (!buttons.length) return false;
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnter();
      return true;
    }
    const delta = MOVES[event.key];
    if (!delta) return false;
    event.preventDefault();
    move(delta[0], delta[1]);
    return true;
  };

  const reset = () => {
    focusedIdx = -1;
    desiredCol = 0;
    onFocus(null);
  };

  return { setFocus, handleKey, reset, getFocusedIdx: () => focusedIdx };
}
