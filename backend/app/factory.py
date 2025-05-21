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
from firebase_admin import credentials, auth
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

from app.v1.movies.routes import movies_routes
from app.v1.user.routes import user_routes
from app.v1.forum.routes import forum_routes
from app.v1.movielist.routes import movielist_routes
from app.v1.chat.routes import chat_routes
from app.auth import setup_firebase_auth_hooks
from app.auth.routes import auth_routes
from app.v1.communities.routes import communities_routes
from app.v1.profile.routes import profile_routes
from app.v1.social.routes import social_routes
from app.v1.recomendations.routes import recommendations_routes

# Import email-authenticated routes
from app.v1.user.email_routes import user_email_routes
from app.v1.movies.email_routes import movies_email_routes
from app.v1.movielist.email_routes import movielist_email_routes

import asyncio

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
    
    # Sync existing Firebase users with Supabase
    try:
        # Create a background task to sync existing users
        loop = asyncio.get_event_loop()
        loop.create_task(sync_existing_users(app.state.user_synchronizer))
    except Exception as e:
        logger.error(f"Error initializing user synchronization: {str(e)}")
    
    yield

    # No need to close Supabase client


async def sync_existing_users(synchronizer):
    """Synchronize existing Firebase users with Supabase"""
    try:
        # Get all Firebase users
        page = auth.list_users()
        count = 0
        sync_count = 0
        
        while page:
            for user in page.users:
                count += 1
                try:
                    # Check if user has 'authenticated' role
                    if not user.custom_claims or not user.custom_claims.get('role') == 'authenticated':
                        # Set the authenticated role for proper Supabase integration
                        auth.set_custom_user_claims(user.uid, {'role': 'authenticated'})
                        #logger.info(f"Added 'authenticated' role to Firebase user {user.uid}")
                    
                    # Synchronize with Supabase
                    result = await synchronizer.create_user_in_supabase(user)
                    if result:
                        sync_count += 1
                except Exception as user_e:
                    logger.error(f"Error synchronizing user {user.uid}: {str(user_e)}")
            
            # Get next page of users
            page = page.get_next_page()
        
        #logger.info(f"Synchronized {sync_count} out of {count} Firebase users with Supabase")
    except Exception as e:
        logger.error(f"Error during user synchronization: {str(e)}")


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
    
    # Regular JWT/bearer token routes
    app.include_router(movies_routes)
    app.include_router(user_routes)
    app.include_router(forum_routes)
    app.include_router(movielist_routes)
    app.include_router(chat_routes)
    app.include_router(auth_routes)
    app.include_router(communities_routes)
    app.include_router(profile_routes)
    app.include_router(social_routes)
    app.include_router(recommendations_routes)
    
    # Email-authenticated routes
    app.include_router(user_email_routes)
    app.include_router(movies_email_routes)
    app.include_router(movielist_email_routes)
    
    return app