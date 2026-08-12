interface Axes {
  x: number;
  y: number;
}

export interface PanInfo {
  offset: Axes;
  velocity: Axes;
}

interface DragHandlers {
  onMove?: (info: PanInfo) => void;
  onEnd?: (info: PanInfo) => void;
}

export function startDrag(origin: { clientX: number; clientY: number }, handlers: DragHandlers): () => void {
  const startX = origin.clientX;
  const startY = origin.clientY;
  let lastX = startX;
  let lastY = startY;
  let lastTime = performance.now();
  let velocity: Axes = { x: 0, y: 0 };

  const info = (): PanInfo => ({ offset: { x: lastX - startX, y: lastY - startY }, velocity });

  const move = (event: PointerEvent) => {
    const now = performance.now();
    const elapsed = now - lastTime;
    if (elapsed > 0) {
      velocity = { x: ((event.clientX - lastX) / elapsed) * 1000, y: ((event.clientY - lastY) / elapsed) * 1000 };
      lastTime = now;
    }
    lastX = event.clientX;
    lastY = event.clientY;
    handlers.onMove?.(info());
  };

  const detach = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', end);
    window.removeEventListener('pointercancel', end);
  };

  const end = () => {
    detach();
    handlers.onEnd?.(info());
  };

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  return detach;
}
