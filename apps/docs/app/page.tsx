import type { CSSProperties } from 'react';
import Link from 'next/link';

const page: CSSProperties = {
  minHeight: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  color: '#18181b',
};

const inner: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '24px',
  maxWidth: '480px',
};

const nav: CSSProperties = { display: 'flex', gap: '20px', marginTop: '8px' };

const link: CSSProperties = { color: '#2563eb', textDecoration: 'underline', textUnderlineOffset: '3px' };

export default function HomePage() {
  return (
    <main style={page}>
      <div style={inner}>
        <h1 style={{ fontSize: '28px', fontWeight: 650, margin: 0 }}>Zyncat UI</h1>
        <p style={{ margin: 0, lineHeight: 1.6, color: '#52525b' }}>
          Motion-first React 19 design system. The landing page is being rebuilt — the documentation is all here:
        </p>
        <nav style={nav} aria-label="Documentation">
          <Link href="/introduction" style={link}>
            Introduction
          </Link>
          <Link href="/installation" style={link}>
            Installation
          </Link>
          <Link href="/button" style={link}>
            Components
          </Link>
        </nav>
      </div>
    </main>
  );
}
