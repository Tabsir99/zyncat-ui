// aliases.ts — OPTIONAL semantic shortcuts for <Icon> (open & additive).
// ─────────────────────────────────────────────────────────────────────────
// These let the product say what it MEANS ("publish") instead of which glyph
// ("paper-plane-tilt"). They are NOT a closed set — any Phosphor name works
// directly too. Add aliases freely as the app grows; they only ever expand the
// convenience layer, never restrict it.
//
// value = the Phosphor React export name (PascalCase).

export const aliases: Record<string, string> = {
  // actions
  new: 'Plus',
  search: 'MagnifyingGlass',
  filter: 'Funnel',
  settings: 'Gear',
  upload: 'UploadSimple',
  edit: 'PencilSimple',
  duplicate: 'Copy',
  delete: 'Trash',
  more: 'DotsThreeOutline',
  close: 'X',
  // domain
  schedule: 'Calendar',
  time: 'Clock',
  publish: 'PaperPlaneTilt',
  reschedule: 'ArrowsClockwise',
  comments: 'ChatCircle',
  analytics: 'ChartBar',
  notifications: 'Bell',
  team: 'Users',
  channel: 'ShareNetwork',
  facebook: 'FacebookLogo',
  // content types
  image: 'Image',
  video: 'VideoCamera',
  // post status
  published: 'CheckCircle',
  scheduled: 'ClockCountdown',
  draft: 'NotePencil',
  failed: 'WarningCircle',
};
