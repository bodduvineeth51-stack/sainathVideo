import { Config } from "@remotion/cli/config";

// Defaults for transparent overlay exports (ProRes 4444 with alpha).
// The explicit CLI flags in package.json override/duplicate these.
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le");
Config.setCodec("prores");
Config.setProResProfile("4444");
Config.setOverwriteOutput(true);
