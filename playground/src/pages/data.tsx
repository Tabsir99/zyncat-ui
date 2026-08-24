import { useState } from 'react';
import { Avatar } from '@zyncat/ui/avatar';
import { AvatarGroup } from '@zyncat/ui/avatar-group';
import { Tag } from '@zyncat/ui/tag';
import { ToggleTag } from '@zyncat/ui/toggle-tag';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { Pagination } from '@zyncat/ui/pagination';
import { Badge } from '@zyncat/ui/badge';
import { Icon } from '../icon';

/* ==========================================================================
   Avatar
   ========================================================================== */
export function AvatarHero() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar src="https://i.pravatar.cc/96?img=47" name="Ana Ng" status="online" size="lg" />
      <Avatar name="Bo Park" paletteIndex={5} status="busy" size="lg" />
      <Avatar name="Dee Okafor" paletteIndex={2} size="lg" />
    </div>
  );
}

export function AvatarSizesDemo() {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
      <Avatar name="Ana Ng" size="xs" />
      <Avatar name="Ana Ng" size="sm" />
      <Avatar name="Ana Ng" size="md" />
      <Avatar name="Ana Ng" size="lg" />
      <Avatar name="Ana Ng" size="xl" />
    </div>
  );
}

export function AvatarStatusDemo() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="Bo Park" status="online" />
      <Avatar name="Cira Diaz" status="away" />
      <Avatar name="Dee Okafor" status="busy" />
      <Avatar name="Eli Stone" status="offline" />
    </div>
  );
}

export function AvatarGroupDemo() {
  return (
    <AvatarGroup max={4} size="md">
      <Avatar name="Ana Ng" src="https://i.pravatar.cc/96?img=47" />
      <Avatar name="Bo Park" />
      <Avatar name="Cira Diaz" />
      <Avatar name="Dee Okafor" />
      <Avatar name="Eli Stone" />
      <Avatar name="Fang Wu" />
    </AvatarGroup>
  );
}

/* ==========================================================================
   Tag
   ========================================================================== */
const INITIAL_LABELS = [
  { id: 'a', name: 'design', icon: <Icon name="hash" /> },
  { id: 'b', name: 'frontend', icon: <Icon name="hash" /> },
  { id: 'c', name: 'urgent', icon: <Icon name="hash" /> },
];

export function TagHero() {
  const [labels, setLabels] = useState(INITIAL_LABELS);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      {labels.map((l) => (
        <Tag key={l.id} icon={l.icon} onRemove={() => setLabels((arr) => arr.filter((x) => x.id !== l.id))}>
          {l.name}
        </Tag>
      ))}
    </div>
  );
}

export function TagToggleGroupDemo() {
  const [selected, setSelected] = useState<string[]>(['Open', 'Merged']);
  const filters = ['Open', 'In review', 'Merged', 'Closed'];

  const toggle = (f: string) => {
    setSelected((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      {filters.map((f) => (
        <ToggleTag key={f} checked={selected.includes(f)} onChange={() => toggle(f)}>
          {f}
        </ToggleTag>
      ))}
    </div>
  );
}

/* ==========================================================================
   Table
   ========================================================================== */
interface PostRow {
  id: string;
  title: string;
  channel: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  engagement: number;
}

const ROWS: PostRow[] = [
  { id: '1', title: 'React 19 Release Highlights', channel: 'Twitter', status: 'Published', engagement: 4230 },
  { id: '2', title: 'Design Tokens Architecture', channel: 'LinkedIn', status: 'Published', engagement: 1890 },
  { id: '3', title: 'WAAPI Motion Deep Dive', channel: 'Twitter', status: 'Scheduled', engagement: 0 },
  { id: '4', title: 'Q3 Product Roadmap Preview', channel: 'Newsletter', status: 'Draft', engagement: 0 },
];

const COLUMNS: TableColumn<PostRow>[] = [
  { id: 'title', header: 'Post Title', cell: (r) => <strong>{r.title}</strong>, sortable: true },
  { id: 'channel', header: 'Channel', cell: (r) => r.channel },
  {
    id: 'status',
    header: 'Status',
    cell: (r) => (
      <Badge tone={r.status === 'Published' ? 'success' : r.status === 'Scheduled' ? 'info' : 'warning'}>
        {r.status}
      </Badge>
    ),
  },
  {
    id: 'engagement',
    header: 'Impressions',
    cell: (r) => (r.engagement ? r.engagement.toLocaleString() : '—'),
    align: 'right',
    sortable: true,
  },
];

export function TableHero() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['1']);
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table
        data={ROWS}
        columns={COLUMNS}
        keyField="id"
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
}

/* ==========================================================================
   Pagination
   ========================================================================== */
export function PaginationHero() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageSize={10} totalCount={94} onPageChange={setPage} />;
}
