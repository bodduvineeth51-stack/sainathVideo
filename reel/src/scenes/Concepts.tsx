import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SpecApp} from '../components/AppBuilder';
import {Emphasis, Label} from '../components/Type';
import {easeIn, easeInOut, easeOut, lerp, p, pop, typed} from '../lib/anim';
import {C, F} from '../lib/theme';
import type {SceneProps} from './types';

const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>{children}</AbsoluteFill>
);

const Card: React.FC<{x: number; y: number; w: number; h?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: C.ink2, border: `2px solid ${C.line}`, borderRadius: 16, ...style}}>{children}</div>
);

// ───────────────────────────── SCENE 11 ─────────────────────────────
// A few real snippets; they shrink into one small "syntax" piece inside a much larger frame.
const SNIPPETS = [
  {lang: 'JS', code: 'const total = items\n  .map(i => i.price)\n  .reduce((a, b) => a + b);'},
  {lang: 'Python', code: 'for user in users:\n    if user.active:\n        notify(user)'},
  {lang: 'SQL', code: 'SELECT name FROM tasks\nWHERE due >= CURRENT_DATE;'},
  {lang: 'HTML', code: '<button class="primary">\n  Sign in\n</button>'},
];

export const Syntax: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const shrink = p(f, b.shrink, 26, easeInOut);
  const frameIn = p(f, b.shrink + 10, 20);
  const slots = ['Problem', 'Requirements', 'Architecture', 'Testing', 'Judgement'];
  return (
    <Stage>
      {SNIPPETS.map((s, i) => {
        const t = pop(f, 2 + i * 4, 160, 16);
        const gx = 70 + (i % 2) * 480;
        const gy = 560 + Math.floor(i / 2) * 330;
        // all collapse to a single chip at the centre of the larger frame
        const tx = 420 + (i % 2) * 8;
        const ty = 1030 + Math.floor(i / 2) * 8;
        return (
          <div
            key={s.lang}
            style={{
              position: 'absolute',
              left: lerp(gx, tx, shrink),
              top: lerp(gy, ty, shrink),
              width: 460,
              padding: 24,
              borderRadius: 16,
              background: C.ink2,
              border: `2px solid ${C.line}`,
              transformOrigin: 'top left',
              transform: `scale(${lerp(1, 0.52, shrink) * (0.9 + 0.1 * t)})`,
              opacity: Math.min(1, t * 1.5) * (1 - shrink),
            }}
          >
            <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 20, color: C.mute, letterSpacing: 2, marginBottom: 10}}>{s.lang}</div>
            <pre style={{margin: 0, fontFamily: F.mono, fontSize: 25, lineHeight: 1.45, color: C.paperDim, whiteSpace: 'pre', fontVariantLigatures: 'none'}}>{s.code}</pre>
          </div>
        );
      })}
      {/* the bigger job */}
      <div style={{position: 'absolute', left: 90, top: 560, width: 900, height: 900, borderRadius: 30, border: `2.5px dashed ${C.line}`, opacity: frameIn}}>
        {slots.map((sl, i) => {
          const a = (i / slots.length) * Math.PI * 2 - Math.PI / 2;
          const t = p(f, b.shrink + 14 + i * 3, 12);
          return (
            <div
              key={sl}
              style={{
                position: 'absolute',
                left: 450 + Math.cos(a) * 310 - 120,
                top: 450 + Math.sin(a) * 320 - 32,
                width: 240,
                height: 64,
                borderRadius: 12,
                border: `2px solid ${C.line}`,
                background: C.ink,
                fontFamily: F.ui,
                fontWeight: 600,
                fontSize: 26,
                color: C.paperDim,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: t,
              }}
            >
              {sl}
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 330, top: 405, width: 240, height: 90, borderRadius: 14, border: `2px solid ${C.lak}`, background: C.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: F.mono, fontSize: 30, color: C.lak, opacity: shrink}}>
          {'{ }'} <span style={{fontFamily: F.ui, fontWeight: 600}}>syntax</span>
        </div>
      </div>
      <Emphasis text="NOT JUST SYNTAX" at={b.text} size={104} y={260} align="center" color={C.paper} />
    </Stage>
  );
};

// ───────────────────────────── SCENE 12 ─────────────────────────────
// Tangle → subproblems → groups → connected architecture → a working app emerges.
const NODES = [
  {t: 'Login', g: 0},
  {t: 'Screens', g: 0},
  {t: 'Forms', g: 0},
  {t: 'Rules', g: 1},
  {t: 'Deadlines', g: 1},
  {t: 'Roles', g: 1},
  {t: 'Users', g: 2},
  {t: 'Tasks', g: 2},
  {t: 'History', g: 2},
];
const GROUPS = ['Interface', 'Logic', 'Data'];

export const Complex: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const untangle = p(f, b.untangle, 26, easeInOut);
  const group = p(f, b.group, 16);
  const connect = p(f, b.connect, 18);
  const app = p(f, b.app, 26, easeInOut);
  const jitter = (1 - untangle) * 6;
  const pos = NODES.map((n, i) => {
    const TANGLE = [[620, 1180], [140, 760], [700, 640], [260, 1260], [520, 900], [120, 1020], [760, 960], [360, 620], [420, 1120]];
    const [tx, ty] = TANGLE[i];
    const gi = NODES.filter((m, j) => m.g === n.g && j < i).length;
    const ox = 110 + gi * 290;
    const oy = 640 + n.g * 300;
    return {
      x: lerp(tx + Math.sin(f / 7 + i) * jitter, ox, untangle),
      y: lerp(ty + Math.cos(f / 9 + i) * jitter, oy, untangle),
    };
  });
  // tangled dependencies (crossing) fade out as structure appears
  const messy: [number, number][] = [[0, 7], [1, 5], [2, 8], [3, 6], [4, 0], [5, 2], [6, 1], [7, 3], [8, 4], [0, 5], [2, 6]];
  return (
    <Stage>
      <Emphasis text="SOLVE COMPLEX" at={2} size={96} y={250} align="center" />
      <Emphasis text="PROBLEMS" at={6} size={96} y={355} align="center" color={C.lak} />
      <AbsoluteFill style={{transform: `scale(${lerp(1, 0.42, app)}) translateY(${app * -120}px)`, transformOrigin: '50% 72%', opacity: 1 - app * 0.0}}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {messy.map(([a, c], i) => (
            <line key={i} x1={pos[a].x + 115} y1={pos[a].y + 40} x2={pos[c].x + 115} y2={pos[c].y + 40} stroke={C.bad} strokeWidth={2.5} opacity={0.55 * (1 - untangle)} />
          ))}
          {/* clean connections between layers */}
          {[0, 1].map((g) => (
            <g key={g} opacity={connect}>
              <line x1={540} y1={640 + g * 300 + 130} x2={540} y2={640 + g * 300 + 130 + 110 * connect} stroke={C.lak} strokeWidth={4} />
              <path d={`M528 ${640 + g * 300 + 228} L540 ${640 + g * 300 + 244} L552 ${640 + g * 300 + 228}`} stroke={C.lak} strokeWidth={4} fill="none" opacity={connect > 0.9 ? 1 : 0} />
            </g>
          ))}
        </svg>
        {GROUPS.map((g, i) => (
          <div
            key={g}
            style={{
              position: 'absolute',
              left: 70,
              top: 600 + i * 300,
              width: 940,
              height: 170,
              borderRadius: 22,
              border: `2px solid ${C.line}`,
              background: 'rgba(35,37,42,0.6)',
              opacity: group,
            }}
          >
            <div style={{position: 'absolute', left: 22, top: -36, fontFamily: F.ui, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.mute}}>{g.toUpperCase()}</div>
          </div>
        ))}
        {NODES.map((n, i) => (
          <div
            key={n.t}
            style={{
              position: 'absolute',
              left: pos[i].x,
              top: pos[i].y,
              width: 230,
              height: 80,
              borderRadius: 14,
              background: C.ink2,
              border: `2px solid ${untangle > 0.5 ? C.paperDim : C.line}`,
              fontFamily: F.ui,
              fontWeight: 600,
              fontSize: 28,
              color: C.paper,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: p(f, i * 1.5, 8),
            }}
          >
            {n.t}
          </div>
        ))}
      </AbsoluteFill>
      {/* the working app emerges from the organised system */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 520,
          width: 800,
          height: 560,
          borderRadius: 26,
          overflow: 'hidden',
          border: `2.5px solid ${C.lak}`,
          opacity: app,
          transform: `translateY(${(1 - app) * 80}px) scale(${0.9 + 0.1 * app})`,
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}
      >
        <SpecApp k={800 / 760} />
      </div>
    </Stage>
  );
};

// ───────────────────────────── SCENE 13 ─────────────────────────────
// AI sits in the middle of a human loop: you define → AI generates → you review → iterate.
export const AITool: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const steps = [
    {k: 'YOU', t: 'Understand the problem', c: C.lak},
    {k: 'YOU', t: 'Write clear instructions', c: C.lak},
    {k: 'AI', t: 'Generates the code', c: C.paper},
    {k: 'YOU', t: 'Review · decide · iterate', c: C.lak},
  ];
  const y0 = 470;
  const gap = 260;
  const dot = interpolate(f, [10, dur - 20], [0, steps.length - 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  const loop = p(f, dur - 30, 20);
  return (
    <Stage>
      <Label text="AI IS A TOOL IN THE LOOP" x={90} y={290} at={0} color={C.mute} size={30} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={190} y1={y0 + 60} x2={190} y2={y0 + 60 + gap * 3} stroke={C.line} strokeWidth={4} />
        {/* iterate loop back from review to instructions */}
        <path
          d={`M900 ${y0 + 60 + gap * 3} C1010 ${y0 + 60 + gap * 3} 1010 ${y0 + 60 + gap} 900 ${y0 + 60 + gap}`}
          stroke={C.lak}
          strokeWidth={4}
          fill="none"
          strokeDasharray={800}
          strokeDashoffset={800 * (1 - loop)}
        />
        <circle cx={190} cy={y0 + 60 + dot * gap} r={14} fill={C.lak} />
      </svg>
      {steps.map((s, i) => {
        const t = pop(f, 4 + i * 8, 170, 16);
        const active = Math.abs(dot - i) < 0.5;
        const ai = s.k === 'AI';
        return (
          <div key={i} style={{position: 'absolute', left: 120, top: y0 + i * gap, display: 'flex', alignItems: 'center', gap: 34, opacity: Math.min(1, t * 1.5), transform: `translateX(${(1 - t) * 40}px)`}}>
            <div
              style={{
                width: 140,
                height: 120,
                borderRadius: ai ? 60 : 20,
                background: ai ? C.paper : C.ink2,
                border: `3px solid ${active ? C.lak : C.line}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: F.display,
                fontWeight: 700,
                fontSize: 38,
                color: ai ? C.ink : s.c,
              }}
            >
              {s.k}
            </div>
            <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 40, color: active ? C.paper : C.paperDim, width: 600}}>{s.t}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 860, top: y0 + 2 * gap - 10, fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.lak, opacity: loop}}>iterate</div>
    </Stage>
  );
};

// ───────────────────────────── SCENE 14 ─────────────────────────────
const PROCESS = ['Problem', 'Requirements', 'Architecture', 'Build with AI', 'Test', 'Evaluate', 'Improve'];

export const Process: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const chip = pop(f, 2, 170, 16);
  const expand = p(f, b.expand, 20, easeInOut);
  const top = 480;
  const gap = 140;
  return (
    <Stage>
      <Emphasis text="PROCESS" at={b.expand} size={120} y={260} align="center" color={C.lak} />
      {/* syntax as a lone chip, before the workflow opens around it */}
      <div
        style={{
          position: 'absolute',
          left: lerp(390, 680, expand),
          top: lerp(860, top + 3 * gap + 18, expand),
          padding: lerp(22, 10, expand) + 'px ' + lerp(40, 18, expand) + 'px',
          borderRadius: 12,
          border: `2px solid ${C.mute}`,
          fontFamily: F.mono,
          fontSize: lerp(46, 24, expand),
          color: C.mute,
          opacity: Math.min(1, chip * 1.5),
          zIndex: 3,
        }}
      >
        syntax
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={150} y1={top + 40} x2={150} y2={top + 40 + gap * 6 * expand} stroke={C.line} strokeWidth={4} />
        {/* improve → back to requirements */}
        <path
          d={`M150 ${top + 40 + gap * 6} C40 ${top + 40 + gap * 6} 40 ${top + 40 + gap} 150 ${top + 40 + gap}`}
          stroke={C.lak}
          strokeWidth={4}
          fill="none"
          strokeDasharray={1200}
          strokeDashoffset={1200 * (1 - p(f, b.expand + 90, 24))}
        />
      </svg>
      {PROCESS.map((s, i) => {
        const t = p(f, b.expand + 12 + i * 12, 12);
        return (
          <div key={s} style={{position: 'absolute', left: 124, top: top + i * gap, display: 'flex', alignItems: 'center', gap: 30, opacity: t, transform: `translateX(${(1 - t) * 30}px)`}}>
            <div style={{width: 52, height: 52, borderRadius: 99, background: i === 3 ? C.lak : C.ink2, border: `3px solid ${i === 3 ? C.lak : C.paperDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.ui, fontWeight: 700, fontSize: 22, color: i === 3 ? C.ink : C.paper}}>
              {i + 1}
            </div>
            <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 52, color: C.paper}}>{s}</div>
          </div>
        );
      })}
    </Stage>
  );
};

// ───────────────────────────── SCENE 15 ─────────────────────────────
// The visible app swings aside to reveal what runs behind it; one request makes the round trip.
export const Architecture: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const behind = p(f, b.behind, 26, easeInOut);
  const mods = [
    {k: 'fe', t: 'Frontend', x: 380, y: 560},
    {k: 'api', t: 'API', x: 380, y: 800},
    {k: 'be', t: 'Backend', x: 380, y: 1040},
    {k: 'auth', t: 'Auth', x: 120, y: 1290},
    {k: 'db', t: 'Database', x: 640, y: 1290},
  ];
  const M = Object.fromEntries(mods.map((m) => [m.k, m]));
  const c = (k: string) => ({x: M[k].x + 160, y: M[k].y + 55});
  // request path: fe → api → be → auth → be → db → be → api → fe
  const path = ['fe', 'api', 'be', 'auth', 'be', 'db', 'be', 'api', 'fe'];
  const tp = interpolate(f, [b.packet, dur - 14], [0, path.length - 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const seg = Math.min(path.length - 2, Math.floor(tp));
  const a = c(path[seg]);
  const z = c(path[seg + 1]);
  const lt = easeInOut(tp - seg);
  const returning = tp > 4;
  const done = tp >= path.length - 1.01;
  return (
    <Stage>
      <Emphasis text="ARCHITECTURE" at={2} size={104} y={250} align="center" />
      {/* modules */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: behind}}>
        {[
          ['fe', 'api'],
          ['api', 'be'],
          ['be', 'auth'],
          ['be', 'db'],
        ].map(([s, e]) => (
          <line key={s + e} x1={c(s).x} y1={c(s).y} x2={c(e).x} y2={c(e).y} stroke={C.line} strokeWidth={4} />
        ))}
      </svg>
      {mods.map((m, i) => {
        const t = p(f, b.behind + 6 + i * 4, 12);
        const hot = tp > 0 && (path[seg] === m.k || path[seg + 1] === m.k);
        return (
          <div
            key={m.k}
            style={{
              position: 'absolute',
              left: m.x,
              top: m.y,
              width: 320,
              height: 110,
              borderRadius: 18,
              background: C.ink2,
              border: `3px solid ${hot ? C.lak : C.line}`,
              fontFamily: F.display,
              fontWeight: 700,
              fontSize: 42,
              color: C.paper,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: t,
              transform: `translateY(${(1 - t) * 20}px)`,
            }}
          >
            {m.t}
          </div>
        );
      })}
      {tp > 0 && !done && (
        <div style={{position: 'absolute', left: lerp(a.x, z.x, lt) - 16, top: lerp(a.y, z.y, lt) - 16, width: 32, height: 32, borderRadius: 99, background: returning ? C.ok : C.lak, border: `4px solid ${C.ink}`}} />
      )}
      <div style={{position: 'absolute', left: 750, top: 590, fontFamily: F.mono, fontSize: 26, color: C.ok, opacity: done ? 1 : 0}}>200 OK</div>
      <div style={{position: 'absolute', left: 740, top: 640, fontFamily: F.ui, fontSize: 22, color: C.mute, opacity: tp > 0 ? 1 : 0}}>
        {returning ? 'response' : 'request: sign in'}
      </div>
      {/* the visible app, which swings back and aside */}
      <div style={{position: 'absolute', inset: 0, perspective: 1600}}>
        <div
          style={{
            position: 'absolute',
            left: lerp(240, 60, behind),
            top: lerp(470, 520, behind),
            width: 600,
            height: 1080,
            borderRadius: 50,
            overflow: 'hidden',
            border: `10px solid ${C.ink3}`,
            transformOrigin: 'left center',
            transform: `rotateY(${behind * 62}deg) scale(${lerp(1, 0.42, behind)})`,
            opacity: 1 - behind * 0.15,
          }}
        >
          <SpecApp k={600 / 520} showLogin={false} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 420, background: C.ink, padding: 40}}>
            <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 46, color: C.paper, marginBottom: 20}}>Sign in</div>
            <div style={{height: 70, borderRadius: 14, border: `2px solid ${C.line}`, marginBottom: 16}} />
            <div style={{height: 78, borderRadius: 14, background: C.lak}} />
          </div>
        </div>
      </div>
    </Stage>
  );
};

// ───────────────────────────── SCENE 16 ─────────────────────────────
// AI writes it; a human checks it against the spec, a test catches a real bug, it gets fixed.
const CODE = [
  'function validateTask(task) {',
  '  if (!task.title) {',
  '    return "Title is required";',
  '  }',
  '  if (task.due <= today()) {',
  '    return "Due date is in the past";',
  '  }',
  '  return null;',
  '}',
];
const BUG_LINE = 4;

export const Judge: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const fixed = f >= b.fix + 8;
  const lineCount = Math.min(CODE.length, Math.floor(interpolate(f, [4, 40], [0, CODE.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  const review = p(f, b.review, 14);
  const fail = f >= b.fail && !fixed;
  const tests = [
    {t: 'empty title → error', ok: true},
    {t: 'due tomorrow → valid', ok: true},
    {t: 'due today → valid', ok: fixed},
    {t: 'missing date → error', ok: true},
  ];
  const checks = ['Meets the requirements?', 'Behaves correctly?', 'Any errors?', 'Fits the architecture?', 'Edge cases handled?'];
  return (
    <Stage>
      <Emphasis text="JUDGE THE CODE" at={b.review} size={100} y={250} align="center" />
      {/* generated code panel */}
      <Card x={60} y={420} w={960} h={560}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '18px 26px', borderBottom: `2px solid ${C.line}`}}>
          <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 22, padding: '4px 12px', borderRadius: 8, background: C.paper, color: C.ink}}>AI</div>
          <div style={{fontFamily: F.mono, fontSize: 24, color: C.mute}}>validateTask.js · generated</div>
        </div>
        <div style={{padding: '18px 26px'}}>
          {CODE.slice(0, lineCount).map((l, i) => {
            const isBug = i === BUG_LINE;
            const text = isBug && fixed ? '  if (task.due < today()) {' : l;
            return (
              <div
                key={i}
                style={{
                  fontFamily: F.mono,
                  fontSize: 30,
                  lineHeight: '50px',
                  color: C.paperDim,
                  whiteSpace: 'pre',
                  fontVariantLigatures: 'none',
                  background: isBug && fail ? 'rgba(217,88,78,0.22)' : isBug && fixed ? 'rgba(91,179,138,0.18)' : 'transparent',
                  borderLeft: `5px solid ${isBug && fail ? C.bad : isBug && fixed ? C.ok : 'transparent'}`,
                  paddingLeft: 10,
                  marginLeft: -15,
                }}
              >
                <span style={{color: C.line, marginRight: 22}}>{i + 1}</span>
                {text}
              </div>
            );
          })}
        </div>
      </Card>
      {/* human review checklist */}
      <div style={{position: 'absolute', left: 60, top: 1010, width: 450, opacity: review}}>
        <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.lak, marginBottom: 14}}>YOUR REVIEW</div>
        {checks.map((c, i) => (
          <div key={c} style={{fontFamily: F.ui, fontWeight: 500, fontSize: 26, color: C.paperDim, marginBottom: 14, opacity: p(f, b.review + i * 5, 8)}}>
            <span style={{color: C.lak, marginRight: 12}}>?</span>
            {c}
          </div>
        ))}
      </div>
      {/* tests */}
      <div style={{position: 'absolute', left: 540, top: 1010, width: 480, opacity: p(f, b.tests, 10)}}>
        <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.mute, marginBottom: 14}}>TESTS</div>
        {tests.map((t, i) => {
          const shown = f >= b.tests + i * 7;
          const state = !shown ? 'wait' : t.ok ? 'pass' : f >= b.fail ? 'fail' : 'wait';
          return (
            <div key={t.t} style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: F.mono, fontSize: 24, color: C.paperDim, marginBottom: 16, opacity: shown ? 1 : 0.3}}>
              <span style={{width: 34, height: 34, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.ui, fontWeight: 700, fontSize: 22, background: state === 'pass' ? C.ok : state === 'fail' ? C.bad : C.ink3, color: C.ink}}>
                {state === 'pass' ? '✓' : state === 'fail' ? '✕' : ''}
              </span>
              {t.t}
            </div>
          );
        })}
        <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 24, marginTop: 10, color: fixed ? C.ok : C.bad, opacity: f >= b.fail ? 1 : 0}}>
          {fixed ? 'Fixed: today is allowed (per spec)' : 'Bug: spec allows today'}
        </div>
      </div>
    </Stage>
  );
};

// ───────────────────────────── SCENE 17 ─────────────────────────────
export const Era: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const t = pop(f, b.text, 150, 16);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', opacity: Math.min(1, t * 1.4), transform: `translateY(${(1 - t) * 24}px)`}}>
        <div style={{display: 'inline-block', padding: '16px 34px', background: 'rgba(22,23,26,0.8)', borderRadius: 18}}>
          <span style={{fontFamily: F.display, fontWeight: 700, fontSize: 64, color: C.paper, letterSpacing: 2}}>
            IN THE <span style={{color: C.lak}}>AI ERA</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
