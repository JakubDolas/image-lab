from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse

from app.domain.edit.service import (
    remove_background_bytes,
    upscale_image_bytes,
)

router = APIRouter(prefix="/edit", tags=["edit"])


@router.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    data = await file.read()
    out = remove_background_bytes(data)
    return StreamingResponse(out, media_type="image/png")


@router.post("/upscale")
async def upscale(file: UploadFile = File(...)):
    """
    Upscale x4 (np. 640x360 → 2560x1440) z użyciem RealESRGAN-x4plus.onnx.
    """
    data = await file.read()
    out = upscale_image_bytes(data)
    return StreamingResponse(out, media_type="image/png")
