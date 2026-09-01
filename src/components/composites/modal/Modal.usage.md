# Modal - @zyncat/ui/modal

Group: overlays

The SAME modality as Dialog (scrim, focus trap, scroll lock, inert, Esc, motion) with ZERO paint - no header, no body padding, no width cap, no border/radius/shadow.

You supply the whole surface AND its semantics (role="dialog" + a label). Use it ONLY when Dialog's
chrome is the problem: lightbox / image viewer, full-bleed media, video, a custom layout that owns
its own edges. If the content is a title + text + buttons, use Dialog instead. htmlProps paints the
panel (centered by default; width+height 100% = full-bleed), layerProps reaches the box behind it
(set --bg-overlay to retint the scrim). Also takes trigger, dismissible, container, animation.

```tsx
<Modal
  open={!!src}
  onOpenChange={() => setSrc(null)}
  htmlProps={{ className: 'lightbox' }}
  layerProps={{ style: { '--bg-overlay': 'rgb(0 0 0 / 0.92)' } }}
>
  <div role="dialog" aria-label="Image viewer">
    <img src={src} alt="" />
  </div>
</Modal>
```
