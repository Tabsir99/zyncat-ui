import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Button } from 'premium-ui';
import { GROUPS } from './registry';
import { Icon } from './icon';

// An accent preset writes the same semantic tokens a consumer would override.
// Subtle/border are translucent and text sits mid-light, so a preset reads
// correctly on BOTH themes; the default (vars: null) defers to the theme's own
// accent tokens for best contrast.
function accent(base: string): Record<string, string> {
  const c = `oklch(${base})`;
  return {
    '--accent': c,
    '--accent-hover': `color-mix(in oklab, ${c} 88%, black)`,
    '--accent-active': `color-mix(in oklab, ${c} 74%, black)`,
    '--accent-subtle': `color-mix(in oklab, ${c} 16%, transparent)`,
    '--accent-border': `color-mix(in oklab, ${c} 38%, transparent)`,
    '--text-accent': c,
  };
}

const ACCENTS: { key: string; label: string; swatch: string; vars: Record<string, string> | null }[] = [
  { key: 'teal', label: 'Teal', swatch: 'oklch(0.7 0.12 198)', vars: null },
  { key: 'violet', label: 'Violet', swatch: 'oklch(0.55 0.2 285)', vars: accent('0.55 0.2 285') },
  { key: 'blue', label: 'Blue', swatch: 'oklch(0.55 0.16 250)', vars: accent('0.55 0.16 250') },
  { key: 'rose', label: 'Rose', swatch: 'oklch(0.58 0.2 15)', vars: accent('0.58 0.2 15') },
];

export function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('pui-theme') as 'light' | 'dark') || 'light');
  const [accentKey, setAccentKey] = useState(() => localStorage.getItem('pui-accent') || 'teal');
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('pui-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const preset = ACCENTS.find((a) => a.key === accentKey);
    for (const a of ACCENTS) if (a.vars) for (const k of Object.keys(a.vars)) root.style.removeProperty(k);
    if (preset?.vars) for (const [k, v] of Object.entries(preset.vars)) root.style.setProperty(k, v);
    localStorage.setItem('pui-accent', accentKey);
  }, [accentKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="brand__mark" />
          <span className="brand__name">premium-ui</span>
        </NavLink>
        <nav>
          {GROUPS.map((g) => (
            <div key={g.id} className="nav__group">
              <p className="nav__title">{g.title}</p>
              {g.docs.map((d) => (
                <NavLink key={d.slug} to={`/${d.slug}`} className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
                  {d.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="main">
        <div className="topbar">
          <span className="topbar__meta">30+ components · token-driven · framework-agnostic</span>
          <div className="controls">
            <div className="swatches" role="group" aria-label="Accent">
              {ACCENTS.map((a) => (
                <button
                  key={a.key}
                  className={`swatch${accentKey === a.key ? ' swatch--on' : ''}`}
                  style={{ background: a.swatch }}
                  onClick={() => setAccentKey(a.key)}
                  aria-label={a.label}
                  aria-pressed={accentKey === a.key}
                />
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Icon name={theme === 'dark' ? 'sun' : 'moon'} size="sm" />}
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>
        </div>

        <div className="wrap">
          <Outlet />
          <footer className="footer">premium-ui — rendered from source via Vite. Restraint, consistency, motion.</footer>
        </div>
      </div>
    </div>
  );
}
