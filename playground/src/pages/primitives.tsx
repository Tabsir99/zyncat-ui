import { useState } from 'react';
import { Button, Glass, Collapse, Badge, StatusBadge, CountBadge, type PostStatus } from 'premium-ui';
import { Demo } from '../kit';
import { Icon } from '../icon';

export function ButtonPage() {
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
      <Demo label="icon · loading · disabled">
        <Button iconLeft={<Icon name="plus" size="sm" />}>New project</Button>
        <Button variant="secondary" iconRight={<Icon name="more" size="sm" />}>
          More
        </Button>
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
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

export function GlassPage() {
  return (
    <Demo label="interactive · strong" fill>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          padding: 'var(--space-7)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 20% 25%, #a78bfa, transparent 48%), radial-gradient(circle at 80% 20%, #2dd4bf, transparent 44%), radial-gradient(circle at 65% 85%, #fb7185, transparent 48%), linear-gradient(125deg, #6366f1, #8b5cf6 50%, #14b8a6)',
        }}
      >
        <Glass interactive style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
          Interactive
        </Glass>
        <Glass strong style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
          Strong blur
        </Glass>
      </div>
    </Demo>
  );
}

export function CollapsePage() {
  const [open, setOpen] = useState(true);
  return (
    <Demo label="toggle">
      <div className="stack">
        <Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Open'}
        </Button>
        <Collapse open={open}>
          <div style={{ padding: '12px 0', maxWidth: 360, color: 'var(--text-muted)' }}>
            This region eases open and closed without an abrupt layout shift — the
            decelerate-and-settle curve, never a teleport.
          </div>
        </Collapse>
      </div>
    </Demo>
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
      <Demo label="dot · live · outline · pill">
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
    <Demo label="static · roll">
      <CountBadge value="7 / 10" />
      <CountBadge value={count} roll tone="info" />
      <Button size="sm" variant="secondary" onClick={() => setCount((c) => c + 1)}>
        +1
      </Button>
    </Demo>
  );
}
