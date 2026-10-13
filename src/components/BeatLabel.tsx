import React from "react";
import { useCurrentFrame } from "remotion";
import { fonts } from "../theme";

/**
 * Studio-only sync helper: shows the current frame and the most recent beat,
 * e.g. "f 190 · vpnOn", in the top-left corner. Never enable for export.
 */
export const BeatLabel: React.FC<{ beats: Record<string, number> }> = ({ beats }) => {
  const frame = useCurrentFrame();
  const current = Object.entries(beats)
    .filter(([, f]) => f <= frame)
    .sort((a, b) => a[1] - b[1])
    .pop();

  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        top: 16,
        padding: "6px 12px",
        background: "#000000",
        color: "#FFD60A",
        fontFamily: fonts.mono,
        fontSize: 28,
        lineHeight: 1,
        whiteSpace: "nowrap",
        zIndex: 10,
      }}
    >
      f {frame} · {current ? current[0] : "–"}
    </div>
  );
};
