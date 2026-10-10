import React from 'react';
import {C, F} from '../lib/theme';

export type Who = 'ram' | 'lak' | 'dad';
export type Mood = 'neutral' | 'confident' | 'sad' | 'focused';

const LOOK: Record<Who, {top: string; topDark: string; skin: string; hair: string; name: string}> = {
  ram: {top: C.ram, topDark: C.ramDeep, skin: '#C99A78', hair: '#1E1C1B', name: 'RAM'},
  lak: {top: C.lak, topDark: C.lakDeep, skin: '#BF8E6C', hair: '#1A1817', name: 'LAKSHMAN'},
  dad: {top: '#2C2F36', topDark: '#1E2025', skin: '#B88968', hair: '#C9C5BE', name: 'FATHER'},
};

/**
 * Flat, geometric bust. Same construction for all three people so they read as one family;
 * colour + hair silhouette distinguish them. `mood` drives brow, mouth and head pose.
 */
export const Character: React.FC<{
  who: Who;
  size?: number;
  mood?: Mood;
  /** 0..1 — head lowers / turns for disappointment. */
  droop?: number;
  style?: React.CSSProperties;
}> = ({who, size = 260, mood = 'neutral', droop = 0, style}) => {
  const L = LOOK[who];
  const headTilt = mood === 'sad' ? 8 * droop + 4 : mood === 'confident' ? -3 : 0;
  const headDrop = mood === 'sad' ? 10 * droop : 0;
  const mouth =
    mood === 'confident'
      ? 'M88 132 Q100 142 114 131'
      : mood === 'sad'
        ? 'M90 137 Q101 130 112 137'
        : mood === 'focused'
          ? 'M91 134 L111 134'
          : 'M90 133 Q101 138 112 133';
  const brow =
    mood === 'sad'
      ? {l: 'M78 100 L92 93', r: 'M110 93 L124 100'}
      : mood === 'confident'
        ? {l: 'M77 97 L92 95', r: 'M110 95 L125 97'}
        : {l: 'M78 97 L92 97', r: 'M110 97 L124 97'};
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 200 210" style={style}>
      {/* shoulders */}
      <path d="M22 210 C26 168 58 152 100 152 C142 152 174 168 178 210 Z" fill={L.top} />
      <path d="M100 152 C142 152 174 168 178 210 L140 210 C136 182 122 160 100 152Z" fill={L.topDark} opacity={0.55} />
      {who === 'dad' && <path d="M86 154 L100 186 L114 154 Z" fill="#E9E5DD" />}
      {who === 'dad' && <path d="M97 160 L103 160 L104 190 L100 196 L96 190Z" fill={C.lak} opacity={0.0} />}
      {who === 'lak' && <path d="M80 156 L100 176 L120 156" stroke={C.ink} strokeWidth={4} fill="none" opacity={0.35} />}
      {who === 'ram' && <path d="M70 160 C80 176 120 176 130 160" stroke={C.ink} strokeWidth={4} fill="none" opacity={0.3} />}
      {/* neck */}
      <rect x={90} y={132} width={20} height={26} rx={6} fill={L.skin} />
      <g transform={`translate(0 ${headDrop}) rotate(${headTilt} 100 110)`}>
        {/* head */}
        <ellipse cx={101} cy={106} rx={34} ry={39} fill={L.skin} />
        {/* hair silhouettes */}
        {who === 'ram' && <path d="M66 100 C64 66 90 58 106 62 C126 64 140 78 136 102 C130 86 118 80 102 82 C88 82 74 88 66 100Z" fill={L.hair} />}
        {who === 'lak' && <path d="M67 104 C62 70 84 56 108 60 C132 64 142 84 135 104 C132 90 124 78 112 76 C108 86 84 88 67 104Z" fill={L.hair} />}
        {who === 'dad' && <path d="M68 100 C66 74 86 62 104 64 C124 64 138 78 134 100 C126 84 112 78 100 80 C86 80 74 88 68 100Z" fill={L.hair} />}
        {/* brows + eyes */}
        <path d={brow.l} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" />
        <path d={brow.r} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" />
        <ellipse cx={86} cy={110 + (mood === 'sad' ? 1.5 : 0)} rx={3.6} ry={mood === 'sad' ? 3 : 4.2} fill={C.ink} />
        <ellipse cx={116} cy={110 + (mood === 'sad' ? 1.5 : 0)} rx={3.6} ry={mood === 'sad' ? 3 : 4.2} fill={C.ink} />
        <path d={mouth} stroke={C.ink} strokeWidth={3.2} fill="none" strokeLinecap="round" />
        {who === 'dad' && <path d="M84 124 Q101 120 118 124" stroke={L.hair} strokeWidth={4} fill="none" strokeLinecap="round" />}
      </g>
    </svg>
  );
};

/** Pill label used next to hands and in split screens — the identity token reused all video. */
export const NameTag: React.FC<{who: Who; scale?: number; style?: React.CSSProperties; sub?: string}> = ({
  who,
  scale = 1,
  style,
  sub,
}) => {
  const col = who === 'ram' ? C.ram : who === 'lak' ? C.lak : C.dad;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14 * scale,
        padding: `${12 * scale}px ${24 * scale}px ${12 * scale}px ${14 * scale}px`,
        background: 'rgba(22,23,26,0.86)',
        borderRadius: 999,
        border: `${2 * scale}px solid ${col}`,
        boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
        ...style,
      }}
    >
      <div style={{width: 18 * scale, height: 18 * scale, borderRadius: 99, background: col}} />
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <span style={{fontFamily: F.display, fontWeight: 700, fontSize: 34 * scale, letterSpacing: 2 * scale, color: C.paper}}>
          {LOOK[who].name}
        </span>
        {sub && (
          <span style={{fontFamily: F.ui, fontWeight: 500, fontSize: 20 * scale, color: C.mute, marginTop: 2}}>{sub}</span>
        )}
      </div>
    </div>
  );
};
