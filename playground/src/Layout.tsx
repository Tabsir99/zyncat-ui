import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'premium-ds/toast';
import { GROUPS } from './registry';
/* __MDT_VERIFY__ temporary preview mount - remove when done */
import { MotionDevtools } from '../../src/components/dev/MotionDevtools';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      {/* __MDT_VERIFY__ temporary preview mount */}
      <MotionDevtools persist={false} />
      <Toaster />
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="brand__mark" />
          <span className="brand__name">premium-ds</span>
        </NavLink>
        <nav>
          {GROUPS.map((g) => (
            <div key={g.id} className="nav__group">
              <p className="nav__title">{g.title}</p>
              {g.docs.map((d) => (
                <NavLink
                  key={d.slug}
                  to={`/${d.slug}`}
                  className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}
                >
                  {d.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="main">
        <div className="topbar">
          <span className="topbar__meta">30+ components - token-driven - framework-agnostic</span>
        </div>

        <div className="wrap">
          <Outlet />
          <footer className="footer">
            premium-ds - rendered from source via Vite. Restraint, consistency, motion.
          </footer>
        </div>
      </div>
    </div>
  );
}
