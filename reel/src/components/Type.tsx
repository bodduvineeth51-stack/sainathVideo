import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {easeInOut, easeOut, p, pop} from '../lib/anim';
import {C, F, SAFE} from '../lib/theme';

/**
 * True extruded type: the word is stacked `depth` times along Z inside a perspective camera,
 * so rotation reveals real side walls instead of a drop shadow.
 */
export const Extruded: React.FC<{
  text: string;
  size: number;
  face?: string;
  side?: string;
  depth?: number;
  step?: number;
  style?: React.CSSProperties;
  weight?: number;
}> = ({text, size, face = C.paper, side = '#8E877B', depth = 18, step = 1.6, style, weight = 700}) => {
  const base: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    fontFamily: F.display,
    fontWeight: weight,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: -size * 0.02,
    whiteSpace: 'nowrap',
  };
  return (
    <div style={{position: 'relative', transformStyle: 'preserve-3d', ...style}}>
      <span style={{...base, position: 'relative', visibility: 'hidden'}}>{text}</span>
      {Array.from({length: depth}).map((_, i) => {
        const shade = 1 - (i / depth) * 0.55;
        return (
          <span key={i} style={{...base, color: side, filter: `brightness(${shade})`, transform: `translateZ(${-(i + 1) * step}px)`}}>
            {text}
          </span>
        );
      })}
      <span style={{...base, color: face}}>{text}</span>
    </div>
  );
};

/**
 * SCENE 1 — "WHY SHOULD WE LEARN CODING IN 2026?"
 * Beat 1 (0–14f): dark, a single rule draws (anticipation, riser).
 * Beat 2: words rise out of depth on a slow dolly; "2026" lands last in accent with the low impact.
 * Beat 3: the rule under 2026 widens into a vertical slot that opens onto the talking head (transition).
 */
export const Title3D: React.FC<{dur: number; children?: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const lines: {t: string; at: number; size: number; accent?: boolean}[] = [
    {t: 'WHY SHOULD', at: 10, size: 132},
    {t: 'WE LEARN', at: 16, size: 132},
    {t: 'CODING IN', at: 22, size: 132},
    {t: '2026?', at: 34, size: 250, accent: true},
  ];
  const dolly = interpolate(f, [0, dur], [-260, 40], {easing: easeInOut});
  const yaw = interpolate(f, [0, dur], [-16, 8], {easing: easeInOut});
  const pitch = interpolate(f, [0, dur], [14, 4], {easing: easeInOut});
  const ruleW = p(f, 2, 14) * 520;
  // exit: slot opens from the rule
  const openStart = dur - 14;
  const open = p(f, openStart, 14, easeInOut);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {/* the footage sits behind and is revealed through the slot */}
      <AbsoluteFill style={{clipPath: `inset(${(1 - open) * 50}% ${(1 - open) * 50}% ${(1 - open) * 50}% ${(1 - open) * 50}% round ${(1 - open) * 40}px)`}}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{perspective: 1400, perspectiveOrigin: '50% 45%', opacity: 1 - open}}>
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 560,
            transformStyle: 'preserve-3d',
            transform: `translateZ(${dolly}px) rotateY(${yaw}deg) rotateX(${pitch}deg)`,
          }}
        >
          {lines.map((l, i) => {
            const t = pop(f, l.at, l.accent ? 120 : 150, l.accent ? 12 : 16);
            const z = (1 - t) * -900;
            return (
              <div key={i} style={{transformStyle: 'preserve-3d', transform: `translateZ(${z}px) translateY(${(1 - t) * 60}px)`, opacity: Math.min(1, t * 2), marginBottom: l.accent ? 0 : 14}}>
                <Extruded text={l.t} size={l.size} face={l.accent ? C.lak : C.paper} side={l.accent ? C.lakDeep : '#7D776D'} depth={l.accent ? 30 : 22} step={l.accent ? 2.6 : 2.2} />
              </div>
            );
          })}
          <div style={{height: 10, width: ruleW, background: C.lak, marginTop: 30, transform: 'translateZ(2px)'}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Large emphasis phrase with depth: rises, slight overshoot, settles; optional strike. */
export const Emphasis: React.FC<{
  text: string;
  at?: number;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  align?: 'left' | 'center';
  strikeAt?: number;
  out?: number;
}> = ({text, at = 0, size = 110, color = C.paper, x = SAFE.left, y = 300, align = 'left', strikeAt, out}) => {
  const f = useCurrentFrame();
  const t = pop(f, at, 160, 14);
  const o = out !== undefined ? 1 - p(f, out, 8) : 1;
  const strike = strikeAt !== undefined ? p(f, strikeAt, 10) : 0;
  const shove = strikeAt !== undefined ? p(f, strikeAt + 6, 14) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'center' ? 0 : x,
        right: align === 'center' ? 0 : undefined,
        top: y,
        textAlign: align,
        perspective: 1000,
        opacity: Math.min(1, t * 1.5) * o * (1 - shove * 0.45),
      }}
    >
      <div
        style={{
          display: 'inline-block',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `translateY(${(1 - t) * 50}px) rotateX(${(1 - t) * 35}deg) translateX(${shove * -40}px) scale(${1 - shove * 0.12})`,
        }}
      >
        <Extruded text={text} size={size} face={color} side="#5E5A53" depth={10} step={1.4} />
        {strikeAt !== undefined && (
          <div style={{position: 'absolute', left: -12, top: '52%', height: size * 0.09, width: `calc(${strike * 100}% + 24px)`, background: C.bad, transform: 'translateZ(30px) rotate(-2deg)'}} />
        )}
      </div>
    </div>
  );
};

/** Small label (above / beside the speaker). */
export const Label: React.FC<{text: string; at?: number; x: number; y: number; color?: string; size?: number; out?: number}> = ({
  text,
  at = 0,
  x,
  y,
  color = C.paper,
  size = 34,
  out,
}) => {
  const f = useCurrentFrame();
  const t = p(f, at, 12);
  const o = out !== undefined ? 1 - p(f, out, 8) : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: t * o, transform: `translateY(${(1 - t) * 14}px)`, fontFamily: F.display, fontWeight: 700, fontSize: size, letterSpacing: size * 0.08, color}}>
      {text}
    </div>
  );
};

/** Movie-style subtitle: small, sentence case, fixed position inside the Reels safe zone. */
export const Subtitle: React.FC<{text: string; dur: number}> = ({text, dur}) => {
  const f = useCurrentFrame();
  const o = Math.min(p(f, 0, 4, easeOut), 1 - p(f, dur - 4, 4, easeOut));
  return (
    <div style={{position: 'absolute', left: 90, right: 150, top: 1418, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div
        style={{
          fontFamily: F.ui,
          fontWeight: 500,
          fontSize: 38,
          lineHeight: 1.32,
          color: '#FAF8F4',
          textAlign: 'center',
          padding: '6px 14px',
          background: 'rgba(16,17,19,0.42)',
          borderRadius: 8,
          textShadow: '0 2px 6px rgba(0,0,0,0.65)',
        }}
      >
        {text}
      </div>
    </div>
  );
};
