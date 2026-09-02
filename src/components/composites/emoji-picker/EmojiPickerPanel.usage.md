# EmojiPickerPanel - @zyncat/ui/emoji-picker

Group: overlays
Docs: https://ui.zyncat.app/emoji-picker

Searchable emoji panel - grid, scrollspy category rail, recents in localStorage - living in a Popover, becoming a bottom Sheet on narrow viewports.

Matching is word-based, not fuzzy. The dataset is NOT bundled: call loadEmojiData(url | EmojiData)
once before the panel first opens or it throws; onEmojiDataLoaded(cb) fires when it lands and
getEmojiArray() then reads it back. getEmojiUrl is REQUIRED. Two shapes. search renders the panel's
own field, opened from trigger. query drives the grid from an input YOU own - point
popoverProps.anchor at the caret rect and forward keys through the ref.

```tsx
import { EmojiPickerPanel, getEmojiUrl, loadEmojiData } from '@zyncat/ui/emoji-picker';

loadEmojiData('/emojis.json'); // once, before the panel first opens
<EmojiPickerPanel
  open={open}
  onOpenChange={setOpen}
  onSelect={addReaction}
  getEmojiUrl={getEmojiUrl}
  search
  trigger={<Button variant="secondary">Add reaction</Button>}
/>;
```
