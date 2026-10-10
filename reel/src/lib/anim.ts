import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './theme';

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.5, 0, 0.75, 0);

/** 0→1 over [start, start+dur] frames, clamped, eased. */
export const p = (frame: number, start: number, dur: number, ease = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

/** Spring with a small, controlled overshoot that settles. */
export const pop = (frame: number, start: number, stiffness = 170, damping = 15) =>
  spring({frame: frame - start, fps: FPS, config: {stiffness, damping, mass: 1}});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Seconds → frames. */
export const s = (sec: number) => Math.round(sec * FPS);

/** Typewriter: how many chars of `text` are visible. */
export const typed = (frame: number, start: number, text: string, cps = 18) =>
  text.slice(0, Math.max(0, Math.floor(((frame - start) / FPS) * cps)));
