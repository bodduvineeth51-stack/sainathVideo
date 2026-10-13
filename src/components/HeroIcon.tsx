import React from "react";
import { Img, staticFile } from "remotion";

/** Source PNGs are 256px; anything much larger looks blurry. */
export const HERO_MAX = 280;

/** A PNG from public/icons/, fitted into a size×size box (capped at HERO_MAX). */
export const HeroIcon: React.FC<{
  name: string;
  size: number;
  style?: React.CSSProperties;
}> = ({ name, size, style }) => {
  const s = Math.min(size, HERO_MAX);
  return (
    <Img
      src={staticFile(`icons/${name}`)}
      style={{ width: s, height: s, objectFit: "contain", ...style }}
    />
  );
};
