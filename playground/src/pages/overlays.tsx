import { useState } from 'react';
import { Alert, Tooltip, Dialog, Overlay, Button, toast } from 'premium-ds';
import { Demo } from '../kit';
import { Icon } from '../icon';

export function AlertPage() {
  return (
    <>
      <Demo label="tones - title + body" fill>
        <div className="stack" style={{ gap: 'var(--space-3)', width: '100%', maxWidth: 560 }}>
          <Alert tone="info" title="A new version is available">
            Reload to get the latest improvements - your work is saved.
          </Alert>
          <Alert tone="success" title="Changes saved">
            Everything is up to date across your devices.
          </Alert>
          <Alert
            tone="warning"
            title="Your trial ends in 5 days"
            action={{ label: 'Upgrade', onClick: () => toast.info('Opening billing...') }}
          >
            Add a plan to keep your team's access uninterrupted.
          </Alert>
          <Alert
            tone="danger"
            title="Payment failed"
            action={{ label: 'Retry', onClick: () => toast.loading('Retrying payment...') }}
          >
            Your card was declined. Update your billing details to continue.
          </Alert>
        </div>
      </Demo>
      <Demo label="banner - dismissible" fill>
        <div className="stack" style={{ gap: 'var(--space-3)', width: '100%', maxWidth: 560 }}>
          <Alert
            banner
            tone="warning"
            title="2 items need your review"
            action={{ label: 'Review', onClick: () => toast('Opening review...') }}
          />
          <Alert tone="info" title="Tip: press ⌘K to jump anywhere" dismissible />
        </div>
      </Demo>
    </>
  );
}

export function ToastPage() {
  const fakeSave = (ok: boolean) =>
    new Promise<{ count: number }>((resolve, reject) =>
      setTimeout(() => (ok ? resolve({ count: 12 }) : reject(new Error('network timeout'))), 1400),
    );
  return (
    <>
      <Demo label="tones">
        <Button variant="secondary" onClick={() => toast('Copied to clipboard')}>
          Neutral
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.success('Changes saved', { description: 'Synced to the cloud' })}
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.error('Upload failed', { description: 'File too large' })}
        >
          Error
        </Button>
        <Button variant="secondary" onClick={() => toast.warning("You're running low on storage")}>
          Warning
        </Button>
        <Button variant="secondary" onClick={() => toast.info('A new version is available')}>
          Info
        </Button>
      </Demo>
      <Demo label="action - promise - loading">
        <Button
          variant="secondary"
          onClick={() =>
            toast('Item deleted', {
              description: 'Moved to trash',
              action: { label: 'Undo', onClick: () => toast.success('Restored') },
            })
          }
        >
          With action
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.promise(fakeSave(true), {
              loading: 'Saving...',
              success: (v) => `Saved - ${v.count} items`,
              error: (e) => `Failed - ${(e as Error).message}`,
            })
          }
        >
          Promise - resolves
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.promise(fakeSave(false), {
              loading: 'Uploading...',
              success: 'Uploaded',
              error: (e) => `Upload failed - ${(e as Error).message}`,
            })
          }
        >
          Promise - rejects
        </Button>
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Dismiss all
        </Button>
      </Demo>
    </>
  );
}

export function TooltipPage() {
  return (
    <>
      <Demo label="content - shortcut">
        <Tooltip content="Save changes" shortcut="⌘S">
          <Button variant="primary">Save</Button>
        </Tooltip>
        <Tooltip content="Discard draft" shortcut="Esc">
          <Button variant="secondary">Discard</Button>
        </Tooltip>
      </Demo>
      <Demo label="placements">
        <Tooltip placement="top" content="Shown above">
          <Button variant="secondary">Top</Button>
        </Tooltip>
        <Tooltip placement="bottom" content="Shown below">
          <Button variant="secondary">Bottom</Button>
        </Tooltip>
        <Tooltip placement="right" content="Re-runs the check and reports any new issues it finds.">
          <Button variant="secondary" iconLeft={<Icon name="info" size="sm" />}>
            Re-run
          </Button>
        </Tooltip>
      </Demo>
    </>
  );
}

export function DialogPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <Demo label="confirm - controlled">
      <Button variant="danger" onClick={() => setConfirmOpen(true)}>
        Delete project
      </Button>
      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        tone="danger"
        icon={<Icon name="warning-circle" />}
        title="Delete this project?"
        description="All of its content will be removed. This can't be undone."
        footer={(close) => (
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                close();
                toast.success('Project deleted');
              }}
            >
              Delete project
            </Button>
          </>
        )}
      >
        <p style={{ margin: 0, color: 'var(--text-body)' }}>
          Members will lose access immediately. Other projects are unaffected.
        </p>
      </Dialog>
    </Demo>
  );
}

export function OverlayPage() {
  return (
    <Demo label="popover menu">
      <Overlay
        side="bottom"
        align="start"
        trigger={
          <Button variant="secondary" iconRight={<Icon name="caret-down" size="sm" />}>
            Actions
          </Button>
        }
      >
        {({ close }) => (
          <div
            role="menu"
            aria-label="Actions"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-1)',
              padding: 'var(--space-2)',
              background: 'var(--bg-surface-raised)',
              border: 'var(--border-hairline) solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              minWidth: 200,
            }}
          >
            {(
              [
                { icon: 'pencil-simple', label: 'Rename', msg: 'Renaming...' },
                { icon: 'copy', label: 'Duplicate', msg: 'Duplicated' },
                { icon: 'trash', label: 'Delete', msg: 'Deleted' },
              ] as const
            ).map((it) => (
              <Button
                key={it.label}
                variant="ghost"
                size="sm"
                iconLeft={<Icon name={it.icon} size="sm" />}
                style={{ justifyContent: 'flex-start', width: '100%' }}
                onClick={() => {
                  close();
                  toast(it.msg);
                }}
              >
                {it.label}
              </Button>
            ))}
          </div>
        )}
      </Overlay>
    </Demo>
  );
}

export function SheetPage() {
  return (
    <>
      <Demo label="right - drag-to-dismiss">
        <Overlay
          mode="sheet"
          side="right"
          asChild
          trigger={<Button variant="secondary">Open panel</Button>}
        >
          {({ close }) => (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                width: 'min(400px, 92vw)',
                height: '100%',
                padding: 'var(--space-6)',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-xl)',
                overflowY: 'auto',
              }}
            >
              <div className="stack" style={{ gap: 'var(--space-1)' }}>
                <h2 style={{ font: 'var(--type-heading)', color: 'var(--text-strong)', margin: 0 }}>
                  Filters
                </h2>
                <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', margin: 0 }}>
                  Drag toward the edge, press Esc, or tap the scrim to dismiss.
                </p>
              </div>
              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 'var(--space-2)',
                }}
              >
                <Button variant="secondary" onClick={close}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    close();
                    toast.success('Filters applied');
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </Overlay>
      </Demo>
      <Demo label="bottom">
        <Overlay
          mode="sheet"
          side="bottom"
          asChild
          trigger={<Button variant="secondary">Open bottom sheet</Button>}
        >
          {({ close }) => (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Quick actions"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                width: '100%',
                maxHeight: '80vh',
                padding: 'var(--space-6)',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--border-strong)',
                  alignSelf: 'center',
                }}
              />
              <h2 style={{ font: 'var(--type-heading)', color: 'var(--text-strong)', margin: 0 }}>
                Quick actions
              </h2>
              <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', margin: 0 }}>
                The bottom sheet spans the full width and drags down to dismiss.
              </p>
              <Button onClick={close} style={{ alignSelf: 'flex-start' }}>
                Done
              </Button>
            </div>
          )}
        </Overlay>
      </Demo>
    </>
  );
}
