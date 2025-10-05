from fastapi import APIRouter, UploadFile, File, Query, HTTPException, Form
from fastapi.responses import StreamingResponse
from typing import List, Optional, Tuple
from io import BytesIO
import json
from pydantic import ValidationError

from app.domain.conversion.service import convert_single_image
from app.domain.conversion.utils import zip_many, normalize_format
from app.schemas.conversion import FileOptions

router = APIRouter(prefix="/convert", tags=["Conversion"])

@router.post("/zip-simple")
async def convert_zip_simple(
    files: List[UploadFile] = File(..., description="Wybierz 1..N plików"),
    target_format: str = Query(..., description="Docelowy format: png|jpg|webp"),
):
    try:
        target_format = normalize_format(target_format)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    converted: List[Tuple[str, bytes]] = []
    for f in files:
        data = await f.read()
        try:
            converted.append(
                convert_single_image(
                    filename=f.filename,
                    data=data,
                    target_format=target_format,
                    width=None,
                    height=None,
                    quality=None,
                )
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    mem_zip = zip_many(converted)
    return StreamingResponse(
        mem_zip,
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="converted.zip"'}
    )

@router.post("/zip-custom")
async def convert_zip_custom(
    files: List[UploadFile] = File(..., description="Wybierz 1..N plików"),
    target_format: str = Query(..., description="Docelowy format: png|jpg|webp"),
    options_json: str = Form(..., description="JSON lista opcji dla każdego pliku, w tej samej kolejności"),
):
    try:
        target_format = normalize_format(target_format)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        raw = json.loads(options_json)
        if not isinstance(raw, list):
            raise ValueError("options_json musi być listą opcji, zgodną z kolejnością plików.")
        options: List[FileOptions] = [FileOptions(**item) for item in raw]
    except (json.JSONDecodeError, ValidationError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Błędny options_json: {e}")

    if len(options) != len(files):
        raise HTTPException(
            status_code=400,
            detail=f"Liczba opcji ({len(options)}) musi równać się liczbie plików ({len(files)})."
        )

    converted: List[Tuple[str, bytes]] = []
    for idx, f in enumerate(files):
        data = await f.read()
        opt = options[idx]
        try:
            converted.append(
                convert_single_image(
                    filename=f.filename,
                    data=data,
                    target_format=target_format,
                    width=opt.width,
                    height=opt.height,
                    quality=opt.quality,
                )
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    mem_zip = zip_many(converted)
    return StreamingResponse(
        mem_zip,
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="converted.zip"'}
    )
