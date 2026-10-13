import React from "react";
import { AbsoluteFill } from "remotion";
import { CheckRow } from "../components/CheckRow";
import { layout } from "../theme";

/** Preview of <CheckRow /> as it will be used in the per-tip scenes. */
export const CheckRowDemo: React.FC<{ checked: number }> = ({ checked }) => {
  return (
    <AbsoluteFill
      style={{
        top: layout.bottomCenterY - 45,
        height: 90,
        alignItems: "center",
      }}
    >
      <CheckRow checked={checked} checkFrom={6} />
    </AbsoluteFill>
  );
};
