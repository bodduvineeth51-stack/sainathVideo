import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { colors, popSpring } from "../theme";

const BOX = 90;
const BORDER = 4;
const RADIUS = 18;
const GAP = 28;
const CHECK_PATH = "M 22 46 L 38 62 L 68 29";

export type CheckRowProps = {
  /** How many boxes are ticked (0–5), counted from the left. */
  checked: number;
  /** Total number of boxes. */
  total?: number;
  /** Pop the boxes in one by one (scale 0 → 1). Off = boxes already visible. */
  popIn?: boolean;
  /** Frame (relative to the parent Sequence) at which the first box pops in. */
  popInFrom?: number;
  /** Frames between each box popping in. */
  stagger?: number;
  /**
   * Animate the newest tick (box #checked) drawing in. Earlier ticks are
   * shown fully drawn, so scene N can use checked={N} and only tip N animates.
   */
  animateNewest?: boolean;
  /** Frame at which the newest checkmark starts drawing. */
  checkFrom?: number;
  /** Duration of the checkmark draw in frames. */
  checkDuration?: number;
};

export const CheckRow: React.FC<CheckRowProps> = ({
  checked,
  total = 5,
  popIn = false,
  popInFrom = 0,
  stagger = 3,
  animateNewest = true,
  checkFrom = 0,
  checkDuration = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ticked = Math.max(0, Math.min(total, Math.round(checked)));

  return (
    <div style={{ display: "flex", gap: GAP }}>
      {Array.from({ length: total }, (_, i) => {
        const scale = popIn
          ? spring({
              frame: frame - popInFrom - i * stagger,
              fps,
              config: popSpring,
              durationInFrames: 8,
            })
          : 1;

        const isTicked = i < ticked;
        const isNewest = i === ticked - 1 && animateNewest;
        const drawProgress = !isTicked
          ? 0
          : isNewest
            ? interpolate(frame, [checkFrom, checkFrom + checkDuration], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;
        const { strokeDasharray, strokeDashoffset } = evolvePath(
          drawProgress,
          CHECK_PATH,
        );

        return (
          <div
            key={i}
            style={{
              position: "relative",
              width: BOX,
              height: BOX,
              boxSizing: "border-box",
              border: `${BORDER}px solid ${colors.cyan}`,
              borderRadius: RADIUS,
              backgroundColor: isTicked
                ? `rgba(34, 211, 238, ${0.15 * Math.min(1, drawProgress * 2)})`
                : "transparent",
              transform: `scale(${scale})`,
            }}
          >
            {isTicked && drawProgress > 0 ? (
              <svg
                width={BOX}
                height={BOX}
                viewBox={`0 0 ${BOX} ${BOX}`}
                style={{ position: "absolute", left: -BORDER, top: -BORDER }}
              >
                <path
                  d={CHECK_PATH}
                  fill="none"
                  stroke={colors.cyan}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
