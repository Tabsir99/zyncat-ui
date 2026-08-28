'use client';

import './confetti.css';

import { useEffect, useImperativeHandle, useRef, type CSSProperties, type HTMLAttributes, type Ref } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { loop, type Playback } from '../../../engine';
import { cx } from '../../internal/utils/cx';

const TAU = Math.PI * 2;
const MS_PER_SECOND = 1000;

const MAX_PIECES = 520;
const MIN_COUNT = 1;
const DEFAULT_COUNT = 170;
const DEFAULT_DURATION = 0.15;
const MAX_DURATION = 10;
const EMISSION_EASE = 1.8;
const PIXEL_RATIO_CAP = 2;

const PAPER_SLOTS = 5;
const DEFAULT_WEIGHT = 1;
const PAPER_KEYS = Array.from({ length: PAPER_SLOTS }, (_, i) => `--confetti-paper-${i + 1}`);
const REVERSE_KEYS = Array.from({ length: PAPER_SLOTS }, (_, i) => `--confetti-reverse-${i + 1}`);
const SHEEN_KEYS = Array.from({ length: PAPER_SLOTS }, (_, i) => `--confetti-sheen-${i + 1}`);
const WEIGHTS_KEY = '--confetti-weights';

const SCALE_REFERENCE = 700;
const SCALE_MIN = 0.72;
const SCALE_MAX = 1.6;

const DEPTH_NEAR = 2;
const DEPTH_FAR_SHARE = 0.34;
const DEPTH_MID_SHARE = 0.6;
const DEPTH_SIZE = [0.62, 0.88, 1.16];
const DEPTH_ALPHA = [0.52, 0.8, 1];
const DEPTH_GRAVITY = [0.86, 1, 1.13];
const DEPTH_DRAG = [1.14, 1, 0.9];

const GRAVITY = 1020;
const DRAG = 0.03;
const DRAG_SOFTENING = 265;
const AREA_EDGE_ON = 0.14;
const AREA_SWING = 0.86;
const LIFT_MIN = 1.5;
const LIFT_RANGE = 1.4;
const LIFT_SPEED_CAP = 300;
const PACE_FLOOR = 0.001;
const SPIN_RANGE = 7;
const SPIN_JITTER = 0.5;
const FLIP_MIN = 3.2;
const FLIP_RANGE = 6;
const FLIP_SPEED_COUPLING = 0.0016;
const ALIGN_RATE = 4.5;
const LIFE_MIN = 4.6;
const LIFE_RANGE = 2.8;
const FADE_IN = 0.09;
const FADE_OUT = 0.42;
const CULL_BELOW = 90;
const CULL_SIDE = 260;

const FLAKE_SHARE = 0.4;
const CURL_SHARE = 0.62;
const RIBBON_SHARE = 0.82;

const FLAKE_WIDTH_MIN = 7;
const FLAKE_WIDTH_RANGE = 6;
const FLAKE_HEIGHT_MIN = 9;
const FLAKE_HEIGHT_RANGE = 7;
const FLAKE_HEIGHT_FLOOR = 0.7;
const FLAKE_CORNER_MAX = 1.7;

const CURL_RADIUS_MIN = 5;
const CURL_RADIUS_RANGE = 5;
const CURL_STROKE_MIN = 2.2;
const CURL_STROKE_RANGE = 1.3;
const CURL_SWEEP_MIN = 2.1;
const CURL_SWEEP_RANGE = 2.1;
const CURL_HEIGHT_FLOOR = 0.5;

const RIBBON_SEGMENTS = 8;
const RIBBON_LENGTH_MIN = 26;
const RIBBON_LENGTH_RANGE = 26;
const RIBBON_WAVE_MIN = 3.4;
const RIBBON_WAVE_RANGE = 5;
const RIBBON_WIDTH_MIN = 4.4;
const RIBBON_WIDTH_RANGE = 3;
const RIBBON_FREQUENCY_MIN = 0.8;
const RIBBON_FREQUENCY_RANGE = 0.8;
const RIBBON_TWIST_MIN = 4;
const RIBBON_TWIST_RANGE = 4.5;
const RIBBON_EDGE_ON = 0.16;

const SEQUIN_RADIUS_MIN = 1.5;
const SEQUIN_RADIUS_RANGE = 1.2;
const SEQUIN_GLINT_SHARE = 0.45;
const SEQUIN_GLINT_EDGE = 0.74;
const SEQUIN_GLINT_REACH = 3.4;
const SEQUIN_GLINT_STROKE = 0.9;
const SEQUIN_FACE_BASE = 0.75;
const SEQUIN_FACE_RANGE = 0.25;

const SPECULAR_EDGE = 0.15;
const ALPHA_FLOOR = 0.01;
const STREAK_SPEED = 430;
const STREAK_ALPHA = 0.16;
const STREAK_REACH = 0.014;
const STREAK_WIDTH = 0.42;
const STREAK_STROKE_FLOOR = 1;

const SIDE_ANGLE_LEFT = -0.92;
const SIDE_ANGLE_RIGHT = -2.22;
const SIDE_SPREAD = 0.6;
const SIDE_SPEED_MIN = 1270;
const SIDE_SPEED_RANGE = 440;
const SIDE_INSET = 20;
const SIDE_JITTER = 14;
const SIDE_HEIGHT = 0.66;
const SIDE_BAND = 0.15;

const TOP_ANGLE = Math.PI / 2;
const TOP_SPREAD = 0.56;
const TOP_SPEED_MIN = 70;
const TOP_SPEED_RANGE = 150;
const TOP_OVERSCAN = 0.04;
const TOP_RISE = 46;
const TOP_RISE_JITTER = 80;
const TOP_DRIFT = 30;
const TOP_DRIFT_RATE = 0.62;

const CORNER_ANGLE_LEFT = -1.27;
const CORNER_ANGLE_RIGHT = -1.87;
const CORNER_SPREAD = 0.44;
const CORNER_SPEED_MIN = 1180;
const CORNER_SPEED_RANGE = 430;
const CORNER_INSET = 0.035;
const CORNER_JITTER = 14;
const CORNER_LAUNCH = 14;
const CORNER_LAUNCH_JITTER = 12;

const VIEWPORT_CLASS = 'confetti--viewport';

export type ConfettiEmitter = 'sides' | 'top' | 'corners';
export type ConfettiField = 'container' | 'viewport';

type Shape = 'flake' | 'curl' | 'ribbon' | 'sequin';

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  alpha: number;
  gravity: number;
  drag: number;
  lift: number;
  drift: number;
  shape: Shape;
  slot: number;
  spin: number;
  spinRate: number;
  flip: number;
  flipRate: number;
  wave: number;
  age: number;
  life: number;
  fade: number;
  pace: number;
  aligned: boolean;
  width: number;
  height: number;
  radius: number;
  stroke: number;
  sweepFrom: number;
  sweep: number;
  length: number;
  amplitude: number;
  frequency: number;
  twist: number;
  glint: boolean;
}

interface Run {
  emitter: ConfettiEmitter;
  total: number;
  sent: number;
  elapsed: number;
  span: number;
}

interface Palette {
  key: string;
  front: string[];
  reverse: string[];
  sheen: string[];
  weights: number[];
  total: number;
}

interface Stage {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  size: number;
  pieces: Piece[];
  runs: Run[];
  clock: number;
  palette: Palette;
  playback: Playback | null;
}

interface Seat {
  x: number;
  y: number;
  angle: number;
  speed: number;
  drift: number;
}

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);

const pieceCount = (value: number) =>
  Number.isFinite(value) ? Math.round(clamp(value, MIN_COUNT, MAX_PIECES)) : DEFAULT_COUNT;

const emitterSpan = (value: number) => (Number.isFinite(value) && value > 0 ? Math.min(value, MAX_DURATION) : 0);

function readPalette(canvas: HTMLCanvasElement, cached: Palette | null): Palette {
  const computed = getComputedStyle(canvas);
  const key = [...PAPER_KEYS, ...REVERSE_KEYS, ...SHEEN_KEYS, WEIGHTS_KEY]
    .map((name) => computed.getPropertyValue(name).trim())
    .join('|');
  if (cached && cached.key === key) return cached;

  const resolveColor = (name: string) => {
    canvas.style.color = `var(${name})`;
    return getComputedStyle(canvas).color;
  };
  const front = PAPER_KEYS.map(resolveColor);
  const reverse = REVERSE_KEYS.map(resolveColor);
  const sheen = SHEEN_KEYS.map(resolveColor);
  canvas.style.color = '';

  const parsed = computed.getPropertyValue(WEIGHTS_KEY).trim().split(/\s+/).filter(Boolean).map(Number);
  const weights: number[] = [];
  let total = 0;
  for (let i = 0; i < PAPER_SLOTS; i++) {
    const value = parsed[i];
    const weight = Number.isFinite(value) && value >= 0 ? value : DEFAULT_WEIGHT;
    weights.push(weight);
    total += weight;
  }
  if (total <= 0) {
    weights.fill(DEFAULT_WEIGHT);
    total = PAPER_SLOTS * DEFAULT_WEIGHT;
  }
  return { key, front, reverse, sheen, weights, total };
}

function pickSlot(palette: Palette) {
  let roll = Math.random() * palette.total;
  for (let i = 0; i < palette.weights.length; i++) {
    if (roll < palette.weights[i]) return i;
    roll -= palette.weights[i];
  }
  return 0;
}

function seat(emitter: ConfettiEmitter, width: number, height: number): Seat {
  if (emitter === 'top') {
    return {
      x: -width * TOP_OVERSCAN + Math.random() * width * (1 + TOP_OVERSCAN * 2),
      y: -TOP_RISE - Math.random() * TOP_RISE_JITTER,
      angle: TOP_ANGLE + (Math.random() - 0.5) * TOP_SPREAD,
      speed: TOP_SPEED_MIN + Math.random() * TOP_SPEED_RANGE,
      drift: TOP_DRIFT,
    };
  }
  const left = Math.random() < 0.5;
  if (emitter === 'corners') {
    return {
      x: (left ? width * CORNER_INSET : width * (1 - CORNER_INSET)) + (Math.random() - 0.5) * CORNER_JITTER,
      y: height + CORNER_LAUNCH + Math.random() * CORNER_LAUNCH_JITTER,
      angle: (left ? CORNER_ANGLE_LEFT : CORNER_ANGLE_RIGHT) + (Math.random() - 0.5) * CORNER_SPREAD,
      speed: CORNER_SPEED_MIN + Math.random() * CORNER_SPEED_RANGE,
      drift: 0,
    };
  }
  return {
    x: left ? -SIDE_INSET - Math.random() * SIDE_JITTER : width + SIDE_INSET + Math.random() * SIDE_JITTER,
    y: height * SIDE_HEIGHT + (Math.random() - 0.5) * height * SIDE_BAND,
    angle: (left ? SIDE_ANGLE_LEFT : SIDE_ANGLE_RIGHT) + (Math.random() - 0.5) * SIDE_SPREAD,
    speed: SIDE_SPEED_MIN + Math.random() * SIDE_SPEED_RANGE,
    drift: 0,
  };
}

function cut(stage: Stage, emitter: ConfettiEmitter, palette: Palette): Piece {
  const spot = seat(emitter, stage.width, stage.height);
  const speed = spot.speed * stage.size;
  const depthRoll = Math.random();
  const depth = depthRoll < DEPTH_FAR_SHARE ? 0 : depthRoll < DEPTH_MID_SHARE ? 1 : DEPTH_NEAR;
  const size = DEPTH_SIZE[depth] * stage.size;
  const shapeRoll = Math.random();
  const shape: Shape =
    shapeRoll < FLAKE_SHARE
      ? 'flake'
      : shapeRoll < CURL_SHARE
        ? 'curl'
        : shapeRoll < RIBBON_SHARE
          ? 'ribbon'
          : 'sequin';
  const piece: Piece = {
    x: spot.x,
    y: spot.y,
    vx: Math.cos(spot.angle) * speed,
    vy: Math.sin(spot.angle) * speed,
    depth,
    alpha: DEPTH_ALPHA[depth],
    gravity: GRAVITY * DEPTH_GRAVITY[depth],
    drag: DRAG * DEPTH_DRAG[depth],
    lift: LIFT_MIN + Math.random() * LIFT_RANGE,
    drift: spot.drift,
    shape,
    slot: pickSlot(palette),
    spin: Math.random() * TAU,
    spinRate: (Math.random() - 0.5) * SPIN_RANGE,
    flip: Math.random() * TAU,
    flipRate: (FLIP_MIN + Math.random() * FLIP_RANGE) * (Math.random() < 0.5 ? -1 : 1),
    wave: Math.random() * TAU,
    age: 0,
    life: LIFE_MIN + Math.random() * LIFE_RANGE,
    fade: 0,
    pace: speed,
    aligned: shape === 'ribbon',
    width: 0,
    height: 0,
    radius: 0,
    stroke: 0,
    sweepFrom: 0,
    sweep: 0,
    length: 0,
    amplitude: 0,
    frequency: 0,
    twist: 0,
    glint: false,
  };

  if (shape === 'flake') {
    piece.width = (FLAKE_WIDTH_MIN + Math.random() * FLAKE_WIDTH_RANGE) * size;
    piece.height = (FLAKE_HEIGHT_MIN + Math.random() * FLAKE_HEIGHT_RANGE) * size;
  } else if (shape === 'curl') {
    piece.radius = (CURL_RADIUS_MIN + Math.random() * CURL_RADIUS_RANGE) * size;
    piece.stroke = (CURL_STROKE_MIN + Math.random() * CURL_STROKE_RANGE) * size;
    piece.sweepFrom = Math.random() * TAU;
    piece.sweep = CURL_SWEEP_MIN + Math.random() * CURL_SWEEP_RANGE;
    piece.width = piece.radius * 2;
  } else if (shape === 'ribbon') {
    piece.length = (RIBBON_LENGTH_MIN + Math.random() * RIBBON_LENGTH_RANGE) * size;
    piece.amplitude = (RIBBON_WAVE_MIN + Math.random() * RIBBON_WAVE_RANGE) * size;
    piece.width = (RIBBON_WIDTH_MIN + Math.random() * RIBBON_WIDTH_RANGE) * size;
    piece.height = piece.width;
    piece.frequency = RIBBON_FREQUENCY_MIN + Math.random() * RIBBON_FREQUENCY_RANGE;
    piece.twist = RIBBON_TWIST_MIN + Math.random() * RIBBON_TWIST_RANGE;
    piece.spin = Math.atan2(piece.vy, piece.vx);
  } else {
    piece.radius = (SEQUIN_RADIUS_MIN + Math.random() * SEQUIN_RADIUS_RANGE) * size;
    piece.width = piece.radius * 2;
    piece.glint = Math.random() < SEQUIN_GLINT_SHARE;
  }
  return piece;
}

function emit(stage: Stage, dt: number, palette: Palette) {
  const runs = stage.runs;
  for (let i = runs.length - 1; i >= 0; i--) {
    const run = runs[i];
    run.elapsed += dt;
    const send = () => {
      if (stage.pieces.length >= MAX_PIECES) stage.pieces.shift();
      stage.pieces.push(cut(stage, run.emitter, palette));
      run.sent++;
    };
    if (run.span <= 0) {
      while (run.sent < run.total) send();
    } else {
      while (run.sent < run.total && run.elapsed >= run.span * Math.pow(run.sent / run.total, EMISSION_EASE)) send();
    }
    if (run.sent >= run.total) runs.splice(i, 1);
  }
}

function advance(stage: Stage, dt: number) {
  const pieces = stage.pieces;
  const drift = Math.sin(stage.clock * TOP_DRIFT_RATE);
  for (let i = pieces.length - 1; i >= 0; i--) {
    const piece = pieces[i];
    piece.age += dt;
    const pace = Math.max(PACE_FLOOR, Math.hypot(piece.vx, piece.vy));
    piece.pace = pace;
    const area = AREA_EDGE_ON + AREA_SWING * Math.abs(Math.cos(piece.flip));
    const resistance = (piece.drag * area) / (1 + (pace / DRAG_SOFTENING) * (pace / DRAG_SOFTENING));
    const lift = piece.lift * area * Math.sin(piece.flip) * Math.min(pace, LIFT_SPEED_CAP);
    const ax = -resistance * piece.vx * pace + drift * piece.drift + (-piece.vy / pace) * lift;
    const ay = -resistance * piece.vy * pace + piece.gravity + (piece.vx / pace) * lift;
    piece.vx += ax * dt;
    piece.vy += ay * dt;
    piece.x += piece.vx * dt;
    piece.y += piece.vy * dt;
    piece.spinRate += (Math.random() - 0.5) * SPIN_JITTER * dt;
    if (piece.aligned) {
      const want = Math.atan2(piece.vy, piece.vx);
      piece.spin += (((want - piece.spin + Math.PI * 3) % TAU) - Math.PI) * Math.min(1, ALIGN_RATE * dt);
    } else {
      piece.spin += piece.spinRate * dt;
    }
    piece.flip += (piece.flipRate + Math.sign(piece.flipRate) * pace * FLIP_SPEED_COUPLING) * dt;
    piece.fade = Math.min(1, piece.age / FADE_IN) * Math.min(1, (piece.life - piece.age) / FADE_OUT);
    const gone =
      piece.age >= piece.life ||
      piece.y > stage.height + CULL_BELOW ||
      piece.x < -CULL_SIDE ||
      piece.x > stage.width + CULL_SIDE;
    if (gone) pieces.splice(i, 1);
  }
}

function drawFlake(ctx: CanvasRenderingContext2D, piece: Piece, tone: string) {
  const face = Math.abs(Math.cos(piece.flip));
  const height = Math.max(FLAKE_HEIGHT_FLOOR, piece.height * face);
  ctx.fillStyle = tone;
  ctx.beginPath();
  ctx.roundRect(-piece.width / 2, -height / 2, piece.width, height, Math.min(FLAKE_CORNER_MAX, height / 2));
  ctx.fill();
}

function drawCurl(ctx: CanvasRenderingContext2D, piece: Piece, tone: string) {
  const face = Math.abs(Math.cos(piece.flip));
  ctx.strokeStyle = tone;
  ctx.lineWidth = piece.stroke;
  ctx.beginPath();
  ctx.ellipse(
    0,
    0,
    piece.radius,
    Math.max(CURL_HEIGHT_FLOOR, piece.radius * face),
    0,
    piece.sweepFrom,
    piece.sweepFrom + piece.sweep,
  );
  ctx.stroke();
}

function drawRibbon(ctx: CanvasRenderingContext2D, piece: Piece, palette: Palette) {
  const half = piece.width * 0.5;
  for (let s = 0; s < RIBBON_SEGMENTS; s++) {
    const from = s / RIBBON_SEGMENTS;
    const to = (s + 1) / RIBBON_SEGMENTS;
    const x0 = (from - 0.5) * piece.length;
    const x1 = (to - 0.5) * piece.length;
    const y0 = piece.amplitude * Math.sin(from * piece.frequency * TAU + piece.wave);
    const y1 = piece.amplitude * Math.sin(to * piece.frequency * TAU + piece.wave);
    const twist0 = Math.cos(from * piece.twist + piece.flip);
    const twist1 = Math.cos(to * piece.twist + piece.flip);
    const w0 = half * Math.abs(twist0);
    const w1 = half * Math.abs(twist1);
    const edge = (Math.abs(twist0) + Math.abs(twist1)) * 0.5;
    ctx.fillStyle =
      edge < RIBBON_EDGE_ON
        ? palette.sheen[piece.slot]
        : twist0 + twist1 >= 0
          ? palette.front[piece.slot]
          : palette.reverse[piece.slot];
    ctx.beginPath();
    ctx.moveTo(x0, y0 - w0);
    ctx.lineTo(x1, y1 - w1);
    ctx.lineTo(x1, y1 + w1);
    ctx.lineTo(x0, y0 + w0);
    ctx.closePath();
    ctx.fill();
  }
}

function drawSequin(ctx: CanvasRenderingContext2D, piece: Piece, palette: Palette) {
  const face = Math.abs(Math.cos(piece.flip));
  ctx.fillStyle = palette.front[piece.slot];
  ctx.beginPath();
  ctx.arc(0, 0, piece.radius * (SEQUIN_FACE_BASE + SEQUIN_FACE_RANGE * face), 0, TAU);
  ctx.fill();
  if (!piece.glint || face <= SEQUIN_GLINT_EDGE) return;
  const reach = (piece.radius * SEQUIN_GLINT_REACH * (face - SEQUIN_GLINT_EDGE)) / (1 - SEQUIN_GLINT_EDGE);
  ctx.strokeStyle = palette.sheen[piece.slot];
  ctx.lineWidth = SEQUIN_GLINT_STROKE;
  ctx.beginPath();
  ctx.moveTo(-reach, 0);
  ctx.lineTo(reach, 0);
  ctx.moveTo(0, -reach);
  ctx.lineTo(0, reach);
  ctx.stroke();
}

function paint(stage: Stage) {
  const ctx = stage.ctx;
  ctx.clearRect(0, 0, stage.width, stage.height);
  const palette = stage.palette;
  ctx.lineCap = 'round';
  for (const piece of stage.pieces) {
    const facing = Math.cos(piece.flip);
    const face = Math.abs(facing);
    const alpha = piece.alpha * piece.fade;
    if (alpha <= ALPHA_FLOOR) continue;

    if (piece.depth === DEPTH_NEAR && piece.pace > STREAK_SPEED && piece.shape !== 'sequin') {
      ctx.globalAlpha = alpha * STREAK_ALPHA;
      ctx.strokeStyle = palette.front[piece.slot];
      ctx.lineWidth = Math.max(STREAK_STROKE_FLOOR, piece.width * STREAK_WIDTH);
      ctx.beginPath();
      ctx.moveTo(piece.x, piece.y);
      ctx.lineTo(piece.x - piece.vx * STREAK_REACH, piece.y - piece.vy * STREAK_REACH);
      ctx.stroke();
    }

    ctx.globalAlpha = alpha;
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.spin);
    const tone =
      face < SPECULAR_EDGE
        ? palette.sheen[piece.slot]
        : facing > 0
          ? palette.front[piece.slot]
          : palette.reverse[piece.slot];
    if (piece.shape === 'flake') drawFlake(ctx, piece, tone);
    else if (piece.shape === 'curl') drawCurl(ctx, piece, tone);
    else if (piece.shape === 'ribbon') drawRibbon(ctx, piece, palette);
    else drawSequin(ctx, piece, palette);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function fit(stage: Stage) {
  const box = stage.canvas.getBoundingClientRect();
  if (!box.width || !box.height) return;
  stage.width = box.width;
  stage.height = box.height;
  stage.size = clamp(Math.sqrt(box.width * box.height) / SCALE_REFERENCE, SCALE_MIN, SCALE_MAX);
  const ratio = Math.min(PIXEL_RATIO_CAP, window.devicePixelRatio || 1);
  const width = Math.round(box.width * ratio);
  const height = Math.round(box.height * ratio);
  if (stage.canvas.width !== width || stage.canvas.height !== height) {
    stage.canvas.width = width;
    stage.canvas.height = height;
  }
  stage.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function halt(stage: Stage) {
  stage.pieces.length = 0;
  stage.runs.length = 0;
  stage.clock = 0;
  stage.ctx.clearRect(0, 0, stage.width, stage.height);
  stage.playback?.stop();
  stage.playback = null;
}

export interface ConfettiFireOptions {
  /** Pieces this burst sends, clamped to 1-520. Falls back to the `count` prop. */
  count?: number;
  /** Seconds this burst's emitter stays open, clamped to 0-10. Falls back to the `duration` prop. */
  duration?: number;
  /** Emitter geometry for this burst. Falls back to the `emitter` prop. */
  emitter?: ConfettiEmitter;
}

export interface ConfettiHandle {
  /** Sends one burst. Bursts coexist - firing again while pieces are still airborne adds to the field rather than replacing it. */
  fire: (options?: ConfettiFireOptions) => void;
  /** Empties the field and stops the simulation immediately. */
  clear: () => void;
}

export interface ConfettiOwnProps {
  /** Where pieces are launched from: two side cannons, a full-width fall, or two floor-corner cannons. @default 'sides' */
  emitter?: ConfettiEmitter;
  /** Pieces one fire sends, clamped to 1-520. The field itself holds 520; beyond that the oldest piece is retired. @default 170 */
  count?: number;
  /** Seconds the emitter stays open, clamped to 0-10. Pieces leave front-loaded inside that window, so 0.15 reads as one shove and 2.5 as a burst that tapers into a fall. @default 0.15 */
  duration?: number;
  /** Multiplies the simulation rate; sampled live on every frame. @default 1 */
  speed?: number;
  /** `container` fills the nearest positioned ancestor; `viewport` pins the field to the window above the toast layer. @default 'container' */
  field?: ConfettiField;
  /** Imperative handle - call `fire()` on it to send a burst, `clear()` to empty the field. */
  ref?: Ref<ConfettiHandle>;
  /** Extra class(es) merged onto the canvas. */
  className?: string;
  /** Inline styles merged onto the canvas. */
  style?: CSSProperties;
}

export interface ConfettiProps extends ConfettiOwnProps {
  /** Standard <canvas> attributes (aria-*, data-*, title, ...) forwarded to the canvas. */
  htmlProps?: Omit<HTMLAttributes<HTMLCanvasElement>, keyof ConfettiOwnProps> & DataAttributes;
}

export function Confetti({
  emitter = 'sides',
  count = DEFAULT_COUNT,
  duration = DEFAULT_DURATION,
  speed = 1,
  field = 'container',
  ref,
  className = '',
  style,
  htmlProps,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage | null>(null);
  const settingsRef = useRef({ emitter, count, duration, speed });

  useEffect(() => {
    settingsRef.current = { emitter, count, duration, speed };
  }, [emitter, count, duration, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const stage: Stage = {
      canvas,
      ctx,
      width: 0,
      height: 0,
      size: 1,
      pieces: [],
      runs: [],
      clock: 0,
      palette: readPalette(canvas, null),
      playback: null,
    };
    stageRef.current = stage;
    fit(stage);

    const resizes = new ResizeObserver(() => fit(stage));
    resizes.observe(canvas);

    return () => {
      resizes.disconnect();
      stage.playback?.stop();
      stage.playback = null;
      stageRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      fire(options?: ConfettiFireOptions) {
        const stage = stageRef.current;
        if (!stage) return;
        fit(stage);
        if (!stage.width || !stage.height) return;
        const settings = settingsRef.current;
        stage.palette = readPalette(stage.canvas, stage.palette);
        stage.runs.push({
          emitter: options?.emitter ?? settings.emitter,
          total: pieceCount(options?.count ?? settings.count),
          sent: 0,
          elapsed: 0,
          span: emitterSpan(options?.duration ?? settings.duration),
        });
        if (stage.playback) return;
        let inert = false;
        const playback = loop(
          (_k, dt) => {
            const step = dt / MS_PER_SECOND;
            stage.clock += step;
            emit(stage, step, stage.palette);
            advance(stage, step);
            paint(stage);
            if (!stage.pieces.length && !stage.runs.length) halt(stage);
          },
          {
            el: stage.canvas,
            speed: () => settingsRef.current.speed,
            snap: () => {
              inert = true;
              halt(stage);
            },
          },
        );
        stage.playback = inert ? null : playback;
      },
      clear() {
        const stage = stageRef.current;
        if (stage) halt(stage);
      },
    }),
    [],
  );

  return (
    <canvas
      ref={canvasRef}
      className={cx('confetti', field === 'viewport' && VIEWPORT_CLASS, className)}
      style={style}
      aria-hidden="true"
      {...htmlProps}
    />
  );
}
