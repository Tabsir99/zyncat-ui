import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Toggle Switch Component',
  description:
    'A React toggle switch component for settings that apply immediately - a spring-driven thumb, independent press feedback, and sm/md track sizes.',
  keywords: [
    'toggle switch',
    'react toggle',
    'react toggle switch',
    'switch component',
    'toggle component',
    'on off switch',
    'settings toggle',
  ],
  lede: 'A switch that flips a setting immediately, with a spring-driven thumb. For settings that apply on the spot.',
  faq: [
    {
      q: 'Is Toggle a checkbox or a switch, semantically?',
      a: 'Both - the underlying element is <input type="checkbox" role="switch">, so assistive tech announces it as a switch while it still behaves like a checkbox for checked, onChange and form semantics.',
    },
    {
      q: 'How does the press feedback work, separately from flipping it on or off?',
      a: 'Pointer down sets an internal pressed flag independent of the checked state - the track scales to 0.96 and the thumb stretches to scaleX(1.16) for the duration of the press, then both spring back on pointer up, leave or cancel, whether or not the flip itself happened too.',
    },
    {
      q: 'How do I use Toggle as an uncontrolled component?',
      a: 'Omit checked and pass defaultChecked instead - it still calls onChange on every flip, but the component holds its own on/off state internally rather than requiring you to store it yourself.',
    },
    {
      q: 'What sizes does Toggle come in?',
      a: 'size="md" (the default) is a 36x20px track, and "sm" is 28x16px for dense settings or table rows - the thumb and how far it travels both derive from the track size, so nothing needs retuning separately.',
    },
  ],
};

export default seo;
