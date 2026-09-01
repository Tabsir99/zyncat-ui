# TikTok - @zyncat/ui/tiktok

Group: replicas
Docs: https://ui.zyncat.app/tiktok

A replica of TikTok's post surface: pick surface="desktop" for the 1584x912 web player with the photo carousel, or surface="mobile" for the 452x822 mobile-web viewport.

Platform metrics are pinned constants - no token, no --tiktok-* knob, so theming cannot move them.
name, caption, location (desktop) or music + sound (mobile), likes, comments, saves, shares. slides
takes an array for the desktop carousel, with slide/defaultSlide/onSlideChange controlling the page;
ratio letterboxes inside the frame. Chevrons, drag and arrow keys page it; muted, liked, saved,
followed are controllable toggles; onAction reports comment, share, menu, search. Counts print exact
below 10,000 then abbreviate. No autoplay, no fetch, no wordmark.

```tsx
<TikTok surface="desktop" name="Lena" caption="coast road" slides={[a, b]} likes={3149} />
```
