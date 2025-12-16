from fastapi import APIRouter, UploadFile, File, Query, HTTPException, Form
from fastapi.responses import StreamingResponse, JSONResponse
from typing import List, Tuple
import json
from pydantic import ValidationError
from io import BytesIO


from app.domain.conversion.service import convert_single_image
from app.domain.conversion.utils import zip_many, normalize_format, supported_formats
from app.schemas.conversion import FileOptions

router = APIRouter(prefix="/convert", tags=["Conversion"])


@router.get("/supported")
def get_supported_formats():
    fmts = supported_formats()
    preferred_ext = {"jpeg": "jpg", "tiff": "tif"}
    return JSONResponse({"formats": fmts, "preferred_ext": preferred_ext})

@router.post("/zip-simple")
async def convert_zip_simple(
    files: List[UploadFile] = File(...),
    target_format: str = Query(...),
    quality: int | None = Query(None),
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
                    quality=quality,
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
    files: List[UploadFile] = File(...),
    options_json: str = Form(...),
):
    try:
        raw = json.loads(options_json)
        if not isinstance(raw, list):
            raise ValueError("options_json musi być listą opcji w kolejności plików.")
        options: List[FileOptions] = [FileOptions(**item) for item in raw]
    except (json.JSONDecodeError, ValidationError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Błędny options_json: {e}")

    if len(options) != len(files):
        raise HTTPException(status_code=400, detail="Niezgodna liczba opcji i plików.")

    converted: List[Tuple[str, bytes]] = []
    for idx, f in enumerate(files):
        data = await f.read()
        opt = options[idx]

        if not opt.format:
            raise HTTPException(status_code=400, detail=f"Brak 'format' dla pliku #{idx+1} ({f.filename}).")

        qual = opt.quality if opt.format in ("jpeg", "webp") else None

        try:
            converted.append(
                convert_single_image(
                    filename=f.filename,
                    data=data,
                    target_format=opt.format,
                    width=opt.width,
                    height=opt.height,
                    quality=qual,
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


@router.post("/to-editor")
async def convert_to_editor(file: UploadFile = File(...)):
    """
    Przyjmuje JEDEN plik (dowolnego formatu obsługiwanego przez Pillow / ImageMagick backend)
    i zwraca go skonwertowanego do PNG (pierwsza strona / klatka dla formatów wielostronicowych).
    """
    data = await file.read()
    try:
        out_name, out_bytes = convert_single_image(
            filename=file.filename,
            data=data,
            target_format="png",   # zawsze PNG dla edytora
            width=None,
            height=None,
            quality=None
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return StreamingResponse(BytesIO(out_bytes), media_type="image/png",
                             headers={"Content-Disposition": f'inline; filename="{out_name}"'})