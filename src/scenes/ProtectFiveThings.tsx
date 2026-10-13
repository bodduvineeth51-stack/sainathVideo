import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { CheckRow } from "../components/CheckRow";
import { colors, fontWeights, fonts, layout, popSpring } from "../theme";

// ---------- Shield geometry (local SVG coords) ----------
const SHIELD_W = 780;
const SHIELD_H = 320;
// Each half starts at the bottom tip and travels up to the top center,
// so both strokes draw "from bottom-center going both ways up".
const SHIELD_LEFT =
  "M 390 312 C 210 290 26 236 26 150 L 26 50 Q 210 50 390 10";
const SHIELD_RIGHT =
  "M 390 312 C 570 290 754 236 754 150 L 754 50 Q 570 50 390 10";
const SHIELD_FILL =
  "M 390 10 Q 210 50 26 50 L 26 150 C 26 236 210 290 390 312 C 570 290 754 236 754 150 L 754 50 Q 570 50 390 10 Z";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

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
  // Chip pop (0–10)
  const chipScale = spring({
    frame,
    fps,
    config: popSpring,
    durationInFrames: 10,
  });

  // Shield draw (8–26)
  const drawProgress = interpolate(frame, [8, 26], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const left = evolvePath(drawProgress, SHIELD_LEFT);
  const right = evolvePath(drawProgress, SHIELD_RIGHT);

  // Fill + glow pulse (26–34)
  const fillOpacity = interpolate(frame, [26, 29], [0, 0.15], clamp);
  const pulse = interpolate(frame, [26, 30, 34], [0, 1, 0], clamp);
  const shieldScale = 1 + 0.06 * pulse;
  const glowAlpha = Math.round(pulse * 255)
    .toString(16)
    .padStart(2, "0");

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
      {showGuides ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: layout.footageTop,
            height: layout.footageBottom - layout.footageTop,
            background: "rgba(255, 59, 92, 0.18)",
            border: `2px dashed ${colors.danger}`,
            boxSizing: "border-box",
          }}
        />
      ) : null}

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
          <div
            style={{
              position: "relative",
              width: SHIELD_W,
              height: SHIELD_H,
              transform: `scale(${shieldScale})`,
              filter:
                pulse > 0
                  ? `drop-shadow(0 0 40px ${colors.cyan}${glowAlpha})`
                  : undefined,
            }}
          >
            <svg
              width={SHIELD_W}
              height={SHIELD_H}
              viewBox={`0 0 ${SHIELD_W} ${SHIELD_H}`}
              style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
              <path d={SHIELD_FILL} fill={colors.cyan} fillOpacity={fillOpacity} />
              {frame >= 8 ? (
                <>
                  <path
                    d={SHIELD_LEFT}
                    fill="none"
                    stroke={colors.cyan}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={left.strokeDasharray}
                    strokeDashoffset={left.strokeDashoffset}
                  />
                  <path
                    d={SHIELD_RIGHT}
                    fill="none"
                    stroke={colors.cyan}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={right.strokeDasharray}
                    strokeDashoffset={right.strokeDashoffset}
                  />
                </>
              ) : null}
            </svg>

            {/* Session chip, sitting in the upper body of the shield */}
            <div
              style={{
                position: "absolute",
                left: (SHIELD_W - 620) / 2,
                top: 92,
                width: 620,
                height: 108,
                boxSizing: "border-box",
                borderRadius: 999,
                border: `2px solid ${colors.cyan}`,
                backgroundColor: colors.panel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.mono,
                fontWeight: fontWeights.mono,
                fontSize: 48,
                color: colors.text,
                whiteSpace: "nowrap",
                transform: `scale(${chipScale})`,
              }}
            >
              SESSION_ID: a9f3…k2
            </div>
          </div>
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
