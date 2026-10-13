import React from "react";
import { Composition } from "remotion";
import { CheckRowDemo } from "./scenes/CheckRowDemo";
import { ProtectFiveThings } from "./scenes/ProtectFiveThings";
import { BEATS, Thing1PublicWifi } from "./scenes/Thing1PublicWifi";
import { DURATION as TIP1_DURATION, Tip1PublicWifi } from "./scenes/Tip1PublicWifi";
import { DURATION as TIP2_DURATION, Tip2Logout } from "./scenes/Tip2Logout";
import { DURATION as TIP3_DURATION, Tip3TwoFactor } from "./scenes/Tip3TwoFactor";
import { DURATION as TIP4_DURATION, Tip4ActiveSessions } from "./scenes/Tip4ActiveSessions";
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
        defaultProps={{ showReference: true, showBeatLabels: true }}
      />
      <Composition
        id="Tip2Logout"
        component={Tip2Logout}
        durationInFrames={TIP2_DURATION}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{ showReference: true, showBeatLabels: true }}
      />
      <Composition
        id="Tip3TwoFactor"
        component={Tip3TwoFactor}
        durationInFrames={TIP3_DURATION}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{ showReference: true, showBeatLabels: true }}
      />
      <Composition
        id="Tip4ActiveSessions"
        component={Tip4ActiveSessions}
        durationInFrames={TIP4_DURATION}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{ showReference: true, showBeatLabels: true }}
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
