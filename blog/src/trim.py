"""Trim empty background at the bottom of a rendered image, keeping a fixed margin.

Usage: python3 trim.py image.png [image2.png ...]
Images whose bottom row is not a single flat color (e.g. the gradient banner) are left alone.
"""
import sys

from PIL import Image

MARGIN = 56

for path in sys.argv[1:]:
    img = Image.open(path).convert("RGB")
    w, h = img.size
    px = img.load()
    bg = px[0, h - 1]

    def row_is_bg(y):
        return all(px[x, y] == bg for x in range(0, w, 2))

    if not row_is_bg(h - 1):
        continue
    y = h - 1
    while y > 0 and row_is_bg(y):
        y -= 1
    new_h = min(h, y + 1 + MARGIN)
    if new_h < h:
        img.crop((0, 0, w, new_h)).save(path, optimize=True)
        print(f"trimmed {path}: {h} -> {new_h}px")
