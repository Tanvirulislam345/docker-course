#!/usr/bin/env bash
# Renders every image source in blog/src/ to a PNG in blog/images/.
#   ./blog/render.sh              -> render all
#   ./blog/render.sh 07-port      -> render files whose name contains "07-port"
# Each HTML file declares its size with <meta name="shot" content="WIDTHxHEIGHT">.
set -euo pipefail

BLOG_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$BLOG_DIR/src"
OUT="$BLOG_DIR/images"
CHROME="${CHROME:-google-chrome}"
FILTER="${1:-}"

mkdir -p "$OUT"

# terminal + code screenshots are generated from blog/src/shots.mjs
node "$BLOG_DIR/src/shots.mjs"

for html in "$SRC"/diagrams/*.html "$SRC"/generated/*.html; do
  name="$(basename "$html" .html)"
  [[ -n "$FILTER" && "$name" != *"$FILTER"* ]] && continue
  size="$(grep -o 'name="shot" content="[0-9]*x[0-9]*"' "$html" | grep -o '[0-9]*x[0-9]*')"
  w="${size%x*}"; h="${size#*x}"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=6000 --window-size="$w,$h" \
    --screenshot="$OUT/$name.png" "file://$html" >/dev/null 2>&1
  python3 "$SRC/trim.py" "$OUT/$name.png" >/dev/null
  echo "rendered $name.png"
done
