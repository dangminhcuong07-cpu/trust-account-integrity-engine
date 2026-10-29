"""Trim the Blender renders to their visible pixels and export 2x WebP for the site.
Both lamp states share one crop so they stay aligned when one fades over the other."""
import json, os, sys
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
DEST = sys.argv[1]
os.makedirs(DEST, exist_ok=True)


def bbox(*imgs, thresh=6, pad=6):
    boxes = [im.getchannel("A").point(lambda a: 255 if a > thresh else 0).getbbox() for im in imgs]
    l = min(b[0] for b in boxes) - pad; t = min(b[1] for b in boxes) - pad
    r = max(b[2] for b in boxes) + pad; btm = max(b[3] for b in boxes) + pad
    w, h = imgs[0].size
    return max(0, l), max(0, t), min(w, r), min(h, btm)


def save(im, name, width):
    h = round(im.height * width / im.width)
    im = im.resize((width, h), Image.LANCZOS)
    path = os.path.join(DEST, name)
    im.save(path, "WEBP", quality=86, method=6, exact=True)
    return {"file": name, "w": width, "h": h, "kb": round(os.path.getsize(path) / 1024, 1)}


meta = {}
off = Image.open(f"{OUT}/lamp-off.png").convert("RGBA")
on = Image.open(f"{OUT}/lamp-on.png").convert("RGBA")
box = bbox(off, on, thresh=60, pad=10)  # the contact shadow is invisible on the dark page


def unveil(im, floor=70):
    """The shadow catcher leaves a faint veil over the whole frame; on the dark page it shows as a box."""
    r, g, b, a = im.split()
    return Image.merge("RGBA", (r, g, b, a.point(lambda v: 0 if v < floor else v)))


off, on = unveil(off), unveil(on)
meta["lamp-off"] = save(off.crop(box), "lamp-off.webp", 520)
meta["lamp-on"] = save(on.crop(box), "lamp-on.webp", 520)
pen = Image.open(f"{OUT}/pen.png").convert("RGBA")
meta["pen"] = save(pen.crop(bbox(pen, thresh=10)), "pen.webp", 640)
nib = Image.open(f"{OUT}/nib.png").convert("RGBA")
nib = nib.crop((0, round(nib.height * 0.15), nib.width, nib.height))  # the nib only, not the barrel above it
meta["nib"] = save(nib.crop(bbox(nib, pad=2)), "nib.webp", 32)
lib = Image.open(f"{OUT}/library.png").convert("RGB")
for w in (1920, 1080):  # a background behind a darkening mask: lower quality is invisible
    path = os.path.join(DEST, f"library-{w}.webp")
    lib.resize((w, round(lib.height * w / lib.width)), Image.LANCZOS).save(path, "WEBP", quality=70, method=6)
    meta[f"library-{w}"] = {"file": os.path.basename(path), "w": w, "kb": round(os.path.getsize(path) / 1024, 1)}
print(json.dumps(meta, indent=1))
