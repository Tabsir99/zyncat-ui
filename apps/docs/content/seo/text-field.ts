import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Text Input Component',
  description:
    'A React text input component with a leading icon slot, a clear button, and error, warning and success states that slide open under the field.',
  keywords: [
    'text field',
    'react text field',
    'react text input',
    'text input component',
    'input field',
    'input type text',
    'clearable input',
  ],
  lede: 'A single-line text input with an icon slot and a clear button. For any short-answer form field.',
  faq: [
    {
      q: 'How do I add a clear button to a React text input?',
      a: "Set clearable - a small button appears once the field has a value and isn't disabled or readOnly. Clicking it resets the native input through a real dispatched input event, so a controlled onChange still fires, then returns focus to the field.",
    },
    {
      q: 'How do I show a validation error on a text field?',
      a: 'Pass error as the message text - the border and message icon switch to the danger color and the message itself slides open under the field through a Collapse instead of jumping into place. error wins over warning, warning wins over success, and success wins over the neutral helper text, so only one shows at a time.',
    },
    {
      q: 'Can I put an icon inside the text input?',
      a: "Yes - leadingIcon takes any node and pins it to the left edge, sized to match the control. There's no separate trailing-icon prop, since that slot is reserved for the built-in clear button when clearable is set.",
    },
    {
      q: 'Does TextField support password, email or search inputs?',
      a: 'Yes - type accepts text (default), search, email, url or password, and it renders straight through to a native <input type="...">, so browser autofill, validation and password managers behave exactly as they do on plain HTML.',
    },
  ],
};

export default seo;
