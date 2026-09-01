# YouTube - @zyncat/ui/youtube

Group: replicas
Docs: https://ui.zyncat.app/youtube

Replica of three YouTube surfaces, picked with surface: a feed grid card (video), a Shorts player with its action rail (short), or a community post (post).

Platform metrics are pinned; theming tokens do not move them. One prop set spans all three - title,
channel, views, age, duration, verified, likes, comments, remixes, text. paused and progress drive
the Shorts overlay and bar as consumer state. carousel takes an array of images and turns the post
frame into a draggable, arrow-keyed paged strip; page/defaultPage/onPageChange control it. media and
avatar take a URL or your own node, with CSS placeholders when empty. liked and disliked are
controllable toggles; onAction reports comment, share, remix, menu, expand. Never fetches, never
plays.

```tsx
<YouTube surface="video" title="..." channel="..." views="2m views" age="1 year ago" duration="34:46" verified />
```
