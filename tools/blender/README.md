# Desk objects (Blender)

The banker's lamp, the fountain pen and the nib icon on the site are Cycles renders made from these scripts. `library.py` renders a law library too; the site now uses a photo for that instead (see `tools/photo/`), but the render is kept as an alternative. They are modelled the way Polygon Runway's "5 Models in 7 Minutes" tutorial works: lathe profiles spun with a Screw modifier, then Solidify and Subdivision. The lamp shade and the nib are swept from cross-sections.

Run them from this folder with Blender 5.2's Python module (or with `blender -b -P <script>`):

```bash
python3.13 -m venv .venv && .venv/bin/pip install bpy==5.2.3
.venv/bin/python lamp.py          # out/lamp-off.png, out/lamp-on.png  (add "preview" for a fast draft)
.venv/bin/python pen.py           # out/pen-obj.png, out/pen-shadow.png, out/nib.png
.venv/bin/python library.py       # out/library.png (about 5 minutes on 4 CPU cores)
python3 comp.py out/pen-obj.png out/pen-shadow.png out/pen.png   # pen over its shadow, no light halo
python3 export.py ../../public/img   # trim and save the 2x WebP files the site uses
```

Units are decimetres. The lighting matches the page: a warm key from the upper right (the lamp's side), so shadows fall down and to the left. If you change the framing, update the image sizes in `src/components/Objects.tsx` and the `.lamp-cone` position in `src/index.css`.

The library is procedural: runs of matching law-report volumes in six leathers, with tooled bands and red or black labels, a few odd and leaning books, and gaps. Change the seed in `library.py` (`random.Random(2006)`) for a different arrangement. Light rakes in from the upper left and the lamp's glow comes from the lower right; the page darkens the centre behind the headline, so keep the render moody rather than bright.
