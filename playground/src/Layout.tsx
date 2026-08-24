import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { Toaster } from '@zyncat/ui/toast';
import { GROUPS } from './registry';
import { CommandMenu } from './CommandMenu';
import { Icon } from './icon';
/* __MDT_VERIFY__ temporary preview mount - remove when done */
import { MotionDevtools } from '../../src/components/dev/MotionDevtools';

const NEW_SLUGS = new Set(['count-badge', 'emoji-picker', 'date-range', 'multi-select']);

export function Layout() {
  const { pathname } = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('zyncat-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldDark);
    if (shouldDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('zyncat-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('zyncat-theme', 'light');
      }
      return next;
    });
  };

  return (
    <div className="docs-shell">
      {/* __MDT_VERIFY__ temporary preview mount */}
      <MotionDevtools persist={false} />
      <Toaster />
      <CommandMenu open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Top Sticky Header */}
      <header className="navbar">
        <div className="navbar__inner">
          <div className="navbar__left">
            <button
              type="button"
              className="navbar__mobile-toggle"
              onClick={() => setIsMobileNavOpen((o) => !o)}
              aria-label="Toggle navigation menu"
            >
              <Icon name={isMobileNavOpen ? 'x' : 'list'} size="md" />
            </button>

            <NavLink to="/" className="brand">
              <span className="brand__mark" />
              <span className="brand__name">Zyncat UI</span>
            </NavLink>

            <nav className="navbar__nav">
              <NavLink
                to="/introduction"
                className={({ isActive }) =>
                  `navbar__nav-link ${
                    isActive ||
                    pathname === '/introduction' ||
                    pathname === '/installation' ||
                    pathname === '/mcp'
                      ? 'navbar__nav-link--active'
                      : ''
                  }`
                }
              >
                Docs
              </NavLink>
              <NavLink
                to="/button"
                className={({ isActive }) =>
                  `navbar__nav-link ${
                    isActive ||
                    (pathname !== '/' &&
                      pathname !== '/introduction' &&
                      pathname !== '/installation' &&
                      pathname !== '/mcp')
                      ? 'navbar__nav-link--active'
                      : ''
                  }`
                }
              >
                Components
              </NavLink>
              <a
                href="https://github.com/Tabsir99/zyncat-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="navbar__nav-link"
              >
                GitHub
              </a>
            </nav>
          </div>

          <div className="navbar__right">
            <button
              type="button"
              className="search-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search documentation"
            >
              <Icon name="magnifying-glass" size="sm" />
              <span className="search-btn__placeholder">Search documentation...</span>
              <kbd className="search-btn__kbd">⌘K</kbd>
            </button>

            <a
              href="https://github.com/Tabsir99/zyncat-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__icon-btn"
              title="View source on GitHub"
              aria-label="GitHub repository"
            >
              <Icon name="github" size="md" />
            </a>

            <button
              type="button"
              className="navbar__icon-btn"
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle color theme"
            >
              <Icon name={isDark ? 'sun' : 'moon'} size="md" />
            </button>
          </div>
        </div>
      </header>

      {/* 3-Column Docs Shell Layout */}
      <div className="docs-container">
        {/* Left Sidebar Navigation */}
        <aside className={`sidebar ${isMobileNavOpen ? 'sidebar--open' : ''}`}>
          <div className="sidebar__inner">
            <nav className="sidebar__nav">
              {GROUPS.map((g) => (
                <div key={g.id} className="nav__group">
                  <p className="nav__title">{g.title}</p>
                  {g.docs.map((d) => {
                    const isNew = NEW_SLUGS.has(d.slug);
                    return (
                      <NavLink
                        key={d.slug}
                        to={`/${d.slug}`}
                        className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}
                      >
                        <span className="nav__link-label">{d.label}</span>
                        {isNew ? <span className="nav__badge nav__badge--new">New</span> : null}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {isMobileNavOpen ? (
          <div className="sidebar-backdrop" onClick={() => setIsMobileNavOpen(false)} aria-hidden />
        ) : null}

        {/* Main Content Area */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
