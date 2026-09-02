import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'Typing Animation & React Typewriter Effect',
  description:
    'A React typing animation for multiple lines: each types itself, holds, then deletes. A typewriter effect with a real blinking caret and zero dependencies.',
  keywords: [
    'typed js',
    'typing animation',
    'typewriter effect',
    'typing effect',
    'typing animation css',
    'typewriter animation',
    'css typing animation',
    'typing text animation',
    'text typing animation',
    'typewriter effect css',
    'react typewriter effect',
    'css typewriter effect',
    'typewriter-effect',
    'react typewriter',
    'typewriter effect react',
  ],
  lede: 'A React typing animation component that types each line, holds, then deletes it. For headlines and terminals.',
  faq: [
    {
      q: 'How do I add a typing animation to a React or Next.js page?',
      a: "Import it per subpath and pass the lines: import { TypingLines } from '@zyncat/ui/typing-lines', then <TypingLines lines={['Design every state.', 'Ship the polish.']} />. It is a client component, so it drops straight into the Next.js App Router; link @zyncat/ui/styles.css once at the root for the tokens.",
    },
    {
      q: 'Can I make a typewriter effect with CSS alone?',
      a: 'Only a limited one. The classic CSS typewriter animates a width in steps() behind a border-right caret, so it needs one fixed-width line of monospace and it cannot delete a line or move on to the next. Here CSS owns the look - ink, size, weight, leading, caret gap and the step-end blink all read from --typing-lines-* custom properties - while the character timing, the deletion and the line sequence are driven in JavaScript.',
    },
    {
      q: 'Is this a typewriter effect generator like the ones for Premiere Pro, Canva or TikTok?',
      a: 'No - it is a React component that types live DOM text on a web page, not a GIF, a Lottie file, or an After Effects, Premiere Pro, DaVinci Resolve, Canva or CapCut preset, so the words stay selectable text rather than pixels. The playground on this page is the generator: set the unit, caret and speed, then copy the JSX from the Code tab.',
    },
    {
      q: 'Is this a typed.js alternative for React?',
      a: 'Yes. lines is the equivalent of the typed.js strings array, and the sequence loops on its own with no loop flag, so you do not need typed.js, react-simple-typewriter or react-type-animation alongside it. It is a React 19 component with zero runtime dependencies, not a wrapper around a standalone JS library.',
    },
    {
      q: 'Can I change the typing speed, the caret, or type word by word?',
      a: "Yes. unit switches between 'character' - one letter every 54ms, the default - and 'word', where a whole word fades and rises into place at a time. caret picks 'line', 'block', 'underscore' or 'none', and 'none' suits word reveals, where nothing is pending between words; speed multiplies the whole cycle, including the 2.4s hold on a finished line, and is sampled live on every frame, so moving a slider retimes a line already being typed.",
    },
    {
      q: 'Is the typing animation accessible and does it respect reduced motion?',
      a: 'Yes. The full current line is rendered as real text in a visually hidden label for screen readers while the animated text and the caret are aria-hidden, so assistive tech reads one sentence instead of a stream of letters. Under prefers-reduced-motion the loop never starts and the first line shows complete and still, and the animation pauses on its own whenever the element scrolls out of view or the tab is hidden.',
    },
  ],
};

export default seo;
