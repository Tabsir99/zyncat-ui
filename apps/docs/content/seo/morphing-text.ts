import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Morphing Text Animation Component',
  description:
    'React morphing text animation: a headline cycles your words, each morphing into the next through one SVG alpha threshold. Gooey text, zero dependencies.',
  keywords: [
    'text animation',
    'animated text generator',
    'animated text',
    'text animations',
    'text animation css',
    'css text animation',
    'css text effects',
    'react text animation',
    'text morph',
    'react text animations',
  ],
  lede: 'A React text animation component that cycles your words, each one melting into the next. For hero headlines.',
  faq: [
    {
      q: 'How do I add a morphing text animation in React or Next.js?',
      a: "Import it per subpath and pass a word list: import { MorphingText } from '@zyncat/ui/morphing-text', then <MorphingText words={['Weight', 'Timing', 'Ease']} />. It is a client component, so it drops straight into the Next.js App Router; link @zyncat/ui/styles.css once at the root for the tokens.",
    },
    {
      q: 'How is the gooey text morph effect made?',
      a: 'Every letter of the outgoing and incoming word is blurred on its own stagger, and the whole stage passes through one SVG filter - an feGaussianBlur feeding an feColorMatrix alpha threshold - so the softened letterforms pool and split like liquid. The filter attaches only while a morph is in flight, so a resting word is untouched, unblurred type.',
    },
    {
      q: 'Can I control the speed of the morphing text animation?',
      a: 'Yes. hold sets how long each word rests fully legible before the next morph starts, in milliseconds (default 1500), and speed multiplies the simulation rate (default 1). Both are sampled live on every frame, so changing either retimes the animation mid-morph; the morph itself runs 900ms.',
    },
    {
      q: 'Is this a morphing text generator or an After Effects preset?',
      a: 'Neither - it is a React component that morphs live DOM text, not a GIF, a Lottie file, or an After Effects or Photoshop render, so the words stay real text rather than pixels. The playground on this page is the generator: set the words, hold and speed, then copy the JSX from the Code tab.',
    },
    {
      q: 'Can I make morphing text with CSS alone?',
      a: 'Not this effect. The look is CSS - the letter blur, the colour and the hairline all read from --morphing-text-* custom properties you can retune - but the per-letter stagger, the SVG threshold strength and the rule that stretches between the two word widths are measured and driven in JavaScript every frame. A pure CSS text animation can cross-fade two words; it cannot pool their letterforms.',
    },
    {
      q: 'Is the morphing text accessible and does it respect reduced motion?',
      a: 'Yes. The current word is rendered as real text in a visually hidden label for screen readers while the animated stage is aria-hidden, so assistive tech reads one word instead of a stream of letters. Under prefers-reduced-motion the loop never starts and the first word shows as still, unblurred type.',
    },
  ],
};

export default seo;
