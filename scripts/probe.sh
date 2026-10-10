#!/usr/bin/env bash
# Print the facts the edit depends on: resolution, rotation, fps, duration, audio format.
set -euo pipefail
ffprobe -v error -show_entries format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,sample_rate,channels:stream_side_data=rotation -of json "$1"
