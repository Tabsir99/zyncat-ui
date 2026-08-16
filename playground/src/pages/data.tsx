import { useState } from 'react';
import { Avatar } from '@zyncat/ui/avatar';
import { AvatarGroup } from '@zyncat/ui/avatar-group';
import { Tag, TagGroup } from '@zyncat/ui/tag';
import { ToggleTag } from '@zyncat/ui/toggle-tag';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { Pagination } from '@zyncat/ui/pagination';
import { Badge } from '@zyncat/ui/badge';
import { Demo } from '../kit';
import { Icon } from '../icon';

export function AvatarPage() {
  return (
    <>
      <Demo label="sizes">
        <Avatar name="Ana Ng" size="xs" />
        <Avatar name="Ana Ng" size="sm" />
        <Avatar name="Ana Ng" size="md" />
        <Avatar name="Ana Ng" size="lg" />
        <Avatar name="Ana Ng" size="xl" />
      </Demo>
      <Demo label="status">
        <Avatar name="Bo Park" status="online" />
        <Avatar name="Cira Diaz" status="away" />
        <Avatar name="Dee Okafor" status="busy" />
        <Avatar name="Eli Stone" status="offline" />
      </Demo>
      <Demo label="image - initials - square - anonymous">
        <Avatar src="https://i.pravatar.cc/96?img=47" name="Ana Ng" status="online" />
        <Avatar name="Bo Park" paletteIndex={5} />
        <Avatar name="Acme" shape="square" icon={<span>AC</span>} />
        <Avatar />
      </Demo>
      <Demo label="AvatarGroup - overflow +N">
        <AvatarGroup max={4} size="sm">
          <Avatar name="Ana Ng" />
          <Avatar name="Bo Park" />
          <Avatar name="Cira Diaz" />
          <Avatar name="Dee Okafor" />
          <Avatar name="Eli Stone" />
          <Avatar name="Fang Wu" />
        </AvatarGroup>
      </Demo>
    </>
  );
}

const INITIAL_LABELS = [
  { id: 'a', name: 'design', icon: <Icon name="hash" /> },
  { id: 'b', name: 'frontend', icon: <Icon name="hash" /> },
  { id: 'c', name: 'urgent', icon: <Icon name="hash" /> },
  { id: 'd', name: 'backlog', icon: <Icon name="hash" /> },
];

const FILTERS = ['Open', 'In review', 'Merged', 'Closed'];

export function TagPage() {
  const [labels, setLabels] = useState(INITIAL_LABELS);
  const [filters, setFilters] = useState<string[]>(['Open', 'Merged']);
  return (
    <>
      <Demo label="static - icon - sizes - disabled">
        <Tag>Spring 2026</Tag>
        <Tag icon={<Icon name="hash" />}>label</Tag>
        <Tag size="sm">dense row</Tag>
        <Tag disabled onRemove={() => undefined}>
          locked
        </Tag>
      </Demo>
      <Demo label="TagGroup - removable">
        <TagGroup ariaLabel="Labels">
          {labels.map((l) => (
            <Tag
              key={l.id}
              icon={l.icon}
              removeLabel={`Remove ${l.name}`}
              onRemove={() => setLabels((list) => list.filter((x) => x.id !== l.id))}
            >
              {l.name}
            </Tag>
          ))}
        </TagGroup>
      </Demo>
      <Demo label="ToggleTag - many-of-many (controlled)">
        {FILTERS.map((label) => (
          <ToggleTag
            key={label}
            selected={filters.includes(label)}
            onChange={(next) => setFilters((sel) => (next ? [...sel, label] : sel.filter((x) => x !== label)))}
          >
            {label}
          </ToggleTag>
        ))}
      </Demo>
      <Demo label="ToggleTag - icon + count">
        <ToggleTag icon={<Icon name="star" />} count={48} defaultSelected>
          Starred
        </ToggleTag>
        <ToggleTag icon={<Icon name="archive" />} count={7}>
          Archived
        </ToggleTag>
      </Demo>
    </>
  );
}

type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';
interface Invoice {
  id: string;
  number: string;
  customer: string;
  status: InvoiceStatus;
  date: string;
  ts: number;
  amount: number;
}

const STATUS_TONE: Record<InvoiceStatus, 'success' | 'warning' | 'danger' | undefined> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
  draft: undefined,
};

const INVOICES: Invoice[] = [
  { id: 'i1', number: 'INV-2041', customer: 'Northwind', status: 'paid', date: 'Jun 12', ts: 1718, amount: 4820 },
  { id: 'i2', number: 'INV-2042', customer: 'Acme Inc', status: 'pending', date: 'Jun 14', ts: 1718.2, amount: 1290 },
  { id: 'i3', number: 'INV-2043', customer: 'Globex', status: 'draft', date: '-', ts: 0, amount: 0 },
  { id: 'i4', number: 'INV-2044', customer: 'Initech', status: 'overdue', date: 'May 30', ts: 1717, amount: 760 },
];

const COLUMNS: TableColumn<Invoice>[] = [
  { key: 'number', label: 'Invoice', strong: true, grow: true, sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <Badge tone={STATUS_TONE[r.status]} pill>
        {r.status[0].toUpperCase() + r.status.slice(1)}
      </Badge>
    ),
  },
  { key: 'date', label: 'Date', mono: true, sortable: true, sortBy: (r) => r.ts },
  {
    key: 'amount',
    label: 'Amount',
    mono: true,
    align: 'end',
    sortable: true,
    render: (r) => (r.amount ? `$${r.amount.toLocaleString()}` : '-'),
  },
];

export function TablePage() {
  return (
    <Demo label="sortable - status cell - selectable - footer" fill>
      <Table<Invoice>
        ariaLabel="Invoices"
        columns={COLUMNS}
        rows={INVOICES}
        selectable
        defaultSort={{ key: 'amount', dir: 'desc' }}
        footer={<Pagination ariaLabel="Invoices" range={[1, INVOICES.length]} total={INVOICES.length} />}
      />
    </Demo>
  );
}

const PAGE_SIZE = 25;
const PAGE_TOTAL = 312;

export function PaginationPage() {
  const [start, setStart] = useState(26);
  const from = start;
  const to = Math.min(start + PAGE_SIZE - 1, PAGE_TOTAL);
  return (
    <>
      <Demo label="cursor range (controlled)">
        <Pagination
          ariaLabel="Rows"
          range={[from, to]}
          total={PAGE_TOTAL}
          hasPrev={from > 1}
          hasNext={to < PAGE_TOTAL}
          onPrev={() => setStart((s) => Math.max(1, s - PAGE_SIZE))}
          onNext={() => setStart((s) => s + PAGE_SIZE)}
        />
      </Demo>
      <Demo label="endless - no total">
        <Pagination ariaLabel="Activity" range={[101, 125]} hasPrev hasNext />
      </Demo>
    </>
  );
}
