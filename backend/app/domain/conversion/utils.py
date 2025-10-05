from io import BytesIO
import zipfile
from typing import Iterable, Tuple

ALLOWED_FORMATS = {"png", "jpg", "jpeg", "webp"}

def normalize_format(fmt: str) -> str:
    fmt = fmt.lower()
    if fmt == "jpg":
        fmt = "jpeg"
    if fmt not in ALLOWED_FORMATS:
        raise ValueError(f"Nieobsługiwany format: {fmt}")
    return fmt

def zip_many(files: Iterable[Tuple[str, bytes]]) -> BytesIO:
    mem_zip = BytesIO()
    with zipfile.ZipFile(mem_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        for name, content in files:
            zf.writestr(name, content)
    mem_zip.seek(0)
    return mem_zip
