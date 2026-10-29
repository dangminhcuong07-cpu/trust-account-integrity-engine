"""Fountain pen lying on the report, cap posted, at its on-page angle (21 degrees).
Also renders the small nib icon. Units: decimetres (the pen is ~1.5 dm long).
Usage: python pen.py [preview]"""
import math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, bmesh
from common import *

preview = "preview" in sys.argv
s = reset(samples=48 if preview else 192)
world(strength=0.55, rot=math.radians(120))

resin = principled("Resin", (0.004, 0.004, 0.005), rough=0.06, coat=1.0)
gold = principled("Gold", (0.95, 0.72, 0.38), metallic=1.0, rough=0.13)
rhodium = principled("Rhodium", (0.82, 0.84, 0.86), metallic=1.0, rough=0.1)
feedm = principled("Feed", (0.012, 0.012, 0.013), rough=0.45)
holem = principled("Hole", (0.0, 0.0, 0.0), rough=0.9)

parts = []
def keep(ob):
    parts.append(ob); return ob

# ── body: section + barrel, and the posted cap, as lathe profiles around X: (radius, x) ──
keep(lathe("Barrel", [(0, 0.17), (0.033, 0.17), (0.036, 0.2), (0.041, 0.27), (0.038, 0.33), (0.043, 0.39), (0.05, 0.41),
                       (0.056, 0.425), (0.059, 0.5), (0.0615, 0.8), (0.062, 1.06), (0, 1.06)], resin, axis="X", steps=96))
keep(lathe("Cap", [(0.058, 0.99), (0.066, 0.995), (0.0675, 1.1), (0.068, 1.25), (0.065, 1.38), (0.06, 1.44), (0.048, 1.475),
                    (0.028, 1.492), (0, 1.496)], resin, axis="X", steps=96))
for name, prof in [
    ("SectionRing", [(0.051, 0.405), (0.0572, 0.41), (0.0582, 0.42), (0.0572, 0.43), (0.051, 0.435)]),
    ("CapLip", [(0.064, 0.991), (0.0684, 0.996), (0.0684, 1.006), (0.066, 1.011)]),
    ("CapBand", [(0.066, 1.016), (0.0698, 1.021), (0.0701, 1.045), (0.0698, 1.07), (0.066, 1.075)]),
    ("CapRing", [(0.066, 1.08), (0.069, 1.083), (0.069, 1.09), (0.066, 1.093)]),
]:
    keep(lathe(name, prof, gold, axis="X", steps=96, sub=1))

# clip: a strip along the top of the cap, a head into the dome, a ball at the free end
bpy.ops.mesh.primitive_cube_add(size=1, location=(1.275, 0, 0.0815)); clip = keep(bpy.context.object)
clip.scale = (0.3, 0.022, 0.009); clip.data.materials.append(gold)
bv = clip.modifiers.new("Bevel", "BEVEL"); bv.width = 0.004; bv.segments = 3
bpy.ops.mesh.primitive_cube_add(size=1, location=(1.42, 0, 0.072)); head = keep(bpy.context.object)
head.scale = (0.045, 0.026, 0.03); head.data.materials.append(gold)
bv = head.modifiers.new("Bevel", "BEVEL"); bv.width = 0.008; bv.segments = 4
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.016, location=(1.128, 0, 0.0765)); keep(bpy.context.object).data.materials.append(gold)
bpy.ops.object.shade_smooth()

# ── nib: a gently curved sheet in a nib outline, slit to the breather hole, rhodium inlay on gold ──
def halfw(x):
    # concave sides sweeping to a fine point, full width at the shoulders, a waist into the section
    if x <= 0.15:
        t = max(0.0, (x + 0.01) / 0.16)
        return 0.0012 + 0.0445 * t ** 1.6
    return 0.0457 - (x - 0.15) / 0.05 * 0.01
def crown(x):
    return 0.005 + (x + 0.01) / 0.21 * 0.031
def rcone(x):  # height of the nib's centre line, used for the tip and hole
    return crown(x)
rows = [-0.01 + 0.21 * i / 70 for i in range(71)]
half = 14
verts, faces, mats = [], [], []
for side in (-1, 1):
    base = len(verts)
    for x in rows:
        w, h = halfw(x), crown(x)
        R = 1.5 * max(w, 0.012)
        d = 0.0009 if x < 0.095 else 0.0
        for j in range(half + 1):
            y = side * (d + (w - d) * j / half)
            verts.append((x, y, h - (R - math.sqrt(max(R * R - y * y, 0)))))
    for i in range(len(rows) - 1):
        for j in range(half):
            p = base + i * (half + 1) + j
            faces.append((p, p + 1, p + half + 2, p + half + 1) if side > 0 else (p, p + half + 1, p + half + 2, p + 1))
            xm = rows[i]
            u = (xm - 0.1) / 0.05
            inlay = abs(u) < 1 and j < half * 0.62 * (1 - u * u) * (1.15 if u < 0 else 1)
            mats.append(1 if inlay else 0)
nib = keep(mesh("Nib", verts, faces, gold))
nib.data.materials.append(rhodium)
for p, m in zip(nib.data.polygons, mats):
    p.material_index = m
bm = bmesh.new(); bm.from_mesh(nib.data)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
bm.to_mesh(nib.data); bm.free()
so = nib.modifiers.new("Solidify", "SOLIDIFY"); so.thickness = 0.003; so.offset = -1
bpy.ops.mesh.primitive_cylinder_add(radius=0.0055, depth=0.002, location=(0.095, 0, rcone(0.095) + 0.0009)); keep(bpy.context.object).data.materials.append(holem)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.0028, location=(-0.009, 0, rcone(-0.009) - 0.001)); keep(bpy.context.object).data.materials.append(rhodium)
bpy.ops.object.shade_smooth()
feed = keep(lathe("Feed", [(0, 0.03), (0.004, 0.03), (0.028, 0.2), (0, 0.2)], feedm, axis="X", steps=48, sub=0))
feed.scale = (1, 1.15, 0.8)

# ── lay it on the report at its on-page angle; centre it ──
pivot = bpy.data.objects.new("Pen", None); bpy.context.collection.objects.link(pivot)
for o in parts:
    o.parent = pivot
    o.location.x -= 0.75
pivot.location.z = 0.062
pivot.rotation_euler.z = math.radians(21)

# the lamp is up and to the right: key from there, a long softbox for the line on the barrel
area("Key", (3.2, 2.6, 4.5), (0, 0, 0), 1.6, 160, color=(1.0, 0.92, 0.82))
strip = area("Strip", (0.35, -0.2, 2.2), (0.1, 0.05, 0), 0.25, 70, size_y=3.0)
strip.rotation_euler.z += math.radians(21)
area("Fill", (-3, -2, 3), (0, 0, 0), 4, 25)
cat = catcher(0)
camera((0, 0, 6), (0, 0, 0), ortho=1.62)
W, H = (800, 400) if preview else (1500, 750)
cat.hide_render = True
render(f"{OUT}/pen-obj.png", W, H)
cat.hide_render = False
for o in parts:
    o.visible_camera = False
render(f"{OUT}/pen-shadow.png", W, H)
for o in parts:
    o.visible_camera = True

# ── the nib icon: nib pointing down, no shadow, close up ──
pivot.rotation_euler.z = math.radians(90)
pivot.location = (0, 0.75 - 0.12, 0.062)
cat.hide_render = True
camera((0, 0, 6), (0, 0, 0), ortho=0.24)
render(f"{OUT}/nib.png", 192, 192)
print("DONE")
