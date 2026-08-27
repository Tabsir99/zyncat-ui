'use client';

import Link from 'next/link';

import { Callout, FeatureCard, FeatureGrid } from '../kit';

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
        <p className="guide-section__p">Zyncat UI adheres to four strict architectural principles:</p>

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
            <strong>Modern CSS First:</strong> We utilize modern browser primitives like CSS nesting, container queries,{' '}
            <code className="doc-inline-code">:has()</code>, and <code className="doc-inline-code">@layer</code> rather
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
            title="Closed Token Vocabulary"
            description="All component dimensions, paddings, fonts, radiuses, and colors resolve to semantic CSS variables. No arbitrary magic numbers, no utility sprawl."
          />
          <FeatureCard
            icon="rocket"
            title="Native WAAPI Motion"
            description="Zero JavaScript bundle cost for animations. Transitions run off the main thread with real hardware acceleration, proper spring physics, and automatic reduced-motion handling."
          />
          <FeatureCard
            icon="browsers"
            title="Subpath Treeshaking"
            description="Zero barrel export bloat. Importing @zyncat/ui/button packages only the Button and its CSS, keeping consumer bundle sizes minimal."
          />
          <FeatureCard
            icon="cpu"
            title="AI & MCP Native"
            description="Includes an integrated Model Context Protocol (MCP) server so AI coding assistants (Cursor, Claude, Antigravity) understand the component schemas and can write correct UI out-of-the-box."
          />
        </FeatureGrid>
      </section>

      <section className="guide-section" id="pillars">
        <h2 className="guide-section__title">Design System Architecture</h2>
        <p className="guide-section__p">
          The component hierarchy is strictly organized into four layers with clear boundary rules:
        </p>

        <div className="doc-steps">
          <div className="doc-step">
            <div className="doc-step__num">1</div>
            <div className="doc-step__body">
              <h3 className="doc-step__title">Tokens Layer</h3>
              <p className="doc-step__desc">
                Defines raw CSS variables in <code>styles.css</code> including surface colors, borders, typography,
                radii, z-indices, and motion tokens (durations, easings, distances).
              </p>
            </div>
          </div>
          <div className="doc-step">
            <div className="doc-step__num">2</div>
            <div className="doc-step__body">
              <h3 className="doc-step__title">Primitives Layer</h3>
              <p className="doc-step__desc">
                Single-purpose controls with minimal state:{' '}
                <Link href="/button" className="doc-link">
                  Button
                </Link>
                ,{' '}
                <Link href="/icon" className="doc-link">
                  Icon
                </Link>
                ,{' '}
                <Link href="/collapse" className="doc-link">
                  Collapse
                </Link>
                ,{' '}
                <Link href="/badge" className="doc-link">
                  Badge
                </Link>
                ,{' '}
                <Link href="/count-badge" className="doc-link">
                  CountBadge
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="doc-step">
            <div className="doc-step__num">3</div>
            <div className="doc-step__body">
              <h3 className="doc-step__title">Forms &amp; Inputs</h3>
              <p className="doc-step__desc">
                Form inputs adhering to standard HTML input semantics with integrated error states and labels:{' '}
                <Link href="/text-field" className="doc-link">
                  TextField
                </Link>
                ,{' '}
                <Link href="/number-field" className="doc-link">
                  NumberField
                </Link>
                ,{' '}
                <Link href="/otp-field" className="doc-link">
                  OtpField
                </Link>
                ,{' '}
                <Link href="/select" className="doc-link">
                  Select
                </Link>
                ,{' '}
                <Link href="/multi-select" className="doc-link">
                  MultiSelect
                </Link>
                ,{' '}
                <Link href="/toggle" className="doc-link">
                  Toggle
                </Link>
                ,{' '}
                <Link href="/checkbox" className="doc-link">
                  Checkbox
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="doc-step">
            <div className="doc-step__num">4</div>
            <div className="doc-step__body">
              <h3 className="doc-step__title">Data &amp; Overlays</h3>
              <p className="doc-step__desc">
                Complex data representations and portal-anchored surfaces:{' '}
                <Link href="/avatar" className="doc-link">
                  Avatar
                </Link>
                ,{' '}
                <Link href="/table" className="doc-link">
                  Table
                </Link>
                ,{' '}
                <Link href="/pagination" className="doc-link">
                  Pagination
                </Link>
                ,{' '}
                <Link href="/date-field" className="doc-link">
                  DateField
                </Link>
                ,{' '}
                <Link href="/tabs" className="doc-link">
                  Tabs
                </Link>
                ,{' '}
                <Link href="/dialog" className="doc-link">
                  Dialog
                </Link>
                ,{' '}
                <Link href="/popover" className="doc-link">
                  Popover
                </Link>
                ,{' '}
                <Link href="/sheet" className="doc-link">
                  Sheet
                </Link>
                ,{' '}
                <Link href="/dropdown" className="doc-link">
                  Dropdown
                </Link>
                ,{' '}
                <Link href="/toast" className="doc-link">
                  Toast
                </Link>
                ,{' '}
                <Link href="/emoji-picker" className="doc-link">
                  EmojiPicker
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="guide-section" id="next-steps">
        <h2 className="guide-section__title">Next Steps</h2>
        <p className="guide-section__p">
          Follow the installation guide to integrate Zyncat UI into your Next.js, Vite, or Remix application, or
          configure the MCP server for AI pair programming.
        </p>

        <div className="page-pagination" style={{ marginTop: '2rem' }}>
          <Link href="/installation" className="pagination-card pagination-card--next">
            <span className="pagination-card__sub">Next Step</span>
            <span className="pagination-card__title">Installation &amp; Setup →</span>
          </Link>
          <Link href="/mcp" className="pagination-card pagination-card--next">
            <span className="pagination-card__sub">AI Tooling</span>
            <span className="pagination-card__title">MCP Server Guide →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
