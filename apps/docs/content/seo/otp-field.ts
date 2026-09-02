import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React OTP Input & Verification Screen UI',
  description:
    'React OTP input for verification screens: segmented one-time-code slots that auto-advance and fill whole from a pasted code. React 19, zero dependencies.',
  keywords: [
    'otp screen',
    'otp verification ui',
    'otp screen ui',
    'otp verification screen',
    'otp ui',
    'react otp input',
    'otp form',
    'otp verification ui design',
    'otp template',
    'react-otp-input',
    'otp verification page',
    'otp screen ui design',
    'otp input',
    'otp input react',
    'react otp',
  ],
  lede: 'A React OTP input whose slots auto-advance and fill from a pasted code. For sign-in and phone verification.',
  faq: [
    {
      q: 'How do I make an OTP verification input in React?',
      a: "Import OtpField from '@zyncat/ui/otp-field' and give it a value and an onChange: <OtpField length={6} group={3} value={code} onChange={setCode} />. length is the number of slots and group drops a separator every N of them, so group={3} renders 000-000. It ships compiled ESM with its 'use client' directive intact, so it drops straight into the Next.js App Router.",
    },
    {
      q: 'What should an OTP verification screen look like?',
      a: 'One monospaced slot per digit, wide enough to read at a glance and grouped so the code is scannable - OtpField draws 44x52px slots with a 10x2px dash between each group, or 38x44px under size="sm". The slot borders firm up as digits land, so the screen shows its own progress without a separate counter.',
    },
    {
      q: 'Does pasting a code fill every slot at once?',
      a: 'Yes. The paste handler strips everything that is not a digit and writes the rest across the slots from wherever you pasted, then leaves the caret where the code ran out - so pasting 492-013 straight out of a message fills all six and the dash is dropped for you. Typing works the same way one digit at a time: each entry advances to the next slot, and Backspace on an empty slot clears the one before it.',
    },
    {
      q: 'How do I autofill an SMS verification code on iPhone?',
      a: 'Every slot carries autocomplete="one-time-code", the attribute iOS and Safari look for before offering the code from a just-received SMS above the keyboard. Slots also set inputMode="numeric", so phones raise the number pad instead of the full keyboard, and non-digits are rejected on the way in.',
    },
    {
      q: 'How do I show an error when the code is wrong?',
      a: 'Pass error. Every slot turns to the danger border, the focus ring swaps to the danger ring, and each input gets aria-invalid so a screen reader announces the failure rather than leaving it as colour only. Pair it with disabled while the code is in flight to the server.',
    },
    {
      q: 'How is this different from react-otp-input or input-otp?',
      a: 'Those are single-purpose packages you bolt onto a project. OtpField is one field inside a design system that already ships the labels, buttons and dialogs around it, and it adds no runtime dependencies of its own. Styling is CSS custom properties rather than Tailwind classes, so changing a slot is a token override instead of a className rewrite.',
    },
  ],
};

export default seo;
