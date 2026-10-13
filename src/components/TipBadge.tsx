import React from "react";
import { colors } from "../theme";
import { anton } from "./Headline";

/** Cyan "#N" badge (Anton 120px). Wrap in <Headline enter="pop"> to animate. */
export const TipBadge: React.FC<{ n: number }> = ({ n }) => (
  <div
    style={{
      ...anton(120),
      lineHeight: 1,
      color: colors.panel,
      backgroundColor: colors.cyan,
      borderRadius: 32,
      padding: "18px 42px 14px",
    }}
  >
    {`#${n}`}
  </div>
);
