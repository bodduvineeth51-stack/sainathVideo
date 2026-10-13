import React from "react";
import { Composition } from "remotion";
import { CheckRowDemo } from "./scenes/CheckRowDemo";
import { ProtectFiveThings } from "./scenes/ProtectFiveThings";
import { BEATS, Thing1PublicWifi } from "./scenes/Thing1PublicWifi";
import { DURATION as TIP1_DURATION, Tip1PublicWifi } from "./scenes/Tip1PublicWifi";
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
        id="Thing1PublicWifi"
        component={Thing1PublicWifi}
        durationInFrames={BEATS.end}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{ showGuides: false }}
      />
      <Composition
        id="Tip1PublicWifi"
        component={Tip1PublicWifi}
        durationInFrames={TIP1_DURATION}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{ showReference: true }}
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
