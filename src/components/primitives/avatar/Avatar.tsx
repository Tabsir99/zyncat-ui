'use client';

import './avatar.css';

import { useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { cx } from '../../internal/utils/cx';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';
export type AvatarPaletteIndex = 1 | 2 | 3 | 4 | 5 | 6;

interface AvatarOwnProps {
  /** Image URL. Falls back to initials / icon / silhouette if absent or fails. */
  src?: string | null;
  /** Display name - drives initials generation, palette hash, and aria-label. */
  name?: string | null;
  /** Content override - any React node (e.g. <Icon name="globe" />). */
  icon?: ReactNode | null;
  /** 'circle' for people; 'square' for channels / brand pages. Default 'circle'. */
  shape?: AvatarShape;
  /** Size step. Default 'md' (32 px). */
  size?: AvatarSize;
  /** Presence indicator dot at bottom-right. Default null (hidden). */
  status?: AvatarStatus | null;
  /** Override identity slot 1-6 (blue - violet - plum - rose - clay - moss); auto from name hash when null, neutral when anonymous. */
  paletteIndex?: AvatarPaletteIndex | null;
  /** Extra class(es) merged onto the root. */
  className?: string;
  /** Inline styles merged onto the root. */
  style?: CSSProperties;
}

export interface AvatarProps extends AvatarOwnProps {
  /** Standard <span> attributes (onClick, title, data-*, ...) forwarded to the root. */
  htmlProps?: Omit<HTMLAttributes<HTMLSpanElement>, keyof AvatarOwnProps> & DataAttributes;
}

const PALETTE_SLOTS = 6;

function hashName(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return (Math.abs(h) % PALETTE_SLOTS) + 1;
}

function initialsOf(name: string | null, max: number) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1 || max === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Silhouette() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.8" fill="currentColor" />
      <path d="M4 20.5C4 16.1 7.6 13 12 13s8 3.1 8 7.5" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

export function Avatar({
  src = null,
  name = null,
  icon = null,
  shape = 'circle',
  size = 'md',
  status = null,
  paletteIndex = null,
  className = '',
  style = {},
  htmlProps,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImg = Boolean(src) && !imgError;

  const maxInits = size === 'xs' ? 1 : 2;
  const inits = initialsOf(name, maxInits);
  const slot = paletteIndex ?? (name ? hashName(name) : null);

  const cls = cx('avatar', size !== 'md' && `avatar--${size}`, shape === 'square' && 'avatar--square', className);

  return (
    <span
      className={cls}
      role={name ? 'img' : undefined}
      aria-label={name || undefined}
      data-palette={!showImg && slot != null ? slot : undefined}
      style={style}
      {...htmlProps}
    >
      <span className="avatar__face">
        {showImg && (
          <img className="avatar__img" src={src} alt={name || ''} onError={() => setImgError(true)} draggable={false} />
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
            <Silhouette />
          </span>
        )}
      </span>

      {status && (
        <span className={`avatar__status avatar__status--${status}`} role="img" aria-label={status} title={status} />
      )}
    </span>
  );
}
