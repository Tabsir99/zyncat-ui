'use client';

import { useState } from 'react';

import { Badge, type BadgeProps, type BadgeTone } from '@zyncat/ui/badge';
import { Button, type ButtonProps } from '@zyncat/ui/button';
import { Collapse, type CollapseProps } from '@zyncat/ui/collapse';
import { CountBadge } from '@zyncat/ui/count-badge';
import { StatusBadge, type PostStatus } from '@zyncat/ui/status-badge';
import { TextField } from '@zyncat/ui/text-field';

import { Icon, type IconProps } from '../icon';
import { KnobSegment, Playground } from '../playground';

type ButtonVariant = NonNullable<ButtonProps['variant']>;
type ButtonSize = NonNullable<ButtonProps['size']>;
type IconSize = NonNullable<IconProps['size']>;
type IconWeight = NonNullable<IconProps['weight']>;
type CollapseAxis = NonNullable<CollapseProps['axis']>;
type BadgeVariant = NonNullable<BadgeProps['variant']>;
type BadgeSize = NonNullable<BadgeProps['size']>;

const BUTTON_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger', 'link', 'unstyled'];
const BUTTON_SIZES: readonly ButtonSize[] = ['sm', 'md', 'lg', 'icon'];
const ICON_SIZES: readonly IconSize[] = ['sm', 'md', 'lg'];
const ICON_WEIGHTS: readonly IconWeight[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];
const BADGE_TONES: readonly BadgeTone[] = ['neutral', 'info', 'success', 'warning', 'danger'];
const BADGE_VARIANTS: readonly BadgeVariant[] = ['glass', 'outline'];
const BADGE_SIZES: readonly BadgeSize[] = ['sm', 'md'];

/* ==========================================================================
   Button
   ========================================================================== */
export function ButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('md');

  const code =
    size === 'icon'
      ? `<Button variant="${variant}" size="icon" aria-label="Schedule post">\n  <PlusIcon />\n</Button>`
      : `<Button variant="${variant}" size="${size}">Schedule post</Button>`;

  return (
    <Playground
      code={code}
      note="unstyled emits base chrome only - sizing, focus ring, layout - so a local className can re-skin it."
      rail={
        <>
          <KnobSegment label="variant" value={variant} onChange={setVariant} options={BUTTON_VARIANTS} />
          <KnobSegment label="size" value={size} onChange={setSize} options={BUTTON_SIZES} />
        </>
      }
    >
      <Button variant={variant} size={size} aria-label={size === 'icon' ? 'Schedule post' : undefined}>
        {size === 'icon' ? <Icon name="plus" size="sm" /> : 'Schedule post'}
      </Button>
    </Playground>
  );
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
        <span className="btn__icon">
          <Icon name="plus" size="sm" />
        </span>
        New project
      </Button>
      <Button variant="secondary">
        More
        <span className="btn__icon">
          <Icon name="more" size="sm" />
        </span>
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
export function IconPlayground() {
  const [size, setSize] = useState<IconSize>('lg');
  const [weight, setWeight] = useState<IconWeight>('regular');

  const code = `<Icon name="heart" size="${size}" weight="${weight}" />`;

  return (
    <Playground
      code={code}
      rail={
        <>
          <KnobSegment label="size" value={size} onChange={setSize} options={ICON_SIZES} />
          <KnobSegment label="weight" value={weight} onChange={setWeight} options={ICON_WEIGHTS} />
        </>
      }
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Icon name="lightning" size={size} weight={weight} />
        <Icon name="star" size={size} weight={weight} />
        <Icon name="heart" size={size} weight={weight} />
      </div>
    </Playground>
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
export function CollapsePlayground() {
  const [axis, setAxis] = useState<CollapseAxis>('height');
  const [open, setOpen] = useState(true);

  const code = `<Collapse open={open} axis="${axis}">
  <div>This region eases open and closed.</div>
</Collapse>`;

  const vertical = axis === 'height';

  return (
    <Playground
      code={code}
      note="The width axis animates the inline size instead, so the region opens sideways out of the trigger."
      rail={<KnobSegment label="axis" value={axis} onChange={setAxis} options={['height', 'width']} />}
    >
      <div
        style={{
          width: '100%',
          maxWidth: vertical ? 360 : '100%',
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
          alignItems: vertical ? 'stretch' : 'center',
          gap: '12px',
        }}
      >
        <Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close region' : 'Open region'}
        </Button>
        <Collapse open={open} axis={axis}>
          <div
            style={{
              padding: vertical ? '8px 0' : '0 4px',
              color: 'var(--text-muted)',
              whiteSpace: vertical ? undefined : 'nowrap',
            }}
          >
            {vertical
              ? 'This region eases open and closed with WAAPI motion on the grid track — never touches height: auto.'
              : 'The same track, animated sideways.'}
          </div>
        </Collapse>
      </div>
    </Playground>
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
export function BadgePlayground() {
  const [tone, setTone] = useState<BadgeTone>('info');
  const [variant, setVariant] = useState<BadgeVariant>('glass');
  const [size, setSize] = useState<BadgeSize>('md');

  const code = `<Badge tone="${tone}" variant="${variant}" size="${size}">New Release</Badge>`;

  return (
    <Playground
      code={code}
      rail={
        <>
          <KnobSegment label="tone" value={tone} onChange={setTone} options={BADGE_TONES} />
          <KnobSegment label="variant" value={variant} onChange={setVariant} options={BADGE_VARIANTS} />
          <KnobSegment label="size" value={size} onChange={setSize} options={BADGE_SIZES} />
        </>
      }
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Badge tone={tone} variant={variant} size={size}>
          New Release
        </Badge>
        <Badge tone={tone} variant={variant} size={size} dot>
          Active
        </Badge>
      </div>
    </Playground>
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

export function StatusBadgePlayground() {
  const [status, setStatus] = useState<PostStatus>('scheduled');
  const [variant, setVariant] = useState<BadgeVariant>('glass');
  const [size, setSize] = useState<BadgeSize>('md');

  const code = `<StatusBadge status="${status}" variant="${variant}" size="${size}" morph />`;

  return (
    <Playground
      code={code}
      note="Switch status with the knob - morph re-letters the chip in place instead of swapping it."
      rail={
        <>
          <KnobSegment label="status" value={status} onChange={setStatus} options={STATUSES} />
          <KnobSegment label="variant" value={variant} onChange={setVariant} options={BADGE_VARIANTS} />
          <KnobSegment label="size" value={size} onChange={setSize} options={BADGE_SIZES} />
        </>
      }
    >
      <StatusBadge status={status} variant={variant} size={size} morph />
    </Playground>
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
export function CountBadgePlayground() {
  const [tone, setTone] = useState<BadgeTone>('info');
  const [variant, setVariant] = useState<BadgeVariant>('glass');
  const [size, setSize] = useState<BadgeSize>('md');
  const [count, setCount] = useState(12);

  const code = `<CountBadge value={count} roll tone="${tone}" variant="${variant}" size="${size}" />`;

  return (
    <Playground
      code={code}
      rail={
        <>
          <KnobSegment label="tone" value={tone} onChange={setTone} options={BADGE_TONES} />
          <KnobSegment label="variant" value={variant} onChange={setVariant} options={BADGE_VARIANTS} />
          <KnobSegment label="size" value={size} onChange={setSize} options={BADGE_SIZES} />
        </>
      }
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <CountBadge value={count} roll tone={tone} variant={variant} size={size} />
        <Button size="sm" variant="secondary" onClick={() => setCount((c) => c + 1)}>
          +1 Count
        </Button>
      </div>
    </Playground>
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
