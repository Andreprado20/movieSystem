import firebase_admin
from contextlib import asynccontextmanager
from pathlib import Path
import asyncpg

from fastapi import APIRouter, FastAPI
from fastapi.routing import APIRoute
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from firebase_admin import credentials



health = APIRouter(tags=["health"], responses={404: {"description": "Not found"}})

DATABASE_URL = "postgresql://postgres:Fde2ZOInnYEScXdn@db.qoplwtzicemqpxytfzoj.supabase.co:5432/postgres"


@health.get("/health")
async def health_check():
    return JSONResponse(True, status_code=200)


def error_handler(request: Request, exc: Exception):
    return JSONResponse(
        {"message": str(exc)},
        status_code=500,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Firebase Admin SDK
    cred_path = Path(__file__).parent / "moviesystem-c4130-firebase-adminsdk-fbsvc-62e886a59f.json"
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

    app.state.pool = await asyncpg.create_pool(DATABASE_URL)
    
    yield

    await app.state.pool.close()
    

def create_app():
    app = FastAPI(lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_exception_handler(Exception, error_handler)
    app.include_router(health)
    
    return app