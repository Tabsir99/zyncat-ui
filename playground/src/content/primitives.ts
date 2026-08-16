import type { ComponentDoc } from './types';

export const primitives: Record<string, ComponentDoc> = {
  button: {
    example: `import { Button } from '@zyncat/ui/button';

<Button variant="primary" onClick={schedulePost}>Schedule post</Button>`,
  },

  icon: {
    example: `import { Button } from '@zyncat/ui/button';
// bring your own icon library - compose it straight into children

<Button><PaperPlaneTilt />Publish</Button>
<Button size="icon" aria-label="Publish"><PaperPlaneTilt /></Button>`,
  },

  collapse: {
    example: `import { Collapse } from '@zyncat/ui/collapse';

<Collapse open={showRules}>
  <div>Additional scheduling rules for this batch.</div>
</Collapse>`,
  },

  badge: {
    example: `import { Badge } from '@zyncat/ui/badge';

<Badge tone="success" pill>Published</Badge>
<Badge tone="warning" dot>Review pending</Badge>`,
  },

  'status-badge': {
    example: `import { StatusBadge } from '@zyncat/ui/status-badge';

<StatusBadge status="scheduled" />
<StatusBadge status={currentStatus} morph />`,
  },

  'count-badge': {
    example: `import { CountBadge } from '@zyncat/ui/count-badge';

<CountBadge value="7 / 10" />
<CountBadge value={queued} roll tone="info" />`,
  },
};
