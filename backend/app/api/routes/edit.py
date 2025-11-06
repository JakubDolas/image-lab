from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.domain.edit.service import remove_background_bytes, apply_filters_bytes, export_bytes

router = APIRouter(prefix="/edit", tags=["edit"])

@router.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    data = await file.read()
    out = remove_background_bytes(data)
    return StreamingResponse(out, media_type="image/png")

@router.post("/apply-filters")
async def apply_filters(
    file: UploadFile = File(...),
    brightness: int = Form(100),
    contrast: int = Form(100),
    saturate: int = Form(100),
    hue: int = Form(0),
    temperature: int = Form(0),
):
    data = await file.read()
    out = apply_filters_bytes(
        data,
        brightness=brightness,
        contrast=contrast,
        saturate=saturate,
        hue=hue,
        temperature=temperature,
    )
    return StreamingResponse(out, media_type="image/png")

@router.post("/export")
async def export(
    file: UploadFile = File(...),
    fmt: str = Form("png"), 
    quality: int = Form(90),
):
    data = await file.read()
    stream, mt, filename = export_bytes(data, fmt=fmt, quality=quality)
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return StreamingResponse(stream, media_type=mt, headers=headers)
