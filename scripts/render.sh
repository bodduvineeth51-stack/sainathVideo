#!/usr/bin/env bash
# Render the Reel.
#   scripts/render.sh preview   → out/preview_540x960.mp4   (half resolution, fast)
#   scripts/render.sh final     → out/reel_final_1080x1920.mp4
# Final pass: H.264 High / yuv420p / AAC 48 kHz, loudness-normalised to −14 LUFS, −1 dBTP
# (Instagram's playback target), then validated and sampled into review stills.
set -euo pipefail
MODE="${1:-preview}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/out"; mkdir -p "$OUT"
cd "$ROOT/reel"
START=$(date +%s)
if [[ "$MODE" == "preview" ]]; then
  npx remotion render src/index.ts Reel "$OUT/preview_540x960.mp4" --scale=0.5 --crf=28 --audio-codec=aac
  FILE="$OUT/preview_540x960.mp4"
else
  [[ -f public/footage/talking_head_cut.mp4 ]] || { echo "final render needs reel/public/footage/talking_head_cut.mp4 (run scripts/cut.py)"; exit 1; }
  npx remotion render src/index.ts Reel "$OUT/_raw.mp4" --codec=h264 --crf=16 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k
  ffmpeg -v error -y -i "$OUT/_raw.mp4" -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac -b:a 320k -ar 48000 -movflags +faststart "$OUT/reel_final_1080x1920.mp4"
  rm "$OUT/_raw.mp4"
  FILE="$OUT/reel_final_1080x1920.mp4"
fi
echo "render time: $(( $(date +%s) - START ))s"
"$ROOT/scripts/validate.sh" "$FILE"
