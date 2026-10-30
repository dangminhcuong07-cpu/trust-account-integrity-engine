"""Crop the library photo to 16:9 and grade it to sit behind the hero: darker, warmer,
highlights tamed (the white vellum spines), slightly soft. Writes 2x WebP at two sizes."""
import sys, os
from PIL import Image, ImageEnhance, ImageFilter, ImageChops
src, dest, y0 = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert("RGB")
w = im.width
im = im.crop((0, y0, w, y0 + round(w * 9 / 16)))
# tame highlights: compress values above ~60% so pale spines don't flare
lut = [round(v if v < 150 else 150 + (v - 150) * 0.45) for v in range(256)]
im = im.point(lut * 3)
im = ImageEnhance.Brightness(im).enhance(0.62)
im = ImageEnhance.Color(im).enhance(0.9)
warm = Image.new("RGB", im.size, (255, 226, 190))
im = ImageChops.multiply(im, warm)
im = im.filter(ImageFilter.GaussianBlur(1.6))
for size in (1920, 1080):
    out = os.path.join(dest, f"library-{size}.webp")
    im.resize((size, round(size * 9 / 16)), Image.LANCZOS).save(out, "WEBP", quality=72, method=6)
    print(out, round(os.path.getsize(out) / 1024, 1), "KB")
