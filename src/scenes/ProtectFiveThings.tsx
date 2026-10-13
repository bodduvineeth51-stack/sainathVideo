import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CheckRow } from "../components/CheckRow";
import { FootageGuide } from "../components/FootageGuide";
import { SessionChip } from "../components/SessionChip";
import { SHIELD_H, SHIELD_W, Shield } from "../components/Shield";
import { colors, fontWeights, fonts, layout, popSpring } from "../theme";

// Deterministic camera shake offsets (±6px) on the headline impact.
const SHAKE_START = 33;
const SHAKE: [number, number][] = [
  [6, -4],
  [-5, 5],
  [3, -3],
];

export type ProtectFiveThingsProps = {
  /** Show the footage band in Studio for positioning. Keep false for export. */
  showGuides?: boolean;
};

export const ProtectFiveThings: React.FC<ProtectFiveThingsProps> = ({
  showGuides = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- Top band ----------
  // Chip pop (0–10), shield draw (8–26), fill + glow pulse (26–34)
  // Idle float (34+)
  const floatY = frame >= 34 ? 4 * Math.sin(((frame - 34) / fps) * Math.PI * 2) : 0;

  // ---------- Bottom band ----------
  // Headline slam (30–40)
  const slam = spring({
    frame: frame - 30,
    fps,
    config: popSpring,
    durationInFrames: 10,
  });
  const headlineScale = interpolate(slam, [0, 1], [1.6, 1]);
  const showHeadline = frame >= 30;

  const shake = SHAKE[frame - SHAKE_START] ?? [0, 0];

  return (
    <AbsoluteFill>
      {showGuides ? <FootageGuide /> : null}

      <AbsoluteFill
        style={{ transform: `translate(${shake[0]}px, ${shake[1]}px)` }}
      >
        {/* TOP BAND */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: layout.topCenterY - SHIELD_H / 2,
            height: SHIELD_H,
            display: "flex",
            justifyContent: "center",
            transform: `translateY(${floatY}px)`,
          }}
        >
          <Shield drawFrom={8} drawDuration={18}>
            {/* Session chip, sitting in the upper body of the shield */}
            <SessionChip
              style={{
                position: "absolute",
                left: (SHIELD_W - 620) / 2,
                top: 92,
              }}
            />
          </Shield>
        </div>

        {/* BOTTOM BAND */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: layout.bottomCenterY - 165,
            height: 330,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 36,
          }}
        >
          <div
            style={{
              fontFamily: fonts.headline,
              fontWeight: fontWeights.headline,
              fontSize: 150,
              lineHeight: 1.1,
              height: 165,
              letterSpacing: 2,
              color: colors.text,
              transform: `scale(${headlineScale})`,
              visibility: showHeadline ? "visible" : "hidden",
            }}
          >
            <span style={{ color: colors.cyan }}>5</span> THINGS
          </div>

          <CheckRow checked={0} popIn popInFrom={38} stagger={3} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
