import { useState } from 'react';
import { Button } from '@zyncat/ui/button';
import { Collapse } from '@zyncat/ui/collapse';
import { TextField } from '@zyncat/ui/text-field';
import { Badge } from '@zyncat/ui/badge';
import { StatusBadge, type PostStatus } from '@zyncat/ui/status-badge';
import { CountBadge } from '@zyncat/ui/count-badge';
import { Icon } from '../icon';

/* ==========================================================================
   Button
   ========================================================================== */
export function ButtonHero() {
  return <Button variant="primary">Schedule post</Button>;
}

export function ButtonVariantsDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}

export function ButtonSizesDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export function ButtonIconsDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button>
        <Icon name="plus" size="sm" />
        New project
      </Button>
      <Button variant="secondary">
        More
        <Icon name="more" size="sm" />
      </Button>
      <Button size="icon" variant="secondary" aria-label="More options">
        <Icon name="more" size="sm" />
      </Button>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
      <Button
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        {loading ? 'Loading' : 'Click to load'}
      </Button>
    </div>
  );
}

/* ==========================================================================
   Icon
   ========================================================================== */
export function IconHero() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon name="lightning" size="lg" />
      <Icon name="star" size="lg" />
      <Icon name="heart" size="lg" weight="fill" />
    </div>
  );
}

export function IconGlyphsDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
      <Icon name="gear" />
      <Icon name="bell" />
      <Icon name="user" />
      <Icon name="cloud" />
      <Icon name="lock" />
      <Icon name="globe" />
      <Icon name="star" />
      <Icon name="sparkle" />
    </div>
  );
}

export function IconSizesDemo() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon name="star" size="sm" />
      <Icon name="star" size="md" />
      <Icon name="star" size="lg" />
    </div>
  );
}

export function IconWeightsDemo() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon name="heart" />
      <Icon name="heart" weight="fill" />
    </div>
  );
}

/* ==========================================================================
   Collapse
   ========================================================================== */
export function CollapseHero() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
        {open ? 'Close region' : 'Open region'}
      </Button>
      <Collapse open={open}>
        <div style={{ padding: '8px 0', color: 'var(--text-muted)' }}>
          This region eases open and closed with WAAPI motion on the grid track — never touches height: auto.
        </div>
      </Collapse>
    </div>
  );
}

export function CollapseAsymDemo() {
  const [asym, setAsym] = useState(true);
  return (
    <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Button variant="secondary" size="sm" onClick={() => setAsym((o) => !o)}>
        {asym ? 'Close' : 'Open'}
      </Button>
      <Collapse open={asym} fade animation={{ duration: { open: 'slow', close: 'fast' }, ease: { close: 'exit' } }}>
        <div style={{ padding: '8px 0', color: 'var(--text-muted)' }}>
          Opens deliberately on the entrance curve, leaves quickly on the exit curve.
        </div>
      </Collapse>
    </div>
  );
}

export function CollapseTabOrderDemo() {
  const [form, setForm] = useState(false);
  return (
    <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Button variant="secondary" size="sm" onClick={() => setForm((o) => !o)}>
        {form ? 'Hide form' : 'Show form'}
      </Button>
      <Collapse open={form}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px 4px' }}>
          <TextField id="collapse-demo-name" label="Name" placeholder="Tab reaches me only while open" />
          <Button size="sm">Submit</Button>
        </div>
      </Collapse>
      <Button variant="secondary" size="sm">
        Tab lands here when closed
      </Button>
    </div>
  );
}

/* ==========================================================================
   Badge
   ========================================================================== */
export function BadgeHero() {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <Badge tone="info" pill>
        New Release
      </Badge>
      <Badge tone="success" dot>
        Active
      </Badge>
    </div>
  );
}

export function BadgeTonesDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
      <Badge>Neutral</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
    </div>
  );
}

export function BadgeVariantsDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
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
    </div>
  );
}

/* ==========================================================================
   StatusBadge
   ========================================================================== */
const STATUSES: PostStatus[] = ['draft', 'scheduled', 'processing', 'published', 'failed'];

export function StatusBadgeHero() {
  const [si, setSi] = useState(1);
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
      <StatusBadge status={STATUSES[si]} morph />
      <Button size="sm" variant="secondary" onClick={() => setSi((i) => (i + 1) % STATUSES.length)}>
        Advance state
      </Button>
    </div>
  );
}

export function StatusBadgeAllDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      {STATUSES.map((s) => (
        <StatusBadge key={s} status={s} />
      ))}
    </div>
  );
}

/* ==========================================================================
   CountBadge
   ========================================================================== */
export function CountBadgeHero() {
  const [count, setCount] = useState(12);
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
      <CountBadge value={count} roll tone="info" />
      <Button size="sm" variant="secondary" onClick={() => setCount((c) => c + 1)}>
        +1 Count
      </Button>
    </div>
  );
}

export function CountBadgeStaticDemo() {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <CountBadge value="7 / 10" />
      <CountBadge value="99+" tone="warning" />
      <CountBadge value="1,420" tone="success" />
    </div>
  );
}
