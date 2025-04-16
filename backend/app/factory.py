import firebase_admin
from contextlib import asynccontextmanager
from pathlib import Path
import os
from supabase import create_client, Client
import logging

from fastapi import APIRouter, FastAPI
from fastapi.routing import APIRoute
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from firebase_admin import credentials
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

from app.v1.movies.routes import movies_routes
from app.v1.user.routes import user_routes
from app.auth import setup_firebase_auth_hooks

# Configurar logging
logger = logging.getLogger(__name__)

health = APIRouter(tags=["health"], responses={404: {"description": "Not found"}})

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # anon key for public operations
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # service_role key for admin operations


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

    # Initialize Supabase client - use service role key for admin operations if available
    supabase_key = SUPABASE_SERVICE_KEY if SUPABASE_SERVICE_KEY else SUPABASE_KEY
    app.state.supabase = create_client(SUPABASE_URL, supabase_key)
    
    # Initialize Firebase-Supabase user synchronization
    app.state.user_synchronizer = setup_firebase_auth_hooks(app.state.supabase)
    
    yield

    # No need to close Supabase client


def create_app():
    app = FastAPI(
        title="Movie System API",
        description="API para sistema de gerenciamento de filmes",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_exception_handler(Exception, error_handler)
    app.include_router(health)
    app.include_router(movies_routes)
    app.include_router(user_routes)
    
    return app