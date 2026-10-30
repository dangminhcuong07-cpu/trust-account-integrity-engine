# Library photo (hero background)

`public/img/library-1920.webp` and `library-1080.webp` come from **"Antique Bookshelf Filled with Vintage Books" by Magda Ehlers** on Pexels (photo 29976380, https://www.pexels.com/photo/antique-bookshelf-filled-with-vintage-books-29976380/), used under the Pexels License: free for commercial use, no watermark, attribution not required (credited here anyway).

To regenerate, download the photo at 2400px wide and run:

```bash
python3 grade.py path/to/29976380.jpg ../../public/img 1150
```

The last argument is the top of the 16:9 crop in the source image (y = 1150 keeps the dark brown rows and avoids most of the pale vellum spines, which flare behind the headline). `grade.py` darkens, warms, tames the highlights and softens the photo slightly so it sits behind the text like a shallow depth of field.

The earlier Blender-rendered library is still in `tools/blender/library.py` if you want to switch back.
