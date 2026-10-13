import React from "react";
import { Img, getStaticFiles, staticFile } from "remotion";
import { colors, fonts } from "../theme";

/**
 * A PNG from public/, fitted into a size×size box. If the file is missing,
 * draws a dashed placeholder with the filename so the scene still previews.
 */
export const AssetImage: React.FC<{
  file: string;
  size: number;
  style?: React.CSSProperties;
}> = ({ file, size, style }) => {
  const exists = getStaticFiles().some((f) => f.name === file);
  if (!exists) {
    return (
      <div
        style={{
          width: size,
          height: size,
          boxSizing: "border-box",
          border: `3px dashed ${colors.text}`,
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 32,
          color: colors.text,
          ...style,
        }}
      >
        {file}
      </div>
    );
  }
  return (
    <Img
      src={staticFile(file)}
      style={{ width: size, height: size, objectFit: "contain", ...style }}
    />
  );
};
