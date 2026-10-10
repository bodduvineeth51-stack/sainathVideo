"""Word-level transcription of the raw recording (Telugu–English code-mixed).

  pip install faster-whisper==1.1.1
  python3 scripts/transcribe.py source/raw.mp4 work/

Writes work/transcript.json (segments + words with start/end) and work/transcript.srt.
Needs huggingface.co reachable for the first model download. large-v3 handles Telugu and
English in one pass; the English captions are then written by hand from this transcript
(machine translation of code-mixed speech is only a draft).
"""
import json, sys, pathlib
from faster_whisper import WhisperModel

src, out = sys.argv[1], pathlib.Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
model = WhisperModel('large-v3', device='auto', compute_type='int8')
segments, info = model.transcribe(
    src, language='te', word_timestamps=True, vad_filter=True,
    vad_parameters={'min_silence_duration_ms': 250},
    initial_prompt='Ram, Lakshman, coding, AI, app, Lovable, syntax, process, architecture, authentication, 2026',
)
segs = []
for s in segments:
    segs.append({'start': s.start, 'end': s.end, 'text': s.text.strip(),
                 'words': [{'start': w.start, 'end': w.end, 'word': w.word, 'p': w.probability} for w in s.words]})
    print(f'[{s.start:7.2f} → {s.end:7.2f}] {s.text.strip()}')
(out / 'transcript.json').write_text(json.dumps({'language': info.language, 'segments': segs}, ensure_ascii=False, indent=1))


def ts(x):
    h, m = divmod(int(x), 3600)
    m, s = divmod(m, 60)
    return f'{h:02}:{m:02}:{s:02},{int((x % 1) * 1000):03}'


(out / 'transcript.srt').write_text('\n'.join(f'{i + 1}\n{ts(s["start"])} --> {ts(s["end"])}\n{s["text"]}\n' for i, s in enumerate(segs)), encoding='utf-8')
