# ARCANA · ไพ่ทาโรต์

ดูดวงไพ่ทาโรต์ 78 ใบในโลกแฟนตาซีมืด: สับไพ่ เลือกไพ่ และเปิดไพ่แบบ 3D พร้อมคำทำนายภาษาไทย

A dark-fantasy tarot reading site: shuffle, pick and reveal cards in 3D, with Thai readings for all 78 cards.

## Features

- Single, three-card and Celtic Cross spreads
- Thai meanings for every card, upright and reversed (love, career, finance)
- Browse all 78 cards by dragging or tapping the deck on the setup screen
- Painted card art, generated ambient sound, and a volume dial
- Save a reading as a PNG image
- Works on phones; respects the "reduce motion" setting, with a switch to turn full effects on

## Project layout

| Path | What it is |
|---|---|
| `index.html` | The built page (served by GitHub Pages) |
| `cards/` | Card faces: `sm/` 350px for the table, full 840px for zoom, plus `back.webp` |
| `assets/` | Backdrop, altar cloth, sigil, panel corners, link-preview image |
| `src/` | Source pieces that `build.sh` joins into `index.html` |
| `tools/` | Python scripts that convert the original PNG art into the WebP files |

## Building

```sh
sh build.sh                    # src/ -> index.html (and tarot.html)
python tools/make_cards.py     # cardpng/*.png -> cards/
python tools/make_assets.py    # img/*.png -> assets/
```

The original PNG art (`cardpng/`, `img/`) is not in the repository; only the optimised WebP files are.

Built with [GSAP](https://gsap.com/), Cinzel and Noto Serif Thai.
