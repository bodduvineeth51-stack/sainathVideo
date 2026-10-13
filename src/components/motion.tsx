import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { popSpring } from "../theme";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Returns pop(from, duration) → spring 0→1 (with overshoot) starting at `from`. */
export const usePop = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (from: number, durationInFrames = 10) =>
    spring({ frame: frame - from, fps, config: popSpring, durationInFrames });
};

/** Absolutely positions a child with its center at (x, y). */
export const At: React.FC<{
  x: number;
  y: number;
  transform?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ x, y, transform = "", style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) ${transform}`,
      ...style,
    }}
  >
    {children}
  </div>
);

// Deterministic jitter table (renders must be reproducible).
const JITTER = [7, -5, 9, -8, 4, -9, 6, -4];
export const jitter = (frame: number, k = 0) =>
  JITTER[(frame + k * 3) % JITTER.length];
