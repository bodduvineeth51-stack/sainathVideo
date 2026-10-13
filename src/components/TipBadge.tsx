import React from "react";
import { colors } from "../theme";
import { anton } from "./Headline";
import { usePop } from "./motion";

/**
 * Cyan "#N" badge.
 * - variant "pill" (default): small pill, ~110x64, Anton 48px.
 * - variant "big": Anton 120px block (Tip2's top-band badge).
 * With `enterAt`, it springs in (scale 0 → 1) at that frame.
 */
export const TipBadge: React.FC<{
  n: number;
  enterAt?: number;
  variant?: "pill" | "big";
}> = ({ n, enterAt, variant = "pill" }) => {
  const pop = usePop();
  const scale = enterAt === undefined ? 1 : pop(enterAt, 10);
  const label = `#${n}`;

  if (variant === "big") {
    return (
      <div
        style={{
          ...anton(120),
          lineHeight: 1,
          color: colors.panel,
          backgroundColor: colors.cyan,
          borderRadius: 32,
          padding: "18px 42px 14px",
          transform: `scale(${scale})`,
        }}
      >
        {label}
      </div>
    );
  }
  return (
    <div
      style={{
        ...anton(48),
        lineHeight: 1,
        letterSpacing: 1,
        color: colors.panel,
        backgroundColor: colors.cyan,
        borderRadius: 999,
        minWidth: 110,
        height: 64,
        boxSizing: "border-box",
        padding: "0 26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
      }}
    >
      {label}
    </div>
  );
};
