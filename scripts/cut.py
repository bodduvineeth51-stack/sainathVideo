"""Apply the EDL: one continuous 1080×1920 talking-head clip with click-free joins.

  python3 scripts/cut.py reel/src/edit/edl.json reel/public/footage/talking_head_cut.mp4 [--fps 30]

Video: each range trimmed, scaled/cropped to fill 9:16 (never mirrored — keeps the
Ram = left hand / Lakshman = right hand mapping), concatenated.
Audio: 12 ms fades at every join so cuts don't click.
Also writes <out>.map.json mapping source time → cut time, used to retime the transcript.
"""
import json, subprocess, sys, argparse

ap = argparse.ArgumentParser()
ap.add_argument('edl'); ap.add_argument('out'); ap.add_argument('--fps', default='30')
a = ap.parse_args()
edl = json.load(open(a.edl))
R = edl['ranges']
F = 0.012
parts, labels = [], []
for i, r in enumerate(R):
    d = r['out'] - r['in']
    parts.append(f"[0:v]trim=start={r['in']}:end={r['out']},setpts=PTS-STARTPTS,"
                 f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps={a.fps},setsar=1[v{i}]")
    parts.append(f"[0:a]atrim=start={r['in']}:end={r['out']},asetpts=PTS-STARTPTS,"
                 f"afade=t=in:d={F},afade=t=out:st={max(0, d - F)}:d={F}[a{i}]")
    labels.append(f'[v{i}][a{i}]')
parts.append(''.join(labels) + f'concat=n={len(R)}:v=1:a=1[v][a]')
cmd = ['ffmpeg', '-y', '-i', edl['source'], '-filter_complex', ';'.join(parts), '-map', '[v]', '-map', '[a]',
       '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p',
       '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', a.out]
subprocess.run(cmd, check=True)
t, m = 0.0, []
for r in R:
    m.append({'src_in': r['in'], 'src_out': r['out'], 'cut_in': round(t, 3)})
    t += r['out'] - r['in']
json.dump(m, open(a.out + '.map.json', 'w'), indent=1)
print(f'cut length {t:.2f}s → {a.out}')
