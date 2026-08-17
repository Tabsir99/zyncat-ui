import { animate, flip, measure, set } from '../../../engine';
import { UIMotion as SM } from '../../../tokens/motion-tokens';
import { el } from './dom';
import type { EmojiData } from './data';
import type { GetEmojiUrl } from './types';

const IDLE_CAPTION = 'Pick an emoji…';
const MARKER_OPACITY = 0.6;

export function createScaffold(root: HTMLElement, emojiData: EmojiData, getEmojiUrl: GetEmojiUrl, listboxId: string) {
  const scroll = el('div', 'on-emoji-scroll');
  const marker = el('span', 'on-emoji-marker');
  const caption = el('div', 'on-emoji-caption');

  scroll.id = listboxId;
  scroll.setAttribute('role', 'listbox');
  scroll.setAttribute('aria-label', 'Emoji');

  caption.innerHTML =
    '<img class="on-emoji-caption-img" alt="" draggable="false" hidden>' +
    '<span class="on-emoji-caption-name"></span><span class="on-emoji-caption-code"></span>';
  const [captionImg, captionName, captionCode] = caption.children as unknown as [
    HTMLImageElement,
    HTMLElement,
    HTMLElement,
  ];

  root.className = 'on-emoji-body';
  root.append(scroll, caption);

  const setCaption = (btn: HTMLButtonElement | null) => {
    const emoji = btn?.dataset.id ? emojiData.emojis[btn.dataset.id] : null;
    caption.classList.toggle('is-idle', !emoji);
    captionImg.hidden = !emoji;
    captionName.textContent = emoji ? emoji.name : IDLE_CAPTION;
    captionCode.textContent = emoji ? `:${emoji.shortcodes[0] ?? emoji.id}:` : '';
    if (emoji) captionImg.src = getEmojiUrl(emoji.id, 'picker-grid');
  };
  setCaption(null);

  const offsetWithinScroll = (node: HTMLElement) => {
    let left = 0;
    let top = 0;
    for (let box: HTMLElement | null = node; box && box !== scroll; box = box.offsetParent as HTMLElement | null) {
      left += box.offsetLeft;
      top += box.offsetTop;
    }
    return { left, top };
  };

  let hadFocus = false;
  const positionMarker = (btn: HTMLButtonElement | null) => {
    if (!btn?.offsetHeight) {
      animate(marker, { opacity: [0], timing: SM.t.exit });
      hadFocus = false;
      return;
    }
    const from = hadFocus ? measure(marker) : null;
    const tile = offsetWithinScroll(btn);
    set(marker, { x: [tile.left], y: [tile.top], width: [btn.offsetWidth], height: [btn.offsetHeight] });
    animate(marker, { opacity: [MARKER_OPACITY], timing: { duration: SM.dur.fast, ease: SM.ease.standard } });
    hadFocus = true;
    if (from && !SM.reduced)
      flip(marker, from, { size: 'none', timing: { duration: SM.dur.base, ease: SM.ease.standard } });
  };

  const mountMarker = () => {
    hadFocus = false;
    set(marker, { opacity: [0] });
    scroll.appendChild(marker);
  };

  return { scroll, setCaption, positionMarker, mountMarker };
}
