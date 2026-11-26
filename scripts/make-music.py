"""מייצר פסקול רגוע: פסנתר רך + ציפורים, באורך נתון (מקורי, נוצר בקוד — בלי זכויות יוצרים).

שימוש: python scripts/make-music.py <seconds> [out.wav]
"""
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
rng = np.random.default_rng(7)

duration = float(sys.argv[1]) if len(sys.argv) > 1 else 90.0
out_path = sys.argv[2] if len(sys.argv) > 2 else 'demo-music.wav'
N = int(SR * (duration + 4))  # זנב לריוורב
left = np.zeros(N)
right = np.zeros(N)


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    left[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    right[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def piano(midi, vel=0.5, length=3.5):
    f0 = midi_hz(midi)
    t = np.arange(int(SR * length)) / SR
    tone = np.zeros_like(t)
    B = 0.00035
    for n in range(1, 10):
        fn = n * f0 * np.sqrt(1 + B * n * n)
        if fn > 9000:
            break
        decay = (1.6 + 2.5 * (60 - min(midi, 84)) / 40 + 0.4) / (1 + 0.35 * (n - 1))
        amp = (1 / n ** 1.4) * (0.6 + 0.4 * vel) ** (n - 1)
        tone += amp * np.sin(2 * np.pi * fn * t + rng.uniform(0, 6.28)) * np.exp(-t / max(decay, 0.25))
    attack = np.minimum(1, t / 0.006)
    release = np.minimum(1, (length - t) / 0.4)
    return tone * attack * release * vel * 0.22


def bird(start):
    """ציוץ קצר: כמה תווים עולים/יורדים עם טרמולו."""
    notes = rng.integers(2, 7)
    base = rng.uniform(2600, 4200)
    pan = rng.uniform(-0.8, 0.8)
    gain = rng.uniform(0.025, 0.05)
    t0 = start
    style = rng.integers(0, 3)
    for k in range(notes):
        dur = rng.uniform(0.05, 0.13)
        t = np.arange(int(SR * dur)) / SR
        if style == 0:
            f = base * (1 + 0.35 * t / dur)  # עולה
        elif style == 1:
            f = base * (1.3 - 0.4 * t / dur)  # יורד
        else:
            f = base * (1 + 0.12 * np.sin(2 * np.pi * 28 * t))  # טריל
        f = f * (1 + 0.04 * k * (-1) ** k)
        phase = 2 * np.pi * np.cumsum(f) / SR
        env = np.sin(np.pi * t / dur) ** 2
        add(np.sin(phase) * env, t0, pan, gain)
        t0 += dur + rng.uniform(0.03, 0.09)
    return t0


# --- הרמוניה: D major, רך ואיטי ---
beat = 60 / 64
chords = [
    (50, [62, 66, 69, 73, 76]),  # Dmaj9
    (47, [62, 66, 69, 71, 74]),  # Bm7(add11)
    (43, [59, 62, 66, 69, 71]),  # Gmaj7
    (45, [61, 64, 66, 69, 73]),  # A6/9
]
melody_bank = [78, 76, 74, 73, 71, 69]

t = 0.0
bar = 0
while t < duration:
    root, tones = chords[(bar // 2) % len(chords)]
    if bar % 2 == 0:
        add(piano(root, 0.45, 6.5), t, -0.25)
        add(piano(root + 12, 0.3, 6.0), t + 0.02, -0.15)
    # ארפג'ו בשמיניות, עדין
    pattern = [0, 2, 4, 3, 1, 2, 4, 2]
    for k, idx in enumerate(pattern):
        vel = 0.28 + 0.08 * rng.random() + (0.06 if k == 0 else 0)
        add(piano(tones[idx], vel, 3.0), t + k * beat / 2 + rng.uniform(0, 0.012), 0.15 + 0.1 * (idx - 2) / 2)
    # מנגינה פשוטה מדי פעם
    if bar >= 2 and bar % 2 == 1:
        m = melody_bank[rng.integers(0, len(melody_bank))]
        if m - 12 in tones or m in tones or rng.random() < 0.5:
            add(piano(m, 0.42, 4.0), t + beat * 1, 0.1)
            add(piano(m - 2 if rng.random() < 0.5 else m - 3, 0.36, 4.0), t + beat * 2.5, 0.1)
    t += 4 * beat
    bar += 1

# --- ריוורב (חדר רך) ---
ir_len = int(SR * 2.8)
ir_t = np.arange(ir_len) / SR
ir_env = np.exp(-ir_t / 0.75)
irL = rng.standard_normal(ir_len) * ir_env
irR = rng.standard_normal(ir_len) * ir_env
lp = butter(2, 5000, 'low', fs=SR, output='sos')
irL, irR = sosfilt(lp, irL), sosfilt(lp, irR)
irL /= np.sqrt(np.sum(irL ** 2))
irR /= np.sqrt(np.sum(irR ** 2))
wetL = fftconvolve(left, irL)[:N]
wetR = fftconvolve(right, irR)[:N]
pL = left * 0.75 + wetL * 0.45
pR = right * 0.75 + wetR * 0.45
piano_peak = max(np.abs(pL).max(), np.abs(pR).max())
pL, pR = pL / piano_peak * 0.6, pR / piano_peak * 0.6

# --- ציפורים + רחש טבע עדין ---
left[:] = 0
right[:] = 0
bt = rng.uniform(0.8, 2.0)
while bt < duration - 1:
    end = bird(bt)
    bt = end + rng.uniform(1.5, 5.0)
amb = rng.standard_normal((2, N))
amb_sos = butter(2, [300, 1800], 'band', fs=SR, output='sos')
amb = sosfilt(amb_sos, amb) * 0.006
bird_rev = 0.25
bL = left + fftconvolve(left, irL)[:N] * bird_rev + amb[0]
bR = right + fftconvolve(right, irR)[:N] * bird_rev + amb[1]

L = pL + bL
R = pR + bR
# fade in / out
n = int(SR * duration)
L, R = L[:n], R[:n]
fade_in = np.minimum(1, np.arange(n) / (SR * 2.0))
fade_out = np.minimum(1, (n - np.arange(n)) / (SR * 3.5))
env = fade_in * fade_out
L, R = L * env, R * env
peak = max(np.abs(L).max(), np.abs(R).max())
stereo = np.stack([L, R], axis=1) / peak * 0.52
wavfile.write(out_path, SR, (stereo * 32767).astype(np.int16))
print(f'{out_path}: {duration:.1f}s')
