import React from 'react';
import {C, F} from '../lib/theme';

// deterministic pseudo-random
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Simplified city map. River splits the city; the EAST district (right of the river) is the prize.
 * `hi` 0..1 highlights the east district; `owner` paints its outline in the owner's colour.
 */
export const CityMap: React.FC<{size: number; hi: number; ownerColor?: string; claim?: number}> = ({size, hi, ownerColor = C.dad, claim = 0}) => {
  const streets: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    streets.push(<line key={`h${i}`} x1={0} x2={1000} y1={60 + i * 80 + rnd(i) * 20} y2={60 + i * 80 + rnd(i + 3) * 20} stroke={C.line} strokeWidth={3} opacity={0.6} />);
    streets.push(<line key={`v${i}`} y1={0} y2={1000} x1={50 + i * 85 + rnd(i + 9) * 20} x2={50 + i * 85 + rnd(i + 5) * 20} stroke={C.line} strokeWidth={3} opacity={0.6} />);
  }
  const east = 'M600 40 C640 200 590 330 640 480 C690 640 600 780 650 960 L960 960 L960 40 Z';
  const fillCol = claim > 0 ? C.lak : ownerColor;
  return (
    <svg width={size} height={size} viewBox="0 0 1000 1000">
      <rect x={0} y={0} width={1000} height={1000} rx={40} fill={C.ink2} />
      <g clipPath="url(#mapclip)">{streets}</g>
      <defs>
        <clipPath id="mapclip">
          <rect x={0} y={0} width={1000} height={1000} rx={40} />
        </clipPath>
      </defs>
      {/* river */}
      <path d="M560 0 C600 200 540 340 590 500 C640 660 550 800 600 1000" stroke="#2D3A4F" strokeWidth={46} fill="none" />
      {/* east district */}
      <path d={east} fill={fillCol} opacity={0.08 + 0.22 * hi} />
      <path d={east} fill="none" stroke={fillCol} strokeWidth={8} strokeDasharray="2400" strokeDashoffset={2400 * (1 - hi)} strokeLinejoin="round" />
      {/* tower glyphs in east */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={700 + (i % 3) * 80} y={330 + Math.floor(i / 3) * 170 - (i === 1 ? 40 : 0)} width={46} height={i === 1 ? 130 : 80 + rnd(i) * 40} rx={6} fill={C.paper} opacity={0.15 + 0.6 * hi} />
      ))}
      {/* compass */}
      <g transform="translate(110 120)">
        <circle r={58} fill="none" stroke={C.mute} strokeWidth={3} />
        <path d="M0 -44 L10 0 L0 44 L-10 0Z" fill={C.mute} />
        <path d="M-44 0 L0 -9 L44 0 L0 9Z" fill={C.lak} opacity={0.4 + 0.6 * hi} />
        <text x={0} y={-70} fill={C.mute} fontFamily={F.ui} fontSize={30} fontWeight={600} textAnchor="middle">N</text>
        <text x={78} y={11} fill={C.lak} fontFamily={F.ui} fontSize={32} fontWeight={700} opacity={0.4 + 0.6 * hi}>E</text>
      </g>
    </svg>
  );
};

/** Modern skyline with a landmark "East Tower" whose terrace is the elevated seat. */
export const Skyline: React.FC<{width: number; height: number; claim?: number; lights?: number}> = ({width, height, claim = 0, lights = 1}) => {
  const bldgs: React.ReactNode[] = [];
  let x = 0;
  let i = 0;
  while (x < 2400) {
    const w = 90 + rnd(i) * 120;
    const h = 380 + rnd(i + 50) * 520;
    const isTowerSlot = x > 1060 && x < 1260;
    if (!isTowerSlot) {
      const win: React.ReactNode[] = [];
      for (let r = 0; r < Math.floor(h / 46); r++) {
        for (let c = 0; c < Math.floor(w / 34); c++) {
          if (rnd(i * 97 + r * 13 + c) < 0.32 * lights) {
            win.push(<rect key={`${r}-${c}`} x={x + 12 + c * 34} y={1400 - h + 20 + r * 46} width={16} height={22} fill="#F3D7A6" opacity={0.55} />);
          }
        }
      }
      bldgs.push(
        <g key={i}>
          <rect x={x} y={1400 - h} width={w - 10} height={h} fill={i % 2 ? '#22243A' : '#262842'} />
          {win}
        </g>,
      );
    }
    x += w;
    i++;
  }
  return (
    <svg width={width} height={height} viewBox="0 0 2400 1400" preserveAspectRatio="xMidYMax slice">
      {/* far layer */}
      {Array.from({length: 26}).map((_, j) => (
        <rect key={j} x={j * 95} y={1400 - 300 - rnd(j + 200) * 420} width={80} height={900} fill="#2E2F4A" opacity={0.7} />
      ))}
      {bldgs}
      {/* East Tower: tapered landmark with cantilevered terrace at y≈520 */}
      <path d="M1100 1400 L1120 420 L1150 300 L1180 420 L1210 1400 Z" fill="#2A2C47" />
      <path d="M1150 300 L1180 420 L1210 1400 L1160 1400 Z" fill="#1E2036" />
      <rect x={1040} y={520} width={240} height={16} fill={C.paperDim} />
      <rect x={1040} y={500} width={4} height={20} fill={C.paperDim} />
      <rect x={1276} y={500} width={4} height={20} fill={C.paperDim} />
      <line x1={1042} y1={502} x2={1278} y2={502} stroke={C.paperDim} strokeWidth={3} />
      {/* ownership flag on the spire */}
      {/* the pole rises only when the district is claimed, then the flag unfurls */}
      <line x1={1150} y1={300} x2={1150} y2={300 - 130 * Math.min(1, claim * 2)} stroke={C.paperDim} strokeWidth={5} opacity={claim > 0 ? 1 : 0} />
      <path d={`M1152 172 L${1152 + 110 * Math.max(0, claim * 2 - 1)} ${186} L1152 ${172 + 58}`} fill={C.lak} opacity={claim > 0.5 ? 1 : 0} />
    </svg>
  );
};

/** Lounge chair drawn behind a seated bust so the character reads as sitting. */
export const Seat: React.FC<{w: number}> = ({w}) => (
  <svg width={w} height={w * 0.75} viewBox="0 0 200 150">
    <path d="M30 10 Q100 -6 170 10 L176 110 L24 110 Z" fill="#33354F" />
    <rect x={10} y={100} width={180} height={26} rx={10} fill="#3B3D5C" />
    <rect x={40} y={126} width={8} height={24} fill="#55587A" />
    <rect x={152} y={126} width={8} height={24} fill="#55587A" />
  </svg>
);
