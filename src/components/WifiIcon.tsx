import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, popSpring } from "../theme";

const W = 300;
const H = 240;
const CX = 150;
const CY = 210;
const RADII = [60, 115, 170];

const arc = (r: number) => {
  const a1 = (-135 * Math.PI) / 180;
  const a2 = (-45 * Math.PI) / 180;
  return `M ${CX + r * Math.cos(a1)} ${CY + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${
    CX + r * Math.cos(a2)
  } ${CY + r * Math.sin(a2)}`;
};

export type WifiIconProps = {
  /** Frame the dot pops in; arcs follow one by one. */
  popFrom?: number;
  stagger?: number;
  color?: string;
};

/** WiFi symbol (dot + 3 arcs) that pops in from the dot outward. */
export const WifiIcon: React.FC<WifiIconProps> = ({
  popFrom = 0,
  stagger = 3,
  color = colors.cyan,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (i: number) =>
    spring({
      frame: frame - popFrom - i * stagger,
      fps,
      config: popSpring,
      durationInFrames: 8,
    });

  const origin = { transformOrigin: `${CX}px ${CY}px` };

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <circle
        cx={CX}
        cy={CY}
        r={20}
        fill={color}
        style={{ ...origin, transform: `scale(${pop(0)})` }}
      />
      {RADII.map((r, i) => (
        <path
          key={r}
          d={arc(r)}
          fill="none"
          stroke={color}
          strokeWidth={24}
          strokeLinecap="round"
          style={{ ...origin, transform: `scale(${pop(i + 1)})` }}
        />
      ))}
    </svg>
  );
};
