import { Link } from 'react-router-dom';
import { Callout, FeatureGrid, FeatureCard } from '../kit';

export function IntroductionDoc() {
  return (
    <>
      <section className="guide-section" id="overview">
        <h2 className="guide-section__title">Overview</h2>
        <p className="guide-section__p">
          <strong>Zyncat UI</strong> is a React 19 design system built on modern CSS standards, a small closed token
          vocabulary, and a lightweight (~2.5 kB) Web Animations API (WAAPI) motion engine.
        </p>
        <p className="guide-section__p">
          It provides a complete set of accessible, highly animated UI primitives, form controls, data display blocks,
          and overlays engineered with <strong>zero Tailwind</strong>, <strong>zero CSS-in-JS</strong>, and{' '}
          <strong>zero runtime animation dependencies</strong>.
        </p>

        <Callout tone="tip" title="Zero Animation Runtime Bloat">
          Unlike libraries that require heavy animation frameworks (e.g. Framer Motion, GSAP), Zyncat UI orchestrates
          all spring physics, FLIP layouts, and presence transitions directly on the browser&apos;s native Web
          Animations API.
        </Callout>
      </section>

      <section className="guide-section" id="philosophy">
        <h2 className="guide-section__title">Philosophy &amp; Craft</h2>
        <p className="guide-section__p">
          Good UI design is not merely decoration—it is one of the primary mechanisms for establishing trust with users.
          When interfaces feel intentional, responsive, and physically grounded, users instinctively know the software
          behind it is reliable.
        </p>
        <p className="guide-section__p">
          Zyncat UI adheres to four strict architectural principles:
        </p>

        <ul className="guide-section__list">
          <li>
            <strong>Restraint over Decoration:</strong> Every color, elevation, radius, and spatial interval is strictly
            bounded by an intentional token system. No arbitrary hex values, ad-hoc padding, or utility-class clutter.
          </li>
          <li>
            <strong>Motion is Physical State:</strong> Layout changes, collapses, modal appearances, and digit rolls
            never snap or teleport. Every transition preserves spatial orientation and respects reduced-motion
            preferences.
          </li>
          <li>
            <strong>Modern CSS First:</strong> We utilize modern browser primitives like CSS nesting, container
            queries, <code className="doc-inline-code">:has()</code>, and <code className="doc-inline-code">@layer</code> rather
            than JavaScript style injection or complex build-time transformers.
          </li>
          <li>
            <strong>Strict Accessibility &amp; Keyboard Control:</strong> Every interactive element includes complete
            ARIA roles, keyboard active descendants, focus traps, and screen-reader announcements by default.
          </li>
        </ul>
      </section>

      <section className="guide-section" id="core-pillars">
        <h2 className="guide-section__title">Core Pillars</h2>
        <p className="guide-section__p">
          Explore the architectural pillars that make Zyncat UI fast, resilient, and enjoyable to build with.
        </p>

        <FeatureGrid>
          <FeatureCard
            icon="lightning"
            title="~2.5 kB WAAPI Engine"
            description="Native browser animations with physics-driven springs, playback scaling, and FLIP layout morphing."
          />
          <FeatureCard
            icon="package"
            title="Closed Token System"
            description="Standardized CSS variables for surfaces, text hierarchy, borders, radii, and semantic status tones."
          />
          <FeatureCard
            icon="cpu"
            title="React 19 Native"
            description="Built from the ground up for React 19: ref-as-prop, useActionState, transitions, and zero hydration bugs."
          />
          <FeatureCard
            icon="browsers"
            title="Universal SSR / SSG"
            description="Seamless compatibility with Next.js (App & Pages), Remix, Astro, Vite, and Cloudflare Pages."
          />
          <FeatureCard
            icon="shield-check"
            title="Accessible & Headless"
            description="Full WAI-ARIA 1.2 compliance, focus trapping, roving tabindex, and keyboard shortcuts built-in."
          />
          <FeatureCard
            icon="terminal"
            title="Built-in MCP Server"
            description="First-class Model Context Protocol server enabling AI IDE agents (Cursor, Claude, Antigravity) to query APIs."
          />
        </FeatureGrid>
      </section>

      <section className="guide-section" id="architecture">
        <h2 className="guide-section__title">Design Architecture</h2>
        <p className="guide-section__p">
          Components are organized cleanly into distinct layers based on their responsibility and composition:
        </p>

        <div className="examples-list">
          <div className="example-block">
            <h3 className="example-block__title">1. Primitives</h3>
            <p className="example-block__desc">
              Visual atoms and single controls with zero composite behavior:{' '}
              <Link to="/button" className="doc-link">Button</Link>,{' '}
              <Link to="/icon" className="doc-link">Icon</Link>,{' '}
              <Link to="/collapse" className="doc-link">Collapse</Link>,{' '}
              <Link to="/badge" className="doc-link">Badge</Link>,{' '}
              <Link to="/count-badge" className="doc-link">CountBadge</Link>.
            </p>
          </div>

          <div className="example-block">
            <h3 className="example-block__title">2. Forms</h3>
            <p className="example-block__desc">
              Inputs and data entry machines with built-in validation states and smooth disclosure transitions:{' '}
              <Link to="/text-field" className="doc-link">TextField</Link>,{' '}
              <Link to="/number-field" className="doc-link">NumberField</Link>,{' '}
              <Link to="/otp-field" className="doc-link">OtpField</Link>,{' '}
              <Link to="/select" className="doc-link">Select</Link>,{' '}
              <Link to="/multi-select" className="doc-link">MultiSelect</Link>,{' '}
              <Link to="/toggle" className="doc-link">Toggle</Link>,{' '}
              <Link to="/checkbox" className="doc-link">Checkbox</Link>.
            </p>
          </div>

          <div className="example-block">
            <h3 className="example-block__title">3. Data &amp; Navigation</h3>
            <p className="example-block__desc">
              Display surfaces and collection navigators:{' '}
              <Link to="/avatar" className="doc-link">Avatar</Link>,{' '}
              <Link to="/table" className="doc-link">Table</Link>,{' '}
              <Link to="/pagination" className="doc-link">Pagination</Link>,{' '}
              <Link to="/date-field" className="doc-link">DateField</Link>,{' '}
              <Link to="/tabs" className="doc-link">Tabs</Link>.
            </p>
          </div>

          <div className="example-block">
            <h3 className="example-block__title">4. Overlays &amp; Feedback</h3>
            <p className="example-block__desc">
              Anchored surfaces, popovers, dynamic sheets, and toasts:{' '}
              <Link to="/dialog" className="doc-link">Dialog</Link>,{' '}
              <Link to="/popover" className="doc-link">Popover</Link>,{' '}
              <Link to="/sheet" className="doc-link">Sheet</Link>,{' '}
              <Link to="/dropdown" className="doc-link">Dropdown</Link>,{' '}
              <Link to="/toast" className="doc-link">Toast</Link>,{' '}
              <Link to="/emoji-picker" className="doc-link">EmojiPicker</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="guide-section" id="next-steps">
        <h2 className="guide-section__title">Next Steps</h2>
        <p className="guide-section__p">
          Ready to start using Zyncat UI in your application? Follow the installation guide or set up the MCP server
          for AI-assisted development.
        </p>

        <div className="page-pagination" style={{ marginTop: 'var(--space-4)' }}>
          <Link to="/installation" className="pagination-card pagination-card--next">
            <span className="pagination-card__sub">Next Step</span>
            <span className="pagination-card__title">Installation Guide &rarr;</span>
          </Link>
          <Link to="/mcp" className="pagination-card pagination-card--next">
            <span className="pagination-card__sub">AI Assistant</span>
            <span className="pagination-card__title">MCP Server Setup &rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
