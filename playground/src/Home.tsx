import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { GROUPS } from './registry';

const SITE = 'https://premium-ds.vercel.app';

export function Home() {
  return (
    <>
      <Head>
        <title>premium-ds - a calm, polished React 19 design system</title>
        <meta
          name="description"
          content="A premium React 19 design system: accessible, animated components on a small, closed CSS token vocabulary. No Tailwind, no CSS-in-JS. Browse 30+ live components."
        />
        <link rel="canonical" href={`${SITE}/components`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="premium-ds - a calm, polished React 19 design system" />
        <meta
          property="og:description"
          content="Accessible, animated React 19 components on a small, closed CSS token vocabulary."
        />
        <meta property="og:url" content={`${SITE}/components`} />
      </Head>
      <header className="hero">
        <p className="hero__eyebrow">premium-ds</p>
        <h1 className="hero__title">A calm, polished React design system.</h1>
        <p className="hero__lede">
          Modern CSS and a small, closed token vocabulary - restraint over decoration, motion that never teleports.
          Everything here is rendered live from the package.
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
          <span className="chip">Next - Vite - Remix</span>
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
