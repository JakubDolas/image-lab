from fastapi import FastAPI
from app.api.routes.health import router as health_router
from app.api.routes.convert import router as convert_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Image Lab API", version="0.1.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

app.include_router(health_router)
app.include_router(convert_router)

