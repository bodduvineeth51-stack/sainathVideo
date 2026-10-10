import React from 'react';
import {Composition} from 'remotion';
import './lib/fonts';
import {Reel, ScenePreview} from './Reel';
import {TL, sec, totalFrames} from './edit/load';
import {FPS, H, W} from './lib/theme';

export const Root: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} durationInFrames={totalFrames()} fps={FPS} width={W} height={H} defaultProps={{showCaptions: true}} />
    {TL.shots.map((s) => (
      <Composition
        key={s.id}
        id={`Scene-${s.id.replace(/_/g, '-')}`}
        component={ScenePreview}
        durationInFrames={sec(s.end) - sec(s.start)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{id: s.id}}
      />
    ))}
  </>
);
