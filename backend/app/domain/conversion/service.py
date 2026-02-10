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
    target_format = normalize_format(target_format)

    try:
        img = Image.open(BytesIO(data))
    except UnidentifiedImageError:
        raise ValueError(f"Plik nie jest obrazem lub format nieobsługiwany: {filename}")

    # Jeśli plik jest wielostronicowy (GIF), weź pierwszą "klatkę/stronę"
    try:
        img.seek(0)
    except Exception:
        # nie wszystkie formaty wspierają seek — ignorujemy
        pass

    # Konwertuj tryb gdy to wymagane (np. RGBA do RGB dla JPEG)
    if target_format == "jpeg" and img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGB")
    # Dla PNG możemy zachować alfa jeśli jest
    if target_format == "png" and img.mode == "P":
        img = img.convert("RGBA")

    # Resize (zachowaj proporcje jeśli tylko jedna wartość jest podana)
    if width or height:
        w, h = img.size
        if width and height:
            new_w, new_h = int(width), int(height)
        elif width:
            new_w = int(width)
            new_h = int(h * (width / w))
        else:  # height
            new_h = int(height)
            new_w = int(w * (height / h))
        img = img.resize((new_w, new_h), Image.LANCZOS)

    buf = BytesIO()
    save_kwargs = {}
    if target_format in {"jpeg", "webp"} and quality is not None:
        save_kwargs["quality"] = quality

    # Pillow oczekuje nazwy formatu w uppercase, np. "PNG"
    try:
        img.save(buf, format=target_format.upper(), **save_kwargs)
    except Exception as e:
        # jeśli Pillow nie potrafi zapisać w danym formacie, rzuć błąd
        raise ValueError(f"Nie można zapisać obrazu w formacie {target_format}: {e}")

    buf.seek(0)

    base, _ = os.path.splitext(filename)
    ext = "jpg" if target_format == "jpeg" else target_format
    out_name = f"{base}.{ext}"
    return out_name, buf.read()