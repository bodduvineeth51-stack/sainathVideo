import React from 'react';
import {C, F} from '../lib/theme';

/**
 * Generic AI app-builder window. Deliberately unbranded and tagged "illustration" so it is never
 * mistaken for a real product screenshot (the dialogue names the real tool; the visual does not mimic it).
 */
export const AppBuilder: React.FC<{
  width: number;
  height: number;
  prompt: string;
  caret?: boolean;
  /** 0..1 submit button press */
  press?: number;
  /** 0..1 generation progress; <0 = not started */
  gen?: number;
  accent?: string;
  children?: React.ReactNode; // generated preview
  promptHeight?: number;
  promptNode?: React.ReactNode; // replaces text prompt (e.g. attached spec doc)
  style?: React.CSSProperties;
}> = ({width, height, prompt, caret, press = 0, gen = -1, accent = C.paper, children, promptHeight = 120, promptNode, style}) => {
  const k = width / 900;
  const barH = 64 * k;
  return (
    <div
      style={{
        width,
        height,
        background: C.ink2,
        borderRadius: 30 * k,
        border: `${1.5 * k}px solid ${C.line}`,
        boxShadow: '0 40px 80px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      <div style={{height: barH, display: 'flex', alignItems: 'center', padding: `0 ${26 * k}px`, gap: 12 * k, borderBottom: `${1.5 * k}px solid ${C.line}`}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 14 * k, height: 14 * k, borderRadius: 99, background: C.line}} />
        ))}
        <span style={{marginLeft: 14 * k, fontFamily: F.ui, fontWeight: 600, fontSize: 24 * k, color: C.paperDim}}>AI App Builder</span>
        <span style={{marginLeft: 'auto', fontFamily: F.ui, fontSize: 18 * k, color: C.mute, border: `${1 * k}px solid ${C.line}`, borderRadius: 8 * k, padding: `${3 * k}px ${10 * k}px`}}>
          illustration
        </span>
      </div>
      {/* preview canvas */}
      <div style={{flex: 1, position: 'relative', background: '#1B1C20', margin: 20 * k, borderRadius: 18 * k, overflow: 'hidden'}}>
        {gen >= 0 && gen < 1 && <Generating k={k} t={gen} accent={accent} />}
        {gen >= 1 && children}
        {gen < 0 && (
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.ui, fontSize: 24 * k, color: C.line}}>
            Preview
          </div>
        )}
      </div>
      {/* prompt bar */}
      <div
        style={{
          height: promptHeight * k,
          margin: `0 ${20 * k}px ${20 * k}px`,
          borderRadius: 18 * k,
          background: C.ink3,
          border: `${1.5 * k}px solid ${C.line}`,
          display: 'flex',
          alignItems: 'center',
          padding: `0 ${18 * k}px 0 ${26 * k}px`,
          gap: 16 * k,
        }}
      >
        <div style={{flex: 1, fontFamily: F.ui, fontWeight: 500, fontSize: 34 * k, color: C.paper, whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {promptNode ?? (
            <>
              {prompt || <span style={{color: C.mute}}>Describe what to build…</span>}
              {caret && <span style={{display: 'inline-block', width: 3 * k, height: 36 * k, background: C.paper, marginLeft: 3 * k, verticalAlign: 'middle'}} />}
            </>
          )}
        </div>
        <div
          style={{
            width: 68 * k,
            height: 68 * k,
            borderRadius: 16 * k,
            background: accent,
            transform: `scale(${1 - 0.12 * Math.sin(Math.PI * press)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={30 * k} height={30 * k} viewBox="0 0 24 24">
            <path d="M12 19V5M5 12l7-7 7 7" stroke={C.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/** Calm, non-glowing build progress: skeleton rows filling in + a thin progress rule. */
const Generating: React.FC<{k: number; t: number; accent: string}> = ({k, t, accent}) => {
  const rows = [0.55, 0.9, 0.75, 0.82, 0.6, 0.9];
  return (
    <div style={{position: 'absolute', inset: 0, padding: 34 * k}}>
      <div style={{fontFamily: F.mono, fontSize: 22 * k, color: C.mute, marginBottom: 26 * k}}>Generating{'.'.repeat(1 + (Math.floor(t * 12) % 3))}</div>
      {rows.map((w, i) => {
        const v = Math.min(1, Math.max(0, t * rows.length - i));
        return <div key={i} style={{height: 26 * k, width: `${w * 100 * v}%`, background: C.ink3, borderRadius: 8 * k, marginBottom: 20 * k}} />;
      })}
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 5 * k, width: `${t * 100}%`, background: accent}} />
    </div>
  );
};

/** Ram's result: a coherent but generic app — nothing specified, so nothing specific. */
export const GenericApp: React.FC<{k: number; reveal?: number}> = ({k, reveal = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: '#ECEAE6', padding: 36 * k, opacity: reveal, fontFamily: F.ui}}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 * k}}>
      <div style={{fontSize: 30 * k, fontWeight: 600, color: '#555'}}>My App</div>
      <div style={{display: 'flex', gap: 14 * k}}>
        {['Home', 'About', 'Contact'].map((x) => (
          <span key={x} style={{fontSize: 22 * k, color: '#777'}}>{x}</span>
        ))}
      </div>
    </div>
    <div style={{fontSize: 34 * k, fontWeight: 500, color: '#555', marginBottom: 12 * k}}>Welcome to your app</div>
    <div style={{fontSize: 24 * k, color: '#888', marginBottom: 26 * k}}>This is your new application.</div>
    <div style={{display: 'flex', gap: 18 * k}}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{flex: 1, height: 150 * k, background: '#DAD7D2', borderRadius: 14 * k, padding: 16 * k, fontSize: 22 * k, color: '#777'}}>
          Feature {i}
        </div>
      ))}
    </div>
    <div style={{marginTop: 26 * k, display: 'inline-block', padding: `${12 * k}px ${22 * k}px`, background: '#BDBAB4', color: '#555', borderRadius: 10 * k, fontSize: 22 * k}}>
      Get started
    </div>
  </div>
);

/** Lakshman's result: follows the spec — login, clear hierarchy, the stated features and design system. */
export const SpecApp: React.FC<{k: number; reveal?: number; showLogin?: boolean}> = ({k, reveal = 1, showLogin = true}) => (
  <div style={{position: 'absolute', inset: 0, background: C.paper, opacity: reveal, fontFamily: F.ui, display: 'flex'}}>
    {showLogin && (
      <div style={{width: '38%', background: C.ink, padding: 28 * k, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 30 * k, color: C.paper, marginBottom: 20 * k}}>Sign in</div>
        {['Email', 'Password'].map((x) => (
          <div key={x} style={{height: 46 * k, borderRadius: 10 * k, border: `${1.5 * k}px solid ${C.line}`, marginBottom: 14 * k, fontSize: 19 * k, color: C.mute, display: 'flex', alignItems: 'center', paddingLeft: 14 * k}}>
            {x}
          </div>
        ))}
        <div style={{height: 50 * k, borderRadius: 10 * k, background: C.lak, color: C.ink, fontWeight: 700, fontSize: 21 * k, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          Sign in
        </div>
      </div>
    )}
    <div style={{flex: 1, padding: 30 * k}}>
      <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 42 * k, color: C.ink}}>Team Tasks</div>
      <div style={{fontSize: 20 * k, color: '#6B6F78', marginBottom: 18 * k}}>3 due this week · 5 members</div>
      <div style={{display: 'inline-block', padding: `${10 * k}px ${18 * k}px`, background: C.lak, borderRadius: 10 * k, fontWeight: 700, fontSize: 20 * k, color: C.ink, marginBottom: 18 * k}}>
        + New task
      </div>
      {[
        ['Design review', 'Today'],
        ['Login flow', 'Wed'],
        ['Release notes', 'Fri'],
      ].map(([t, d]) => (
        <div key={t} style={{display: 'flex', alignItems: 'center', gap: 12 * k, padding: `${12 * k}px 0`, borderTop: `${1.5 * k}px solid ${C.paperDim}`}}>
          <div style={{width: 20 * k, height: 20 * k, borderRadius: 6 * k, border: `${2 * k}px solid ${C.ink}`}} />
          <div style={{flex: 1, fontSize: 21 * k, fontWeight: 500, color: C.ink}}>{t}</div>
          <div style={{fontSize: 18 * k, color: '#6B6F78'}}>{d}</div>
        </div>
      ))}
    </div>
  </div>
);
