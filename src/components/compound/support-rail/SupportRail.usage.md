# SupportRail - @zyncat/ui/support-rail

Group: compound
Docs: https://ui.zyncat.app/support-rail

An edge tab that grows a support panel out of its own measured box.

Pick it over Sheet when the affordance must stay visible and the panel must not take the screen
over. actions renders the rows; selecting one fires onSelect and leaves the rail open, so render
what happens next in children. title names the panel, status is the mono line under it, needleLabel
is the vertical word on the tab, live adds the availability dot, footer pins a bottom strip. side
right|left flips the needle, the collapse origin and the drag axis. Drag the grabber outward past
88px or flick it over 500px/s to dismiss; Escape and the close button are the keyboard equivalents.
Row padding is --support-rail-row-pad-block/-inline, not a density prop.

```tsx
<SupportRail actions={actions} status="Open - closes 20:00" live onSelect={route} />
```
