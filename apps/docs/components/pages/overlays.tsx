'use client';

import { useEffect, useState, type CSSProperties } from 'react';

import { Alert } from '@zyncat/ui/alert';
import { Button } from '@zyncat/ui/button';
import { Dialog, type DialogProps } from '@zyncat/ui/dialog';
import { Dropdown } from '@zyncat/ui/dropdown';
import { EmojiPickerPanel, getEmojiUrl, loadEmojiData } from '@zyncat/ui/emoji-picker';
import { Popover, type PopoverProps } from '@zyncat/ui/popover';
import { Sheet, type SheetProps } from '@zyncat/ui/sheet';
import { toast } from '@zyncat/ui/toast';
import { Tooltip, type TooltipProps } from '@zyncat/ui/tooltip';

import { KnobSegment, KnobSwitch, Playground } from '../playground';

type DialogTone = NonNullable<DialogProps['tone']>;
type PopoverSide = NonNullable<PopoverProps['side']>;
type PopoverAlign = NonNullable<PopoverProps['align']>;
type SheetSide = NonNullable<SheetProps['side']>;
type TooltipPlacement = NonNullable<TooltipProps['placement']>;

const MENU: CSSProperties = { padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 160 };
const MENU_BTN: CSSProperties = { justifyContent: 'flex-start' };

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
      <Button
        variant="secondary"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2200)), {
            loading: 'Publishing 8 queued posts...',
            success: 'Queue published',
            error: 'Queue failed',
          })
        }
      >
        Promise toast
      </Button>
    </div>
  );
}

export function TooltipPlayground() {
  const [placement, setPlacement] = useState<TooltipPlacement>('top');
  const [shortcut, setShortcut] = useState(true);

  const code = `<Tooltip content="Schedule post to queue"${shortcut ? ' shortcut="⌘S"' : ''} placement="${placement}">
  <Button variant="secondary">Schedule</Button>
</Tooltip>`;

  return (
    <Playground
      code={code}
      note="One bubble travels between triggers - hover the pair and watch it glide."
      rail={
        <>
          <KnobSegment
            label="placement"
            value={placement}
            onChange={setPlacement}
            options={['top', 'bottom', 'left', 'right']}
          />
          <KnobSwitch label="shortcut" checked={shortcut} onChange={setShortcut} />
        </>
      }
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: 'var(--space-7) 0' }}>
        <Tooltip content="Schedule post to queue" shortcut={shortcut ? '⌘S' : undefined} placement={placement}>
          <Button variant="secondary">Schedule</Button>
        </Tooltip>
        <Tooltip content="Delete permanently" shortcut={shortcut ? '⌫' : undefined} placement={placement}>
          <Button variant="danger">Delete</Button>
        </Tooltip>
      </div>
    </Playground>
  );
}

export function DialogPlayground() {
  const [tone, setTone] = useState<DialogTone>('danger');
  const [dismissible, setDismissible] = useState(true);
  const [open, setOpen] = useState(false);

  const code = `<Dialog
  open={open}
  onOpenChange={setOpen}
  tone="${tone}"
  dismissible={${dismissible}}
  title="${tone === 'danger' ? 'Delete project permanently?' : 'Rename this project?'}"
  footer={(close) => (
    <>
      <Button variant="secondary" onClick={close}>Cancel</Button>
      <Button variant="${tone === 'danger' ? 'danger' : 'primary'}" onClick={confirm}>
        ${tone === 'danger' ? 'Delete' : 'Save'}
      </Button>
    </>
  )}
>
  ...
</Dialog>`;

  return (
    <Playground
      code={code}
      note={
        dismissible
          ? 'Esc, the scrim and the close button all dismiss it.'
          : 'Only the footer actions close it - Esc and the scrim are inert.'
      }
      rail={
        <>
          <KnobSegment label="tone" value={tone} onChange={setTone} options={['default', 'danger']} />
          <KnobSwitch label="dismissible" checked={dismissible} onChange={setDismissible} />
        </>
      }
    >
      <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={() => setOpen(true)}>
        {tone === 'danger' ? 'Delete project' : 'Rename project'}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        tone={tone}
        dismissible={dismissible}
        title={tone === 'danger' ? 'Delete project permanently?' : 'Rename this project?'}
        footer={(close) => (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button
              variant={tone === 'danger' ? 'danger' : 'primary'}
              onClick={() => {
                toast.success(tone === 'danger' ? 'Project deleted' : 'Project renamed');
                close();
              }}
            >
              {tone === 'danger' ? 'Delete' : 'Save'}
            </Button>
          </div>
        )}
      >
        {tone === 'danger'
          ? 'This action cannot be undone. All queued posts and analytics history will be removed.'
          : 'The new name is applied everywhere immediately, including shared links.'}
      </Dialog>
    </Playground>
  );
}

export function PopoverPlayground() {
  const [side, setSide] = useState<PopoverSide>('bottom');
  const [align, setAlign] = useState<PopoverAlign>('start');
  const [arrow, setArrow] = useState(false);
  const [open, setOpen] = useState(false);

  const code = `<Popover
  trigger={<Button variant="secondary">More actions</Button>}
  side="${side}"
  align="${align}"
  arrow={${arrow}}
>
  <menu>...</menu>
</Popover>`;

  return (
    <Playground
      code={code}
      note="Non-modal and viewport-aware - it flips to the other side when cramped."
      rail={
        <>
          <KnobSegment label="side" value={side} onChange={setSide} options={['top', 'bottom', 'left', 'right']} />
          <KnobSegment label="align" value={align} onChange={setAlign} options={['start', 'center', 'end']} />
          <KnobSwitch label="arrow" checked={arrow} onChange={setArrow} />
        </>
      }
    >
      <div style={{ padding: 'var(--space-9) 0' }}>
        <Popover
          key={`${side}-${align}-${arrow}`}
          trigger={<Button variant="secondary">More actions</Button>}
          side={side}
          align={align}
          arrow={arrow}
          open={open}
          onOpenChange={setOpen}
        >
          <div style={MENU}>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} style={MENU_BTN}>
              Reschedule batch
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} style={MENU_BTN}>
              Duplicate draft
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} style={MENU_BTN}>
              Export CSV
            </Button>
          </div>
        </Popover>
      </div>
    </Playground>
  );
}

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
            {
              id: 'share',
              label: 'Share to',
              items: [
                { id: 'share-x', label: 'Twitter / X' },
                { id: 'share-li', label: 'LinkedIn' },
                { id: 'share-ig', label: 'Instagram' },
              ],
            },
          ],
        },
        { items: [{ id: 'delete', label: 'Delete permanently', danger: true }] },
      ]}
    />
  );
}

export function SheetPlayground() {
  const [side, setSide] = useState<SheetSide>('right');
  const [open, setOpen] = useState(false);

  const code = `<Sheet side="${side}" open={open} onOpenChange={setOpen}>
  <div>Panel content</div>
</Sheet>`;

  return (
    <Playground
      code={code}
      note="Drag the panel toward its edge to dismiss it - the scrim fades with the travel."
      rail={<KnobSegment label="side" value={side} onChange={setSide} options={['right', 'bottom']} />}
    >
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open settings panel
      </Button>
      <Sheet side={side} open={open} onOpenChange={setOpen}>
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
    </Playground>
  );
}

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
        onSelect={(shortcode) => {
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
