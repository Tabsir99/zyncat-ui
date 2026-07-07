// Route table for vite-react-ssg. Static paths (one per registry slug) are
// crawled and prerendered to their own HTML file, so each component page is a
// real URL with its own title and meta.
//
// `/` is the marketing landing page (its own full-bleed chrome); the docs
// shell (sidebar layout) is a pathless route so every component keeps its
// existing `/:slug` URL, with the component index living at `/components`.
import type { RouteRecord } from 'vite-react-ssg';
import { Layout } from './Layout';
import { Home } from './Home';
import { PageView } from './PageView';
import { Landing } from './landing/Landing';
import { DOCS } from './registry';

export const routes: RouteRecord[] = [
  { path: '/', element: <Landing /> },
  {
    element: <Layout />,
    children: [
      { path: '/components', element: <Home /> },
      ...DOCS.map((d) => ({ path: `/${d.slug}`, element: <PageView doc={d} /> })),
    ],
  },
];
