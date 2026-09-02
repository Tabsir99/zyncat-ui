import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Auto-Resize Textarea',
  description:
    'A React textarea that grows as you type up to a row cap, then scrolls, with a character meter, an over-limit highlight and a Cmd+Enter submit.',
  keywords: [
    'textarea',
    'react textarea',
    'auto resize textarea',
    'auto grow textarea',
    'textarea component',
    'character counter',
    'character limit textarea',
    'html textarea',
  ],
  lede: 'A textarea that grows as you type, with a character meter and a Cmd+Enter submit shortcut. For composers.',
  faq: [
    {
      q: 'Does Textarea grow automatically as you type?',
      a: "Yes - it starts at minRows (default 3) and grows on every keystroke up to maxRows (default 10), then switches to an internal scrollbar. A ResizeObserver also re-measures it whenever the field's own width changes, such as a sidebar collapsing.",
    },
    {
      q: 'How do I submit on Cmd+Enter or Ctrl+Enter?',
      a: 'Pass onSubmit - it fires with the current text on Cmd+Enter or Ctrl+Enter, and the keystroke is prevented from inserting a newline. Pair it with hint="Cmd+Enter to submit" to surface the shortcut in the footer.',
    },
    {
      q: 'Does the character limit stop me from typing more?',
      a: 'No - max is a soft limit. Past it, the extra characters get a danger-tinted highlight and underline right in the text and the ring meter turns red, but nothing is truncated; for a hard stop, forward the native maxLength through htmlProps.',
    },
    {
      q: 'When does the character counter turn amber or red?',
      a: "It turns amber once warnAt characters remain (default 20), and switches to the danger color once you're past max. The count itself also flips from 'count / max' to a plain countdown of characters left as soon as you enter the warning zone.",
    },
  ],
};

export default seo;
