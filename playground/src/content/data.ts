import type { ComponentDoc } from './types';

export const data: Record<string, ComponentDoc> = {
  avatar: {
    example: `import { Avatar } from 'premium-ds/avatar';
import { AvatarGroup } from 'premium-ds/avatar-group';

// Single avatar with presence dot
<Avatar name="Sara Osei" src="/avatars/sara.jpg" size="md" status="online" />

// Square shape for a channel page
<Avatar name="Acme Brand" shape="square" size="lg" />

// AvatarGroup - overlapping stack with +N overflow (uses the same Avatar children)
<AvatarGroup max={4} size="sm">
  <Avatar name="Sara Osei" />
  <Avatar name="Kwame Asante" status="away" />
  <Avatar name="Lena Brandt" />
  <Avatar name="Omar Diallo" />
  <Avatar name="Hina Sato" />
</AvatarGroup>`,
    props: [
      {
        name: 'src',
        type: 'string | null',
        default: 'null',
        description: 'Image URL; falls back to initials, icon, or silhouette on error or absence.',
      },
      {
        name: 'name',
        type: 'string | null',
        default: 'null',
        description: 'Display name used for initials generation, palette hash, and aria-label.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode | null',
        default: 'null',
        description:
          'Content override rendered in the face slot when no image or initials are available.',
      },
      {
        name: 'shape',
        type: "'circle' | 'square'",
        default: "'circle'",
        description: "Use 'circle' for people and 'square' for channels or brand pages.",
      },
      {
        name: 'size',
        type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
        default: "'md'",
        description: 'Size step; md renders at 32 px.',
      },
      {
        name: 'status',
        type: "'online' | 'away' | 'busy' | 'offline' | null",
        default: 'null',
        description: 'Presence dot shown at the bottom-right; omit to hide it.',
      },
      {
        name: 'paletteIndex',
        type: '1 | 2 | 3 | 4 | 5 | 6 | null',
        default: 'null',
        description:
          'Override the identity palette slot (blue to moss); auto-selected from name hash when null.',
      },
      {
        name: '...rest',
        type: 'HTMLAttributes<HTMLSpanElement>',
        description: 'All native span attributes.',
      },
    ],
  },

  tag: {
    example: `import { Tag, TagGroup } from 'premium-ds/tag';

const [channels, setChannels] = useState(['instagram', 'twitter', 'linkedin']);

<TagGroup label="Active channels">
  {channels.map((ch) => (
    <Tag
      key={ch}
      onRemove={() => setChannels((prev) => prev.filter((c) => c !== ch))}
    >
      {ch}
    </Tag>
  ))}
</TagGroup>

// Dense row with icon slot
<Tag size="sm" onRemove={handleRemove}>
  {/* your icon node */}
  design
</Tag>`,
    props: [
      {
        name: 'children',
        type: 'React.ReactNode',
        required: true,
        description: 'The label text or node rendered inside the tag.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode | null',
        default: 'null',
        description:
          'Icon node rendered before the label, sized and tinted to the tag text automatically.',
      },
      {
        name: 'onRemove',
        type: '(() => void) | null',
        default: 'null',
        description:
          'Callback fired when the remove button is clicked; its presence adds the remove button.',
      },
      {
        name: 'removeLabel',
        type: 'string',
        description:
          'Accessible label for the remove button; defaults to "Remove {label}" for string children.',
      },
      {
        name: 'size',
        type: "'md' | 'sm'",
        default: "'md'",
        description: "Tag height: 'md' is 28 px, 'sm' is 24 px for dense rows.",
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the remove button and recedes the tag visually.',
      },
      {
        name: '...rest',
        type: 'HTMLAttributes<HTMLSpanElement>',
        description: 'All native span attributes (children excluded).',
      },
    ],
  },

  table: {
    example: `import { Table } from 'premium-ds/table';

type Post = { id: number; channel: string; status: string; scheduled: string; reach: number };

const columns = [
  { key: 'channel', label: 'Channel', grow: true, strong: true },
  { key: 'status', label: 'Status' },
  { key: 'scheduled', label: 'Scheduled at', mono: true, sortable: true },
  { key: 'reach', label: 'Est. reach', align: 'end', mono: true, sortable: true },
];

const rows: Post[] = [
  { id: 1, channel: 'Instagram', status: 'Scheduled', scheduled: '2026-07-01 09:00', reach: 4800 },
  { id: 2, channel: 'LinkedIn', status: 'Draft', scheduled: '-', reach: 1200 },
  { id: 3, channel: 'Twitter', status: 'Published', scheduled: '2026-06-28 14:30', reach: 9300 },
];

<Table<Post>
  label="Scheduled posts"
  columns={columns}
  rows={rows}
  selectable
  defaultSort={{ key: 'scheduled', dir: 'asc' }}
  onRowClick={(row) => openPost(row.id)}
/>`,
    props: [
      {
        name: 'columns',
        type: 'TableColumn<Post>[]',
        required: true,
        description:
          'Column definitions; each entry declares key, label, rendering, sort, alignment, and display options.',
      },
      {
        name: 'rows',
        type: 'Post[]',
        required: true,
        description: 'Data rows; each object must contain the property named by rowKey.',
      },
      {
        name: 'rowKey',
        type: 'string',
        default: "'id'",
        description: 'Property name used as the stable unique row identity key.',
      },
      {
        name: 'label',
        type: 'string',
        description: 'aria-label applied to the table element.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        default: 'false',
        description: 'Adds a checkbox column and a bulk-action bar above the table.',
      },
      {
        name: 'onSelectionChange',
        type: '(keys: Array<string | number>) => void',
        description: 'Fired whenever the selection set changes.',
      },
      {
        name: 'bulkActions',
        type: '(keys: Array<string | number>, clear: () => void) => React.ReactNode',
        description:
          'Renders additional controls in the bulk bar between the count and the built-in Clear button.',
      },
      {
        name: 'selectionLabel',
        type: '(row: Post) => string',
        description: 'Returns the aria-label for each row checkbox; defaults to "Select row".',
      },
      {
        name: 'defaultSort',
        type: 'TableSort | null',
        default: 'null',
        description: 'Initial sort state; sorting is uncontrolled after mount.',
      },
      {
        name: 'onSortChange',
        type: '(sort: TableSort) => void',
        description: 'Notification fired after the local sort state updates.',
      },
      {
        name: 'density',
        type: "'cozy' | 'compact'",
        default: "'cozy'",
        description: "Row height: 'cozy' is 46 px, 'compact' is 38 px.",
      },
      {
        name: 'pinFirst',
        type: 'boolean',
        default: 'true',
        description: 'Pins the checkbox column and first data column under horizontal overflow.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Recedes rows and marks the table aria-busy while data is fetching.',
      },
      {
        name: 'empty',
        type: 'React.ReactNode',
        description:
          'Content shown when rows is empty and not loading; defaults to "Nothing to show".',
      },
      {
        name: 'footer',
        type: 'React.ReactNode',
        description: 'Footer strip for pagination, summaries, or row-level controls.',
      },
      {
        name: 'onRowClick',
        type: '(row: Post) => void',
        description: 'Makes rows clickable; the checkbox cell is excluded from the click target.',
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Class applied to the outermost wrapper; size the table here so the internal scroller absorbs the constraint.',
      },
    ],
  },

  pagination: {
    example: `import { Pagination } from 'premium-ds/pagination';

const [cursor, setCursor] = useState({ from: 1, to: 25, hasPrev: false, hasNext: true });

<Pagination
  label="Posts"
  range={[cursor.from, cursor.to]}
  total={312}
  hasPrev={cursor.hasPrev}
  hasNext={cursor.hasNext}
  onPrev={() => loadPage('prev')}
  onNext={() => loadPage('next')}
/>`,
    props: [
      {
        name: 'range',
        type: '[number, number]',
        required: true,
        description: 'Items currently shown, 1-based inclusive: [from, to] (e.g. [26, 50]).',
      },
      {
        name: 'label',
        type: 'string',
        default: "'Pagination'",
        description:
          'Accessible name for the nav landmark; name the list ("Posts"), not "pagination".',
      },
      {
        name: 'total',
        type: 'number | null',
        default: 'null',
        description: 'Total item count; renders "of N" only when provided; omit for endless lists.',
      },
      {
        name: 'hasPrev',
        type: 'boolean',
        default: 'false',
        description: 'Enables the previous arrow when a previous cursor exists.',
      },
      {
        name: 'hasNext',
        type: 'boolean',
        default: 'false',
        description: 'Enables the next arrow when a next cursor exists.',
      },
      {
        name: 'onPrev',
        type: '() => void',
        description: 'Fired when the previous arrow is pressed.',
      },
      {
        name: 'onNext',
        type: '() => void',
        description: 'Fired when the next arrow is pressed.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description:
          'Disables both arrows and shows a spinner on the last-pressed button while a page fetch is in flight.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Class applied to the nav element.',
      },
    ],
  },
};
