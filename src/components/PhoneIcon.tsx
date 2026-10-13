import React from "react";
import { colors } from "../theme";

/** Flat phone (150x260): navy fill, off-white outline. */
export const PhoneIcon: React.FC = () => (
  <svg width={150} height={260} viewBox="0 0 150 260">
    <rect x={5} y={5} width={140} height={250} rx={26} fill={colors.panel} stroke={colors.text} strokeWidth={7} />
    <rect x={22} y={36} width={106} height={180} rx={8} fill="none" stroke={colors.text} strokeWidth={3} opacity={0.5} />
    <line x1={58} y1={21} x2={92} y2={21} stroke={colors.text} strokeWidth={5} strokeLinecap="round" />
    <circle cx={75} cy={236} r={9} fill="none" stroke={colors.text} strokeWidth={4} />
  </svg>
);
