import React from "react";
import { colors, layout } from "../theme";

/** Studio-only marker for the footage band. Never enable for export. */
export const FootageGuide: React.FC = () => (
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
);
