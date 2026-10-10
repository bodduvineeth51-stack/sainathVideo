import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(4);
// Uses the Chromium already installed on this machine instead of downloading one.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
);
