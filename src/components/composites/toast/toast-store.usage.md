# toast-store - @zyncat/ui/toast-store

Group: overlays
Docs: https://ui.zyncat.app/toast

The headless store behind Toast: subscribe to the toast queue and drive it without rendering <Toaster />.

Reach for it only when building a custom toast surface; for notifications in an app, import
toast() and <Toaster /> from @zyncat/ui/toast instead. Exposes the snapshot (toasts, paused,
expanded), the store subscription, and the record shape each toast carries.

```tsx
import { toast } from '@zyncat/ui/toast-store';

toast.success('Changes saved');
```
