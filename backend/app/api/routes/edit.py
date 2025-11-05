from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from app.domain.edit.service import remove_background

router = APIRouter(prefix="/edit", tags=["edit"])

@router.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    try:
        png_stream = await remove_background(file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Background removal failed: {e}")

    return StreamingResponse(
        png_stream,
        media_type="image/png",
        headers={"Content-Disposition": f'inline; filename="{file.filename.rsplit(".",1)[0]}_nobg.png"'}
    )
