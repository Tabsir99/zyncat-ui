// Route table for vite-react-ssg. Static paths (one per registry slug) are
// crawled and prerendered to their own HTML file, so each component page is a
// real URL with its own title and meta.
import type { RouteRecord } from 'vite-react-ssg';
import { Layout } from './Layout';
import { Home } from './Home';
import { PageView } from './PageView';
import { DOCS } from './registry';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      ...DOCS.map((d) => ({ path: d.slug, element: <PageView doc={d} /> })),
    ],
  },
];
