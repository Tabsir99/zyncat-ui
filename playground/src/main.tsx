// Playground entry. Imports the library's stylesheet exactly the way a consumer
// would (`premium-ds/styles.css`), then the docs-only chrome on top. Routes are
// built from the registry so each primitive renders on its own page.
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import 'premium-ds/styles.css';
import './docs.css';
import { Layout } from './Layout';
import { Home } from './Home';
import { PageView } from './PageView';
import { DOCS } from './registry';

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {DOCS.map((d) => (
          <Route key={d.slug} path={d.slug} element={<PageView doc={d} />} />
        ))}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  </HashRouter>,
);
