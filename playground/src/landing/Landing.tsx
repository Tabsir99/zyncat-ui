import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { Toaster, toast } from 'premium-ds/toast';
import { Tooltip } from 'premium-ds/tooltip';
import { Icon } from '../icon';
import { HeroConsole } from './HeroConsole';
import { EasingLab } from './EasingLab';
import { DurationTile, FlipTile, GlideTile, ToastTile } from './MotionTiles';
import { ThemeBand } from './ThemeBand';
import { useReveals } from './reveal';
import './landing.css';

const SITE = 'https://premium-ds.vercel.app';
const GITHUB = 'https://github.com/Tabsir99/premium-ds';

function copy(cmd: string) {
  navigator.clipboard.writeText(cmd).then(
    () => toast.success('Copied', { description: cmd }),
    () => toast.error('Clipboard blocked by the browser'),
  );
}

const PROOF: { value: string; label: string }[] = [
  { value: '30+', label: 'components on one closed token vocabulary' },
  { value: '2', label: 'peer deps — react, react-dom · motion optional' },
  { value: 'llms.txt', label: 'agent docs ship inside the package' },
  { value: 'MIT', label: 'client work, SaaS, internal tools — free forever' },
];

const SPEC_ROWS: { key: string; value: string }[] = [
  { key: 'styling', value: 'modern CSS + custom properties · zero runtime, no Tailwind' },
  { key: 'weight', value: 'per-component CSS lazy-loads with the import' },
  { key: 'a11y', value: 'keyboard-first, focus managed, reduced-motion aware' },
  { key: 'agents', value: 'llms.txt in the package · flat, typed, guessable props' },
  { key: 'frameworks', value: "Next.js · Vite · Remix — 'use client' already baked in" },
  { key: 'types', value: 'TypeScript-first, React 19, ESM + .d.ts shipped' },
];

const STEPS: { code: string; note: string }[] = [
  {
    code: 'pnpm add premium-ds motion',
    note: 'motion is an optional peer — the static half of the library runs without it; the animated components need it',
  },
  { code: "import 'premium-ds/styles.css'", note: 'once, at your app root — fonts + tokens' },
  { code: "import { Button } from 'premium-ds/button'", note: 'and ship — each import pulls only its own CSS' },
];

export function Landing() {
  useReveals();

  return (
    <div className="ld">
      <Head>
        <title>premium-ds — the $400 design system, minus the $400</title>
        <meta
          name="description"
          content="Open-source, motion-first React design system for dashboards and data-heavy apps. 30+ polished components on a small token vocabulary — no Tailwind, no CSS-in-JS. MIT."
        />
        <link rel="canonical" href={SITE} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="premium-ds — the $400 design system, minus the $400" />
        <meta
          property="og:description"
          content="Motion-first React components for dashboards and data-heavy apps, polished to paid-kit level. Token-driven theming, no Tailwind, MIT."
        />
        <meta property="og:url" content={SITE} />
        <meta property="og:image" content={`${SITE}/og.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="premium-ds — the $400 design system, minus the $400" />
        <meta name="twitter:image" content={`${SITE}/og.png`} />
      </Head>
      <Toaster />

      <header className="ld-nav">
        <div className="ld-container ld-nav__in">
          <Link to="/" className="ld-brand">
            <span className="ld-brand__dot" aria-hidden />
            premium-ds
          </Link>
          <nav className="ld-nav__links" aria-label="Site">
            <Link to="/components" className="ld-nav__link">
              Components
            </Link>
            <a href={GITHUB} className="ld-nav__link ld-nav__link--gh" rel="noreferrer">
              <Icon name="github" size="sm" />
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* ------------------------------------------------ hero */}
        <section className="ld-hero">
          <div className="ld-container ld-hero__top">
            <h1 className="ld-h1">
              The $400 design system,
              <br />
              <mark className="ld-h1__flip">minus the $400.</mark>
            </h1>
          </div>
          <div className="ld-container ld-hero__grid">
            <div className="ld-hero__copy">
              <p className="ld-lede">
                Motion-first React components for dashboards, admin panels and data-heavy products — tuned until they
                feel expensive. Token-driven, no Tailwind, MIT all the way down.
              </p>
              <div className="ld-cta">
                <Link to="/components" className="btn btn--lg">
                  <span className="btn__label">Explore 30+ components</span>
                  <span className="btn__icon" aria-hidden="true">
                    <Icon name="arrow-right" size="sm" />
                  </span>
                </Link>
                <Tooltip content="Copy install command">
                  <button type="button" className="ld-install" onClick={() => copy('pnpm add premium-ds')}>
                    <span className="ld-install__prompt" aria-hidden>
                      $
                    </span>
                    pnpm add premium-ds
                    <Icon name="copy" size="sm" />
                  </button>
                </Tooltip>
              </div>
              <p className="ld-objection">No pro tier · no license key · no email wall</p>
            </div>

            <div className="ld-hero__stage">
              <div className="ld-note" aria-hidden>
                <svg viewBox="0 0 110 52" className="ld-note__arrow">
                  <path d="M6 6 C 44 2, 84 12, 97 42" fill="none" />
                  <path d="M90 36 l7 7.5 7.5 -6" fill="none" />
                </svg>
                <span className="ld-note__text">
                  live — sort a column,
                  <br />
                  select some rows
                </span>
              </div>
              <HeroConsole />
              <p className="ld-hero__caption">real components, rendered from source — not a video, not a mock</p>
            </div>
          </div>

          <div className="ld-container ld-hero__proof" aria-label="The numbers">
            {PROOF.map((p) => (
              <div className="ld-proof__cell" key={p.value}>
                <p className="ld-proof__value">{p.value}</p>
                <p className="ld-proof__label">{p.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ motion */}
        <section className="ld-motion" id="motion">
          <div className="ld-container">
            <div className="ld-motion__head" data-reveal>
              <div>
                <p className="ld-eyebrow">--01 · motion</p>
                <h2 className="ld-h2">Every component has a signature move.</h2>
              </div>
              <p className="ld-section-lede">
                Not micro-interaction confetti — one deliberate, physical motion per component, timed on shared tokens.
                Pills glide, springs settle, rows FLIP. And the moment a user prefers reduced motion, all of it stands
                down.
              </p>
            </div>

            <div className="ld-bento">
              <div className="ld-tile ld-tile--lab" data-reveal>
                <EasingLab />
              </div>
              <GlideTile />
              <ToastTile />
              <FlipTile />
              <DurationTile />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ tokens (dark bleed) */}
        <ThemeBand />

        {/* ------------------------------------------------ foundation */}
        <section className="ld-stack" id="foundation">
          <div className="ld-container">
            <div className="ld-stack__head" data-reveal>
              <p className="ld-eyebrow">--03 · foundation</p>
              <h2 className="ld-h2">Boring where it should be.</h2>
              <p className="ld-section-lede">
                Ambitious motion needs an unambitious foundation: plain modern CSS, intent-named custom properties, and
                components that behave in any React 19 stack.
              </p>
            </div>
            <dl className="ld-spec ld-spec--grid" data-reveal>
              {SPEC_ROWS.map((r) => (
                <div className="ld-spec__row" key={r.key}>
                  <dt>--{r.key}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------ quick start */}
        <section className="ld-start" id="quick-start">
          <div className="ld-container">
            <div className="ld-sheet" data-reveal>
              <p className="ld-eyebrow">--04 · quick start</p>
              <h2 className="ld-h2 ld-sheet__title">Sixty seconds to the first button.</h2>
              <ol className="ld-steps">
                {STEPS.map((s, i) => (
                  <li className="ld-step" key={s.code}>
                    <span className="ld-step__num">0{i + 1}</span>
                    <div className="ld-step__body">
                      <code className="ld-step__code">{s.code}</code>
                      <span className="ld-step__note">{s.note}</span>
                    </div>
                    <button
                      type="button"
                      className="ld-step__copy"
                      aria-label={`Copy: ${s.code}`}
                      onClick={() => copy(s.code)}
                    >
                      <Icon name="copy" size="sm" />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ finale */}
        <section className="ld-finale">
          <div className="ld-container" data-reveal>
            <p className="ld-finale__big" aria-label="price: zero dollars">
              <span className="ld-finale__prop">--price:</span> $0;
              <i className="ld-caret" aria-hidden />
            </p>
            <p className="ld-finale__line">The premium tier is the only tier.</p>
            <div className="ld-finale__cta">
              <Link to="/components" className="btn btn--lg">
                <span className="btn__label">Explore 30+ components</span>
                <span className="btn__icon" aria-hidden="true">
                  <Icon name="arrow-right" size="sm" />
                </span>
              </Link>
              <a href={GITHUB} className="btn btn--secondary btn--lg" rel="noreferrer">
                <span className="btn__icon" aria-hidden="true">
                  <Icon name="github" size="sm" />
                </span>
                <span className="btn__label">Star it on GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="ld-footer">
        <div className="ld-container ld-footer__in">
          <span>premium-ds · MIT · built by Tabsir Ahammed</span>
          <nav className="ld-footer__links" aria-label="Footer">
            <Link to="/components">components</Link>
            <a href={GITHUB} rel="noreferrer">
              github
            </a>
            <a href="https://www.npmjs.com/package/premium-ds" rel="noreferrer">
              npm
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
