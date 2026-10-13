import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import type { SpringConfig } from "remotion";

const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const poppins = loadPoppins("normal", { weights: ["600"], subsets: ["latin"] });
const mono = loadJetBrainsMono("normal", {
  weights: ["500"],
  subsets: ["latin"],
});

export const colors = {
  cyan: "#22D3EE",
  text: "#FFF8EE",
  panel: "#0B1120",
  danger: "#FF3B5C",
} as const;

export const fonts = {
  /** Headlines */
  headline: anton.fontFamily,
  /** Labels (use with fontWeight: fontWeights.label) */
  label: poppins.fontFamily,
  /** Tech / code text */
  mono: mono.fontFamily,
} as const;

export const fontWeights = {
  headline: 400,
  label: 600,
  mono: 500,
} as const;

/** Snappy pop-in with slight overshoot. */
export const popSpring: Partial<SpringConfig> = {
  damping: 12,
  stiffness: 180,
};

export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/**
 * Vertical layout. The footage is a 16:9 band in the middle of the frame;
 * graphics must never be placed inside it.
 */
export const layout = {
  footageTop: 656,
  footageBottom: 1264,
  /** Vertical center of the top black band area used for graphics */
  topCenterY: 360,
  /** Vertical center of the bottom black band area used for graphics */
  bottomCenterY: 1560,
} as const;
