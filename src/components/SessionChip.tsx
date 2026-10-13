import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontWeights, fonts, popSpring } from "../theme";

export type SessionChipProps = {
  text?: string;
  /** Frame the chip pops in (scale 0 → 1). */
  popFrom?: number;
  borderColor?: string;
  textColor?: string;
  background?: string;
  /** RGB-split glitch on the text (danger moments). */
  glitch?: boolean;
  style?: React.CSSProperties;
};

export const SessionChip: React.FC<SessionChipProps> = ({
  text = "SESSION_ID: a9f3…k2",
  popFrom = 0,
  borderColor = colors.cyan,
  textColor = colors.text,
  background = colors.panel,
  glitch = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame: frame - popFrom,
    fps,
    config: popSpring,
    durationInFrames: 10,
  });

  // Deterministic jitter so renders are reproducible.
  const dx = glitch ? [5, -4, 7, -6, 3, -7][frame % 6] : 0;

  return (
    <div
      style={{
        minWidth: 620,
        height: 108,
        padding: "0 32px",
        boxSizing: "border-box",
        borderRadius: 999,
        border: `2px solid ${borderColor}`,
        backgroundColor: background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.mono,
        fontWeight: fontWeights.mono,
        fontSize: 48,
        color: textColor,
        whiteSpace: "nowrap",
        transform: `scale(${scale})`,
        textShadow: glitch
          ? `${dx}px 0 ${colors.danger}, ${-dx}px 0 ${colors.cyan}`
          : undefined,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
