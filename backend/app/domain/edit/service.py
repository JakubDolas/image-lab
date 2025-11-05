from io import BytesIO
from rembg import remove  # do wycinania tła

async def remove_background(file):
    data = await file.read()
    out_bytes = remove(data)  
    return BytesIO(out_bytes)
