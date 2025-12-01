from io import BytesIO
from pathlib import Path

import io
import numpy as np
from PIL import Image
import onnxruntime as ort
from rembg import remove


BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "models" / "Real-ESRGAN-x4plus.onnx"

SCALE = 4          # model x4
TILE = 128         # rozmiar kafelka (128x128)

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Brak modelu ESRGAN: {MODEL_PATH}")

session = ort.InferenceSession(
    str(MODEL_PATH),
    providers=["CPUExecutionProvider"],
)
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

def remove_background_bytes(data: bytes) -> BytesIO:
    out = remove(data)
    buf = BytesIO(out)
    buf.seek(0)
    return buf


def upscale_image_bytes(data: bytes) -> BytesIO:
    """
    Wczytuje obraz z bytes, upscaluje x4 przy użyciu RealESRGAN_x4plus.onnx.

    - Nie skaluje w dół przed modelem.
    - Robi padding do wielokrotności TILE (128).
    - Dzieli obraz na kafelki 128x128, każdy przepuszcza przez model.
    - Skleja wynik i na końcu wycina dokładnie (orig_w * 4, orig_h * 4).

    Przykład:
      640x360  →  2560x1440
    """
    img = Image.open(io.BytesIO(data)).convert("RGB")
    orig_w, orig_h = img.size

    pad_w = ((orig_w + TILE - 1) // TILE) * TILE
    pad_h = ((orig_h + TILE - 1) // TILE) * TILE

    padded = Image.new("RGB", (pad_w, pad_h), (0, 0, 0))
    padded.paste(img, (0, 0))

    out_full = Image.new("RGB", (pad_w * SCALE, pad_h * SCALE))

    for ty in range(0, pad_h, TILE):
        for tx in range(0, pad_w, TILE):
            tile = padded.crop((tx, ty, tx + TILE, ty + TILE))

            arr = np.array(tile).astype(np.float32) / 255.0
            arr = np.transpose(arr, (2, 0, 1))[None, ...]

            out_arr = session.run([output_name], {input_name: arr})[0]

            if out_arr.ndim == 4:
                out_arr = out_arr[0]
            elif out_arr.ndim != 3:
                raise RuntimeError(f"Unexpected output shape from ESRGAN: {out_arr.shape}")
            # -------------------

            out_arr = np.clip(out_arr * 255.0, 0, 255).astype(np.uint8)
            out_arr = np.transpose(out_arr, (1, 2, 0))

            out_tile = Image.fromarray(out_arr)

            out_full.paste(out_tile, (tx * SCALE, ty * SCALE))


    final_w = orig_w * SCALE
    final_h = orig_h * SCALE
    final = out_full.crop((0, 0, final_w, final_h))

    buf = BytesIO()
    final.save(buf, format="PNG")
    buf.seek(0)
    return buf
