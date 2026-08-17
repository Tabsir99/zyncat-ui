'use client';

import './styles.css';
import { useImperativeHandle, useMemo, useState, type ReactElement, type Ref } from 'react';
import { Popover, type PopoverProps, type VirtualAnchor } from '../popover/Popover';
import { Sheet, type SheetProps } from '../sheet/Sheet';
import { TextField } from '../../primitives/input/TextField';
import { Icon } from '../../internal/icon/Icon';
import { useMediaQuery } from '../../internal/hooks/use-media-query';
import { useEmojiPicker, type EmojiPickerStore } from './react/useEmojiPicker';
import { CategoryBar } from './react/category-bar';
import type { GetEmojiUrl } from './types';

export { loadEmojiData, onEmojiDataLoaded, type EmojiData, type Emoji } from './data';
export { getEmojiUrl } from './getEmojiUrl';
export type { GetEmojiUrl, EmojiUrlSource } from './types';

export const SHEET_BREAKPOINT = '(max-width: 40rem)';

type Forwarded = 'open' | 'onOpenChange' | 'trigger' | 'children' | 'htmlProps';

export type EmojiPickerHandle = Pick<EmojiPickerStore, 'renderAll' | 'renderFiltered' | 'handleKey' | 'selectFocused'>;

export interface EmojiPickerPanelProps {
  /** Controlled open state - the panel has no uncontrolled mode. */
  open: boolean;
  /** Fires whenever the panel asks to open or close: trigger press, Esc, outside press, sheet drag. */
  onOpenChange: (open: boolean) => void;
  /** Fires on pick, with the primary shortcode (`smile`, no colons) and the emoji's hex id. */
  onSelect: (shortcode: string, hexId: string) => void;
  /** Builds the image URL for one emoji at one call site. Pass the bundled `getEmojiUrl` to use Twemoji and Noto. */
  getEmojiUrl: GetEmojiUrl;
  /** Element that both opens the panel and anchors it, when there is no anchor. */
  trigger?: ReactElement | null;
  /** Gap in pixels between a custom `popoverProps.anchor` and the panel. Ignored when the panel anchors to its trigger. */
  offset?: number;
  /** Render the panel's own search field. Always on in sheet mode, where the
   *  sheet traps focus and an outside query can no longer reach the panel. */
  search?: boolean;
  /** Drive the results from outside — a `:` chip in a document, your own input. */
  query?: string;
  /** Viewport at which the panel becomes a bottom sheet. */
  breakpoint?: string;
  /** Desktop placement — `anchor`, `side`, `align`, `arrow`, and every other Popover knob. */
  popoverProps?: Omit<PopoverProps, Forwarded>;
  /** Narrow-viewport docking — `container`, `dismissible`, and every other Sheet knob. */
  sheetProps?: Omit<SheetProps, Forwarded | 'side'>;
  /** Extra class(es) merged onto the panel frame. */
  className?: string;
  /** Imperative handle - drive the grid from your own field: `handleKey`, `selectFocused`, `renderAll`, `renderFiltered`. */
  ref?: Ref<EmojiPickerHandle>;
}

const inflate = (anchor: VirtualAnchor | null | undefined, by: number): VirtualAnchor | null => {
  if (!anchor || !by) return anchor ?? null;
  return {
    getBoundingClientRect: () => {
      const r = anchor.getBoundingClientRect();
      return new DOMRect(r.x - by, r.y - by, r.width + by * 2, r.height + by * 2);
    },
  };
};

export function EmojiPickerPanel({
  open,
  onOpenChange,
  onSelect,
  getEmojiUrl,
  trigger = null,
  offset = 0,
  search = false,
  query,
  breakpoint = SHEET_BREAKPOINT,
  popoverProps,
  sheetProps,
  className,
  ref,
}: EmojiPickerPanelProps) {
  const asSheet = useMediaQuery(breakpoint);
  const [ownQuery, setOwnQuery] = useState('');
  const drivenFromOutside = !asSheet && query !== undefined;
  const picker = useEmojiPicker({ onSelect, getEmojiUrl, query: drivenFromOutside ? query : ownQuery });

  useImperativeHandle(ref, () => picker, [picker]);

  const { mount, searchRef, searchProps, handleKey } = picker;
  const anchor = popoverProps?.anchor;
  const positioned = useMemo(() => inflate(anchor, offset), [anchor, offset]);

  const frame = (
    <div className={['on-emoji', asSheet && 'on-emoji--sheet', className].filter(Boolean).join(' ')}>
      {asSheet || search ? (
        <div className="on-emoji-search" ref={searchRef}>
          <TextField
            size="sm"
            type="search"
            clearable
            placeholder="Search emoji"
            leadingIcon={<Icon name="magnifying-glass" size="sm" />}
            value={ownQuery}
            onChange={(e) => setOwnQuery(e.target.value)}
            onKeyDown={(e) => {
              const horizontal = e.key === 'ArrowLeft' || e.key === 'ArrowRight';
              if (horizontal && e.currentTarget.value) return;
              if (e.key.startsWith('Arrow') || e.key === 'Enter') handleKey(e.nativeEvent);
            }}
            htmlProps={{ ...searchProps, autoFocus: true, spellCheck: false, 'aria-label': 'Search emoji' }}
          />
        </div>
      ) : null}
      <CategoryBar store={picker} />
      <div ref={mount} />
    </div>
  );

  return asSheet ? (
    <Sheet
      {...sheetProps}
      open={open}
      onOpenChange={onOpenChange}
      side="bottom"
      trigger={trigger}
      htmlProps={{ className: 'on-emoji-sheet' }}
    >
      <div role="dialog" aria-label="Emoji picker">
        {frame}
      </div>
    </Sheet>
  ) : (
    <Popover
      side="right"
      align="center"
      {...popoverProps}
      anchor={positioned}
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      htmlProps={{ className: 'on-emoji-pop', 'aria-label': 'Emoji picker' }}
    >
      {frame}
    </Popover>
  );
}
