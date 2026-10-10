#!/usr/bin/env bash
# Download the raw recording from Google Drive into source/ (original is never modified).
# Needs drive.google.com + drive.usercontent.google.com reachable.
set -euo pipefail
ID="${1:-14M_Fm3s0VjSmBIPa4JLuLbJrhGMPiR4_}"
cd "$(dirname "$0")/.."
mkdir -p source
python3 -m pip install -q gdown
python3 -m gdown "$ID" -O source/raw.mp4
chmod a-w source/raw.mp4
./scripts/probe.sh source/raw.mp4
