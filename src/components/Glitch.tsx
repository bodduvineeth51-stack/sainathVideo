import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { jitter } from "./motion";

/** Renders children with a 4-slice horizontal offset + RGB split when active. */
export const Glitch: React.FC<{ active: boolean; children: React.ReactNode }> = ({
  active,
  children,
}) => {
  const frame = useCurrentFrame();
  if (!active) return <>{children}</>;
  const slices = [0, 25, 50, 75];
  return (
    <div
      style={{
        position: "relative",
        filter: `drop-shadow(${jitter(frame)}px 0 0 ${colors.danger}) drop-shadow(${-jitter(frame, 1)}px 0 0 ${colors.cyan})`,
      }}
    >
      <div style={{ visibility: "hidden" }}>{children}</div>
      {slices.map((top, i) => (
        <div
          key={top}
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(${top}% 0 ${100 - top - 25}% 0)`,
            transform: `translateX(${jitter(frame, i + 2) * 2}px)`,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
};
