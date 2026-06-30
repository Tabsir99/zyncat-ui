import type { ComponentDoc } from './types';

export const primitives: Record<string, ComponentDoc> = {
  button: {
    example: `import { Button } from 'premium-ds';

<Button variant="primary" onClick={schedulePost}>Schedule post</Button>`,
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'link'",
        default: "'primary'",
        description: 'Visual weight and intent.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Control height: sm 28px, md 36px, lg 40px.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Swaps content for a spinner and makes the button inert.',
      },
      {
        name: 'iconLeft',
        type: 'ReactNode',
        description: 'Leading icon node, sized and aligned by the component.',
      },
      { name: 'iconRight', type: 'ReactNode', description: 'Trailing icon node.' },
      {
        name: 'fullWidth',
        type: 'boolean',
        default: 'false',
        description: 'Stretch to fill the container width.',
      },
      {
        name: '...rest',
        type: 'ButtonHTMLAttributes',
        description: 'All native button attributes, including onClick, type, and disabled.',
      },
    ],
  },

  icon: {
    example: `import { Button } from 'premium-ds';
// bring your own icon library

<Button iconLeft={<PaperPlaneTilt />}>Publish</Button>`,
    props: [],
  },

  collapse: {
    example: `import { Collapse } from 'premium-ds';

<Collapse open={showRules}>
  <div>Additional scheduling rules for this batch.</div>
</Collapse>`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        default: 'false',
        description: 'Controls whether the content region is expanded.',
      },
      {
        name: 'axis',
        type: "'height' | 'width'",
        default: "'height'",
        description: 'Dimension to animate when opening and closing.',
      },
      {
        name: 'fade',
        type: 'boolean',
        default: 'false',
        description: 'Cross-fades the contents while the region resizes.',
      },
      {
        name: 'innerClassName',
        type: 'string',
        description: 'Class applied to the inner measured wrapper element.',
      },
      { name: '...rest', type: 'HTMLAttributes', description: 'All native div attributes.' },
    ],
  },

  badge: {
    example: `import { Badge } from 'premium-ds';

<Badge tone="success" pill>Published</Badge>
<Badge tone="warning" dot>Review pending</Badge>`,
    props: [
      {
        name: 'tone',
        type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
        default: "'neutral'",
        description: 'Status hue applied to the badge surface and dot.',
      },
      {
        name: 'variant',
        type: "'glass' | 'outline'",
        default: "'glass'",
        description: 'Surface style: glass has a translucent fill, outline is flat.',
      },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Badge size.' },
      {
        name: 'dot',
        type: 'boolean',
        default: 'false',
        description: 'Renders a leading status dot.',
      },
      {
        name: 'live',
        type: 'boolean',
        default: 'false',
        description: 'Pulsing dot for in-progress status, implies dot.',
      },
      {
        name: 'pill',
        type: 'boolean',
        default: 'false',
        description: 'Applies fully-rounded corners.',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        description: 'Optional leading icon node, overrides dot when both are set.',
      },
      { name: '...rest', type: 'HTMLAttributes', description: 'All native span attributes.' },
    ],
  },

  'status-badge': {
    example: `import { StatusBadge } from 'premium-ds';

<StatusBadge status="scheduled" />
<StatusBadge status={currentStatus} morph />`,
    props: [
      {
        name: 'status',
        type: "'draft' | 'scheduled' | 'processing' | 'published' | 'failed'",
        required: true,
        description: 'Post status; determines the tone, label, and live dot automatically.',
      },
      {
        name: 'morph',
        type: 'boolean',
        default: 'false',
        description: 'Animates the label and tone in place as status changes instead of swapping.',
      },
      {
        name: 'variant',
        type: "'glass' | 'outline'",
        default: "'glass'",
        description: 'Inherited from Badge: surface style.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Inherited from Badge: badge size.',
      },
      {
        name: 'dot',
        type: 'boolean',
        description: 'Inherited from Badge: overrides the status-driven dot when set explicitly.',
      },
      {
        name: 'live',
        type: 'boolean',
        description: 'Inherited from Badge: overrides the status-driven pulse when set explicitly.',
      },
      {
        name: 'pill',
        type: 'boolean',
        default: 'false',
        description: 'Inherited from Badge: applies fully-rounded corners.',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        description: 'Inherited from Badge: optional leading icon node.',
      },
      { name: '...rest', type: 'HTMLAttributes', description: 'All native span attributes.' },
    ],
  },

  'count-badge': {
    example: `import { CountBadge } from 'premium-ds';

<CountBadge value="7 / 10" />
<CountBadge value={queued} roll tone="info" />`,
    props: [
      {
        name: 'value',
        type: 'string | number',
        required: true,
        description: 'The count or label to display, rendered mono-tabular.',
      },
      {
        name: 'roll',
        type: 'boolean',
        default: 'false',
        description: 'Animates each digit change with a vertical odometer roll.',
      },
      {
        name: 'tone',
        type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
        default: "'neutral'",
        description: 'Inherited from Badge: status hue.',
      },
      {
        name: 'variant',
        type: "'glass' | 'outline'",
        default: "'glass'",
        description: 'Inherited from Badge: surface style.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Inherited from Badge: badge size.',
      },
      {
        name: 'dot',
        type: 'boolean',
        default: 'false',
        description: 'Inherited from Badge: leading status dot.',
      },
      {
        name: 'live',
        type: 'boolean',
        default: 'false',
        description: 'Inherited from Badge: pulsing dot for in-progress status.',
      },
      {
        name: 'pill',
        type: 'boolean',
        default: 'false',
        description: 'Inherited from Badge: applies fully-rounded corners.',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        description: 'Inherited from Badge: optional leading icon node.',
      },
      { name: '...rest', type: 'HTMLAttributes', description: 'All native span attributes.' },
    ],
  },
};
