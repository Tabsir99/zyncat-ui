'use client';

// Avatar.jsx — user and member identity mark.
// ─────────────────────────────────────────────────────────────────────────
// Content priority: src image → icon prop → initials (from name) → silhouette.
// Image failures fall back to initials automatically via React state.
//
// Palette: six reserved identity slots (tokens/avatar.css),
// auto-derived from a hash of `name` so colour is consistent per person across
// sessions. Override with `paletteIndex` (1–6). No name and no override → neutral.
//
// shape="circle" — people, users, members (default)
// shape="square" — channels, brand pages (Facebook Page, Instagram account)
//
// Usage:
//   <Avatar name="Nadia Petrov" size="lg" status="online" />
//   <Avatar src="/photos/nadia.jpg" name="Nadia Petrov" size="md" />
//   <Avatar name="Acme Store" shape="square" icon={<Icon name="globe" />} />
//   <Avatar />   ← anonymous, shows user silhouette

import * as React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';
export type AvatarPaletteIndex = 1 | 2 | 3 | 4 | 5 | 6;

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials / icon / silhouette if absent or fails. */
  src?: string | null;
  /** Display name — drives initials generation, palette hash, and aria-label. */
  name?: string | null;
  /** Content override — any React node (e.g. <Icon name="globe" />). */
  icon?: React.ReactNode | null;
  /** 'circle' for people; 'square' for channels / brand pages. Default 'circle'. */
  shape?: AvatarShape;
  /** Size step. Default 'md' (32 px). */
  size?: AvatarSize;
  /** Presence indicator dot at bottom-right. Default null (hidden). */
  status?: AvatarStatus | null;
  /** Override identity slot 1–6 (blue · violet · plum · rose · clay · moss).
   *  Auto-derived from name hash when null; neutral when anonymous. */
  paletteIndex?: AvatarPaletteIndex | null;
}

const _PALETTE_SLOTS = 6;

function _hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return (Math.abs(h) % _PALETTE_SLOTS) + 1; // → 1–6
}

function _initials(name: string | null, max: number) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1 || max === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Generic silhouette — shown when no name, src, or icon is provided
function _Silhouette() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.8" fill="currentColor" />
      <path d="M4 20.5C4 16.1 7.6 13 12 13s8 3.1 8 7.5" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

export function Avatar({
  src = null, // image URL — falls back gracefully on error
  name = null, // display name → initials + palette hash + aria-label
  icon = null, // ReactNode override (e.g. <Icon name="globe" />)
  shape = 'circle', // 'circle' | 'square'
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status = null, // null | 'online' | 'away' | 'busy' | 'offline'
  paletteIndex = null, // 1–6; auto-derived from name hash when null
  className = '',
  style = {},
  ...rest
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const showImg = Boolean(src) && !imgError;

  const maxInits = size === 'xs' ? 1 : 2;
  const inits = _initials(name, maxInits);
  // Slot via data attribute (CSS owns the colours); neutral when anonymous
  const slot = paletteIndex ?? (name ? _hash(name) : null);

  const classes = [
    'avatar',
    size !== 'md' ? `avatar--${size}` : '',
    shape === 'square' ? 'avatar--square' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      role={name ? 'img' : undefined}
      aria-label={name || undefined}
      data-palette={!showImg && slot != null ? slot : undefined}
      style={style}
      {...rest}
    >
      <span className="avatar__face">
        {showImg && (
          <img
            className="avatar__img"
            src={src}
            alt={name || ''}
            onError={() => setImgError(true)}
            draggable={false}
          />
        )}
        {!showImg && icon && (
          <span className="avatar__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {!showImg && !icon && inits && (
          <span className="avatar__initials" aria-hidden="true">
            {inits}
          </span>
        )}
        {!showImg && !icon && !inits && (
          <span className="avatar__icon" aria-hidden="true">
            <_Silhouette />
          </span>
        )}
      </span>

      {status && (
        <span
          className={`avatar__status avatar__status--${status}`}
          role="img"
          aria-label={status}
          title={status}
        />
      )}
    </span>
  );
}
