import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Image Zoom Magnifier on Hover',
  description:
    'React image zoom on hover: a magnifier glass that follows the pointer over any element - photo, text, chart - and re-renders it at up to 6x, never upscaled.',
  keywords: [
    'zoom image',
    'image zoom',
    'hover image zoom',
    'zoom on hover',
    'image magnifier',
    'magnify image on hover',
    'image zoom on hover',
    'image zoom effect',
    'how to zoom in on an image',
  ],
  lede: 'A React image zoom component - a magnifier that follows the pointer over any element. For product galleries.',
  faq: [
    {
      q: 'How do I zoom an image on hover in React?',
      a: 'Wrap it: <Lens magnification={2.6} radius={132}><img src="/product.jpg" /></Lens>. The glass follows the pointer with no lag and magnifies whatever sits under it, so there are no mouse events to wire up. magnification is clamped to 1.2-6 and radius, the glass radius in pixels, to 60-260.',
    },
    {
      q: 'What is the best tool for image zoom on hover?',
      a: 'These results are still owned by the jQuery era - elevateZoom, Magic Zoom Plus, YITH WooCommerce Zoom Magnifier - with react-image-magnify, react-medium-image-zoom and js-image-zoom on the React side. Lens differs in what it magnifies: rather than pairing a thumbnail with a separate high-resolution file, it re-renders the DOM you already have, which is why it works over text, SVG and charts as well as photos.',
    },
    {
      q: 'Can the magnifier zoom a div and its text, or only images?',
      a: 'Any DOM. Lens clones its children into the glass and scales that clone about the pointer, so a div, a table, live text, an SVG chart or a map magnifies exactly the way an image does. Because the copy is real DOM and not a bitmap, magnified type is re-rasterised as vector type at the larger size, and a MutationObserver re-clones so content that changes stays live under the glass.',
    },
    {
      q: 'Does magnifying the image lose quality?',
      a: 'Text, SVG and CSS re-rasterise at the magnified size, so they stay sharp at any magnification. A photo is bounded by the file you hand it, as with any image zoom: serve a high-resolution source and constrain it with CSS width, and the browser has the full-resolution pixels to draw from when the glass magnifies. There is no second image URL prop - Lens magnifies the one child you pass.',
    },
    {
      q: 'Is this a magnifying glass PNG or a real effect?',
      a: 'A real effect, not a magnifying glass PNG, a GIF or a PowerPoint magnifier animation. The glass is drawn in the browser - rim, vignette, a specular highlight that trails the direction of travel, and chromatic fringing that strengthens with speed until chromatic={false} turns it off - over live DOM, so it magnifies what your app renders at runtime rather than a picture of it.',
    },
    {
      q: 'Can I use this image zoom on hover in Next.js?',
      a: "Yes. @zyncat/ui/lens ships compiled ESM with its 'use client' directive intact, so it works in the Next.js App Router with no transpilePackages config and no runtime dependencies. Your children are server-rendered and stay in the accessibility tree while the magnified copy is aria-hidden; arrow keys steer the glass and Escape dismisses it once the stage has focus, and under prefers-reduced-motion it settles into place instead of easing.",
    },
  ],
};

export default seo;
