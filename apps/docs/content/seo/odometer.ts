import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Odometer Number Counter Animation',
  description:
    'React number counter animation: an odometer that counts up, rolling every digit column on its own spring with motion blur. Zero dependencies, React 19.',
  keywords: [
    'count up',
    'number counter animation',
    'animated number counter',
    'number animation',
    'counter animation',
    'number counter animation generator',
    'animated numbers',
    'number counter gif',
    'animated counter',
    'count up animation',
    'react countup',
    'number counting animation',
    'counting animation',
    'react-countup',
    'odometer js',
  ],
  lede: 'A React number counter component whose digits roll like an odometer. For stats, dashboards and pricing.',
  faq: [
    {
      q: 'How do I make an animated number counter in React?',
      a: "Import Odometer from '@zyncat/ui/odometer' and give it a value: <Odometer value={12480} />. Every time value changes the digit columns roll to the new number, each on its own spring, so there is no animation code to write. Under prefers-reduced-motion it snaps straight to the value instead of rolling.",
    },
    {
      q: 'How do I add commas or zero-padding to the rolling numbers?',
      a: "Pass a format function. format={(v) => v.toLocaleString('en-US')} renders 12,480 with its comma, and format={(v) => String(v).padStart(8, '0')} renders 00012480. Digits in the returned string become rolling columns; everything else - commas, currency symbols, decimal points, units - stays put as a static separator.",
    },
    {
      q: 'How do I start the count up animation on scroll?',
      a: 'Odometer has no scroll-trigger prop: render it with a starting value and set the real value when your own IntersectionObserver fires. The simulation already pauses whenever the element is off-screen or the tab is hidden, so a counter further down the page burns no frames before anyone sees it.',
    },
    {
      q: 'Is this a number counter GIF or a real animation?',
      a: 'It is a real animation, not a GIF, a Lottie file or an After Effects template. Odometer renders live DOM - one column per digit, each driven by a spring simulation - so it counts to whatever value your app produces at runtime and stays sharp at any font size, which a pre-rendered number counter animation cannot do.',
    },
    {
      q: 'Can I use this number counter animation in Next.js?',
      a: "Yes. @zyncat/ui/odometer ships compiled ESM with its 'use client' directive intact, so it works in the Next.js App Router with no transpilePackages config. The formatted value is in the server-rendered HTML for crawlers and screen readers, and the digit columns start rolling once the component hydrates.",
    },
    {
      q: 'How is this different from react-countup or odometer.js?',
      a: 'react-countup tweens one value from a start to an end over a duration you set. Odometer instead gives every digit column its own spring, so digits land out of sync and blur in proportion to their own velocity, and a value change mid-roll is absorbed rather than restarted. It adds no runtime dependencies - the motion is a small built-in engine, not GSAP or Framer Motion.',
    },
  ],
};

export default seo;
