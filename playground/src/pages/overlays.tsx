import { useEffect, useState } from 'react';
import { Alert } from '@zyncat/ui/alert';
import { Tooltip } from '@zyncat/ui/tooltip';
import { Dialog } from '@zyncat/ui/dialog';
import { Popover } from '@zyncat/ui/popover';
import { Dropdown } from '@zyncat/ui/dropdown';
import { Sheet } from '@zyncat/ui/sheet';
import { Button } from '@zyncat/ui/button';
import { toast } from '@zyncat/ui/toast';
import { EmojiPickerPanel, loadEmojiData, getEmojiUrl } from '@zyncat/ui/emoji-picker';
import { Icon } from '../icon';

/* ==========================================================================
   Alert
   ========================================================================== */
export function AlertHero() {
  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <Alert
        tone="warning"
        title="Subscription renewal"
        action={{ label: 'Manage plan', onClick: () => toast.info('Navigating to billing...') }}
      >
        Your workspace trial will expire in 3 days.
      </Alert>
    </div>
  );
}

export function AlertTonesDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: 500 }}>
      <Alert tone="info" title="System update available">
        A new version of Zyncat UI is ready to download.
      </Alert>
      <Alert tone="success" title="Draft published">
        All 8 queued items have been sent successfully.
      </Alert>
      <Alert tone="danger" title="Payment declined">
        Please check your billing details to prevent suspension.
      </Alert>
    </div>
  );
}

/* ==========================================================================
   Toast
   ========================================================================== */
export function ToastHero() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Button
        variant="secondary"
        onClick={() => toast.success('Changes saved', { description: 'Updated across all workspaces.' })}
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.error('Connection lost', { description: 'Retrying in 5 seconds...' })}
      >
        Error toast
      </Button>
      <Button variant="secondary" onClick={() => toast.info('New message received')}>
        Info toast
      </Button>
    </div>
  );
}

/* ==========================================================================
   Tooltip
   ========================================================================== */
export function TooltipHero() {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
      <Tooltip content="Schedule post to queue" shortcut="⌘S">
        <Button variant="secondary">Schedule</Button>
      </Tooltip>
      <Tooltip content="Delete permanently" shortcut="⌫">
        <Button variant="danger">Delete</Button>
      </Tooltip>
    </div>
  );
}

/* ==========================================================================
   Dialog
   ========================================================================== */
export function DialogHero() {
  return (
    <Dialog
      trigger={<Button variant="danger">Delete project</Button>}
      title="Delete project permanently?"
      tone="danger"
      footer={(close) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              toast.success('Project deleted');
              close();
            }}
          >
            Delete
          </Button>
        </div>
      )}
    >
      This action cannot be undone. All queued posts and analytics history will be removed.
    </Dialog>
  );
}

/* ==========================================================================
   Popover
   ========================================================================== */
export function PopoverHero() {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      trigger={<Button variant="secondary">More actions</Button>}
      side="bottom"
      align="start"
      open={open}
      onOpenChange={setOpen}
    >
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 160 }}>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)} style={{ justifyContent: 'flex-start' }}>
          Reschedule batch
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)} style={{ justifyContent: 'flex-start' }}>
          Duplicate draft
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)} style={{ justifyContent: 'flex-start' }}>
          Export CSV
        </Button>
      </div>
    </Popover>
  );
}

/* ==========================================================================
   Dropdown
   ========================================================================== */
export function DropdownHero() {
  return (
    <Dropdown
      ariaLabel="Post options"
      trigger={<Button variant="secondary">Options</Button>}
      onSelect={(id) => toast.info(`Action: ${id}`)}
      items={[
        {
          label: 'Post Management',
          items: [
            { id: 'edit', label: 'Edit post', shortcut: 'E' },
            { id: 'duplicate', label: 'Duplicate', shortcut: 'D' },
          ],
        },
        { items: [{ id: 'delete', label: 'Delete permanently', danger: true }] },
      ]}
    />
  );
}

/* ==========================================================================
   Sheet
   ========================================================================== */
export function SheetHero() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open settings panel
      </Button>
      <Sheet side="right" open={open} onOpenChange={setOpen}>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-strong)' }}>Channel Settings</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Configure rate limits, retry rules, and auto-publishing parameters for this channel.
          </p>
          <Button onClick={() => setOpen(false)} style={{ marginTop: '16px' }}>
            Save settings
          </Button>
        </div>
      </Sheet>
    </>
  );
}

/* ==========================================================================
   EmojiPicker
   ========================================================================== */
export function EmojiPickerHero() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState('✨');

  useEffect(() => {
    loadEmojiData('/emojis.json');
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '1.75rem' }}>{picked}</span>
      <EmojiPickerPanel
        open={open}
        onOpenChange={setOpen}
        onSelect={(shortcode, hexId) => {
          setPicked(shortcode);
          setOpen(false);
        }}
        getEmojiUrl={getEmojiUrl}
        search
        popoverProps={{ side: 'bottom', align: 'start' }}
        trigger={<Button variant="secondary">Add reaction</Button>}
      />
    </div>
  );
}
