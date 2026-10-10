"""Map transcript word times from the raw recording onto the cut timeline.

  python3 scripts/retime_transcript.py work/transcript.json reel/public/footage/talking_head_cut.mp4.map.json work/transcript_cut.json

Shot boundaries, beats and captions in reel/src/edit/timeline.json are then set from
work/transcript_cut.json (the words, not guesses, are the source of truth).
"""
import json, sys

tr, mp = json.load(open(sys.argv[1])), json.load(open(sys.argv[2]))


def to_cut(x):
    for r in mp:
        if r['src_in'] <= x <= r['src_out']:
            return round(r['cut_in'] + x - r['src_in'], 3)
    return None  # word was cut out


words = []
for s in tr['segments']:
    for w in s['words']:
        a, b = to_cut(w['start']), to_cut(w['end'])
        if a is not None and b is not None:
            words.append({'start': a, 'end': b, 'word': w['word'].strip()})
json.dump({'words': words}, open(sys.argv[3], 'w'), ensure_ascii=False, indent=1)
for w in words:
    print(f"{w['start']:7.2f} {w['word']}")
