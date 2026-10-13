import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fontWeights, fonts } from "../theme";
import { At, clamp, usePop } from "./motion";

/** Vertical center of the bottom-band headline. */
export const HEADLINE_Y = 1500;
/** Frames the outgoing headline takes to exit up. */
const EXIT = 6;

/**
 * Bottom-band headline shown from `from` to `to`. Enters from below with a
 * spring ("rise") or scales in ("pop"); exits up + fades over 6 frames.
 */
export const Headline: React.FC<{
  from: number;
  to: number;
  enter?: "rise" | "pop";
  children: React.ReactNode;
}> = ({ from, to, enter = "rise", children }) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  if (frame < from || frame >= to + EXIT) return null;

  const s = pop(from, 10);
  const exitT = interpolate(frame, [to, to + EXIT], [0, 1], clamp);
  const enterTransform =
    enter === "pop" ? `scale(${s})` : `translateY(${(1 - s) * 140}px)`;

  return (
    <At
      x={540}
      y={HEADLINE_Y}
      transform={`translateY(${-70 * exitT}px) ${enterTransform}`}
      style={{ opacity: 1 - exitT, whiteSpace: "nowrap", textAlign: "center" }}
    >
      {children}
    </At>
  );
};

/** Anton headline text style. */
export const anton = (size: number): React.CSSProperties => ({
  fontFamily: fonts.headline,
  fontWeight: fontWeights.headline,
  fontSize: size,
  lineHeight: 1.1,
  letterSpacing: 2,
  color: colors.text,
});

/** Poppins SemiBold text style (multi-line headlines, labels). */
export const poppins = (size: number): React.CSSProperties => ({
  fontFamily: fonts.label,
  fontWeight: fontWeights.label,
  fontSize: size,
  lineHeight: 1.2,
  color: colors.text,
});
