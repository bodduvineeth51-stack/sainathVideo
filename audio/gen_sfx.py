"""Synthesize the Reel's original sound-design kit and music bed (no third-party audio).

Usage: python3 audio/gen_sfx.py reel/public
Writes <out>/sfx/*.wav and <out>/music/bed.wav (48 kHz, 16-bit stereo).
"""
import sys, wave, pathlib
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, r=0.2, shape=4.0):
    """attack / exponential release envelope over n samples"""
    x = np.arange(n) / SR
    att = np.clip(x / max(a, 1e-4), 0, 1)
    rel = np.exp(-shape * np.clip(x - a, 0, None) / max(r, 1e-4))
    return att * rel


def lp(x, cutoff):
    """one-pole low-pass; cutoff may be an array (sweeps)"""
    c = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    a = np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def hp(x, cutoff):
    return x - lp(x, cutoff)


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def stereo(x, width=0.0):
    if width:
        d = int(SR * 0.008 * width)
        r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
        return np.stack([x, r], 1)
    return np.stack([x, x], 1)


def save(path, x):
    path.parent.mkdir(parents=True, exist_ok=True)
    if x.ndim == 1:
        x = stereo(x)
    x = np.clip(x, -1, 1)
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())


def whoosh(d=0.55, lo=300, hi=3500, peak_at=0.6):
    n = int(SR * d)
    x = rng.standard_normal(n)
    pos = np.linspace(0, 1, n)
    shape = np.where(pos < peak_at, (pos / peak_at) ** 2, ((1 - pos) / (1 - peak_at)) ** 1.5)
    cut = lo + (hi - lo) * shape
    return norm(hp(lp(x, cut), 120) * shape, 0.7)


def impact(d=1.4, f0=58):
    x = t(d)
    f = f0 * (1 + 1.6 * np.exp(-x * 18))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.9, 5)
    click = lp(rng.standard_normal(len(x)), 2500) * env(len(x), 0.001, 0.03, 6)
    tail = lp(rng.standard_normal(len(x)), 400) * env(len(x), 0.01, 1.0, 4) * 0.25
    return norm(body + 0.5 * click + tail, 0.9)


def riser(d=1.1):
    x = t(d)
    n = len(x)
    pos = np.linspace(0, 1, n)
    noise = lp(rng.standard_normal(n), 200 + 4000 * pos ** 2) * pos ** 2
    tone = np.sin(2 * np.pi * np.cumsum(110 + 220 * pos ** 2) / SR) * pos ** 3 * 0.35
    out = noise + tone
    out[-int(SR * 0.02):] *= np.linspace(1, 0, int(SR * 0.02))
    return norm(out, 0.6)


def tick(f=2400, d=0.06):
    x = t(d)
    return norm(np.sin(2 * np.pi * f * x) * env(len(x), 0.0005, 0.015, 6) + 0.3 * hp(rng.standard_normal(len(x)), 3000) * env(len(x), 0.0005, 0.004, 6), 0.6)


def click():
    x = t(0.09)
    a = np.sin(2 * np.pi * 1700 * x) * env(len(x), 0.0005, 0.012, 6)
    b = np.sin(2 * np.pi * 900 * x) * env(len(x), 0.0005, 0.03, 6)
    return norm(a + 0.6 * b, 0.7)


def pop(f=520):
    x = t(0.18)
    fr = f * (1 + 0.8 * np.exp(-x * 60))
    return norm(np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(x), 0.001, 0.07, 5), 0.6)


def keys(n_keys=9, gap=0.07):
    out = np.zeros(int(SR * (n_keys * gap + 0.1)))
    for k in range(n_keys):
        s = int(SR * (k * gap + rng.uniform(-0.012, 0.012) + 0.01))
        c = hp(rng.standard_normal(int(SR * 0.03)), 1800) * env(int(SR * 0.03), 0.0005, 0.008, 6) * rng.uniform(0.6, 1)
        out[s:s + len(c)] += c
    return norm(out, 0.5)


def chime(freqs=(880, 1320), d=0.9, gap=0.07):
    x = t(d)
    out = np.zeros(len(x))
    for i, f in enumerate(freqs):
        s = int(SR * i * gap)
        y = (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x)) * env(len(x), 0.003, 0.5, 5)
        out[s:] += y[: len(x) - s]
    return norm(out, 0.5)


def gen(d=1.4):
    """soft computational texture under 'Generating…'"""
    x = t(d)
    n = len(x)
    pulses = np.zeros(n)
    for k in range(int(d / 0.09)):
        s = int(SR * k * 0.09)
        f = rng.choice([1200, 1600, 2000, 2400])
        y = np.sin(2 * np.pi * f * t(0.03)) * env(int(SR * 0.03), 0.001, 0.01, 6)
        pulses[s:s + len(y)] += y[: max(0, n - s)] * 0.5
    bed = lp(rng.standard_normal(n), 900) * 0.15
    fade = np.minimum(1, np.minimum(x / 0.1, (d - x) / 0.25))
    return norm((pulses + bed) * fade, 0.45)


def strike():
    w = whoosh(0.22, 800, 6000, 0.4)
    return norm(np.concatenate([w, np.zeros(SR // 20)]) + 0.0, 0.6)


def split():
    a = whoosh(0.35, 500, 4000, 0.3)
    b = np.zeros_like(a)
    for k in range(5):
        tk = tick(1800 + 300 * k)
        s = int(SR * (0.08 + k * 0.035))
        b[s:s + len(tk)] += tk[: len(b) - s]
    return norm(a * 0.6 + b, 0.6)


def stack():
    out = np.zeros(int(SR * 0.6))
    for k in range(6):
        c = pop(380 + 40 * k)
        s = int(SR * k * 0.06)
        out[s:s + len(c)] += c[: len(out) - s] * 0.7
    return norm(out, 0.6)


def error():
    x = t(0.32)
    y = np.sign(np.sin(2 * np.pi * 220 * x)) * 0.3 + np.sin(2 * np.pi * 233 * x)
    y = lp(y, 1800) * env(len(x), 0.003, 0.2, 4)
    return norm(y, 0.45)


def chord(freqs, d, a=0.4, r=2.5):
    x = t(d)
    out = sum(np.sin(2 * np.pi * f * x) + 0.25 * np.sin(2 * np.pi * 2 * f * x + 0.3) for f in freqs)
    return out * env(len(x), a, r, 2.5)


def victory():
    """restrained payoff: low hit + warm major swell"""
    hit = impact(1.6, 52) * 0.7
    sw = chord([196.0, 246.9, 293.7, 392.0], 2.6, 0.18, 2.4)
    sw = lp(sw, 3000)
    out = np.zeros(int(SR * 2.6))
    out[: len(hit)] += hit
    out += norm(sw, 0.5)
    return norm(out, 0.85)


def sad():
    """understated: two descending soft tones, minor colour"""
    out = np.zeros(int(SR * 1.8))
    for i, (f, at) in enumerate([(392.0, 0.0), (349.2, 0.32)]):
        y = chord([f, f * 1.189], 1.4, 0.03, 1.2) * 0.5
        s = int(SR * at)
        out[s:s + len(y)] += y[: len(out) - s]
    return norm(lp(out, 2200), 0.45)


def hush():
    """reverse swell into silence for 'Nothing.'"""
    x = whoosh(0.7, 200, 2200, 0.95)
    return norm(x, 0.4)


def music(d=95.0, bpm=96):
    """Minimal original bed: soft pad on a I–vi–IV–V loop with a muted pulse."""
    beat = 60 / bpm
    bar = beat * 4
    prog = [[110.0, 164.8, 220.0, 277.2], [92.5, 138.6, 185.0, 220.0], [73.4, 110.0, 146.8, 185.0], [82.4, 123.5, 164.8, 207.7]]  # A, F#m, D, E
    n = int(SR * d)
    out = np.zeros(n)
    k = 0
    while k * bar < d:
        ch = prog[k % 4]
        seg = chord(ch, bar + 0.6, 0.6, 3.0) * 0.18
        s = int(SR * k * bar)
        out[s:s + len(seg)] += seg[: max(0, n - s)]
        # muted pulse on 8ths
        for e in range(8):
            ps = int(SR * (k * bar + e * beat / 2))
            p = np.sin(2 * np.pi * ch[0] * 2 * t(0.12)) * env(int(SR * 0.12), 0.003, 0.05, 6) * (0.10 if e % 2 else 0.14)
            out[ps:ps + len(p)] += p[: max(0, n - ps)]
        k += 1
    out = lp(out, 2400)
    return norm(out, 0.7)


if __name__ == '__main__':
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'reel/public')
    kit = {
        'riser.wav': riser(), 'impact.wav': impact(), 'low_hit.wav': impact(1.0, 70) * 0.8,
        'whoosh_soft.wav': whoosh(), 'tick.wav': tick(), 'click.wav': click(),
        'pop_lo.wav': pop(420), 'pop_hi.wav': pop(640), 'keys.wav': keys(), 'ding.wav': chime(),
        'gen.wav': gen(), 'strike.wav': strike(), 'split.wav': split(), 'stack.wav': stack(),
        'error.wav': error(), 'victory.wav': victory(), 'sad.wav': sad(), 'hush.wav': hush(),
    }
    for name, x in kit.items():
        save(root / 'sfx' / name, x)
        print('sfx', name, f'{len(x) / SR:.2f}s')
    save(root / 'music' / 'bed.wav', stereo(music(), 1.0))
    print('music bed.wav')
