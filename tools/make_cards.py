"""Convert the AI card art in cardpng/ into web-ready WebP files.

cardpng/{id}.png (1024x1536, 2:3)  ->  centre-cropped to the site's 7:12 card ratio
  cards/{id}.webp      840x1440  (shown when a card is zoomed)
  cards/sm/{id}.webp   350x600   (used everywhere else: fan, spread, gallery grid)
  cards/back.webp      560x960   (card back, from cardpng/back.png)

Run from the project folder:  python tools/make_cards.py
Re-running overwrites the outputs, so just replace a PNG and run again.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "cardpng", ROOT / "cards"
SM = OUT / "sm"
RATIO = 7 / 12


def crop_7_12(im: Image.Image) -> Image.Image:
    w, h = im.size
    if w / h > RATIO:                      # too wide -> trim left/right equally
        nw = round(h * RATIO)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / RATIO)                  # too tall -> trim top/bottom equally
    y = (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def save(im: Image.Image, path: Path, size, q):
    im.resize(size, Image.LANCZOS).save(path, "WEBP", quality=q, method=6)


def main():
    SM.mkdir(parents=True, exist_ok=True)
    files = sorted(SRC.glob("*.png"))
    total = 0
    for f in files:
        im = crop_7_12(Image.open(f).convert("RGB"))
        if f.stem == "back":
            save(im, OUT / "back.webp", (560, 960), 82)
            total += (OUT / "back.webp").stat().st_size
            continue
        save(im, OUT / f"{f.stem}.webp", (840, 1440), 80)
        save(im, SM / f"{f.stem}.webp", (350, 600), 78)
        total += (OUT / f"{f.stem}.webp").stat().st_size + (SM / f"{f.stem}.webp").stat().st_size
    print(f"{len(files)} images -> {OUT}  ({total / 1e6:.1f} MB total)")


if __name__ == "__main__":
    main()
