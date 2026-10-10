"""Propose an edit decision list from the word timestamps: keep speech, tighten dead air.

  python3 scripts/propose_edl.py work/transcript.json reel/src/edit/edl.json

Each kept range is padded so breaths and word tails survive; gaps longer than MAX_GAP are
shortened to KEEP_GAP. Retakes are NOT resolved automatically — review the proposal,
delete the weaker take's ranges (the transcript shows repeats side by side), then cut.
"""
import json, sys

PAD_IN, PAD_OUT = 0.08, 0.14   # seconds kept before the first / after the last word
MAX_GAP, KEEP_GAP = 0.45, 0.22  # pauses longer than MAX_GAP become KEEP_GAP

tr = json.load(open(sys.argv[1]))
words = [w for s in tr['segments'] for w in s['words']]
ranges = []
for w in words:
    a, b = w['start'] - PAD_IN, w['end'] + PAD_OUT
    if ranges and a - ranges[-1][1] < MAX_GAP - PAD_IN - PAD_OUT:
        ranges[-1][1] = max(ranges[-1][1], b)
    else:
        ranges.append([max(0.0, a), b])
# re-insert a short natural pause between ranges by extending each tail
edl = [{'in': round(a, 3), 'out': round(b + KEEP_GAP / 2, 3), 'text': ' '.join(w['word'].strip() for w in words if a <= w['start'] < b)} for a, b in ranges]
json.dump({'source': 'source/raw.mp4', 'ranges': edl}, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1)
kept = sum(r['out'] - r['in'] for r in edl)
print(f'{len(edl)} ranges, {kept:.1f}s kept of {words[-1]["end"]:.1f}s')
