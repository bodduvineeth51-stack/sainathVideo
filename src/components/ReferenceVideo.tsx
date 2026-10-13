import React from "react";
import { OffthreadVideo, getStaticFiles, staticFile } from "remotion";
import { colors, fonts, layout } from "../theme";

/**
 * Studio-only reference footage in the footage band (y 656–1264).
 * `file` is relative to public/. Shows a placeholder until the file exists.
 */
export const ReferenceVideo: React.FC<{ file: string }> = ({ file }) => {
  const hasClip = getStaticFiles().some((f) => f.name === file);
  const band: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: layout.footageTop,
    width: 1080,
    height: layout.footageBottom - layout.footageTop,
  };
  if (!hasClip) {
    return (
      <div
        style={{
          ...band,
          boxSizing: "border-box",
          border: `3px dashed ${colors.danger}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.mono,
          fontSize: 40,
          color: colors.text,
          background: "rgba(255, 59, 92, 0.15)",
        }}
      >
        put your clip at public/{file}
      </div>
    );
  }
  return <OffthreadVideo src={staticFile(file)} style={{ ...band, objectFit: "cover" }} />;
};
