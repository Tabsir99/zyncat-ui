import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'Interactive React Animated Background',
  description:
    'An interactive animated background for React websites - a canvas needle field on a drifting flow field that swings away from the pointer. Zero dependencies.',
  keywords: [
    'animated background',
    'particle js',
    'vanta js',
    'background animation for website',
    'background animation',
    'website background animation',
    'particles background',
    'background animation css',
    'particles js',
    'particle background',
    'css background animation',
    'css animated background',
    'animated background css',
    'react backgrounds',
    'particle animation',
  ],
  lede: 'A React animated background component: a canvas needle field that bends away from the pointer. For hero sections.',
  faq: [
    {
      q: 'How do I add an animated background to a React or Next.js page?',
      a: "Import FlowField from '@zyncat/ui/flow-field' and wrap whatever should sit on top: <FlowField spacing={26} radius={210}><Hero /></FlowField>. The canvas fills the root and your children render above it, so a hero, a card or a section heading keeps its own layout and semantics. The file already carries 'use client', so it drops into the Next.js App Router with no extra directive.",
    },
    {
      q: 'What is a flow field background?',
      a: 'A flow field gives every point on the surface a direction, and whatever is drawn there lines up with it. This background lays needles on a grid and turns each one toward its local angle, so the whole field drifts like grass in wind. Generative-art flow fields usually sample Perlin or simplex noise; this one sums a sine over x and a cosine over y with time in the phase, which loops smoothly and costs one trig pair per needle.',
    },
    {
      q: 'Is this a WebGL or three.js background, or a canvas one?',
      a: "It is a plain 2D canvas - getContext('2d'), no WebGL context, no three.js and no shader, so nothing is compiled at runtime and there is no extra bundle to pull in. That is the difference from Vanta.js, where most effects need three.js on the page as well. It is not a CSS background either: the needles are stroked per frame rather than tweened by keyframes, and it is not a GIF or a background video.",
    },
    {
      q: 'How do I make a website background interactive with the mouse?',
      a: 'Pointer steering is on by default and there is no prop to enable it. Every needle inside radius - 40 to 640 px, 210 by default, sampled live on each frame - turns to point away from the pointer, stretches and brightens through a twelve-stop colour ramp, and the pull falls off toward the edge of that circle. The grip is released more slowly than it is taken, so the field eases back rather than snapping when the pointer leaves.',
    },
    {
      q: 'Is this a particle background like particles.js or Vanta.js?',
      a: 'Not quite. In a particle background such as particles.js or tsparticles the dots travel across the screen and link up; here the needles are pinned to a grid and only rotate, stretch and brighten, so the motion reads as a field rather than as drifting dust. It is also one component with zero runtime dependencies and no Tailwind, not a library plus a config object.',
    },
    {
      q: 'Does an animated background hurt performance or accessibility?',
      a: 'This one is capped rather than open-ended: at most 1600 needles, with spacing widening on its own on large surfaces, device pixel ratio capped at 2, and the loop stopping entirely when the element scrolls out of view or the tab is hidden. The canvas is aria-hidden and adds no tab stop, your children keep their own semantics, and under prefers-reduced-motion it paints one still frame of the settled field and never starts the loop.',
    },
  ],
};

export default seo;
