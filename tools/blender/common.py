"""Shared helpers for the TrustSentry desk objects (headless Blender 5.2, Cycles CPU)."""
import math, os, sys
import bpy, addon_utils

OUT = os.path.dirname(os.path.abspath(__file__)) + "/out"
os.makedirs(OUT, exist_ok=True)
HDRI = os.path.join(bpy.utils.system_resource("DATAFILES"), "studiolights/world/interior.exr")


def reset(samples=256):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    addon_utils.enable("cycles", default_set=True)
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.device = "CPU"
    s.cycles.samples = samples
    s.cycles.use_denoising = True
    s.render.film_transparent = True
    s.view_settings.view_transform = "AgX"
    s.view_settings.look = "AgX - Medium High Contrast"
    s.render.image_settings.file_format = "PNG"
    s.render.image_settings.color_mode = "RGBA"
    return s


def world(strength=0.35, rot=0.0):
    w = bpy.data.worlds.new("World")
    bpy.context.scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Rotation"].default_value[2] = rot
    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(HDRI)
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = strength
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(tc.outputs["Generated"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], env.inputs["Vector"])
    nt.links.new(env.outputs["Color"], bg.inputs["Color"])
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def principled(name, color, metallic=0.0, rough=0.3, coat=0.0, transmission=0.0, ior=1.5, emission=None, estrength=0.0, aniso=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = rough
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = 0.03
    b.inputs["Transmission Weight"].default_value = transmission
    b.inputs["IOR"].default_value = ior
    b.inputs["Anisotropic"].default_value = aniso
    if emission:
        b.inputs["Emission Color"].default_value = (*emission, 1)
        b.inputs["Emission Strength"].default_value = estrength
    return m


def mesh(name, verts, faces, mat=None, smooth=True):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    if mat:
        me.materials.append(mat)
    return ob


def lathe(name, profile, mat, axis="Z", steps=96, sub=1, split=None):
    """The tutorial's move: a profile polyline spun with a Screw modifier.
    profile: [(radius, height)] from the axis outwards and back."""
    if axis == "Z":
        verts = [(r, 0, h) for r, h in profile]
    else:  # along X: (x, radius)
        verts = [(h, 0, r) for r, h in profile]
    edges = [(i, i + 1) for i in range(len(verts) - 1)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, edges, [])
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    sc = ob.modifiers.new("Screw", "SCREW")
    sc.axis = axis
    sc.steps = steps
    sc.render_steps = steps
    sc.use_merge_vertices = True
    sc.use_smooth_shade = True
    sc.use_normal_calculate = True
    if split:
        es = ob.modifiers.new("Split", "EDGE_SPLIT")
        es.split_angle = math.radians(split)
    if sub:
        ss = ob.modifiers.new("Subsurf", "SUBSURF")
        ss.levels = sub
        ss.render_levels = sub
    me.materials.append(mat)
    return ob


def area(name, loc, target, size, energy, color=(1, 1, 1), shape="RECTANGLE", size_y=None):
    d = bpy.data.lights.new(name, "AREA")
    d.energy = energy
    d.color = color
    d.shape = shape
    d.size = size
    if size_y:
        d.size_y = size_y
    ob = bpy.data.objects.new(name, d)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    look_at(ob, target)
    return ob


def look_at(ob, target):
    from mathutils import Vector
    d = Vector(target) - Vector(ob.location)
    ob.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


def camera(loc, target, lens=85, ortho=None):
    c = bpy.data.cameras.new("Cam")
    if ortho:
        c.type = "ORTHO"
        c.ortho_scale = ortho
    else:
        c.lens = lens
    ob = bpy.data.objects.new("Cam", c)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    look_at(ob, target)
    bpy.context.scene.camera = ob
    return ob


def catcher(z=0.0, size=20):
    bpy.ops.mesh.primitive_plane_add(size=size, location=(0, 0, z))
    p = bpy.context.object
    p.is_shadow_catcher = True
    return p


def render(path, w, h):
    s = bpy.context.scene
    s.render.resolution_x = w
    s.render.resolution_y = h
    s.render.resolution_percentage = 100
    s.render.filepath = path
    bpy.ops.render.render(write_still=True)
