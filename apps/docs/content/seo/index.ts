import confetti from './confetti';
import dateField from './date-field';
import dateRange from './date-range';
import datetimeField from './datetime-field';
import emojiPicker from './emoji-picker';
import facebookFeed from './facebook-feed';
import flowField from './flow-field';
import instagramFeed from './instagram-feed';
import installation from './installation';
import introduction from './introduction';
import lens from './lens';
import mcp from './mcp';
import morphingText from './morphing-text';
import multiSelect from './multi-select';
import odometer from './odometer';
import otpField from './otp-field';
import select from './select';
import table from './table';
import theming from './theming';
import tiktok from './tiktok';
import timeField from './time-field';
import type { PageSeo } from './types';
import typingLines from './typing-lines';
import weightField from './weight-field';
import youtube from './youtube';

export const SEO: Record<string, PageSeo> = {
  confetti,
  'date-field': dateField,
  'date-range': dateRange,
  'datetime-field': datetimeField,
  'emoji-picker': emojiPicker,
  'facebook-feed': facebookFeed,
  'flow-field': flowField,
  installation,
  'instagram-feed': instagramFeed,
  introduction,
  lens,
  mcp,
  'morphing-text': morphingText,
  'multi-select': multiSelect,
  odometer,
  'otp-field': otpField,
  select,
  table,
  theming,
  tiktok,
  'time-field': timeField,
  'typing-lines': typingLines,
  'weight-field': weightField,
  youtube,
};

export type { PageSeo, SeoFaq } from './types';
