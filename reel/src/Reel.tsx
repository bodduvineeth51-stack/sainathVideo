import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Subtitle, Title3D} from './components/Type';
import {TL, sec, type Shot} from './edit/load';
import {SCENES} from './scenes/registry';
import {C, F} from './lib/theme';

const hasFile = (p: string) => getStaticFiles().some((f) => f.name === p);

/**
 * Base layer: the cut talking-head footage runs continuously under everything, so dialogue
 * audio is one uninterrupted track and full-screen graphics simply cover the picture.
 * Without footage (animatic mode) a labelled slate stands in — never used for the final render.
 */
export const TalkingHead: React.FC = () => {
  const f = useCurrentFrame();
  if (hasFile(TL.footage)) {
    return <OffthreadVideo src={staticFile(TL.footage)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
  }
  const shot = TL.shots.find((s) => f >= sec(s.start) && f < sec(s.end));
  return (
    <AbsoluteFill style={{background: '#2A2C31', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={700} height={1100} viewBox="0 0 200 300" style={{position: 'absolute', bottom: 0, opacity: 0.25}}>
        <ellipse cx={100} cy={90} rx={48} ry={58} fill="none" stroke={C.paper} strokeWidth={2} strokeDasharray="4 4" />
        <path d="M10 300 C14 200 60 170 100 170 C140 170 186 200 190 300" fill="none" stroke={C.paper} strokeWidth={2} strokeDasharray="4 4" />
      </svg>
      <div style={{position: 'absolute', top: 720, left: 80, right: 80, textAlign: 'center', fontFamily: F.ui, color: C.mute}}>
        <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 4}}>ANIMATIC · TALKING HEAD</div>
        <div style={{fontSize: 30, marginTop: 14, color: C.paperDim}}>{shot?.line}</div>
      </div>
    </AbsoluteFill>
  );
};

const beatsToFrames = (b?: Record<string, number>) =>
  Object.fromEntries(Object.entries(b ?? {}).map(([k, v]) => [k, sec(v)]));

const ShotLayer: React.FC<{s: Shot}> = ({s}) => {
  const dur = sec(s.end) - sec(s.start);
  const props = {dur, b: beatsToFrames(s.beats), cfg: TL, ramRight: TL.ramScreenSide === 'right'};
  if (s.graphic === 'Title3D') {
    // the footage is revealed through the title's exit slot
    return (
      <Title3D dur={dur}>
        <Sequence from={-sec(s.start)}>
          <TalkingHead />
        </Sequence>
      </Title3D>
    );
  }
  const Comp = SCENES[s.graphic];
  return Comp ? <Comp {...props} /> : null;
};

/** Short dissolve-free cut handling: full-screen scenes get a 6-frame fade-in from the footage. */
const FullFade: React.FC<{children: React.ReactNode; s: Shot; prevFull: boolean}> = ({children, s, prevFull}) => {
  const f = useCurrentFrame();
  const o = s.view !== 'full' || prevFull || s.graphic === 'Title3D' ? 1 : interpolate(f, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const musicVolume = (f: number) => {
  const g = TL.music.gain;
  const at = (id: string) => TL.shots.find((s) => s.id === id);
  const nothing = at('s10_nothing');
  const victory = at('s09_victory');
  let v = g;
  if (victory && f >= sec(victory.start) && f < sec(victory.end)) v = g * 1.35; // controlled payoff
  if (nothing) {
    // dip under "Nothing." and recover into the argument
    const a = sec(nothing.start);
    const z = sec(nothing.end);
    v *= interpolate(f, [a, a + 20, z - 10, z + 30], [1, 0.25, 0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  }
  const end = sec(TL.shots[TL.shots.length - 1].end);
  v *= interpolate(f, [0, 20, end - 45, end], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return v;
};

export const Reel: React.FC<{showCaptions?: boolean}> = ({showCaptions = true}) => {
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <TalkingHead />
      {TL.shots.map((s, i) => (
        <Sequence key={s.id} from={sec(s.start)} durationInFrames={sec(s.end) - sec(s.start)} name={s.id}>
          <FullFade s={s} prevFull={i > 0 && TL.shots[i - 1].view === 'full' && s.view === 'full'}>
            <ShotLayer s={s} />
          </FullFade>
        </Sequence>
      ))}
      {showCaptions &&
        TL.captions.map((c, i) => (
          <Sequence key={i} from={sec(c.start)} durationInFrames={sec(c.end) - sec(c.start)} name={`cap ${c.text.slice(0, 18)}`}>
            <Subtitle text={c.text} dur={sec(c.end) - sec(c.start)} />
          </Sequence>
        ))}
      {/* sound design: cues ride with their shot */}
      {TL.shots.flatMap((s) =>
        (s.sfx ?? [])
          .filter((x) => hasFile(`sfx/${x.file}`))
          .map((x, j) => (
            <Sequence key={`${s.id}-${j}`} from={sec(s.start + x.at)} name={`sfx ${x.file}`}>
              <Audio src={staticFile(`sfx/${x.file}`)} volume={x.gain} />
            </Sequence>
          )),
      )}
      {hasFile(TL.music.file) && <Audio src={staticFile(TL.music.file)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};

/** One scene in isolation, for review stills and fast iteration. */
export const ScenePreview: React.FC<{id: string}> = ({id}) => {
  const s = TL.shots.find((x) => x.id === id)!;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {s.view !== 'full' && (
        <Sequence from={-sec(s.start)}>
          <TalkingHead />
        </Sequence>
      )}
      <ShotLayer s={s} />
    </AbsoluteFill>
  );
};
