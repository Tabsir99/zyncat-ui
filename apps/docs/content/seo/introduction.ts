import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React UI Components Without Tailwind',
  description:
    'React UI components and a full design system for React 19 - primitives, forms, overlays and motion in one component library on modern CSS, no Tailwind.',
  keywords: [
    'react components',
    'react component library',
    'react ui',
    'ui library',
    'react ui library',
    'component library',
    'react animation library',
    'react ui components',
    'react ui libraries',
    'ui component library',
    'react ui framework',
    'best react component library',
    'react design system',
  ],
  lede: 'A React 19 component library on a closed token vocabulary and one motion engine - no Tailwind, zero dependencies.',
  faq: [
    {
      q: 'What is a React component library?',
      a: "A React component library is a packaged set of ready-made UI components you import instead of rebuilding. Zyncat UI ships more than 40 of them - buttons, form fields, tables, dialogs, toasts and expressive motion pieces - each on its own subpath, so import { Button } from '@zyncat/ui/button' pulls that one component and its CSS and nothing else.",
    },
    {
      q: 'Do I need Tailwind CSS to use these React UI components?',
      a: 'No. Every component ships plain compiled CSS - no Tailwind, no CSS-in-JS, no build-time transformer - so you link @zyncat/ui/styles.css once at the app root and each component loads its own stylesheet with it. Shipped rules sit in @layer zyncat.components, so if your project does use Tailwind or its own CSS, your unlayered rules still beat them at any specificity.',
    },
    {
      q: 'Does this React UI library work with Next.js and server rendering?',
      a: "Yes. The package ships built ESM with the 'use client' directives intact, so Next.js App Router boundaries work with no transpilePackages and no bundler config, and the same build runs under Remix, Astro, Vite and Cloudflare Pages. Theming server-renders too: ZyncatTheme is a plain component that emits a <style> element, so there is no theme flash on first paint.",
    },
    {
      q: 'What are design tokens, and how do I retheme the components?',
      a: "Design tokens are named CSS custom properties - every colour, radius, font and duration resolves to one, so there are no magic numbers to hunt down. Retheme by repointing them: defineTheme({ accent: 'oklch(0.58 0.19 292)' }) passed to <ZyncatTheme theme={{ base, dark }} /> at the root, where every key but base becomes a [data-theme='<key>'] block. The motion engine reads the same tokens, so animation retimes with the theme.",
    },
    {
      q: 'Does this React UI library have any dependencies?',
      a: 'None. The dependencies field is empty and React 19 is the only peer: enter/exit, layout and gesture animation run on a small built-in engine over the browser Web Animations API rather than an animation library, and the icons are bundled. Reduced motion is handled at the token layer - every --duration-* collapses to 1ms under prefers-reduced-motion, so no component carries its own media query.',
    },
    {
      q: 'Can an AI coding agent use this component library?',
      a: 'Yes, and one command sets it up: npx zyncat-ui init installs the package, imports the stylesheet at your app root, drops the agent skill into .claude/skills/ and registers the bundled MCP server in .mcp.json. From there an agent calls get_component, search_api and get_tokens to read the real prop types and token values instead of guessing them.',
    },
  ],
};

export default seo;
