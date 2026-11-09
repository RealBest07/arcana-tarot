"""Optimise the scene art in img/ into assets/ for the web page.

img/bg.png.png          -> assets/bg.webp        1920x1080  cathedral backdrop (landscape)
img/bg_mobile.png.png   -> assets/bg_m.webp      1080x1920  cathedral backdrop (portrait)
img/table.png.png       -> assets/table.webp     1600x1000  velvet altar cloth under the cards
img/sigil.png.png       -> assets/sigil.webp     1024x1024  gold sigil, alpha kept, faint haze removed
img/corner-top-left.png -> assets/corner-{tl,tr,bl,br}.webp  160x160 panel ornaments (mirrored)
img/og.png.png          -> assets/og.jpg         1200x630   link-preview image

Run from the project folder:  python tools/make_assets.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "img", ROOT / "assets"


def src(*names):
    for n in names:
        p = SRC / n
        if p.exists():
            return Image.open(p)
    raise FileNotFoundError(names[0])


def main():
    OUT.mkdir(exist_ok=True)
    src("bg.png.png", "bg.png").convert("RGB").resize((1920, 1080), Image.LANCZOS).save(OUT / "bg.webp", quality=90, method=6)
    src("bg_mobile.png.png", "bg_mobile.png").convert("RGB").resize((1080, 1920), Image.LANCZOS).save(OUT / "bg_m.webp", quality=90, method=6)
    src("table.png.png", "table.png").convert("RGB").resize((1600, 1000), Image.LANCZOS).save(OUT / "table.webp", quality=86, method=6)

    sig = src("sigil.png.png", "sigil.png").convert("RGBA").resize((1024, 1024), Image.LANCZOS)
    r, g, b, a = sig.split()
    a = a.point(lambda v: 0 if v < 45 else min(255, int((v - 45) * 255 / 190)))   # drop the faint cream fill / fringe
    Image.merge("RGBA", (r, g, b, a)).save(OUT / "sigil.webp", quality=85, method=6)

    tl = src("corner-top-left.png", "corner.png").convert("RGBA").resize((160, 160), Image.LANCZOS)
    for name, im in {"tl": tl, "tr": ImageOps.mirror(tl), "bl": ImageOps.flip(tl), "br": ImageOps.flip(ImageOps.mirror(tl))}.items():
        im.save(OUT / f"corner-{name}.webp", quality=88, method=6)

    src("og.png.png", "og.png").convert("RGB").resize((1200, 630), Image.LANCZOS).save(OUT / "og.jpg", quality=86, optimize=True)
    total = sum(p.stat().st_size for p in OUT.iterdir())
    print(f"assets -> {OUT}  ({total / 1e6:.2f} MB)")


if __name__ == "__main__":
    main()
