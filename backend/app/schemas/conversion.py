from pydantic import BaseModel, Field
from typing import Optional

class FileOptions(BaseModel):
    width: Optional[int] = Field(None, ge=1)
    height: Optional[int] = Field(None, ge=1)
    quality: Optional[int] = Field(None, ge=1, le=100)
