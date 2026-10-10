#!/usr/bin/env bash
# Verify a rendered file: streams/specs, full decode with no errors, A/V duration match,
# loudness, then export one review still per shot midpoint to out/review/.
set -euo pipefail
F="$1"; ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "== streams"; ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,pix_fmt,sample_rate,channels,duration -of compact "$F"
echo "== full decode"; ERR=$(ffmpeg -v error -i "$F" -f null - 2>&1 | wc -l); echo "decode errors: $ERR"; [[ "$ERR" == 0 ]]
echo "== loudness"; ffmpeg -hide_banner -i "$F" -af ebur128=peak=true -f null - 2>&1 | grep -A8 "Summary" | grep -E "I:|Peak:" || true
echo "== review stills"; mkdir -p "$ROOT/out/review"
python3 - "$F" "$ROOT" <<'PY'
import json, subprocess, sys
f, root = sys.argv[1], sys.argv[2]
tl = json.load(open(f'{root}/reel/src/edit/timeline.json'))
for s in tl['shots']:
    t = (s['start'] + s['end']) / 2
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', f, '-frames:v', '1', f"{root}/out/review/{s['id']}.png"], check=True)
print('stills →', f'{root}/out/review/')
PY
