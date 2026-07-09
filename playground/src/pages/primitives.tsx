import { useState } from 'react';
import { Button } from 'premium-ds/button';
import { Collapse } from 'premium-ds/collapse';
import { TextField } from 'premium-ds/text-field';
import { Badge } from 'premium-ds/badge';
import { StatusBadge, type PostStatus } from 'premium-ds/status-badge';
import { CountBadge } from 'premium-ds/count-badge';
import { Demo } from '../kit';
import { Icon } from '../icon';

export function ButtonPage() {
  const [l, setL] = useState(false);
  return (
    <>
      <Demo label="variants">
        <Button variant="primary">Save changes</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="ghost">Dismiss</Button>
        <Button variant="danger">Delete</Button>
        <Button variant="link">Learn more</Button>
      </Demo>
      <Demo label="sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Demo>
      <Demo label="icon - loading - disabled">
        <Button iconLeft={<Icon name="plus" size="sm" />}>New project</Button>
        <Button variant="secondary" iconRight={<Icon name="more" size="sm" />}>
          More
        </Button>
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
        <Button
          loading={l}
          onClick={() => {
            setL(true);
            setTimeout(() => {
              setL(false);
            }, 2000);
          }}
        >
          {' '}
          {l ? 'Loading' : 'Load'}{' '}
        </Button>
      </Demo>
    </>
  );
}

export function IconPage() {
  return (
    <>
      <Demo label="glyphs">
        <Icon name="gear" />
        <Icon name="bell" />
        <Icon name="user" />
        <Icon name="cloud" />
        <Icon name="lock" />
        <Icon name="globe" />
      </Demo>
      <Demo label="sizes">
        <Icon name="star" size="sm" />
        <Icon name="star" size="md" />
        <Icon name="star" size="lg" />
      </Demo>
      <Demo label="weights (fill = active)">
        <Icon name="heart" />
        <Icon name="heart" weight="fill" />
      </Demo>
    </>
  );
}

export function CollapsePage() {
  const [open, setOpen] = useState(true);
  const [asym, setAsym] = useState(true);
  const [form, setForm] = useState(false);
  return (
    <>
      <Demo label="toggle">
        <div className="stack">
          <Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Open'}
          </Button>
          <Collapse open={open}>
            <div style={{ padding: '12px 0', maxWidth: 360, color: 'var(--text-muted)' }}>
              This region eases open and closed without an abrupt layout shift - the decelerate-and-settle curve, never
              a teleport.
            </div>
          </Collapse>
        </div>
      </Demo>
      <Demo label="asymmetric timing - tokens only">
        <div className="stack">
          <Button variant="secondary" size="sm" onClick={() => setAsym((o) => !o)}>
            {asym ? 'Close' : 'Open'}
          </Button>
          <Collapse open={asym} fade duration={{ open: 'slow', close: 'fast' }} ease={{ close: 'exit' }}>
            <div style={{ padding: '12px 0', maxWidth: 360, color: 'var(--text-muted)' }}>
              Opens deliberately on the entrance curve, leaves in a hurry on the exit curve - duration and ease accept
              motion tokens only, single or per-direction.
            </div>
          </Collapse>
        </div>
      </Demo>
      <Demo label="closed content leaves the tab order">
        <div className="stack">
          <Button variant="secondary" size="sm" onClick={() => setForm((o) => !o)}>
            {form ? 'Hide form' : 'Show form'}
          </Button>
          <Collapse open={form}>
            {/* 4px side padding keeps the 3px focus rings clear of the collapse clip edge */}
            <div className="stack" style={{ padding: '12px 4px', maxWidth: 360 }}>
              <TextField id="collapse-demo-name" label="Name" placeholder="Tab reaches me only while open" />
              <Button size="sm">And me</Button>
            </div>
          </Collapse>
          <Button variant="secondary" size="sm">
            Tab lands here while closed
          </Button>
        </div>
      </Demo>
    </>
  );
}

export function BadgePage() {
  return (
    <>
      <Demo label="tones">
        <Badge>Neutral</Badge>
        <Badge tone="info">Info</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
      </Demo>
      <Demo label="dot - live - outline - pill">
        <Badge dot tone="info">
          Dot
        </Badge>
        <Badge live tone="warning">
          Live
        </Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge pill tone="success">
          Pill
        </Badge>
      </Demo>
    </>
  );
}

const STATUSES: PostStatus[] = ['draft', 'scheduled', 'processing', 'published', 'failed'];

export function StatusBadgePage() {
  const [si, setSi] = useState(0);
  return (
    <>
      <Demo label="static">
        {STATUSES.map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </Demo>
      <Demo label="morph in place">
        <Button size="sm" variant="secondary" onClick={() => setSi((i) => (i + 1) % STATUSES.length)}>
          Advance
        </Button>
        <StatusBadge status={STATUSES[si]} morph />
      </Demo>
    </>
  );
}

export function CountBadgePage() {
  const [count, setCount] = useState(7);
  return (
    <Demo label="static - roll">
      <CountBadge value="7 / 10" />
      <CountBadge value={count} roll tone="info" />
      <Button size="sm" variant="secondary" onClick={() => setCount((c) => c + 1)}>
        +1
      </Button>
    </Demo>
  );
}
