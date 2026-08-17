import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Alert } from '@zyncat/ui/alert';
import { Tooltip } from '@zyncat/ui/tooltip';
import { Dialog } from '@zyncat/ui/dialog';
import { Popover, type VirtualAnchor } from '@zyncat/ui/popover';
import { Dropdown, type DropdownGroup } from '@zyncat/ui/dropdown';
import { Sheet } from '@zyncat/ui/sheet';
import { Button } from '@zyncat/ui/button';
import { TextField } from '@zyncat/ui/text-field';
import { toast } from '@zyncat/ui/toast';
import {
  EmojiPickerPanel,
  type EmojiPickerHandle,
} from '../../../src/components/composites/emoji-picker/react/EmojiPickerPanel';
import { caretAnchor } from '../caret-anchor';
import { loadEmojiData } from '../../../src/components/composites/emoji-picker/data';
import { getEmojiUrl } from '../../../src/components/composites/emoji-picker/getEmojiUrl';
import { Demo } from '../kit';
import { Icon } from '../icon';

const EMOJI_DATA_URL = '/emojis.json';

function useEmojiData() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    loadEmojiData(EMOJI_DATA_URL)
      .then(() => live && setReady(true))
      .catch(() => live && toast.error('Could not load the emoji dataset'));
    return () => {
      live = false;
    };
  }, []);
  return ready;
}

function Picked({ shortcode, hexId }: { shortcode: string; hexId: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        font: 'var(--type-body)',
        color: 'var(--text-muted)',
      }}
    >
      <img src={getEmojiUrl(hexId, 'inline')} alt="" width={20} height={20} />
      <code>:{shortcode}:</code>
    </span>
  );
}

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
        <Button variant="secondary" onClick={() => toast.error('Upload failed', { description: 'File too large' })}>
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
          <Button variant="secondary">
            <Icon name="info" size="sm" />
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

export function PopoverPage() {
  const [open, setOpen] = useState(false);
  return (
    <Demo label="popover menu">
      <Popover
        side="bottom"
        align="start"
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button variant="secondary">
            Actions
            <Icon name="caret-down" size="sm" />
          </Button>
        }
      >
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
              style={{ justifyContent: 'flex-start', width: '100%' }}
              onClick={() => {
                setOpen(false);
                toast(it.msg);
              }}
            >
              <Icon name={it.icon} size="sm" />
              {it.label}
            </Button>
          ))}
        </div>
      </Popover>
    </Demo>
  );
}

const POST_ACTIONS: DropdownGroup[] = [
  {
    label: 'Edit',
    items: [
      { id: 'rename', label: 'Rename', icon: <Icon name="pencil-simple" size="sm" />, shortcut: 'R' },
      { id: 'duplicate', label: 'Duplicate', icon: <Icon name="copy" size="sm" />, shortcut: 'D' },
      {
        id: 'move',
        label: 'Move to',
        icon: <Icon name="archive" size="sm" />,
        items: [
          { id: 'drafts', label: 'Drafts', description: 'Not visible to anyone' },
          { id: 'scheduled', label: 'Scheduled' },
          {
            id: 'campaigns',
            label: 'Campaigns',
            items: [
              { id: 'launch', label: 'Product launch' },
              { id: 'newsletter', label: 'Newsletter' },
              {
                id: 'seasonal',
                label: 'Seasonal',
                items: [
                  { id: 'spring', label: 'Spring' },
                  { id: 'summer', label: 'Summer' },
                  { id: 'winter', label: 'Winter' },
                ],
              },
              { id: 'archived-campaigns', label: 'Archived', disabled: true },
            ],
          },
          {
            id: 'workspaces',
            label: 'Another workspace',
            items: [
              { id: 'ws-design', label: 'Design' },
              { id: 'ws-growth', label: 'Growth' },
              {
                id: 'ws-eng',
                label: 'Engineering',
                items: [
                  { id: 'ws-eng-web', label: 'Web' },
                  { id: 'ws-eng-mobile', label: 'Mobile' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Share',
    items: [
      { id: 'link', label: 'Copy link', icon: <Icon name="hash" size="sm" />, shortcut: 'L' },
      { id: 'members', label: 'Invite people', icon: <Icon name="users" size="sm" /> },
      {
        id: 'export',
        label: 'Export as',
        icon: <Icon name="cloud" size="sm" />,
        items: [
          { id: 'export-pdf', label: 'PDF' },
          { id: 'export-md', label: 'Markdown' },
          { id: 'export-html', label: 'HTML' },
        ],
      },
    ],
  },
  { items: [{ id: 'delete', label: 'Delete post', icon: <Icon name="trash" size="sm" />, danger: true }] },
];

export function DropdownPage() {
  return (
    <>
      <Demo label="menu button - groups, shortcuts, nested submenus">
        <Dropdown
          items={POST_ACTIONS}
          ariaLabel="Post actions"
          onSelect={(id) => toast('Ran ' + id)}
          trigger={
            <Button variant="secondary">
              Actions
              <Icon name="caret-down" size="sm" />
            </Button>
          }
        />
      </Demo>
      <Demo label="align end, flips above when cramped">
        <Dropdown
          items={POST_ACTIONS}
          align="end"
          ariaLabel="Post actions"
          onSelect={(id) => toast('Ran ' + id)}
          trigger={
            <Button variant="ghost" size="icon" aria-label="More actions">
              <Icon name="more" size="sm" />
            </Button>
          }
        />
      </Demo>
      <Demo label="flat items, no groups">
        <Dropdown
          items={[
            { id: 'profile', label: 'Profile', icon: <Icon name="user" size="sm" /> },
            { id: 'settings', label: 'Settings', icon: <Icon name="gear" size="sm" />, shortcut: 'S' },
            { id: 'sign-out', label: 'Sign out', icon: <Icon name="lock" size="sm" />, danger: true },
          ]}
          ariaLabel="Account"
          onSelect={(id) => toast('Ran ' + id)}
          trigger={<Button variant="ghost">Account</Button>}
        />
      </Demo>
    </>
  );
}

export function SheetPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  return (
    <>
      <Demo label="right - drag-to-dismiss">
        <Sheet
          side="right"
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          trigger={<Button variant="secondary">Open panel</Button>}
        >
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
              <h2 style={{ font: 'var(--type-heading)', color: 'var(--text-strong)', margin: 0 }}>Filters</h2>
              <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', margin: 0 }}>
                Drag toward the edge, press Esc, or tap the scrim to dismiss.
              </p>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button variant="secondary" onClick={() => setFiltersOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setFiltersOpen(false);
                  toast.success('Filters applied');
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </Sheet>
      </Demo>
      <Demo label="bottom">
        <Sheet
          side="bottom"
          open={quickOpen}
          onOpenChange={setQuickOpen}
          trigger={<Button variant="secondary">Open bottom sheet</Button>}
        >
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
            <h2 style={{ font: 'var(--type-heading)', color: 'var(--text-strong)', margin: 0 }}>Quick actions</h2>
            <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', margin: 0 }}>
              The bottom sheet spans the full width and drags down to dismiss.
            </p>
            <Button onClick={() => setQuickOpen(false)} style={{ alignSelf: 'flex-start' }}>
              Done
            </Button>
          </div>
        </Sheet>
      </Demo>
    </>
  );
}

const EMOJI_TRIGGER = /(?:^|\s):([a-z0-9_+-]*)$/;

interface EmojiCompletion {
  query: string;
  start: number;
  end: number;
}

function readCompletion(input: HTMLInputElement): EmojiCompletion | null {
  const end = input.selectionStart;
  if (end === null || end !== input.selectionEnd) return null;
  const match = EMOJI_TRIGGER.exec(input.value.slice(0, end));
  return match ? { query: match[1], start: end - match[1].length - 1, end } : null;
}

function InlineEmojiField({ onPick }: { onPick: (shortcode: string, hexId: string) => void }) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<EmojiPickerHandle>(null);
  const pendingCaret = useRef<number | null>(null);
  const [value, setValue] = useState('');
  const [completion, setCompletion] = useState<EmojiCompletion | null>(null);
  const [anchor, setAnchor] = useState<VirtualAnchor | null>(null);

  useLayoutEffect(() => {
    const at = pendingCaret.current;
    const input = fieldRef.current?.querySelector('input');
    if (at === null || !input) return;
    pendingCaret.current = null;
    input.focus();
    input.setSelectionRange(at, at);
  }, [value]);

  const sync = (input: HTMLInputElement) => {
    const next = readCompletion(input);
    setCompletion(next);
    setAnchor(next && caretAnchor(input, next.end));
  };

  const insert = (shortcode: string, hexId: string) => {
    if (!completion) return;
    const text = `:${shortcode}: `;
    setValue(value.slice(0, completion.start) + text + value.slice(completion.end));
    pendingCaret.current = completion.start + text.length;
    setCompletion(null);
    onPick(shortcode, hexId);
  };

  return (
    <div className="stack" style={{ gap: 'var(--space-3)', width: '100%', maxWidth: 420 }}>
      <div ref={fieldRef}>
        <TextField
          label="Message"
          placeholder="Say something, then : to complete an emoji"
          value={value}
          onChange={(e) => {
            setValue(e.currentTarget.value);
            sync(e.currentTarget);
          }}
          onKeyDown={(e) => {
            if (!completion) return;
            if (e.key.startsWith('Arrow') || e.key === 'Enter') panelRef.current?.handleKey(e.nativeEvent);
          }}
          htmlProps={{ onSelect: (e) => sync(e.currentTarget), autoComplete: 'off', spellCheck: false }}
        />
      </div>
      <EmojiPickerPanel
        ref={panelRef}
        open={completion !== null}
        onOpenChange={(next) => {
          if (!next) setCompletion(null);
        }}
        onSelect={insert}
        getEmojiUrl={getEmojiUrl}
        query={completion?.query ?? ''}
        offset={6}
        popoverProps={{ anchor, side: 'bottom', align: 'start' }}
      />
    </div>
  );
}

export function EmojiPickerPage() {
  const ready = useEmojiData();
  const [ownSearchOpen, setOwnSearchOpen] = useState(false);
  const [arrowOpen, setArrowOpen] = useState(false);
  const [picked, setPicked] = useState<{ shortcode: string; hexId: string } | null>(null);

  if (!ready) {
    return (
      <Demo label="loading the dataset">
        <Button variant="secondary" disabled>
          Loading emoji…
        </Button>
      </Demo>
    );
  }

  const select = (shortcode: string, hexId: string) => {
    setPicked({ shortcode, hexId });
    toast(`Picked :${shortcode}:`);
  };

  return (
    <>
      <Demo label="popover - the panel owns its search">
        <EmojiPickerPanel
          open={ownSearchOpen}
          onOpenChange={setOwnSearchOpen}
          onSelect={(shortcode, hexId) => {
            select(shortcode, hexId);
            setOwnSearchOpen(false);
          }}
          getEmojiUrl={getEmojiUrl}
          search
          offset={6}
          popoverProps={{ side: 'bottom', align: 'start' }}
          trigger={
            <Button variant="secondary">
              Add reaction
              <Icon name="caret-down" size="sm" />
            </Button>
          }
        />
        {picked ? <Picked shortcode={picked.shortcode} hexId={picked.hexId} /> : null}
      </Demo>

      <Demo label="typed ':' completion - query driven from outside, anchored to the caret" fill>
        <InlineEmojiField onPick={select} />
      </Demo>

      <Demo label="arrow, anchored right">
        <EmojiPickerPanel
          open={arrowOpen}
          onOpenChange={setArrowOpen}
          onSelect={select}
          getEmojiUrl={getEmojiUrl}
          search
          offset={4}
          popoverProps={{ side: 'right', align: 'center', arrow: true }}
          trigger={<Button variant="secondary">Pick an icon</Button>}
        />
      </Demo>
    </>
  );
}
