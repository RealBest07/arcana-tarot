"""Draw star-position references for the twelve zodiac constellations.

Each image is 1024x1024: the constellation's stars (from src/s_stars.js) projected gnomonically around
their centre, north up and east left as seen in the sky, white dots sized by brightness, thin lines
for the figure. Meant to be handed to an image model with a prompt to paint the figure over the dots.
Also writes zodiac_refs.json: every star's position as fractions of the image, which become the
figure's anchors in s_stars.js when the painting keeps the same framing.

Usage (from the repo root):  python tools/zodiac_refs.py img/ref
"""
import json, math, os, re, sys
from PIL import Image, ImageDraw

out = sys.argv[1] if len(sys.argv) > 1 else 'img/ref'
os.makedirs(out, exist_ok=True)
src = open('src/s_stars.js', encoding='utf8').read()

stars = {}
for line in src.split('const BRIGHT=`')[1].split('`')[0].strip().split('\n'):
    n, th, ra, de, m, c = line.split('|')
    stars[n] = dict(n=n, ra=float(ra) * 15, de=float(de), m=float(m), c=c)

def lines_of(code):
    m = re.search(r"\n  %s:\['[^']*','([^']*)'\]" % code, src)
    if not m or not m.group(1):
        return []
    names = sorted(stars, key=len, reverse=True)
    rest, pairs = m.group(1), []
    while rest.strip():
        rest = rest.strip()
        a = next((n for n in names if rest.startswith(n + '-')), None)
        if not a:
            break
        rest = rest[len(a) + 1:]
        b = next((n for n in names if rest.startswith(n) and (len(rest) == len(n) or rest[len(n)] == ' ')), None)
        if not b:
            break
        rest = rest[len(b):]
        pairs.append((a, b))
    return pairs

SIGNS = [('aries', 'Ari'), ('taurus', 'Tau'), ('gemini', 'Gem'), ('cancer', 'Cnc'), ('leo', 'Leo'), ('virgo', 'Vir'),
         ('libra', 'Lib'), ('scorpius', 'Sco'), ('sagittarius', 'Sgr'), ('capricornus', 'Cap'), ('aquarius', 'Aqr'), ('pisces', 'Psc')]
S, FILL = 1024, .62           # canvas size; share of the canvas the star pattern spans (room for limbs, horns, tails)
meta = {}
sheet = Image.new('RGB', (4 * 512, 3 * 512), (8, 9, 14))
for k, (name, code) in enumerate(SIGNS):
    group = [s for s in stars.values() if s['c'] == code]
    if code == 'Tau':                                   # the Pleiades sit on the bull's back
        group.append(stars['Alcyone']) if stars['Alcyone'] not in group else None
    # centre: mean direction
    x = y = z = 0
    for s in group:
        r, d = math.radians(s['ra']), math.radians(s['de'])
        x += math.cos(d) * math.cos(r); y += math.cos(d) * math.sin(r); z += math.sin(d)
    a0, d0 = math.atan2(y, x), math.asin(z / math.sqrt(x * x + y * y + z * z))
    def proj(s):
        a, d = math.radians(s['ra']), math.radians(s['de'])
        cc = math.sin(d0) * math.sin(d) + math.cos(d0) * math.cos(d) * math.cos(a - a0)
        xi = math.cos(d) * math.sin(a - a0) / cc
        eta = (math.sin(d) * math.cos(d0) - math.cos(d) * math.sin(d0) * math.cos(a - a0)) / cc
        return -xi, -eta                                 # east to the left, north up
    pts = {s['n']: proj(s) for s in group}
    xs, ys = [p[0] for p in pts.values()], [p[1] for p in pts.values()]
    span = max(max(xs) - min(xs), max(ys) - min(ys))
    k_ = S * FILL / span
    cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
    px = {n: (S / 2 + (p[0] - cx) * k_, S / 2 + (p[1] - cy) * k_) for n, p in pts.items()}
    im = Image.new('RGB', (S, S), (8, 9, 14))
    dr = ImageDraw.Draw(im)
    for a, b in lines_of(code):
        if a in px and b in px:
            dr.line([px[a], px[b]], fill=(120, 116, 104), width=3)
    for n, (u, v) in px.items():
        r = max(6, min(22, 16 - 3.2 * stars[n]['m']))
        dr.ellipse([u - r * 2.2, v - r * 2.2, u + r * 2.2, v + r * 2.2], fill=(40, 38, 34))
        dr.ellipse([u - r, v - r, u + r, v + r], fill=(255, 250, 235))
    im.save(f'{out}/{name}-stars.png')
    meta[name] = {n: [round(u / S, 4), round(v / S, 4)] for n, (u, v) in px.items()}
    sheet.paste(im.resize((512, 512), Image.LANCZOS), ((k % 4) * 512, (k // 4) * 512))
    print(name, len(group), 'stars')
sheet.save(f'{out}/_all-stars.png')
json.dump(meta, open(f'{out}/zodiac_refs.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
