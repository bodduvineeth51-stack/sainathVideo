import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AppBuilder, GenericApp, SpecApp} from '../components/AppBuilder';
import {Character, NameTag} from '../components/Character';
import {CityMap, Seat, Skyline} from '../components/Kingdom';
import {Emphasis, Label} from '../components/Type';
import {easeIn, easeInOut, easeOut, lerp, p, pop, typed} from '../lib/anim';
import {C, F} from '../lib/theme';
import type {SceneProps} from './types';

const Stage: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = C.ink}) => (
  <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>{children}</AbsoluteFill>
);

/** x positions for the two brothers in any side-by-side layout, honouring the hand mapping. */
const sides = (ramRight: boolean, left: number, right: number) => (ramRight ? {ram: right, lak: left} : {ram: left, lak: right});

// ───────────────────────────── SCENE 2 ─────────────────────────────
// Overlay above the speaker: the claim, then it is struck and pushed aside.
export const NotRequired: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const t = pop(f, b.show, 170, 16);
  const strike = p(f, b.strike, 9);
  const shove = p(f, b.strike + 5, 16);
  const out = p(f, dur - 8, 8, easeIn);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 250,
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.min(1, t * 1.6) * (1 - out),
          transform: `translateY(${(1 - t) * 24}px) translateX(${shove * -26}px) rotate(${shove * -1.5}deg)`,
        }}
      >
        <div style={{position: 'relative', padding: '22px 34px', background: 'rgba(22,23,26,0.82)', borderRadius: 22, border: `1.5px solid ${C.line}`}}>
          <div style={{fontFamily: F.ui, fontSize: 22, fontWeight: 600, color: C.mute, letterSpacing: 3, marginBottom: 8}}>WHAT EVERYONE SAYS</div>
          <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 58, color: C.paper, letterSpacing: 1, opacity: 1 - shove * 0.45}}>
            CODING IS NOT REQUIRED
          </div>
          <div style={{position: 'absolute', left: 22, top: 90, height: 8, width: `${strike * 92}%`, background: C.bad, transform: 'rotate(-1.5deg)', transformOrigin: 'left'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────── SCENE 3 ─────────────────────────────
// Identity tokens anchored to the hands. Left hand = Ram, right hand = Lakshman.
export const Brothers: React.FC<SceneProps> = ({b, dur, cfg}) => {
  const f = useCurrentFrame();
  const out = p(f, dur - 10, 10, easeIn);
  const Token: React.FC<{who: 'ram' | 'lak'; at: number}> = ({who, at}) => {
    const t = pop(f, at, 180, 14);
    const hand = cfg.hands[who];
    return (
      <div
        style={{
          position: 'absolute',
          left: hand.x - 130,
          top: hand.y - 420,
          width: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: Math.min(1, t * 1.6) * (1 - out),
          transform: `translateY(${(1 - t) * 40 - out * 60}px) scale(${0.85 + 0.15 * t})`,
        }}
      >
        <NameTag who={who} scale={0.92} />
        <Character who={who} size={150} style={{marginTop: 10}} />
        {/* leader line down to the hand */}
        <div style={{width: 3, height: 70 * t, background: who === 'ram' ? C.ram : C.lak, borderRadius: 2}} />
        <div style={{width: 16, height: 16, borderRadius: 99, border: `3px solid ${who === 'ram' ? C.ram : C.lak}`}} />
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Token who="ram" at={b.ram} />
      <Token who="lak" at={b.lak} />
    </AbsoluteFill>
  );
};

// ───────────────────────────── SCENE 4 ─────────────────────────────
// Boardroom → challenge card → push through the window into the city map → East District.
export const Father: React.FC<SceneProps> = ({b, dur, ramRight}) => {
  const f = useCurrentFrame();
  const enter = p(f, 0, 14);
  const card = pop(f, b.challenge, 160, 15);
  const toMap = p(f, b.map - 6, 16, easeInOut);
  const east = p(f, b.east, 22);
  const reward = pop(f, b.reward, 170, 15);
  const exit = p(f, dur - 12, 12, easeIn);
  const X = sides(ramRight, 250, 830);
  return (
    <Stage>
      {/* BOARDROOM */}
      <AbsoluteFill style={{opacity: 1 - Math.min(1, toMap * 1.8), transform: `scale(${1 + toMap * 0.6})`, transformOrigin: '50% 30%'}}>
        {/* glass wall onto the city */}
        <div style={{position: 'absolute', left: 80, right: 80, top: 230, height: 560, borderRadius: 24, overflow: 'hidden', background: C.dusk1}}>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${-200 - f * 0.4}px)`}}>
            <Skyline width={2400 * 0.55} height={1400 * 0.55} lights={0.7} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: `${i * 25}%`, width: 6, background: C.ink}} />
          ))}
        </div>
        {/* table */}
        <div style={{position: 'absolute', left: 60, right: 60, top: 1290, height: 70, background: C.ink3, borderRadius: 14}} />
        {/* father, centred, behind the table */}
        <div style={{position: 'absolute', left: 540 - 170, top: 880 + (1 - enter) * 40, opacity: enter}}>
          <Character who="dad" size={340} mood="focused" />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', justifyContent: 'center', opacity: enter}}>
          <NameTag who="dad" scale={0.7} sub="runs a tech company" />
        </div>
        {/* brothers in the foreground, backs to camera feel → small, at the sides */}
        {(['ram', 'lak'] as const).map((w) => (
          <div key={w} style={{position: 'absolute', left: X[w] - 110, top: 1360, opacity: enter}}>
            <Character who={w} size={220} />
            <div style={{display: 'flex', justifyContent: 'center', marginTop: -6}}>
              <NameTag who={w} scale={0.62} />
            </div>
          </div>
        ))}
        {/* challenge card from the father */}
        <div
          style={{
            position: 'absolute',
            left: 140,
            right: 140,
            top: 300,
            padding: '30px 36px',
            background: C.paper,
            borderRadius: 22,
            opacity: Math.min(1, card * 1.5),
            transform: `translateY(${(1 - card) * 40}px) scale(${0.9 + card * 0.1})`,
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: '#6B6F78'}}>THE CHALLENGE</div>
          <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 60, color: C.ink, lineHeight: 1.08, marginTop: 8}}>
            Build a good app.
            <br />
            <span style={{color: C.lakDeep}}>Win the East.</span>
          </div>
        </div>
      </AbsoluteFill>

      {/* CITY MAP */}
      <AbsoluteFill style={{opacity: Math.max(0, (toMap - 0.35) / 0.65) * (1 - exit), transform: `scale(${lerp(1.25, 1, toMap) * (1 + exit * 1.6)})`, transformOrigin: '75% 52%'}}>
        <div style={{position: 'absolute', left: 60, top: 470}}>
          <CityMap size={960} hi={east} ownerColor={C.dad} />
        </div>
        <Label text="THE CITY" x={70} y={300} color={C.mute} size={30} at={b.map} />
        <div style={{position: 'absolute', left: 70, top: 345, fontFamily: F.display, fontWeight: 700, fontSize: 84, color: C.paper, opacity: east, transform: `translateY(${(1 - east) * 20}px)`}}>
          EAST <span style={{color: C.lak}}>DISTRICT</span>
        </div>
        {/* owner pin on the district */}
        <div style={{position: 'absolute', left: 700, top: 760, opacity: east, transform: `translateY(${(1 - east) * -30}px)`}}>
          <div style={{width: 130, height: 130, borderRadius: 99, overflow: 'hidden', background: C.ink3, border: `4px solid ${C.dad}`}}>
            <Character who="dad" size={130} />
          </div>
          <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.paper, textAlign: 'center', marginTop: 8, letterSpacing: 2}}>OWNER</div>
        </div>
        {/* reward: one of the two will get it */}
        <div
          style={{
            position: 'absolute',
            left: 90,
            right: 90,
            top: 1470,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            opacity: Math.min(1, reward * 1.5),
            transform: `translateY(${(1 - reward) * 30}px)`,
          }}
        >
          <span style={{fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.paper}}>Reward for the better app →</span>
          <NameTag who={ramRight ? 'lak' : 'ram'} scale={0.5} />
          <span style={{fontFamily: F.display, fontSize: 34, color: C.mute}}>or</span>
          <NameTag who={ramRight ? 'ram' : 'lak'} scale={0.5} />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ───────────────────────────── SCENE 5 ─────────────────────────────
export const Task: React.FC<SceneProps> = ({dur, ramRight}) => {
  const f = useCurrentFrame();
  const inn = p(f, 0, 16);
  const X = sides(ramRight, 40, 560);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', opacity: inn}}>
        <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: C.mute}}>SAME TASK</div>
        <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 72, color: C.paper, marginTop: 6}}>
          Build an app <span style={{color: C.lak}}>with AI</span>
        </div>
      </div>
      {(['ram', 'lak'] as const).map((w, i) => {
        const t = pop(f, 8 + i * 5, 150, 16);
        return (
          <div key={w} style={{position: 'absolute', left: X[w], top: 520, opacity: Math.min(1, t * 1.5), transform: `translateY(${(1 - t) * 80}px)`}}>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: 20}}>
              <NameTag who={w} scale={0.75} />
            </div>
            <AppBuilder width={480} height={820} prompt="" accent={w === 'ram' ? C.ram : C.lak} />
          </div>
        );
      })}
    </Stage>
  );
};

// ───────────────────────────── SCENE 6 ─────────────────────────────
export const RamPrompt: React.FC<SceneProps> = ({b, dur, ramRight}) => {
  const f = useCurrentFrame();
  // continuity: Ram's window grows from its split-screen slot to full width
  const grow = p(f, 0, 18, easeInOut);
  const startX = ramRight ? 560 : 40;
  const x = lerp(startX, 60, grow);
  const w = lerp(480, 960, grow);
  const h = lerp(820, 1130, grow);
  const prompt = typed(f, b.type, 'Build me an app.', 16);
  const press = interpolate(f, [b.send, b.send + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gen = f < b.send + 2 ? -1 : interpolate(f, [b.send + 2, b.done], [0, 1], {extrapolateRight: 'clamp'});
  const note = p(f, b.send + 4, 12);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 60, top: 250, display: 'flex', alignItems: 'center', gap: 20, opacity: grow}}>
        <div style={{width: 100, height: 100, borderRadius: 99, overflow: 'hidden', background: C.ink3, border: `3px solid ${C.ram}`}}>
          <Character who="ram" size={100} />
        </div>
        <NameTag who="ram" scale={0.75} sub="doesn't write code" />
      </div>
      <div style={{position: 'absolute', left: x, top: lerp(520, 400, grow)}}>
        <AppBuilder width={w} height={h} prompt={prompt} caret={f >= b.type && f < b.send} press={press} gen={gen} accent={C.ram} promptHeight={130}>
          <GenericApp k={w / 900} reveal={p(f, b.done, 10)} />
        </AppBuilder>
      </div>
      {/* the whole instruction, called out */}
      <div style={{position: 'absolute', left: 60, top: 1560, display: 'flex', alignItems: 'center', gap: 16, opacity: note}}>
        <div style={{width: 40, height: 3, background: C.ram}} />
        <span style={{fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.paperDim}}>The entire instruction: one line, no requirements</span>
      </div>
    </Stage>
  );
};

// ───────────────────────────── SCENE 7 ─────────────────────────────
const MODULES: {key: string; title: string; body: React.ReactNode; beat?: 'auth' | 'design' | 'hierarchy'}[] = [
  {key: 'problem', title: 'Problem', body: 'Teams lose track of their tasks'},
  {key: 'users', title: 'Users', body: 'Small teams, 5–50 people'},
  {key: 'features', title: 'Features', body: 'Tasks · deadlines · assign'},
  {
    key: 'auth',
    title: 'Authentication',
    beat: 'auth',
    body: (
      <div>
        {['Email', 'Password'].map((x) => (
          <div key={x} style={{height: 26, border: `1.5px solid ${C.line}`, borderRadius: 6, marginBottom: 6, fontSize: 15, color: C.mute, paddingLeft: 8, lineHeight: '24px'}}>
            {x}
          </div>
        ))}
        <div style={{height: 26, borderRadius: 6, background: C.lak, color: C.ink, fontSize: 15, fontWeight: 700, textAlign: 'center', lineHeight: '26px'}}>Sign in</div>
      </div>
    ),
  },
  {key: 'design', title: 'Design', body: 'Calm, minimal, mobile first'},
  {
    key: 'colors',
    title: 'Colours & type',
    beat: 'design',
    body: (
      <div>
        <div style={{display: 'flex', gap: 6, marginBottom: 8}}>
          {[C.ink, C.paper, C.lak, C.mute].map((c) => (
            <div key={c} style={{width: 34, height: 34, borderRadius: 8, background: c, border: `1.5px solid ${C.line}`}} />
          ))}
        </div>
        <span style={{fontFamily: F.display, fontWeight: 700, fontSize: 30, color: C.paper}}>Aa</span>
        <span style={{fontFamily: F.ui, fontSize: 18, color: C.mute, marginLeft: 8}}>Space Grotesk / Inter</span>
      </div>
    ),
  },
  {
    key: 'hierarchy',
    title: 'Visual hierarchy',
    beat: 'hierarchy',
    body: (
      <div>
        <div style={{height: 18, width: '80%', background: C.paper, borderRadius: 4, marginBottom: 7}} />
        <div style={{height: 9, width: '95%', background: C.mute, borderRadius: 4, marginBottom: 5}} />
        <div style={{height: 9, width: '70%', background: C.mute, borderRadius: 4, marginBottom: 9}} />
        <div style={{height: 24, width: '45%', background: C.lak, borderRadius: 6}} />
      </div>
    ),
  },
  {key: 'structure', title: 'Structure', body: 'Login → Tasks → Team → Settings'},
  {key: 'validation', title: 'Validation', body: 'Title required · due date today or later'},
];

export const LakshmanSpec: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const inn = p(f, 0, 12);
  const prob = pop(f, b.problem, 160, 16);
  const docT = p(f, b.doc, 22, easeInOut); // cards → document
  const toBuilder = p(f, b.send - 22, 18, easeInOut); // document → builder
  const press = interpolate(f, [b.send, b.send + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gen = f < b.send + 2 ? -1 : interpolate(f, [b.send + 2, b.done], [0, 1], {extrapolateRight: 'clamp'});
  const cardW = 300;
  const cardH = 230;
  const gridTop = 700;
  return (
    <Stage>
      <div style={{position: 'absolute', left: 60, top: 250, display: 'flex', alignItems: 'center', gap: 20, opacity: inn}}>
        <div style={{width: 100, height: 100, borderRadius: 99, overflow: 'hidden', background: C.ink3, border: `3px solid ${C.lak}`}}>
          <Character who="lak" size={100} mood="focused" />
        </div>
        <NameTag who="lak" scale={0.75} sub="understands the problem first" />
      </div>

      {/* problem statement → splits into modules */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          right: 140,
          top: 430,
          padding: '24px 30px',
          borderRadius: 20,
          background: C.paper,
          opacity: Math.min(1, prob * 1.5) * (1 - docT),
          transform: `translateY(${(1 - prob) * 30}px)`,
        }}
      >
        <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 22, letterSpacing: 3, color: '#6B6F78'}}>ONE PROBLEM</div>
        <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 48, color: C.ink, marginTop: 4}}>“Build a good app”</div>
      </div>

      {/* connector lines from problem to modules */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - docT}}>
        {MODULES.map((m, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const tx = 60 + col * (cardW + 30) + cardW / 2;
          const ty = gridTop + row * (cardH + 26);
          const t = p(f, b.split + i * 2, 12);
          return <line key={m.key} x1={540} y1={590} x2={lerp(540, tx, t)} y2={lerp(590, ty, t)} stroke={C.line} strokeWidth={2} />;
        })}
      </svg>

      {MODULES.map((m, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const gx = 60 + col * (cardW + 30);
        const gy = gridTop + row * (cardH + 26);
        // document slot
        const dx = 140;
        const dy = 470 + i * 104;
        const t = pop(f, b.split + i * 2, 170, 16);
        const beatAt = m.beat ? b[m.beat] : undefined;
        const focus = beatAt !== undefined ? p(f, beatAt, 10) * (1 - p(f, beatAt + 40, 12)) : 0;
        const x = lerp(gx, dx, docT);
        const y = lerp(gy, dy, docT);
        const w = lerp(cardW, 800, docT);
        const h = lerp(cardH, 90, docT);
        return (
          <div
            key={m.key}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              padding: lerp(18, 16, docT),
              borderRadius: 16,
              background: C.ink2,
              border: `2px solid ${focus > 0 ? C.lak : C.line}`,
              opacity: Math.min(1, t * 1.6) * (1 - toBuilder),
              transform: `translate(${(1 - t) * (540 - gx - cardW / 2) * 0.6}px, ${(1 - t) * (560 - gy) * 0.6}px) scale(${(0.6 + 0.4 * t) * (1 + focus * 0.08)})`,
              zIndex: focus > 0 ? 5 : 1,
              boxShadow: focus > 0 ? '0 20px 40px rgba(0,0,0,0.5)' : 'none',
              fontFamily: F.ui,
              overflow: 'hidden',
              display: docT > 0.5 ? 'flex' : 'block',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div style={{fontWeight: 700, fontSize: 21, color: C.lak, letterSpacing: 1, marginBottom: 10, minWidth: docT > 0.5 ? 220 : undefined}}>
              {String(i + 1).padStart(2, '0')} {m.title}
            </div>
            {docT < 0.5 ? (
              <div style={{fontSize: 21, color: C.paper, lineHeight: 1.3, opacity: 1 - docT * 2}}>{m.body}</div>
            ) : (
              <div style={{fontSize: 20, color: C.mute, opacity: (docT - 0.5) * 2}}>{typeof m.body === 'string' ? m.body : m.key === 'auth' ? 'Email + password sign-in' : m.key === 'colors' ? 'Charcoal · off-white · amber' : 'Heading › text › action'}</div>
            )}
          </div>
        );
      })}

      {/* document frame */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 380,
          width: 860,
          height: 1050,
          borderRadius: 24,
          border: `2px solid ${C.line}`,
          opacity: docT * (1 - toBuilder),
        }}
      >
        <div style={{fontFamily: F.mono, fontSize: 26, color: C.paper, padding: '26px 30px'}}>spec.md</div>
      </div>

      {/* builder: the document arrives as an attachment */}
      {toBuilder > 0 && (
        <div style={{position: 'absolute', left: 60, top: 400, opacity: toBuilder, transform: `translateY(${(1 - toBuilder) * 60}px)`}}>
          <AppBuilder
            width={960}
            height={1130}
            prompt=""
            press={press}
            gen={gen}
            accent={C.lak}
            promptHeight={130}
            promptNode={
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 14}}>
                <span style={{fontFamily: F.mono, fontSize: 28, padding: '8px 16px', borderRadius: 10, background: C.ink2, border: `1.5px solid ${C.lak}`}}>spec.md</span>
                <span style={{fontSize: 26, color: C.mute}}>9 sections</span>
              </span>
            }
          >
            <SpecApp k={960 / 900} reveal={p(f, b.done, 10)} />
          </AppBuilder>
        </div>
      )}
    </Stage>
  );
};

// ───────────────────────────── SCENE 8 ─────────────────────────────
export const Compare: React.FC<SceneProps> = ({dur, ramRight}) => {
  const f = useCurrentFrame();
  const X = sides(ramRight, 40, 560);
  const rows: [string, string, string][] = [
    ['Instructions', '1 line', '9 sections'],
    ['Login', '—', '✓'],
    ['Defined features', 'generic', '✓'],
    ['Visual hierarchy', 'flat', '✓'],
    ['Checked vs. spec', '—', '✓'],
  ];
  return (
    <Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: F.display, fontWeight: 700, fontSize: 66, color: C.paper, opacity: p(f, 0, 12)}}>
        Which app is better?
      </div>
      {(['ram', 'lak'] as const).map((w, i) => {
        const t = pop(f, 4 + i * 4, 160, 16);
        return (
          <div key={w} style={{position: 'absolute', left: X[w], top: 400, opacity: Math.min(1, t * 1.5), transform: `translateY(${(1 - t) * 50}px)`}}>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: 16}}>
              <NameTag who={w} scale={0.68} />
            </div>
            <div style={{width: 480, height: 560, position: 'relative', borderRadius: 22, overflow: 'hidden', border: `2px solid ${w === 'ram' ? C.ram : C.lak}`}}>
              {w === 'ram' ? <GenericApp k={480 / 760} /> : <SpecApp k={480 / 760} />}
            </div>
          </div>
        );
      })}
      {/* comparison rows */}
      <div style={{position: 'absolute', left: 40, right: 40, top: 1110}}>
        {rows.map(([label, r, l], i) => {
          const t = p(f, 30 + i * 15, 10);
          const cell = (v: string, col: string) => (
            <div style={{width: 300, textAlign: 'center', fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: v === '✓' ? col : C.mute}}>{v}</div>
          );
          const left = ramRight ? cell(l, C.lak) : cell(r, C.ram);
          const right = ramRight ? cell(r, C.ram) : cell(l, C.lak);
          return (
            <div key={label} style={{display: 'flex', alignItems: 'center', height: 70, borderTop: `1.5px solid ${C.line}`, opacity: t, transform: `translateY(${(1 - t) * 10}px)`}}>
              {left}
              <div style={{flex: 1, textAlign: 'center', fontFamily: F.ui, fontWeight: 500, fontSize: 26, color: C.paperDim}}>{label}</div>
              {right}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// ───────────────────────────── SCENE 9 ─────────────────────────────
// Approval → ownership transfers → Lakshman takes the seat on the East Tower terrace → reveal Ram.
export const Victory: React.FC<SceneProps> = ({b, dur, ramRight}) => {
  const f = useCurrentFrame();
  const inn = p(f, 0, 18);
  const approve = pop(f, 6, 170, 15);
  const award = p(f, b.award, 22, easeInOut);
  const claim = p(f, b.claim, 18);
  const seat = pop(f, b.seat, 120, 15);
  const pan = p(f, b.ram, 30, easeInOut);
  const droop = p(f, b.ram + 10, 30);
  const out = p(f, dur - 8, 8, easeIn);
  // world camera: anchored on the terrace (world 1160,520); pushes in on the seat, then
  // drifts away from Ram's side while easing out so Ram enters the frame.
  const panDir = ramRight ? -1 : 1;
  const Sc = lerp(1.62, 1.5, inn) * lerp(1, 0.84, pan);
  const Tx = 540 + panDir * pan * 170;
  const Ty = lerp(980, 900, inn);
  return (
    <Stage bg={C.dusk1}>
      {/* sky: one quiet tone shift for the story world */}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.dusk1} 0%, ${C.dusk2} 75%, #5A4558 100%)`}} />
      <AbsoluteFill style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: Tx - 1160 * Sc, top: Ty - 520 * Sc, width: 2400, height: 1400, transformOrigin: '0 0', transform: `scale(${Sc})`}}>
          <Skyline width={2400} height={1400} claim={claim} />
          <div style={{position: 'absolute', left: 0, top: 1398, width: 2400, height: 600, background: '#1E2036'}} />
          {/* label on the district */}
          <div style={{position: 'absolute', left: 1280, top: 160, opacity: claim, transform: `translateY(${(1 - claim) * 10}px)`, fontFamily: F.display, fontWeight: 700, fontSize: 34, color: C.paper, whiteSpace: 'nowrap'}}>
            EAST DISTRICT
            <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.lak, letterSpacing: 2}}>NOW: LAKSHMAN</div>
          </div>
          {/* Lakshman seated on the terrace */}
          <div style={{position: 'absolute', left: 1160 - 100, top: 520 - 196 + (1 - seat) * 40, opacity: Math.min(1, seat * 1.5), width: 200}}>
            <div style={{position: 'absolute', left: -10, top: 70}}>
              <Seat w={220} />
            </div>
            <div style={{position: 'absolute', left: 10, top: 0}}>
              <Character who="lak" size={180} mood="confident" />
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* father's approval of the finished app (top card) */}
      <div style={{position: 'absolute', left: 90, right: 90, top: 250, height: 250, opacity: Math.min(1, approve * 1.5) * (1 - award), transform: `translateY(${(1 - approve) * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{width: 380, height: 230, position: 'relative', borderRadius: 18, overflow: 'hidden', border: `2px solid ${C.lak}`}}>
            <SpecApp k={380 / 760} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Character who="dad" size={150} mood="confident" />
            <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 26, color: C.ok, marginTop: 4}}>✓ Approved</div>
          </div>
        </div>
      </div>
      {/* ownership token travels from the father to Lakshman */}
      {award > 0 && award < 1 && (
        <div
          style={{
            position: 'absolute',
            left: lerp(780, 540, award) - 40,
            top: lerp(400, 820, award) - 40,
            width: 80,
            height: 80,
            borderRadius: 18,
            background: C.lak,
            transform: `rotate(${award * 90}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: F.display,
            fontWeight: 700,
            fontSize: 40,
            color: C.ink,
          }}
        >
          E
        </div>
      )}
      {/* Ram, revealed at the edge of frame, cooler and quieter */}
      {/* he stands on a lower rooftop in the foreground, looking up at the tower */}
      <div
        style={{
          position: 'absolute',
          left: ramRight ? lerp(1180, 600, pan) : lerp(-600, 0, pan),
          top: 1370,
          width: 480,
          opacity: Math.min(1, pan * 2) * (1 - out),
          filter: 'saturate(0.55) brightness(0.82)',
        }}
      >
        <Character who="ram" size={460} mood="sad" droop={droop} style={{transform: ramRight ? 'scaleX(-1)' : undefined, display: 'block'}} />
        <div style={{position: 'absolute', left: -200, right: -200, top: 470, height: 200, background: '#14151F'}} />
        <div style={{position: 'absolute', left: -200, right: -200, top: 468, height: 6, background: '#3B3D5C'}} />
      </div>
    </Stage>
  );
};

// ───────────────────────────── SCENE 10 ─────────────────────────────
// Deliberately empty: the face and the word carry it. (Music dip handled in the mix.)
export const Nothing: React.FC<SceneProps> = () => null;
