"""Green banker's lamp. Units: decimetres (the lamp stands ~3.4 dm tall).
Usage: python lamp.py [preview]"""
import math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, bmesh
from common import *

preview = "preview" in sys.argv
s = reset(samples=48 if preview else 160)
world(strength=0.28, rot=math.radians(200))

brass = principled("Brass", (0.84, 0.66, 0.36), metallic=1.0, rough=0.2)
brass_satin = principled("BrassSatin", (0.8, 0.63, 0.34), metallic=1.0, rough=0.32)
glass = principled("CasedGreen", (0.008, 0.115, 0.045), rough=0.03, coat=1.0, transmission=0.22, ior=1.52)
opal = principled("OpalInner", (0.95, 0.92, 0.84), rough=0.9, transmission=0.3, ior=1.5)

# ── Shade: a half-cylinder on its side with rounded ends, swept from a cross-section ──
L0, E, RY, RZ, Z0 = 1.0, 0.38, 0.74, 0.76, 2.78
cols = 56
rows = []
for k in range(14):  # left end, t 1 -> 0
    t = 1 - k / 14
    rows.append((-(L0 + E * math.sin(t * math.pi / 2)), math.cos(t * math.pi / 2)))
for k in range(25):
    rows.append((-L0 + 2 * L0 * k / 24, 1.0))
for k in range(1, 15):
    t = k / 14
    rows.append((L0 + E * math.sin(t * math.pi / 2), math.cos(t * math.pi / 2)))
verts, faces = [], []
for x, f in rows:
    f = max(f, 0.0)
    for j in range(cols + 1):
        th = math.pi * j / cols
        verts.append((x, -RY * f * math.cos(th), Z0 + RZ * f * math.sin(th)))
for i in range(len(rows) - 1):
    for j in range(cols):
        a = i * (cols + 1) + j
        faces.append((a, a + 1, a + cols + 2, a + cols + 1))
shade = mesh("Shade", verts, faces, glass)
bm = bmesh.new(); bm.from_mesh(shade.data)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
bmesh.ops.reverse_faces(bm, faces=bm.faces)  # the sweep winds inward; normals must face out
bm.to_mesh(shade.data); bm.free()
shade.data.materials.append(opal)
so = shade.modifiers.new("Solidify", "SOLIDIFY")
so.thickness = 0.04; so.offset = -1; so.material_offset = 1; so.material_offset_rim = 1; so.use_rim = True
ss = shade.modifiers.new("Subsurf", "SUBSURF"); ss.levels = 1; ss.render_levels = 2

# brass rim along the shade's lower edge (a stadium outline)
pts = []
for k in range(0, 33):  # right end
    ph = math.pi * k / 32
    pts.append((L0 + E * math.sin(ph), -RY * math.cos(ph)))
for k in range(0, 33):  # left end
    ph = math.pi * k / 32
    pts.append((-L0 - E * math.sin(ph), RY * math.cos(ph)))
cu = bpy.data.curves.new("Rim", "CURVE"); cu.dimensions = "3D"
sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
for p, (x, y) in zip(sp.points, pts):
    p.co = (x * 1.006, y * 1.03, Z0 - 0.005, 1)
sp.use_cyclic_u = True
cu.bevel_depth = 0.032; cu.bevel_resolution = 6
rim = bpy.data.objects.new("Rim", cu); bpy.context.collection.objects.link(rim); cu.materials.append(brass)

# finial on top
fin = lathe("Finial", [(0, 0), (0.09, 0), (0.09, 0.025), (0.045, 0.06), (0.04, 0.1), (0.07, 0.14), (0.065, 0.19), (0.035, 0.225), (0, 0.23)], brass, split=50)
fin.location.z = Z0 + RZ - 0.01

# ── Stand: base and stem are lathe profiles, as in the tutorial ──
base = lathe("Base", [(0, 0), (1.0, 0), (1.03, 0.02), (1.045, 0.06), (1.025, 0.1), (0.96, 0.125), (0.9, 0.135), (0.88, 0.17), (0.79, 0.27), (0.63, 0.37), (0.47, 0.44), (0.35, 0.48), (0.31, 0.5), (0.31, 0.55), (0.22, 0.58), (0.15, 0.6), (0, 0.6)], brass, split=35)
base.scale.x = 1.22
stem = lathe("Stem", [(0, 0.58), (0.13, 0.58), (0.13, 0.65), (0.085, 0.7), (0.075, 1.48), (0.115, 1.52), (0.115, 1.6), (0.075, 1.64), (0.07, 2.52), (0.105, 2.56), (0.105, 2.63), (0, 2.63)], brass, split=40)
knuckle = lathe("Knuckle", [(0, -0.22), (0.05, -0.22), (0.075, -0.19), (0.075, 0.19), (0.05, 0.22), (0, 0.22)], brass_satin, axis="X", split=40)
knuckle.location.z = 2.69
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.065, location=(0.29, 0, 2.69)); bpy.context.object.data.materials.append(brass)
bpy.ops.object.shade_smooth()
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.05, 2.85)); plate = bpy.context.object
plate.scale = (0.3, 0.03, 0.3); plate.data.materials.append(brass_satin)

# ball-chain pull from the front-right of the rim
for i in range(16):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.019, segments=12, ring_count=8, location=(0.78, -RY - 0.01, Z0 - 0.06 - i * 0.046))
    bpy.context.object.data.materials.append(brass); bpy.ops.object.shade_smooth()
pull = lathe("Pull", [(0, 0), (0.03, 0.02), (0.05, 0.08), (0.048, 0.14), (0.03, 0.19), (0.012, 0.22), (0, 0.23)], brass, steps=48)
pull.location = (0.78, -RY - 0.01, Z0 - 0.06 - 16 * 0.046 - 0.22)

# ── The bulb ──
bulb_mat = principled("Bulb", (1, 1, 1), rough=0.2, emission=(1.0, 0.7, 0.4), estrength=0.0)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.13, location=(0, 0, 2.95)); bulb = bpy.context.object
bulb.data.materials.append(bulb_mat)
pl = bpy.data.lights.new("BulbLight", "POINT"); pl.shadow_soft_size = 0.12; pl.color = (1.0, 0.74, 0.46)
plo = bpy.data.objects.new("BulbLight", pl); bpy.context.collection.objects.link(plo); plo.location = (0, -0.05, 2.9)

# ── Room light, matching the page: key from the upper right, a cool rim from behind left ──
area("Key", (6, -7, 7.5), (0, 0, 1.8), 4.5, 1300, color=(1.0, 0.93, 0.85))
area("Rim", (-6, 6, 5), (0, 0, 2.2), 3, 700, color=(0.8, 0.88, 1.0))
area("Fill", (-7, -6, 2), (0, 0, 1.4), 6, 160)
catcher(0)
camera((0.7, -15.5, 6.2), (0, 0, 1.78), lens=80)

W, H = (600, 560) if preview else (1100, 1030)
for state in ("off", "on"):
    on = state == "on"
    bulb_mat.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 60.0 if on else 0.0
    pl.energy = 320.0 if on else 0.0
    render(f"{OUT}/lamp-{state}.png", W, H)
print("DONE")
