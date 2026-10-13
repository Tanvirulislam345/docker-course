#!/usr/bin/env bash
# Renders every diagram in blog/src/diagrams/ to a PNG in blog/images/.
#   ./blog/render.sh              -> render all
#   ./blog/render.sh 05-ports     -> render files whose name contains "05-ports"
# Each HTML file declares its CSS size with <meta name="shot" content="WIDTHxHEIGHT">.
# Images are rendered at 2x for sharp text, then empty space at the bottom is trimmed.
set -euo pipefail

BLOG_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$BLOG_DIR/src"
OUT="$BLOG_DIR/images"
CHROME="${CHROME:-google-chrome}"
FILTER="${1:-}"

mkdir -p "$OUT"

for html in "$SRC"/diagrams/*.html; do
  name="$(basename "$html" .html)"
  [[ -n "$FILTER" && "$name" != *"$FILTER"* ]] && continue
  size="$(grep -o 'name="shot" content="[0-9]*x[0-9]*"' "$html" | grep -o '[0-9]*x[0-9]*')"
  w="${size%x*}"; h="${size#*x}"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --virtual-time-budget=6000 --window-size="$w,$h" \
    --screenshot="$OUT/$name.png" "file://$html" >/dev/null 2>&1
  python3 "$SRC/trim.py" "$OUT/$name.png" >/dev/null
  echo "rendered $name.png"
done
