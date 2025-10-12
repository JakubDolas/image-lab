from pydantic import BaseModel, Field
from pydantic.functional_validators import field_validator
from typing import Optional
from app.domain.conversion.utils import normalize_format

class FileOptions(BaseModel):
    width: Optional[int] = Field(None, ge=1)
    height: Optional[int] = Field(None, ge=1)
    quality: Optional[int] = Field(None, ge=1, le=100)
    format: Optional[str] = None

    @field_validator("format")
    @classmethod
    def _normalize_format(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        return normalize_format(v)
