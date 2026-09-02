import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'Tailwind Alternative for React 19 Setup',
  description:
    'A Tailwind alternative for React 19: npx zyncat-ui init installs the components and links the stylesheet. No PostCSS, no bundler config, zero dependencies.',
  keywords: [
    'alternatives to tailwind css',
    'tailwind alternatives',
    'what is the best css framework for react',
    'tailwind alternative',
    'next js components',
    'tailwind css alternatives',
    'react css library',
    'alternatives to tailwind',
    'css framework for react',
    'react css framework',
    'tailwind competitors',
    'tailwindcss alternatives',
    'best css framework for react',
    'nextjs components',
    'tailwind css alternative',
  ],
  lede: 'One command installs Zyncat UI - React 19 components with no Tailwind, PostCSS or bundler config.',
  faq: [
    {
      q: 'How do I install Zyncat UI in a React project?',
      a: 'Run npx zyncat-ui init in the root of the project - or pnpm dlx zyncat-ui init, yarn dlx zyncat-ui init, bunx zyncat-ui init. The CLI installs @zyncat/ui with the package manager it detects, adds the @zyncat/ui/styles.css import as the first import in your app entry, installs the agent skill into .claude/skills/ and registers the MCP server in .mcp.json. Every step is idempotent, so re-running it after an upgrade refreshes all four.',
    },
    {
      q: 'What is the best CSS framework for React?',
      a: 'It splits by what you want back. Tailwind, Bootstrap and Bulma hand you utility classes to compose, while MUI, Chakra and Zyncat UI hand you finished React components. Zyncat UI is the option with no utility layer at all: plain modern CSS behind a closed token vocabulary, so nothing about it needs a PostCSS pipeline, a CSS-in-JS runtime or a build step.',
    },
    {
      q: 'Do I need Tailwind or PostCSS to use it?',
      a: 'No. Zyncat UI ships compiled CSS and needs no Tailwind, no PostCSS plugin, no bundler plugin and no build step - you link @zyncat/ui/styles.css once at the app root, and every component imports its own stylesheet from there so your bundler code-splits it with the component. init inserts that import above your own stylesheets, so your CSS keeps winning the cascade.',
    },
    {
      q: 'Does it work with the Next.js App Router?',
      a: "Yes, and with no transpilePackages entry. The package ships built ESM with its 'use client' directives intact, so App Router server and client boundaries resolve on their own. The only optional Next.js config is wrapping next.config.mjs with withZyncat from '@zyncat/ui/next'.",
    },
    {
      q: 'Which package managers and Node version does the CLI need?',
      a: 'pnpm, npm, yarn and bun all work - the CLI picks yours from the lockfile, the packageManager field or the runner you invoked it with, and --pm <pnpm|npm|yarn|bun> pins it. It needs Node.js 18 or newer. In CI or any non-interactive shell it prints plain logs and never prompts, so npx zyncat-ui init --yes --pm pnpm runs unattended.',
    },
    {
      q: 'How do I import components once it is installed?',
      a: "One subpath per component: import { Button } from '@zyncat/ui/button'. There is no barrel entry - importing from '@zyncat/ui' deliberately does not resolve - so an import pulls only that component and its CSS. React 19 is the one peer requirement, icons are bundled with no icon peer to install, and the package declares zero runtime dependencies.",
    },
  ],
};

export default seo;
