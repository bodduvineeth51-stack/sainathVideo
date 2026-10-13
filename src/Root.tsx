import React from "react";
import { Composition } from "remotion";
import { CheckRowDemo } from "./scenes/CheckRowDemo";
import { ProtectFiveThings } from "./scenes/ProtectFiveThings";
import { video } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProtectFiveThings"
        component={ProtectFiveThings}
        durationInFrames={60}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{ showGuides: false }}
      />
      <Composition
        id="CheckRowDemo"
        component={CheckRowDemo}
        durationInFrames={30}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{ checked: 2 }}
      />
    </>
  );
};
