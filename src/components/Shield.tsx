import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { colors } from "../theme";

export const SHIELD_W = 780;
export const SHIELD_H = 320;

// Each half starts at the bottom tip and travels up to the top center,
// so both strokes draw "from bottom-center going both ways up".
const SHIELD_LEFT =
  "M 390 312 C 210 290 26 236 26 150 L 26 50 Q 210 50 390 10";
const SHIELD_RIGHT =
  "M 390 312 C 570 290 754 236 754 150 L 754 50 Q 570 50 390 10";
const SHIELD_FILL =
  "M 390 10 Q 210 50 26 50 L 26 150 C 26 236 210 290 390 312 C 570 290 754 236 754 150 L 754 50 Q 570 50 390 10 Z";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type ShieldProps = {
  /** Frame the outline starts drawing. */
  drawFrom: number;
  /** Frames the outline takes to draw. */
  drawDuration?: number;
  /** Frame the fill + glow pulse starts (defaults to end of draw). */
  pulseFrom?: number;
  color?: string;
  /** Content placed inside the shield (absolutely positioned, 780x320 box). */
  children?: React.ReactNode;
};

export const Shield: React.FC<ShieldProps> = ({
  drawFrom,
  drawDuration = 18,
  pulseFrom = drawFrom + drawDuration,
  color = colors.cyan,
  children,
}) => {
  const frame = useCurrentFrame();

  const drawProgress = interpolate(
    frame,
    [drawFrom, drawFrom + drawDuration],
    [0, 1],
    { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) },
  );
  const left = evolvePath(drawProgress, SHIELD_LEFT);
  const right = evolvePath(drawProgress, SHIELD_RIGHT);

  // Fill to 15% + single glow pulse with scale 1 → 1.06 → 1
  const fillOpacity = interpolate(
    frame,
    [pulseFrom, pulseFrom + 3],
    [0, 0.15],
    clamp,
  );
  const pulse = interpolate(
    frame,
    [pulseFrom, pulseFrom + 4, pulseFrom + 8],
    [0, 1, 0],
    clamp,
  );
  const glowAlpha = Math.round(pulse * 255)
    .toString(16)
    .padStart(2, "0");

  return (
    <div
      style={{
        position: "relative",
        width: SHIELD_W,
        height: SHIELD_H,
        transform: `scale(${1 + 0.06 * pulse})`,
        filter: pulse > 0 ? `drop-shadow(0 0 40px ${color}${glowAlpha})` : undefined,
      }}
    >
      <svg
        width={SHIELD_W}
        height={SHIELD_H}
        viewBox={`0 0 ${SHIELD_W} ${SHIELD_H}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <path d={SHIELD_FILL} fill={color} fillOpacity={fillOpacity} />
        {frame >= drawFrom
          ? [left, right].map((half, i) => (
              <path
                key={i}
                d={i === 0 ? SHIELD_LEFT : SHIELD_RIGHT}
                fill="none"
                stroke={color}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={half.strokeDasharray}
                strokeDashoffset={half.strokeDashoffset}
              />
            ))
          : null}
      </svg>
      {children}
    </div>
  );
};
