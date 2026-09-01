# FacebookFeed - @zyncat/ui/facebook-feed

Group: replicas
Docs: https://ui.zyncat.app/facebook-feed

Replica of Facebook's three post surfaces, pinned to the platform's real metrics: the feed card, the reels stage and the story stage.

Pick it over InstagramFeed when you need Facebook's chrome - caption ABOVE the media, a blurred
saturated letterbox, the 65px reels rail. surface post|reel|story, width mobile|web, stage
narrow|wide, type image|video, ratio 4:5|1.1:1|1:1|3:4|16:9. name, caption, stamp, audio, avatar and
media take a URL string or your own node; follow, ring, verified toggle the chrome;
likes/comments/shares stay exact below 1,000. liked and muted are controllable toggles; onAction
reports comment, share, follow, menu, dismiss, more, search, play. Fixed widths, no theming knobs -
fidelity is the contract.

```tsx
<FacebookFeed surface="post" width="web" media={<img src={src} alt="" />} likes={267} />
```
