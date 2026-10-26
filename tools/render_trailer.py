#!/usr/bin/env python3
"""Рендерить canvas-трейлер (trailer-dev.html) у assets/video/trailer.mp4.
Потрібно: python3, playwright + chromium, ffmpeg, numpy.   Запуск: python3 tools/render_trailer.py
Кадри рахуються по віртуальному годиннику (без реального часу), звук міксується окремо."""
import base64, http.server, os, subprocess, tempfile, threading, wave
import numpy as np
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'assets/video'); os.makedirs(OUT, exist_ok=True)
FPS, SIM, D, SR = 30, 2, 55, 44100          # SIM = підкроків симуляції на кадр (60 Гц фізика)
tmp = tempfile.mkdtemp(); os.makedirs(tmp + '/f')

class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Q)
threading.Thread(target=srv.serve_forever, daemon=True).start()

INIT = "(()=>{let n=0;performance.now=()=>(n+=16);window.requestAnimationFrame=()=>0})()"
with sync_playwright() as p:
    b = p.chromium.launch(args=['--disable-gpu'])
    pg = b.new_page(viewport={'width': 1300, 'height': 800})
    pg.add_init_script(INIT)
    pg.goto(f'http://127.0.0.1:{srv.server_address[1]}/trailer-dev.html')
    pg.wait_for_function('ready===true', timeout=120000)
    pg.evaluate("document.fonts.load('64px G').then(()=>document.fonts.ready)")
    pg.evaluate("""()=>{window.LOG=[];ac={currentTime:0};base=0;run=true;paused=false;mute=false;seen={};
      SH=FL=GL=0;lt=0;QL=1;setQ(1);resetG();
      snd=(n,v=1)=>LOG.push([ac.currentTime,n,v]);boom=(v=1)=>LOG.push([ac.currentTime,'boom',v])}""")
    for i in range(D * FPS):
        T = i / FPS
        ts = [max(0, T - (SIM - 1 - k) / (FPS * SIM)) for k in range(SIM)]
        url = pg.evaluate("(ts)=>{for(const t of ts){ac.currentTime=t;frame()}return cv.toDataURL('image/jpeg',.93)}", ts)
        open(f'{tmp}/f/{i:05d}.jpg', 'wb').write(base64.b64decode(url.split(',')[1]))
        if i % 50 == 0:
            rss = subprocess.run("ps -eo rss,comm | awk '/chrom/{s+=$1}END{print int(s/1024)}'", shell=True, capture_output=True, text=True).stdout.strip()
            print('frame', i, '/', D * FPS, 'chromium MB:', rss, flush=True)
    log = pg.evaluate('LOG'); b.close()
print('sfx events:', len(log), flush=True)

# ---------- audio mix ----------
def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
mix = np.zeros((int((D + 3) * SR), 2), np.float32)
def put(a, at):
    s = int(at * SR); e = min(len(mix), s + len(a))
    if s < len(mix): mix[s:e] += a[:e - s]
def music(n, at, ln, fi, fo, v):
    a = load(f'{ROOT}/assets/audio/{n}.mp3')[:int(ln * SR)]
    tt = np.arange(len(a)) / SR
    put(a * np.interp(tt, [0, fi, ln - fo, ln], [0, v, v, 0])[:, None].astype(np.float32), at)
music('comic', 0, 16.8, .5, 1, .7); music('game', 16.5, 24, .3, 1, .55); music('ending', 40, 16, 1.5, 2, .7)
cache = {}
for t, n, v in log:
    if n == 'boom':
        tt = np.arange(int(.7 * SR)) / SR
        f = 110 * (30 / 110) ** (np.minimum(tt, .5) / .5)
        g = .9 * v * (.001 / (.9 * v)) ** (np.minimum(tt, .6) / .6)
        w = (np.sin(2 * np.pi * np.cumsum(f) / SR) * g).astype(np.float32)
        put(np.stack([w, w], 1), t)
    else:
        cache.setdefault(n, load(f'{ROOT}/assets/audio/{n}.mp3'))
        put(cache[n] * v, t)
mix = np.clip(mix[:D * SR], -1, 1)
with wave.open(tmp + '/a.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())

subprocess.run(['ffmpeg', '-y', '-v', 'error', '-framerate', str(FPS), '-i', tmp + '/f/%05d.jpg', '-i', tmp + '/a.wav',
                '-c:v', 'libx264', '-preset', 'medium', '-crf', '24', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '160k', '-t', str(D), OUT + '/trailer.mp4'], check=True)
print('done', os.path.getsize(OUT + '/trailer.mp4') // 1024, 'KB')
