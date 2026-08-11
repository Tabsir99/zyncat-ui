import type { ComponentDoc } from './types';

export const overlays: Record<string, ComponentDoc> = {
  alert: {
    example: `import { Alert } from '@zyncat/ui/alert';

<Alert
  tone="warning"
  title="Your trial ends in 3 days"
  action={{ label: 'Upgrade now', onClick: handleUpgrade }}
  dismissible
>
  Switch to a paid plan to keep your scheduled posts running.
</Alert>`,
    props: [
      {
        name: 'tone',
        type: "'info' | 'success' | 'warning' | 'danger'",
        default: "'info'",
        description: 'Status tone; info and success are polite, warning and danger are assertive.',
      },
      {
        name: 'title',
        type: 'React.ReactNode',
        required: true,
        description: 'The main message, sentence case, ideally one line.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        default: 'null',
        description: 'Optional body text shown below the title.',
      },
      {
        name: 'action',
        type: '{ label: string; onClick?: () => void }',
        default: 'null',
        description: 'One action button max, rendered as a secondary small button.',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        default: 'false',
        description: 'Renders a close button; triggers uncontrolled dismissal unless `open` is also set.',
      },
      {
        name: 'onDismiss',
        type: '() => void',
        description: 'Fires when the alert is dismissed; with `open` set, the parent owns visibility.',
      },
      {
        name: 'open',
        type: 'boolean',
        description: 'Controlled visibility; omit for uncontrolled (animates height collapse on exit).',
      },
      {
        name: 'banner',
        type: 'boolean',
        default: 'false',
        description: 'App-level strip mode: square corners and bottom border only.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode | null',
        description: 'Override the tone icon; pass null to render no icon.',
      },
      {
        name: '...rest',
        type: 'React.HTMLAttributes<HTMLDivElement>',
        description: 'All other props forwarded to the root div element.',
      },
    ],
  },

  toast: {
    example: `import { Toaster, toast } from '@zyncat/ui/toast';

// Mount <Toaster /> once near your app root. Without it, toast() renders nothing.
function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <YourApp />
    </>
  );
}

// Then call toast() from anywhere - no context, no provider.
toast.success('Post scheduled', { description: '10 posts added to the Monday queue.' });

toast.promise(publishBatch(), {
  loading: 'Publishing batch...',
  success: (r) => 'Batch complete - ' + r.count + ' posts published',
  error: (e) => 'Batch failed: ' + e.message,
});`,
    props: [
      {
        name: '<Toaster />',
        type: 'ToasterProps',
        required: true,
        description: 'Mount once at the app root. Owns the viewport; toast() no-ops until it is mounted.',
      },
      {
        name: 'Toaster position',
        type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
        default: "'bottom-right'",
        description: 'Corner the stack anchors to.',
      },
      {
        name: 'Toaster duration',
        type: 'number',
        default: '0',
        description: 'Default auto-dismiss in ms for timed toasts; 0 keeps the per-tone defaults.',
      },
      {
        name: 'Toaster visibleToasts',
        type: 'number',
        default: '3',
        description: 'How many cards stay visible before the rest recede behind.',
      },
      {
        name: 'Toaster expand',
        type: 'boolean',
        default: 'false',
        description: 'Start the stack fanned open instead of collapsed.',
      },
      {
        name: 'Toaster gap, offset',
        type: 'number',
        default: '0',
        description: 'Px between cards and inset from the edge; 0 uses the token defaults.',
      },
      {
        name: 'toast(msg, opts?)',
        type: '(msg: string, opts?: ToastOptions) => string',
        description: 'Show a neutral toast and return its id.',
      },
      {
        name: 'toast.success(msg, opts?)',
        type: '(msg: string, opts?: ToastOptions) => string',
        description: 'Show a success toast; auto-dismisses after 5 s.',
      },
      {
        name: 'toast.error(msg, opts?)',
        type: '(msg: string, opts?: ToastOptions) => string',
        description: 'Show an error toast; auto-dismisses after 8 s.',
      },
      {
        name: 'toast.warning(msg, opts?)',
        type: '(msg: string, opts?: ToastOptions) => string',
        description: 'Show a warning toast; auto-dismisses after 8 s.',
      },
      {
        name: 'toast.info(msg, opts?)',
        type: '(msg: string, opts?: ToastOptions) => string',
        description: 'Show an info toast; auto-dismisses after 5 s.',
      },
      {
        name: 'toast.loading(msg, opts?)',
        type: '(msg: string, opts?: ToastOptions) => string',
        description: 'Show a sticky loading toast; stays visible until updated or dismissed.',
      },
      {
        name: 'toast.dismiss(id?)',
        type: '(id?: string | null) => void',
        description: 'Dismiss a toast by id, or all toasts if id is omitted.',
      },
      {
        name: 'toast.update(id, patch?)',
        type: '(id: string, patch?: Partial<ToastRecord>) => string',
        description: 'Update a live toast in place; changing tone resets its auto-dismiss timer.',
      },
      {
        name: 'toast.promise(promise, msgs?)',
        type: '<T>(promise: Promise<T>, msgs?: { loading?: string; success?: string | ((v: T) => string); error?: string | ((e: unknown) => string) }) => Promise<T>',
        description: 'Show a loading toast that transitions to success or error when the promise settles.',
      },
      {
        name: 'toast.custom(node, opts?)',
        type: '(node: unknown, opts?: { id?: string | number; duration?: number; dismissible?: boolean }) => string',
        description: 'Show a fully custom React node toast with no built-in chrome.',
      },
      {
        name: 'opts.id',
        type: 'string | number',
        description: 'Stable key for deduplication and targeted updates via toast.update.',
      },
      { name: 'opts.duration', type: 'number', description: 'Auto-dismiss delay in ms; omit to use the tone preset.' },
      { name: 'opts.description', type: 'string | null', description: 'Secondary line shown below the message.' },
      {
        name: 'opts.action',
        type: '{ label: string; onClick: () => void }',
        description: 'Action button shown inside the toast; dismisses the toast after the click handler runs.',
      },
    ],
  },

  tooltip: {
    example: `import { Tooltip } from '@zyncat/ui/tooltip';

<Tooltip content="Schedule to queue" shortcut="S">
  <button type="button">Schedule</button>
</Tooltip>`,
    props: [
      {
        name: 'content',
        type: 'ReactNode',
        required: true,
        description: 'The hint text or node; never use interactive content here.',
      },
      {
        name: 'shortcut',
        type: 'string | null',
        default: 'null',
        description: 'Optional keyboard hint shown as secondary mono text alongside the content.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'top'",
        description: 'Preferred side; auto-flips when the chosen side has insufficient viewport room.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Suppress the tooltip entirely; the trigger renders normally.',
      },
      {
        name: 'openDelay',
        type: 'number',
        default: '350',
        description: 'Delay in ms before a cold hover opens the tooltip.',
      },
      {
        name: 'closeDelay',
        type: 'number',
        default: '140',
        description: 'Delay in ms the bubble lingers after the cursor leaves.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        default: 'false',
        description: 'Clone the child and merge event handlers directly; child must accept a ref.',
      },
      { name: 'id', type: 'string', description: 'ID applied to the tooltip trigger wrapper.' },
      {
        name: 'children',
        type: 'ReactElement',
        required: true,
        description: 'The trigger element; must accept a ref when asChild is true.',
      },
    ],
  },

  dialog: {
    example: `import { Dialog } from '@zyncat/ui/dialog';

<Dialog
  trigger={<button type="button">Delete post</button>}
  title="Delete scheduled post?"
  tone="danger"
  footer={(close) => (
    <>
      <button type="button" onClick={close}>Cancel</button>
      <button type="button" onClick={() => { deletePost(); close(); }}>Delete post</button>
    </>
  )}
>
  This will remove the post from the queue permanently.
</Dialog>`,
    props: [
      { name: 'open', type: 'boolean', description: 'Controlled open state; omit for uncontrolled mode.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the dialog opens or closes.' },
      {
        name: 'trigger',
        type: 'React.ReactElement | null',
        default: 'null',
        description: 'Element cloned to open the dialog; useful for uncontrolled ergonomics.',
      },
      { name: 'title', type: 'React.ReactNode', description: 'Heading shown in the dialog header.' },
      {
        name: 'description',
        type: 'React.ReactNode',
        default: 'null',
        description: 'Subheading shown below the title.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Width preset for the dialog surface.',
      },
      {
        name: 'tone',
        type: "'default' | 'danger'",
        default: "'default'",
        description: "'danger' tints the header badge; use for destructive confirms.",
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        default: 'null',
        description: 'Icon node for the header badge, useful for alert-style dialogs.',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        default: 'true',
        description: 'Renders a close button and enables backdrop and Esc dismissal.',
      },
      {
        name: 'footer',
        type: 'React.ReactNode | ((close: () => void) => React.ReactNode)',
        default: 'null',
        description: 'Action row content; use the render function form to call close from uncontrolled dialogs.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Body content rendered inside the scrollable dialog body.',
      },
      { name: 'id', type: 'string', description: 'ID applied to the dialog element.' },
    ],
  },

  popover: {
    example: `import { Popover } from '@zyncat/ui/popover';

<Popover
  trigger={<button type="button">Actions</button>}
  side="bottom"
  align="start"
>
  {({ close }) => (
    <menu>
      <li><button type="button" onClick={close}>Reschedule</button></li>
      <li><button type="button" onClick={close}>Move to drafts</button></li>
    </menu>
  )}
</Popover>`,
    props: [
      { name: 'open', type: 'boolean', description: 'Controlled open state; omit to stay uncontrolled.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the panel opens or closes.' },
      {
        name: 'trigger',
        type: 'React.ReactElement | null',
        default: 'null',
        description: 'Element cloned to toggle the panel; also serves as the anchor.',
      },
      {
        name: 'side',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'bottom'",
        description: 'Preferred side; flips to the opposite side when cramped.',
      },
      {
        name: 'align',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
        description: 'Cross-axis alignment of the panel relative to the trigger.',
      },
      {
        name: 'arrow',
        type: 'boolean',
        default: 'false',
        description: 'Renders a pointing caret tracking the trigger center.',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        default: 'true',
        description: 'Enables Esc and outside-press dismissal.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        default: 'false',
        description: 'Render no wrapper element; your DOM-element child becomes the panel directly.',
      },
      { name: 'id', type: 'string', description: 'ID applied to the panel element.' },
      {
        name: 'children',
        type: 'React.ReactNode | ((api: { close: () => void }) => React.ReactNode)',
        required: true,
        description: 'The panel content; pass a function to receive the close callback.',
      },
    ],
  },

  sheet: {
    example: `import { Sheet } from '@zyncat/ui/sheet';

<Sheet
  side="right"
  trigger={<button type="button">Channel settings</button>}
>
  {({ close }) => (
    <div>
      <h2>Channel settings</h2>
      <p>Configure posting rules and scheduling limits for this channel.</p>
      <button type="button" onClick={close}>Done</button>
    </div>
  )}
</Sheet>`,
    props: [
      { name: 'side', type: "'right' | 'bottom'", default: "'right'", description: 'Edge the sheet slides in from.' },
      { name: 'open', type: 'boolean', description: 'Controlled open state; omit to stay uncontrolled.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the sheet opens or closes.' },
      {
        name: 'trigger',
        type: 'React.ReactElement | null',
        default: 'null',
        description: 'Element cloned to open the sheet.',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        default: 'true',
        description: 'Enables the scrim, Esc key, and drag-to-edge gesture to close.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        default: 'false',
        description: 'Render no wrapper element; your DOM-element child becomes the panel.',
      },
      { name: 'id', type: 'string', description: 'ID applied to the sheet panel element.' },
      {
        name: 'children',
        type: 'React.ReactNode | ((api: { close: () => void }) => React.ReactNode)',
        required: true,
        description: 'The sheet content; pass a function to receive the close callback.',
      },
    ],
  },
};
