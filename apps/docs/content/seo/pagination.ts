import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Pagination Component',
  description:
    'A React pagination component: prev/next arrows and a live range readout, for tables and search results. Zero runtime dependencies, React 19 ready.',
  keywords: [
    'pagination',
    'pagination website',
    'react pagination',
    'web pagination',
    'pagination examples',
    'pagination ui',
    'pagination design',
    'table pagination',
    'pagination best practices',
    'react pagination component',
    'react table pagination',
    'pagination component',
  ],
  lede: 'A React pagination control - prev/next arrows and a live range readout - for tables and search results.',
  faq: [
    {
      q: 'What is pagination?',
      a: 'Splitting a long result set into pages so only one slice renders at a time, instead of the whole list at once. This component renders that control as a compact strip - a live "from-to of total" range readout next to a previous/next arrow pair - rather than a row of clickable page numbers.',
    },
    {
      q: 'Does this show numbered page buttons, or support infinite scroll?',
      a: 'Neither. There is no 1-2-3 row and no ellipsis-truncation logic - range is a [from, to] tuple and hasPrev/hasNext are plain booleans, so the component never needs to know how many pages exist. It is also not scroll-triggered: paging only happens when someone presses the previous or next arrow, which is what onPrev/onNext fire for.',
    },
    {
      q: 'How do I add pagination to a table in React?',
      a: 'Pass Pagination its own state, separate from the table: range is the [from, to] slice currently shown, total is the full row count (or omit it for an endless list), and hasPrev/hasNext gate the arrows. It is fully controlled - there is no internal page index - so onPrev/onNext just update whatever state feeds your rows, whether that is an offset, a page number or an opaque cursor.',
    },
    {
      q: 'Can I use it with a cursor-based API that has no total count?',
      a: 'Yes - total is optional (number | null), and hasPrev/hasNext are booleans rather than a page count, so the props map directly onto a cursor response: set them from whatever has_more or has_previous flags the API returns, and skip total entirely when the API does not provide one. Nothing in the component assumes a fixed page size or a known page count.',
    },
    {
      q: 'How do I show a loading state while the next page is fetching?',
      a: 'Set loading - both arrows go inert and the one that was just clicked (tracked internally) shows the Button spinner while the other simply disables, so the control never reflows or lets a second click queue up mid-fetch.',
    },
    {
      q: 'Is it accessible, and does it work with Next.js?',
      a: 'Yes to both. The root is a nav element with an aria-label landmark (name the list, e.g. "Posts", not the word "pagination"), the range readout is aria-live="polite" so screen readers announce new totals, and each arrow carries its own aria-label plus native button semantics. It ships with "use client" intact for the Next.js App Router, has zero runtime dependencies, and the slide animation on the range readout collapses under prefers-reduced-motion.',
    },
  ],
};

export default seo;
