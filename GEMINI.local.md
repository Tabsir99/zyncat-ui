# Zyncat UI - Magic UI Docs Redesign Task Record

## Goal

Redesign the documentation pages for Zyncat UI to match the clean, polished design of Magic UI docs (magicuidesign/magicui), using pure CSS (no Tailwind, no CSS-in-JS), adhering strictly to Zyncat UI's token vocabulary and architectural standards. Do not touch the marketing landing page. Do not commit changes before user review.

## Reference Structure (Magic UI Docs)

1. **Top Announcement Bar**: Subtle notification banner at top ("✨ Zyncat UI — Modern CSS, closed token vocabulary & WAAPI motion engine").
2. **Top Navigation Header**:
   - Sticky blur header (`backdrop-filter: blur(12px) saturate(1.4)`).
   - Brand logo + name linking to `/`.
   - Links: Components (active), Theme/Tokens, GitHub.
   - Command palette search button (`Search documentation... ⌘K`).
   - GitHub stars link & Theme toggle button (Light / Dark mode).
3. **3-Column Architecture**:
   - Left: Sticky hierarchical navigation sidebar (Groups, docs links, status pills `New`, `Pro`).
   - Center: Rich component documentation content.
   - Right: Sticky Table of Contents ("On This Page", scrollspy active highlight, "Contribute" links, Feature callout card).
4. **Docs Content Layout**:
   - Breadcrumbs: `Docs / {Category} / {ComponentName}`.
   - Header: Large title `<h1>`, Action bar with `Copy Page` button & Prev/Next arrow buttons, descriptive blurb paragraph.
   - Hero Interactive Preview & Code block: `[Preview]` | `[Code]` tabs with replay button and copy button.
   - Sections with proper anchors:
     - `Examples`: Each demo with title, preview container, interactive state, replay trigger.
     - `Installation`: Tabs `[CLI]` (with `pnpm | npm | yarn | bun` package manager switcher) and `[Manual]`.
     - `Usage`: Syntax-styled usage snippet with line numbers and copy button.
     - `Props`: Clean tables per component/type (`Prop`, `Type`, `Default`, `Description`) with monospace code badges and required markers.
   - Bottom Pagination: Large cards for `← Previous Component` and `Next Component →`.
   - Footer: "Built by Tabsir Ahammed. The source code is available on GitHub."
5. **Interactive Enhancements**:
   - Command Palette / Quick Search modal (`⌘K` / `Ctrl+K`).
   - Replay / reload button on demos to re-trigger animations.
   - Clean Code Block component with line numbers, syntax tokens, and copy button with toast/checkmark feedback.
   - Theme toggle (Dark / Light mode).
   - Mobile responsive navigation with sliding drawer / hamburger menu.

## Architecture Decisions & Constraints

- Pure CSS using CSS variables and modern CSS nesting (`playground/src/docs.css`).
- Zero dependencies added (use existing React 19, Phosphor icons `@phosphor-icons/react`, router, etc.).
- SSR/SSG compatible (`vite-react-ssg` build must pass cleanly).
- Zero broken imports, all existing components and demo pages preserved.
