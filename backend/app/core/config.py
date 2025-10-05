import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Image Lab API"
    VERSION: str = "0.1.0"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://app:app@db:5432/appdb")
    MEDIA_ROOT: str = os.getenv("MEDIA_ROOT", "/data")

settings = Settings()
