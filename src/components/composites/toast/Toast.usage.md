# Toast - @zyncat/ui/toast

Group: overlays
Docs: https://ui.zyncat.app/toast

Imperative transient notifications: mount <Toaster /> once at the app root, then call toast() from anywhere.

Without a mounted <Toaster />, toast() no-ops. <Toaster /> props: position ('bottom-right'
default), duration, visibleToasts, gap, offset, expand. The callable surface: toast(msg) -
toast.success/error/warning/info(msg, { description, action }) - toast.promise(p, { loading,
success, error }) - toast.loading - toast.dismiss().

```tsx
import { toast, Toaster } from '@zyncat/ui/toast';

// once at the root: <Toaster position="bottom-right" />
toast.success('Changes saved', { description: 'Synced to the cloud' });
toast.promise(save(), {
  loading: 'Saving...',
  success: (v) => `Saved - ${v.count}`,
  error: (e) => `Failed - ${e.message}`,
});
```
