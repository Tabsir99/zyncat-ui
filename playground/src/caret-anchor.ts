import type { VirtualAnchor } from '@zyncat/ui/popover';

const MIRRORED_PROPERTIES = [
  'box-sizing',
  'border-bottom-width',
  'border-left-width',
  'border-right-width',
  'border-top-width',
  'font-family',
  'font-size',
  'font-style',
  'font-variant',
  'font-weight',
  'letter-spacing',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'text-indent',
  'text-transform',
  'word-spacing',
];

function measureCaret(input: HTMLInputElement, index: number): DOMRect {
  const box = input.getBoundingClientRect();
  const computed = getComputedStyle(input);
  const mirror = document.createElement('div');
  for (const property of MIRRORED_PROPERTIES) {
    mirror.style.setProperty(property, computed.getPropertyValue(property));
  }
  mirror.style.position = 'fixed';
  mirror.style.top = '0';
  mirror.style.left = '-9999px';
  mirror.style.width = `${input.offsetWidth}px`;
  mirror.style.whiteSpace = 'pre';
  mirror.style.visibility = 'hidden';
  mirror.textContent = input.value.slice(0, index);

  const marker = document.createElement('span');
  marker.textContent = '\u200b';
  mirror.appendChild(marker);
  document.body.appendChild(mirror);
  const offset = marker.getBoundingClientRect().left - mirror.getBoundingClientRect().left;
  mirror.remove();

  const x = Math.min(Math.max(box.left + offset - input.scrollLeft, box.left), box.right);
  return new DOMRect(x, box.top, 0, box.height);
}

export const caretAnchor = (input: HTMLInputElement, index: number): VirtualAnchor => ({
  getBoundingClientRect: () => measureCaret(input, index),
});
