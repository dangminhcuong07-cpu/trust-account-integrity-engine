"""A law library wall: shelves of leather-bound law reports, softly lit, shallow focus.
The background behind the hero. Units: decimetres. Usage: python library.py [preview]"""
import math, random, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from common import *

preview = "preview" in sys.argv
s = reset(samples=32 if preview else 64)
s.render.film_transparent = False
s.view_settings.exposure = -0.3
world(strength=0.04, rot=0)
rng = random.Random(2006)  # the year of the Lawyers and Conveyancers Act

def leather(name, rgb):
    """Leather: a base colour, a little per-book variation, fine grain in the bump."""
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = 0.5
    b.inputs["Coat Weight"].default_value = 0.15
    info = nt.nodes.new("ShaderNodeObjectInfo")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (rgb[0] * 0.6, rgb[1] * 0.6, rgb[2] * 0.6, 1)
    ramp.color_ramp.elements[1].color = (rgb[0] * 1.25, rgb[1] * 1.25, rgb[2] * 1.25, 1)
    nt.links.new(info.outputs["Random"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    noise = nt.nodes.new("ShaderNodeTexNoise"); noise.inputs["Scale"].default_value = 260; noise.inputs["Detail"].default_value = 6
    bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.25
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m

LEATHERS = [leather(n, c) for n, c in [
    ("Oxblood", (0.075, 0.013, 0.01)), ("BottleGreen", (0.014, 0.04, 0.024)), ("Navy", (0.014, 0.02, 0.045)),
    ("Tan", (0.1, 0.045, 0.018)), ("Black", (0.01, 0.009, 0.009)), ("Claret", (0.05, 0.009, 0.016)),
]]
WEIGHTS = [5, 3, 3, 2, 3, 2]
gold = principled("Tooling", (0.85, 0.62, 0.3), metallic=1.0, rough=0.32)
label_red = principled("LabelRed", (0.11, 0.012, 0.009), rough=0.45)
label_black = principled("LabelBlack", (0.01, 0.01, 0.01), rough=0.4)

def walnut(name, dark=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]; b.inputs["Roughness"].default_value = 0.38
    wave = nt.nodes.new("ShaderNodeTexWave"); wave.inputs["Scale"].default_value = 1.2
    wave.inputs["Distortion"].default_value = 6; wave.inputs["Detail"].default_value = 4
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0.03 * dark, 0.017 * dark, 0.009 * dark, 1)
    ramp.color_ramp.elements[1].color = (0.075 * dark, 0.042 * dark, 0.022 * dark, 1)
    nt.links.new(wave.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    return m

wood = walnut("Walnut")
backwood = walnut("Back", dark=0.45)

cube = bpy.data.meshes.new("unit")
cube.from_pydata([(x, y, z) for x in (-.5, .5) for y in (-.5, .5) for z in (-.5, .5)], [],
                 [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)])
cube.materials.append(None)  # one slot; each object links its own material to it

def box(name, loc, size, mat, bevel=0.0, seg=3):
    ob = bpy.data.objects.new(name, cube.copy() if bevel else cube); bpy.context.collection.objects.link(ob)
    ob.location = loc; ob.scale = size
    if bevel:
        ob.data.materials[0] = mat
        bv = ob.modifiers.new("Bevel", "BEVEL"); bv.width = bevel; bv.segments = seg; bv.use_clamp_overlap = True
        for p in ob.data.polygons: p.use_smooth = True
    else:
        ob.material_slots[0].link = "OBJECT"; ob.material_slots[0].material = mat
    return ob

HALF, ROW, BOARD, DEPTH = 10.5, 3.45, 0.24, 2.6
ROWS = [i * ROW for i in range(5)]

# carcass: back panel, shelf boards with a lip, uprights
box("BackPanel", (0, DEPTH / 2 + 0.1, ROWS[-1] / 2 + 0.5), (HALF * 2 + 2, 0.2, ROWS[-1] + 3), backwood)
for z in ROWS:
    box("Board", (0, 0, z - BOARD / 2), (HALF * 2 + 1, DEPTH, BOARD), wood, bevel=0.02)
    box("Lip", (0, -DEPTH / 2 - 0.04, z - BOARD / 2), (HALF * 2 + 1, 0.1, BOARD + 0.06), wood, bevel=0.025)
for x in (-HALF - 0.35, -3.6, 3.6, HALF + 0.35):
    box("Upright", (x, -0.05, ROWS[-1] / 2), (0.36, DEPTH + 0.1, ROWS[-1] + BOARD), wood, bevel=0.03)

def book(x, z, w, h, d, mat, lab, lean=0.0):
    y = -DEPTH / 2 + d / 2 + 0.12 + rng.uniform(0, 0.06)
    b = box("Book", (x, y, z + h / 2), (w, d, h), mat, bevel=min(0.06, w * 0.18), seg=4)
    b.rotation_euler.y = lean or math.radians(rng.gauss(0, 0.7))
    front = y - d / 2 - 0.004
    if lean:
        return
    for dz in (0.17, 0.23, h - 0.2):  # tooled bands
        box("Band", (x, front, z + h - dz if dz < 1 else z + 0.2), (w * 0.86, 0.01, 0.022), gold)
    lz = z + h - 0.5
    box("Label", (x, front - 0.002, lz), (w * 0.78, 0.01, 0.34), lab)
    box("Band", (x, front - 0.003, lz + 0.2), (w * 0.8, 0.01, 0.015), gold)
    box("Band", (x, front - 0.003, lz - 0.2), (w * 0.8, 0.01, 0.015), gold)

for r in range(4):
    z, x = ROWS[r], -HALF + 0.05
    while x < HALF - 0.3:
        if rng.random() < 0.05:
            x += rng.uniform(0.4, 1.4); continue  # a gap where volumes are out
        if rng.random() < 0.12:  # an odd book, sometimes leaning
            w = rng.uniform(0.3, 0.7); h = rng.uniform(2.0, 3.0)
            lean = rng.choice([0, 0, math.radians(rng.uniform(6, 12))])
            book(x + w / 2 + (h * math.sin(lean) / 2 if lean else 0), z, w, h, rng.uniform(1.6, 2.2),
                 rng.choices(LEATHERS, WEIGHTS)[0], rng.choice([label_red, label_black]), -lean)
            x += w + 0.02 + (h * math.sin(lean) if lean else 0); continue
        # a run of matching volumes: a law report series
        mat = rng.choices(LEATHERS, WEIGHTS)[0]; lab = rng.choice([label_red, label_red, label_black])
        w = rng.uniform(0.38, 0.55); h = rng.uniform(2.6, 3.1); d = rng.uniform(2.0, 2.3)
        for _ in range(rng.randint(4, 14)):
            if x + w > HALF - 0.1: break
            ww = w * rng.uniform(0.93, 1.07)
            book(x + ww / 2, z, ww, h, d, mat, lab)
            x += ww + 0.012

# light: warm rake from the upper left, the lamp's glow from the lower right, a cool trace of fill
rake = area("Rake", (-12, -11, 16), (-5, 0, 10), 5, 1150, color=(1.0, 0.8, 0.56))
rake.data.spread = math.radians(48)  # a beam that falls off into the dark, not a flat wash
lamp = bpy.data.lights.new("LampGlow", "POINT"); lamp.energy = 700; lamp.color = (1.0, 0.68, 0.38); lamp.shadow_soft_size = 1.5
lo = bpy.data.objects.new("LampGlow", lamp); bpy.context.collection.objects.link(lo); lo.location = (8, -7, 2.5)
area("Fill", (14, -16, 9), (0, 0, 7), 8, 90, color=(0.72, 0.8, 1.0))

cam = camera((0, -27, 7.2), (0, 0, 7.0), lens=50)
cam.data.dof.use_dof = True
cam.data.dof.focus_distance = 21.5
cam.data.dof.aperture_fstop = 1.4

W, H = (960, 540) if preview else (1920, 1080)
render(f"{OUT}/library.png", W, H)
print("DONE")
