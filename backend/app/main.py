from fastapi import FastAPI
from app.api.routes.health import router as health_router
from app.api.routes.convert import router as convert_router

app = FastAPI(title="Image Lab API", version="0.1.0")
app.include_router(health_router)
app.include_router(convert_router)
