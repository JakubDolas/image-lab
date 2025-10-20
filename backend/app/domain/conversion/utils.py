from io import BytesIO
import zipfile
from typing import Iterable, Tuple, List
from PIL import Image
import importlib

_FORMAT_ALIASES = {"jpg": "jpeg", "jpe": "jpeg", "tif": "tiff"}

_PLUGIN_MODULES = [
    "PIL.BmpImagePlugin",
    "PIL.DdsImagePlugin",
    "PIL.EpsImagePlugin",
    "PIL.GifImagePlugin",
    "PIL.IcnsImagePlugin",
    "PIL.IcoImagePlugin",
    "PIL.ImImagePlugin",
    "PIL.JpegImagePlugin",
    "PIL.Jpeg2KImagePlugin",
    "PIL.MspImagePlugin",
    "PIL.PcxImagePlugin",
    "PIL.PdfImagePlugin",
    "PIL.PngImagePlugin",
    "PIL.PpmImagePlugin",
    "PIL.SgiImagePlugin",
    "PIL.SpiderImagePlugin",
    "PIL.SunImagePlugin",
    "PIL.TgaImagePlugin",
    "PIL.TiffImagePlugin",
    "PIL.WebPImagePlugin",
    "PIL.XbmImagePlugin",
    "PIL.XpmImagePlugin",
]

def _ensure_plugins_loaded() -> None:
    Image.init()
    for m in _PLUGIN_MODULES:
        try:
            importlib.import_module(m)
        except Exception:
            pass
    Image.init()

def supported_formats() -> List[str]:
    _ensure_plugins_loaded()
    fmts = {k.lower() for k in Image.SAVE.keys()}
    return sorted(fmts)

def normalize_format(fmt: str) -> str:
    if not fmt:
        raise ValueError("Brak docelowego formatu.")
    _ensure_plugins_loaded()
    f = fmt.lower().lstrip(".")
    f = _FORMAT_ALIASES.get(f, f)
    if f.upper() not in Image.SAVE:
        ext_map = {ext.lstrip(".").lower(): val for ext, val in Image.registered_extensions().items()}
        mapped = ext_map.get(f)
        if mapped and mapped.upper() in Image.SAVE:
            return mapped.lower()
        raise ValueError(f"Nieobsługiwany format wyjściowy (Pillow): {fmt}")
    return f

def zip_many(files: Iterable[Tuple[str, bytes]]) -> BytesIO:
    mem_zip = BytesIO()
    with zipfile.ZipFile(mem_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        for name, content in files:
            zf.writestr(name, content)
    mem_zip.seek(0)
    return mem_zip
