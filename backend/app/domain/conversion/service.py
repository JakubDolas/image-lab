from io import BytesIO
from typing import Optional, Tuple
from PIL import Image, UnidentifiedImageError
import os
from .utils import normalize_format

def convert_single_image(
    filename: str,
    data: bytes,
    target_format: str,
    width: Optional[int] = None,
    height: Optional[int] = None,
    quality: Optional[int] = None,
) -> Tuple[str, bytes]:
    try:
        target_format = normalize_format(target_format)
    except ValueError as e:
        raise e

    try:
        img = Image.open(BytesIO(data))
    except UnidentifiedImageError:
        raise ValueError(f"Plik nie jest obrazem: {filename}")

    if target_format == "jpeg" and img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGB")

    if width or height:
        w, h = img.size
        new_w = width or int(w * (height / h))
        new_h = height or int(h * (width / w))
        img = img.resize((new_w, new_h), Image.LANCZOS)

    buf = BytesIO()
    save_kwargs = {}
    if target_format in {"jpeg", "webp"} and quality is not None:
        save_kwargs["quality"] = quality
    img.save(buf, format=target_format.upper(), **save_kwargs)
    buf.seek(0)

    base, _ = os.path.splitext(filename)
    out_name = f"{base}.{ 'jpg' if target_format=='jpeg' else target_format }"
    return out_name, buf.read()
