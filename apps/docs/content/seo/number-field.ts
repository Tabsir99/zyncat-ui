import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Number Input Component',
  description:
    'A React number input with caret steppers, a unit suffix and min/max clamping - typing, arrow keys and stepper clicks all stay inside the range.',
  keywords: [
    'number field',
    'react number field',
    'react number input',
    'number input component',
    'input type number',
    'stepper input',
    'numeric input',
  ],
  lede: 'A numeric input with caret steppers, a unit suffix and min/max clamping. For quantities, prices and counts.',
  faq: [
    {
      q: 'How do I clamp a number input to a min and max in React?',
      a: 'Pass min (default 0) and max (default Infinity) - typing, the arrow keys and the caret steppers all clamp into that range, and the stepper buttons themselves disable once the value reaches either bound.',
    },
    {
      q: "How do I add a unit suffix like 'kg' or '%' to a number field?",
      a: 'Pass unit as a string, e.g. <NumberField unit="users" /> - it renders inside the field, between the digits and the stepper column, without becoming part of the number onChange returns.',
    },
    {
      q: 'Is NumberField a native <input type="number">?',
      a: 'No - it renders <input type="text" inputMode="decimal"> with its own digit filter and caret steppers, which sidesteps the native number input\'s scroll-to-change behavior and inconsistent spin buttons, while inputMode="decimal" still raises the numeric keypad on mobile.',
    },
    {
      q: 'How do I control the step size, like 0.5 or 10?',
      a: 'Pass step (default 1) - decimals work, so step={0.5} is valid - and it sets how much each arrow-key press or stepper click adds or removes. Typed values are still clamped to min/max but are not rounded to the step.',
    },
  ],
};

export default seo;
