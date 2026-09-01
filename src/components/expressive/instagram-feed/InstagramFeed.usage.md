# InstagramFeed - @zyncat/ui/instagram-feed

Group: replicas
Docs: https://ui.zyncat.app/instagram-feed

A replica of one Instagram feed post, pixel-pinned to the platform and immune to your theme.

type image|video is structural, not cosmetic: video runs the black frame full-bleed from the top of
the card and floats the header on it in white with the audio credit on a second line. width
mobile|web picks the 390px viewport or the 470px column, which alone carries Follow. ratio 4:5|1:1
frames the media; media and avatar take a URL string or your own node, and nothing is ever fetched.
likes/comments/reposts render compacted inline beside each glyph. liked, saved and muted are
controllable toggles; double-tapping the frame likes it and bursts a heart. onAction reports
comment, repost, send, menu and follow.

```tsx
<InstagramFeed type="video" handle="northfieldsupply" caption="Munnar vibe #kerala" media={clip} likes={760400} />
```
