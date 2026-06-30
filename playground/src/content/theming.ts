import type { ComponentDoc } from './types';

export const theming: Record<string, ComponentDoc> = {
  theming: {
    example: `/* Load after premium-ds/styles.css. Override tokens, never fork. */
:root {
  --accent: oklch(0.55 0.2 285);
  --radius-md: 10px;
}

[data-theme='dark'] {
  --bg-app: oklch(0.17 0.01 260);
}`,
    props: [
      {
        name: '--space-1..10',
        type: 'spacing',
        description: 'Spacing scale on a 4px base. Drives gaps, padding, and layout rhythm.',
      },
      {
        name: '--type-*',
        type: 'typography',
        description: 'Type role bundles: display, title, heading, body, caption, mono.',
      },
      {
        name: '--bg-*, --text-*, --border-*',
        type: 'color',
        description: 'Surface, text, and border ramps that respond to the active theme.',
      },
      {
        name: '--accent, --text-accent',
        type: 'color',
        description: 'Accent hue applied across interactive and selected states.',
      },
      {
        name: '--radius-md, --radius-lg, --radius-xl',
        type: 'radius',
        description: 'Corner radii for controls and surfaces.',
      },
      {
        name: '--shadow-xs..xl',
        type: 'elevation',
        description: 'Elevation ramp. Never hand-roll shadows.',
      },
      {
        name: '--duration-*, --ease-*',
        type: 'motion',
        description: 'Motion timing and easing tokens shared by CSS and JS.',
      },
    ],
  },
};
