#!/bin/sh
# Concatenate src/ into one self-contained page.
# index.html is what GitHub Pages serves; tarot.html is the same page under its original name.
cd "$(dirname "$0")"
{ cat src/a_head.html; for f in src/m_*.js; do [ -f "$f" ] && cat "$f"; done; printf '\n</script>\n<script>\n'; cat src/b_art.js src/z_main.js src/y_fx.js src/x_gallery.js src/w_souls.js src/v_vol.js; printf '\n</script>\n</body>\n</html>\n'; } > tarot.html
# rites loaded on demand from the chooser; the build stamp busts browser caches after each deploy
V=$(date +%s)
cp src/s_stars.js stars.js
sed -i "s/__BUILD__/$V/" tarot.html
cp tarot.html index.html
wc -c tarot.html
