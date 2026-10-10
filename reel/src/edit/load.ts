import raw from './timeline.json';

export type Sfx = {at: number; file: string; gain: number};
export type Shot = {
  id: string;
  scene: number;
  start: number;
  end: number;
  view: 'th' | 'full' | 'overlay';
  graphic: string;
  line: string;
  beats?: Record<string, number>;
  sfx?: Sfx[];
};
export type Caption = {start: number; end: number; text: string};
export type Timeline = {
  fps: number;
  footage: string;
  ramScreenSide: 'left' | 'right';
  hands: {ram: {x: number; y: number}; lak: {x: number; y: number}};
  music: {file: string; gain: number};
  shots: Shot[];
  captions: Caption[];
};

export const TL = raw as unknown as Timeline;
export const sec = (t: number) => Math.round(t * TL.fps);
export const totalFrames = () => sec(TL.shots[TL.shots.length - 1].end);
