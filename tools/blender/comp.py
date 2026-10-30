"""Composite a Blender object pass over its shadow pass, keeping only the shadow's darkness."""
import sys
from PIL import Image
obj, sh, out = sys.argv[1:4]
o = Image.open(obj).convert('RGBA'); s = Image.open(sh).convert('RGBA')
a = s.getchannel('A').point(lambda v: 0 if v < 16 else v)  # drop the catcher's faint veil
shadow = Image.merge('RGBA', (Image.new('L', s.size, 0),) * 3 + (a,))
shadow.alpha_composite(o)
shadow.save(out)
