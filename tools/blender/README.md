# Desk objects (Blender)

The banker's lamp, the fountain pen and the nib icon on the site are Cycles renders made from these scripts. They are modelled the way Polygon Runway's "5 Models in 7 Minutes" tutorial works: lathe profiles spun with a Screw modifier, then Solidify and Subdivision. The lamp shade and the nib are swept from cross-sections.

Run them from this folder with Blender 5.2's Python module (or with `blender -b -P <script>`):

```bash
python3.13 -m venv .venv && .venv/bin/pip install bpy==5.2.3
.venv/bin/python lamp.py          # out/lamp-off.png, out/lamp-on.png  (add "preview" for a fast draft)
.venv/bin/python pen.py           # out/pen-obj.png, out/pen-shadow.png, out/nib.png
python3 comp.py out/pen-obj.png out/pen-shadow.png out/pen.png   # pen over its shadow, no light halo
python3 export.py ../../public/img   # trim and save the 2x WebP files the site uses
```

Units are decimetres. The lighting matches the page: a warm key from the upper right (the lamp's side), so shadows fall down and to the left. If you change the framing, update the image sizes in `src/components/Objects.tsx` and the `.lamp-cone` position in `src/index.css`.
