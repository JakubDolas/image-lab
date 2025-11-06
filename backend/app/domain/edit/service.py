from io import BytesIO
from typing import Tuple
from rembg import remove
from PIL import Image, ImageEnhance
import numpy as np

def _to_image(data: bytes) -> Image.Image:
    im = Image.open(BytesIO(data))
    if im.mode in ("P", "LA"):
        im = im.convert("RGBA")
    return im

def _to_bytes(im: Image.Image, fmt: str = "PNG", **save_kwargs) -> BytesIO:
    buf = BytesIO()
    im.save(buf, format=fmt, **save_kwargs)
    buf.seek(0)
    return buf

def remove_background_bytes(data: bytes) -> BytesIO:
    out = remove(data)
    return BytesIO(out)

def _apply_brightness(im: Image.Image, brightness: float) -> Image.Image:
    return ImageEnhance.Brightness(im).enhance(brightness)

def _apply_contrast(im: Image.Image, contrast: float) -> Image.Image:
    return ImageEnhance.Contrast(im).enhance(contrast)

def _apply_saturation(im: Image.Image, saturation: float) -> Image.Image:
    return ImageEnhance.Color(im).enhance(saturation)

def _apply_hue(im: Image.Image, hue_deg: int) -> Image.Image:
    if hue_deg == 0:
        return im
    img = im.convert("RGBA").convert("RGB")
    arr = np.array(img)
    hsv = _rgb_to_hsv(arr)
    hsv[..., 0] = (hsv[..., 0].astype(np.int16) + int(hue_deg/360*255)) % 255
    rgb = _hsv_to_rgb(hsv)
    out = Image.fromarray(rgb, "RGB")
    if im.mode == "RGBA":
        out = out.convert("RGBA")
        out.putalpha(im.getchannel("A"))
    return out

def _apply_temperature(im: Image.Image, temp: int) -> Image.Image:
    if temp == 0:
        return im
    img = im.convert("RGBA")
    r, g, b, *rest = img.split() if img.mode == "RGBA" else (*img.split(),)
    r = np.array(r, dtype=np.int16)
    b = np.array(b, dtype=np.int16)
    if temp > 0:
        r = np.clip(r + (temp * 0.8), 0, 255)
        b = np.clip(b - (temp * 0.5), 0, 255)
    else:
        t = -temp
        r = np.clip(r - (t * 0.5), 0, 255)
        b = np.clip(b + (t * 0.8), 0, 255)
    r = Image.fromarray(r.astype(np.uint8))
    b = Image.fromarray(b.astype(np.uint8))
    if img.mode == "RGBA":
        out = Image.merge("RGBA", (r, img.getchannel("G"), b, img.getchannel("A")))
    else:
        out = Image.merge("RGB", (r, img.getchannel("G"), b))
    return out

def apply_filters_bytes(
    data: bytes,
    *, brightness: int, contrast: int, saturate: int, hue: int, temperature: int
) -> BytesIO:
    im = _to_image(data)

    im = _apply_brightness(im, max(0.0, brightness/100.0))
    im = _apply_contrast(im,   max(0.0, contrast/100.0))
    im = _apply_saturation(im, max(0.0, saturate/100.0))
    im = _apply_hue(im, hue)
    im = _apply_temperature(im, temperature)

    return _to_bytes(im, "PNG")

def export_bytes(data: bytes, *, fmt: str, quality: int) -> Tuple[BytesIO, str, str]:
    fmt = fmt.lower()
    im = _to_image(data)
    if fmt == "png":
        buf = _to_bytes(im, "PNG")
        return buf, "image/png", "image.png"
    elif fmt in ("jpg", "jpeg"):
        if im.mode == "RGBA":
            im = Image.alpha_composite(Image.new("RGBA", im.size, (255,255,255,255)), im).convert("RGB")
        buf = _to_bytes(im, "JPEG", quality=int(quality))
        return buf, "image/jpeg", "image.jpg"
    elif fmt == "webp":
        buf = _to_bytes(im, "WEBP", quality=int(quality))
        return buf, "image/webp", "image.webp"
    else:
        buf = _to_bytes(im, "PNG")
        return buf, "image/png", "image.png"


def _rgb_to_hsv(arr: np.ndarray) -> np.ndarray:
    arr = arr.astype(np.float32) / 255.0
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    mx = np.max(arr, axis=-1); mn = np.min(arr, axis=-1)
    diff = mx - mn + 1e-6
    h = np.zeros_like(mx)
    mask = mx == r
    h[mask] = (60 * (g[mask] - b[mask]) / diff[mask]) % 360
    mask = mx == g
    h[mask] = (60 * (b[mask] - r[mask]) / diff[mask]) + 120
    mask = mx == b
    h[mask] = (60 * (r[mask] - g[mask]) / diff[mask]) + 240
    s = (diff / (mx + 1e-6))
    v = mx
    hsv = np.stack([h/360.0, s, v], axis=-1)
    hsv = (hsv * 255.0).astype(np.uint8)
    return hsv

def _hsv_to_rgb(hsv: np.ndarray) -> np.ndarray:
    hsv = hsv.astype(np.float32) / 255.0
    h, s, v = hsv[...,0]*360, hsv[...,1], hsv[...,2]
    c = v * s
    x = c * (1 - np.abs(((h/60) % 2) - 1))
    m = v - c
    z = np.zeros_like(h)
    out = np.zeros((*h.shape, 3), dtype=np.float32)
    conds = [
        (0 <= h) & (h < 60), (60 <= h) & (h < 120),
        (120 <= h) & (h < 180), (180 <= h) & (h < 240),
        (240 <= h) & (h < 300), (300 <= h) & (h < 360)
    ]
    values = [
        (c,x,z),(x,c,z),(z,c,x),(z,x,c),(x,z,c),(c,z,x)
    ]
    for cond, (R,G,B) in zip(conds, values):
        out[cond,0], out[cond,1], out[cond,2] = R[cond], G[cond], B[cond]
    out = (out + m[...,None]) * 255.0
    return np.clip(out, 0, 255).astype(np.uint8)
