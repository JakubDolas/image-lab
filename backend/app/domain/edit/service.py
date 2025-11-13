from io import BytesIO
from rembg import remove

def remove_background_bytes(data: bytes) -> BytesIO:
    out = remove(data)
    return BytesIO(out)
