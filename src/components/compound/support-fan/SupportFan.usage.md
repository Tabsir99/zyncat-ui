# SupportFan - @zyncat/ui/support-fan

Group: compound
Docs: https://ui.zyncat.app/support-fan

A corner trigger that fans its actions onto an arc, or onto a magnifying Dock rail, with one pointer-tracked field the row answers.

Pick it over Dropdown when the affordance is a persistent support entry point rather than a menu on
a control. layout arc|dock|icon-dock; the arc derives its own radius from the chip box and the count,
so any number of actions keeps an even pitch, while dock and icon-dock hand the row to a real Dock -
the chip nearest the pointer swells and pushes its neighbours along the rail. glide, magnify, bow and
spread shape the field: magnify is the swell and spread the reach on every layout, glide and bow are
arc geometry. caption is the resting line; pointing at or focusing a chip replaces it with the
action's label and meta. live, label and triggerIcon dress the trigger. Arrow keys drive the same
field the pointer does. It pins to the nearest positioned ancestor; set position fixed via className.

```tsx
<SupportFan actions={actions} caption="Studio open" onSelect={route} />
```
