'use client';

import { useState } from 'react';

import { Avatar } from '@zyncat/ui/avatar';
import { AvatarGroup } from '@zyncat/ui/avatar-group';
import { Badge } from '@zyncat/ui/badge';
import { Pagination } from '@zyncat/ui/pagination';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { Tag, TagGroup } from '@zyncat/ui/tag';
import { ToggleTag } from '@zyncat/ui/toggle-tag';

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
    <TagGroup ariaLabel="Labels">
      {labels.map((l) => (
        <Tag key={l.id} icon={l.icon} onRemove={() => setLabels((arr) => arr.filter((x) => x.id !== l.id))}>
          {l.name}
        </Tag>
      ))}
    </TagGroup>
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
        <ToggleTag key={f} selected={selected.includes(f)} onChange={() => toggle(f)}>
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
  { key: 'title', label: 'Post Title', render: (r: PostRow) => <strong>{r.title}</strong>, sortable: true },
  { key: 'channel', label: 'Channel', render: (r: PostRow) => r.channel },
  {
    key: 'status',
    label: 'Status',
    render: (r: PostRow) => (
      <Badge tone={r.status === 'Published' ? 'success' : r.status === 'Scheduled' ? 'info' : 'warning'}>
        {r.status}
      </Badge>
    ),
  },
  {
    key: 'engagement',
    label: 'Impressions',
    render: (r: PostRow) => (r.engagement ? r.engagement.toLocaleString() : '—'),
    align: 'end',
    sortable: true,
  },
];

export function TableHero() {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table rows={ROWS} columns={COLUMNS} rowKey="id" selectable />
    </div>
  );
}

/* ==========================================================================
   Pagination
   ========================================================================== */
export function PaginationHero() {
  const [offset, setOffset] = useState(0);
  const pageSize = 10;
  const total = 94;
  return (
    <Pagination
      range={[offset + 1, Math.min(offset + pageSize, total)]}
      total={total}
      hasPrev={offset > 0}
      hasNext={offset + pageSize < total}
      onPrev={() => setOffset((o) => Math.max(0, o - pageSize))}
      onNext={() => setOffset((o) => o + pageSize)}
    />
  );
}
