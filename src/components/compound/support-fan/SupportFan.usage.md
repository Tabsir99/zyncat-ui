# SupportFan - @zyncat/ui/support-fan

Group: compound
Docs: https://ui.zyncat.app/support-fan

A corner trigger that fans its actions onto an arc, with one pointer-tracked field the whole row glides along.

Pick it over Dropdown when the affordance is a persistent support entry point rather than a menu on
a control. layout arc|dock|icon-dock; the arc derives its own radius from the chip box and the
count, so any number of actions keeps an even pitch. glide, magnify, bow and spread shape the field

- bow lifts the focused chip off the row and spread is that gaussian's width, 0.6 for one chip and 3
  for the whole row. caption is the resting line; pointing at or focusing a chip replaces it with the
  action's label and meta. live, label and triggerIcon dress the trigger. Arrow keys drive the same
  field the pointer does. It pins to the nearest positioned ancestor; set position fixed via
  className.

```tsx
<SupportFan actions={actions} caption="Studio open" onSelect={route} />
```
