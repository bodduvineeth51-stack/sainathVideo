import type {Timeline} from '../edit/load';

export type SceneProps = {
  /** shot length in frames */
  dur: number;
  /** spoken-word beats inside the shot, in frames from shot start */
  b: Record<string, number>;
  cfg: Timeline;
  /** true when Ram (creator's left hand) appears on the viewer's right */
  ramRight: boolean;
};
