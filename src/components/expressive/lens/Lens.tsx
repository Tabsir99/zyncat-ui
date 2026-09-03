'use client';

import './lens.css';

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { loop } from '../../../engine';
import type { LensStyle } from '../../../tokens/component-styles.generated';
import { UIMotion } from '../../../tokens/motion-tokens';
import { cx } from '../../internal/utils/cx';

const RADIUS_MIN = 60;
const RADIUS_MAX = 260;
const MAGNIFICATION_MIN = 1.2;
const MAGNIFICATION_MAX = 6;
const RIM_CROWD = 0.3;
const MAX_STEP = 3;
const MOVE_THRESHOLD = 0.4;
const SPEED_REFERENCE = 26;
const SPEED_SMOOTHING = 0.25;
const MAGNIFICATION_EASE = 0.24;
const OPACITY_EASE = 0.2;
const PRESS_EASE = 0.28;
const PRESS_SCALE = 0.035;
const SHADOW_LIFT_BASE = 10;
const SHADOW_LIFT_SPEED = 18;
const SHADOW_LIFT_PRESS = 6;
const SHADOW_BLUR_BASE = 26;
const SHADOW_BLUR_SPEED = 26;
const SHADOW_BLUR_PRESS = 12;
const SHADOW_ALPHA_BASE = 0.26;
const SHADOW_ALPHA_PRESS = 0.08;
const FRINGE_BASE = 0.34;
const FRINGE_SPEED = 0.5;
const SPECULAR_ORBIT_BASE = 0.46;
const SPECULAR_ORBIT_SPEED = 0.1;
const SPECULAR_WIDTH = 1.05;
const SPECULAR_HEIGHT = 0.44;
const SPECULAR_OPACITY_BASE = 0.16;
const SPECULAR_OPACITY_SPEED = 0.44;
const RECLONE_INTERVAL_MS = 90;
const KEYBOARD_STEP = 24;
const ACTIVE_CLASS = 'lens--active';

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);

interface Optics {
  pointerX: number;
  pointerY: number;
  centreX: number;
  centreY: number;
  magnification: number;
  opacity: number;
  engaged: number;
  pressed: number;
  press: number;
  speed: number;
  angle: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  acquired: boolean;
  dirty: boolean;
  sinceClone: number;
}

interface Parts {
  stage: HTMLElement;
  content: HTMLElement;
  glass: HTMLElement;
  core: HTMLElement;
  rim: HTMLElement;
  fringe: HTMLElement;
  specular: HTMLElement;
  ring: HTMLElement;
}

function cloneInto(host: HTMLElement, content: HTMLElement, width: number, height: number) {
  host.textContent = '';
  const copy = content.cloneNode(true) as HTMLElement;
  copy.setAttribute('aria-hidden', 'true');
  copy.classList.add('lens__copy');
  if (width && height) {
    copy.style.width = `${width}px`;
    copy.style.height = `${height}px`;
  }
  host.appendChild(copy);
}

function measure(parts: Parts, optics: Optics) {
  const box = parts.content.getBoundingClientRect();
  if (!box.width || !box.height) return;
  optics.width = box.width;
  optics.height = box.height;
  const host = (parts.glass.offsetParent as HTMLElement | null) ?? parts.stage;
  const hostBox = host.getBoundingClientRect();
  optics.offsetX = box.left - hostBox.left;
  optics.offsetY = box.top - hostBox.top;
  for (const layer of [parts.core, parts.rim]) {
    const copy = layer.firstElementChild as HTMLElement | null;
    if (copy) {
      copy.style.width = `${box.width}px`;
      copy.style.height = `${box.height}px`;
    }
  }
}

function paint(parts: Parts, optics: Optics, radius: number, chromatic: boolean) {
  const magnification = Math.max(1, optics.magnification);
  const speed = Math.min(1, optics.speed / SPEED_REFERENCE);
  const press = optics.press;

  parts.glass.style.width = `${radius * 2}px`;
  parts.glass.style.height = `${radius * 2}px`;
  parts.glass.style.opacity = optics.opacity.toFixed(3);
  parts.glass.style.translate = `${optics.offsetX + optics.centreX - radius}px ${optics.offsetY + optics.centreY - radius}px`;
  parts.glass.style.scale = String(1 - press * PRESS_SCALE);

  const place = (layer: HTMLElement, scale: number) => {
    const copy = layer.firstElementChild as HTMLElement | null;
    if (!copy) return;
    copy.style.left = `${-(optics.centreX - radius)}px`;
    copy.style.top = `${-(optics.centreY - radius)}px`;
    copy.style.transformOrigin = `${optics.centreX}px ${optics.centreY}px`;
    copy.style.scale = String(scale);
  };
  place(parts.core, magnification);
  place(parts.rim, magnification + RIM_CROWD * (magnification - 1));

  parts.fringe.style.opacity = chromatic ? (FRINGE_BASE + speed * FRINGE_SPEED).toFixed(3) : '0';

  const lift = SHADOW_LIFT_BASE + speed * SHADOW_LIFT_SPEED - press * SHADOW_LIFT_PRESS;
  const blur = SHADOW_BLUR_BASE + speed * SHADOW_BLUR_SPEED - press * SHADOW_BLUR_PRESS;
  parts.ring.style.setProperty('--_lens-lift', lift.toFixed(2));
  parts.ring.style.setProperty('--_lens-blur', blur.toFixed(2));
  parts.ring.style.setProperty('--_lens-shadow-alpha', (SHADOW_ALPHA_BASE + press * SHADOW_ALPHA_PRESS).toFixed(3));

  const trailing = optics.angle + Math.PI;
  const orbit = radius * (SPECULAR_ORBIT_BASE + speed * SPECULAR_ORBIT_SPEED);
  parts.specular.style.width = `${radius * SPECULAR_WIDTH}px`;
  parts.specular.style.height = `${radius * SPECULAR_HEIGHT}px`;
  parts.specular.style.opacity = (SPECULAR_OPACITY_BASE + speed * SPECULAR_OPACITY_SPEED).toFixed(3);
  parts.specular.style.translate = `calc(-50% + ${(Math.cos(trailing) * orbit).toFixed(1)}px) calc(-50% + ${(Math.sin(trailing) * orbit).toFixed(1)}px)`;
  parts.specular.style.rotate = `${((trailing * 180) / Math.PI).toFixed(1)}deg`;
}

export interface LensOwnProps {
  /** The specimen the glass magnifies. It stays in the accessibility tree; the magnified copy is aria-hidden. */
  children: ReactNode;
  /** How much the glass magnifies, clamped to 1.2-6. @default 2.6 */
  magnification?: number;
  /** Glass radius in pixels, clamped to 60-260. @default 132 */
  radius?: number;
  /** Chromatic fringing at the rim, which strengthens with travel speed. @default true */
  chromatic?: boolean;
  /** Extra class(es) merged onto the stage. */
  className?: string;
  /** Inline styles merged onto the stage. */
  style?: LensStyle;
}

export interface LensProps extends LensOwnProps {
  /** Standard <div> attributes (aria-*, data-*, title, ...) forwarded to the stage. */
  htmlProps?: Omit<HTMLAttributes<HTMLDivElement>, keyof LensOwnProps> & DataAttributes;
}

export function Lens({
  children,
  magnification = 2.6,
  radius = 132,
  chromatic = true,
  className = '',
  style,
  htmlProps,
}: LensProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const fringeRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const settings = useRef({ magnification, radius, chromatic });

  useEffect(() => {
    settings.current = { magnification, radius, chromatic };
  }, [magnification, radius, chromatic]);

  useEffect(() => {
    const parts: Parts | null =
      stageRef.current &&
      contentRef.current &&
      glassRef.current &&
      coreRef.current &&
      rimRef.current &&
      fringeRef.current &&
      specularRef.current &&
      ringRef.current
        ? {
            stage: stageRef.current,
            content: contentRef.current,
            glass: glassRef.current,
            core: coreRef.current,
            rim: rimRef.current,
            fringe: fringeRef.current,
            specular: specularRef.current,
            ring: ringRef.current,
          }
        : null;
    if (!parts) return;

    const optics: Optics = {
      pointerX: 0,
      pointerY: 0,
      centreX: 0,
      centreY: 0,
      magnification: 1,
      opacity: 0,
      engaged: 0,
      pressed: 0,
      press: 0,
      speed: 0,
      angle: 0,
      width: 0,
      height: 0,
      offsetX: 0,
      offsetY: 0,
      acquired: false,
      dirty: false,
      sinceClone: 0,
    };

    const reduced = UIMotion.reduced;
    const currentRadius = () => clamp(settings.current.radius, RADIUS_MIN, RADIUS_MAX);
    const currentMagnification = () => clamp(settings.current.magnification, MAGNIFICATION_MIN, MAGNIFICATION_MAX);

    const rebuild = () => {
      const box = parts.content.getBoundingClientRect();
      cloneInto(parts.core, parts.content, box.width, box.height);
      cloneInto(parts.rim, parts.content, box.width, box.height);
      measure(parts, optics);
    };

    const render = () => paint(parts, optics, currentRadius(), settings.current.chromatic);

    const settleNow = () => {
      optics.magnification = optics.engaged ? currentMagnification() : 1;
      optics.opacity = optics.acquired && optics.engaged ? 1 : 0;
      optics.press = optics.pressed;
      optics.centreX = optics.pointerX;
      optics.centreY = optics.pointerY;
      optics.speed = 0;
      render();
    };

    rebuild();

    const mutations = new MutationObserver(() => {
      optics.dirty = true;
      if (reduced) {
        rebuild();
        settleNow();
      }
    });
    mutations.observe(parts.content, { childList: true, subtree: true, characterData: true, attributes: true });

    const resizes = new ResizeObserver(() => {
      measure(parts, optics);
      if (reduced) settleNow();
    });
    resizes.observe(parts.content);

    const controller = new AbortController();
    const signal = controller.signal;

    const acquire = (clientX: number, clientY: number) => {
      const box = parts.content.getBoundingClientRect();
      optics.pointerX = clientX - box.left;
      optics.pointerY = clientY - box.top;
      if (!optics.acquired) {
        measure(parts, optics);
        optics.acquired = true;
        optics.centreX = optics.pointerX;
        optics.centreY = optics.pointerY;
      }
      optics.engaged = 1;
      parts.stage.classList.add(ACTIVE_CLASS);
      if (reduced) settleNow();
    };

    const disengage = () => {
      optics.engaged = 0;
      optics.pressed = 0;
      parts.stage.classList.remove(ACTIVE_CLASS);
      if (reduced) settleNow();
    };

    const track = (event: PointerEvent | MouseEvent) => acquire(event.clientX, event.clientY);

    parts.stage.addEventListener('pointermove', track, { signal });
    parts.stage.addEventListener(
      'pointerdown',
      (event) => {
        track(event);
        optics.pressed = 1;
        if (reduced) settleNow();
      },
      { signal },
    );
    parts.stage.addEventListener('pointerleave', disengage, { signal });
    window.addEventListener(
      'pointerup',
      () => {
        optics.pressed = 0;
        if (reduced) settleNow();
      },
      { signal },
    );

    parts.stage.addEventListener(
      'keydown',
      (event) => {
        const step =
          event.key === 'ArrowLeft'
            ? [-KEYBOARD_STEP, 0]
            : event.key === 'ArrowRight'
              ? [KEYBOARD_STEP, 0]
              : event.key === 'ArrowUp'
                ? [0, -KEYBOARD_STEP]
                : event.key === 'ArrowDown'
                  ? [0, KEYBOARD_STEP]
                  : null;
        if (step) {
          event.preventDefault();
          if (!optics.acquired) {
            measure(parts, optics);
            optics.acquired = true;
            optics.pointerX = optics.width / 2;
            optics.pointerY = optics.height / 2;
            optics.centreX = optics.pointerX;
            optics.centreY = optics.pointerY;
          } else {
            optics.pointerX = clamp(optics.pointerX + step[0], 0, optics.width);
            optics.pointerY = clamp(optics.pointerY + step[1], 0, optics.height);
          }
          optics.engaged = 1;
          parts.stage.classList.add(ACTIVE_CLASS);
          if (reduced) settleNow();
          return;
        }
        if (event.key === 'Escape' && optics.engaged) {
          event.preventDefault();
          disengage();
        }
      },
      { signal },
    );

    parts.stage.addEventListener('blur', disengage, { signal });

    const playback = loop(
      (k, dt) => {
        const step = Math.min(MAX_STEP, k);
        optics.sinceClone += dt;
        if (optics.dirty && optics.sinceClone > RECLONE_INTERVAL_MS) {
          optics.dirty = false;
          optics.sinceClone = 0;
          rebuild();
        }

        const previousX = optics.centreX;
        const previousY = optics.centreY;
        optics.centreX = optics.pointerX;
        optics.centreY = optics.pointerY;
        const travelled = Math.hypot(optics.centreX - previousX, optics.centreY - previousY);
        optics.speed += (travelled - optics.speed) * SPEED_SMOOTHING * step;
        if (travelled > MOVE_THRESHOLD)
          optics.angle = Math.atan2(optics.centreY - previousY, optics.centreX - previousX);

        const target = optics.engaged ? currentMagnification() : 1;
        optics.magnification += (target - optics.magnification) * MAGNIFICATION_EASE * step;
        optics.opacity += ((optics.acquired && optics.engaged ? 1 : 0) - optics.opacity) * OPACITY_EASE * step;
        optics.press += (optics.pressed - optics.press) * PRESS_EASE * step;
        render();
      },
      { el: parts.stage, snap: render },
    );

    return () => {
      playback.stop();
      mutations.disconnect();
      resizes.disconnect();
      controller.abort();
    };
  }, []);

  return (
    <div ref={stageRef} className={cx('lens', className)} style={style} tabIndex={0} {...htmlProps}>
      <div ref={contentRef} className="lens__content">
        {children}
      </div>
      <div ref={glassRef} className="lens__glass" aria-hidden="true">
        <div ref={coreRef} className="lens__core" />
        <div ref={rimRef} className="lens__rim" />
        <div ref={fringeRef} className="lens__fringe" />
        <div className="lens__vignette" />
        <div ref={specularRef} className="lens__specular" />
        <div ref={ringRef} className="lens__ring" />
      </div>
    </div>
  );
}
