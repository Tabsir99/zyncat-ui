# MotionDevtools - @zyncat/ui/motion-devtools

Group: dev

Dev-only floating panel that slows or freezes EVERY animation at once (CSS and WAAPI) for motion debugging.

Mount once at the app root - no provider, touches no other component. Gate behind a dev check; keep
it out of production. placement top-left|top-right|bottom-left|bottom-right, offset, presets,
maxFactor, defaultFactor, scaleTimers, persist, defaultOpen. Also exports motionSlowmo for
console/hotkey control.

```tsx
{
  import.meta.env.DEV && <MotionDevtools placement="bottom-right" />;
}
```
