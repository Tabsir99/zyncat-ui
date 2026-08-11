import '@zyncat/ui/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StandaloneDemo } from './demo';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StandaloneDemo healed={false} />
  </StrictMode>,
);
