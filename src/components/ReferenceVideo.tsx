import React from "react";
import { OffthreadVideo, getStaticFiles, staticFile } from "remotion";
import { layout } from "../theme";

const warned = new Set<string>();

/**
 * Studio-only reference footage: a plain <OffthreadVideo> of public/<clip>
 * in the footage band (y 656–1263). No tint, border or text. If the clip is
 * missing it logs a warning and draws nothing.
 */
export const ReferenceVideo: React.FC<{ clip: string }> = ({ clip }) => {
  const exists = getStaticFiles().some((f) => f.name === clip);
  if (!exists) {
    if (!warned.has(clip)) {
      warned.add(clip);
      console.warn(`ReferenceVideo: public/${clip} not found – nothing drawn.`);
    }
    return null;
  }
  return (
    <OffthreadVideo
      src={staticFile(clip)}
      style={{
        position: "absolute",
        left: 0,
        top: layout.footageTop,
        width: 1080,
        height: layout.footageBottom - layout.footageTop,
        objectFit: "cover",
      }}
    />
  );
};
