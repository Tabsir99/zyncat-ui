import { Link } from 'react-router-dom';
import { GROUPS } from './registry';

export function Home() {
  return (
    <>
      <header className="hero">
        <p className="hero__eyebrow">premium-ui</p>
        <h1 className="hero__title">A calm, polished React design system.</h1>
        <p className="hero__lede">
          Modern CSS and a small, closed token vocabulary — restraint over decoration, motion that
          never teleports. Everything here is rendered live from the package.
        </p>
        <div className="chips">
          <span className="chip">
            <b>30+</b> components
          </span>
          <span className="chip">
            <b>React 19</b>
          </span>
          <span className="chip">
            <b>0</b> deps beyond peers
          </span>
          <span className="chip">token-driven theming</span>
          <span className="chip">Next · Vite · Remix</span>
        </div>
      </header>

      <div className="index">
        {GROUPS.map((g) => (
          <section key={g.id} className="index__group">
            <h2 className="index__title">{g.title}</h2>
            <div className="index__links">
              {g.docs.map((d) => (
                <Link key={d.slug} to={`/${d.slug}`} className="index__link">
                  <span className="index__name">{d.label}</span>
                  <span className="index__blurb">{d.blurb}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
