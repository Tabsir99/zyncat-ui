// Playground entry. vite-react-ssg prerenders one static HTML file per route
// (real URLs, per-page meta) and hydrates to the SPA. The library stylesheet is
// linked first, exactly as a consumer would, then the docs-only chrome on top.
import { ViteReactSSG } from 'vite-react-ssg';
import 'premium-ds/styles.css';
import './docs.css';
import { routes } from './routes';

export const createRoot = ViteReactSSG({ routes });
