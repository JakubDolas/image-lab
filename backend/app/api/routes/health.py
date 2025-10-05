from fastapi import APIRouter
from app.core.db import ping_db
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
def health():
    return {
        "status": "ok",
        "db": "up" if ping_db() else "down",
        "version": settings.VERSION,
    }
