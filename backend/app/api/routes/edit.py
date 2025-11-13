from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
from app.domain.edit.service import remove_background_bytes

router = APIRouter(prefix="/edit", tags=["edit"])

@router.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    data = await file.read()
    out = remove_background_bytes(data)
    return StreamingResponse(out, media_type="image/png")
