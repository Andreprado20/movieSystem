from dotenv import load_dotenv
import os
from app.v1.movies import schemas
import requests
from fastapi import Request

async def fetch_movie_data(movie_id: int) -> dict:
    """
    Fetch movie data from TMDB API using a Bearer token.

    Args:
        movie_id (int): The TMDB movie ID.

    Raises:
        ValueError: If TMDB_BEARER_TOKEN is not found in environment variables.
        Exception: If the API request fails.
    """
    tmdb_bearer_token = os.getenv("TMDB_BEARER_TOKEN")
    tmdb_url = os.getenv("TMDB_URL")
    if not tmdb_bearer_token:
        raise ValueError("TMDB_BEARER_TOKEN not found in .env file")

    url = f"{tmdb_url}/movie/{movie_id}"
    headers = {"Authorization": f"Bearer {tmdb_bearer_token}"}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"TMDB API Error: {response.status_code} - {response.text}")

async def get_movie_from_db(movie_id: int, request: Request) -> dict:
    """
    Get movie data from the database.

    Args:
        movie_id (int): The movie ID in our database.
        request (Request): FastAPI request object to access the Supabase client.

    Returns:
        dict: Movie data from the database.
    """
    try:
        response = request.app.state.supabase.table("Filme").select("*").eq("id", movie_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        raise Exception(f"Database Error: {str(e)}")

async def create_movie_in_db(movie_data: dict, request: Request) -> dict:
    """
    Create a new movie in the database.

    Args:
        movie_data (dict): Movie data to be inserted.
        request (Request): FastAPI request object to access the Supabase client.

    Returns:
        dict: Created movie data.
    """
    try:
        response = request.app.state.supabase.table("Filme").insert(movie_data).execute()
        return response.data[0]
    except Exception as e:
        raise Exception(f"Database Error: {str(e)}")

async def update_movie_in_db(movie_id: int, movie_data: dict, request: Request) -> dict:
    """
    Update a movie in the database.

    Args:
        movie_id (int): The movie ID to update.
        movie_data (dict): Updated movie data.
        request (Request): FastAPI request object to access the Supabase client.

    Returns:
        dict: Updated movie data.
    """
    try:
        response = request.app.state.supabase.table("Filme").update(movie_data).eq("id", movie_id).execute()
        return response.data[0]
    except Exception as e:
        raise Exception(f"Database Error: {str(e)}")

async def delete_movie_from_db(movie_id: int, request: Request) -> bool:
    """
    Delete a movie from the database.

    Args:
        movie_id (int): The movie ID to delete.
        request (Request): FastAPI request object to access the Supabase client.

    Returns:
        bool: True if successful, False otherwise.
    """
    try:
        response = request.app.state.supabase.table("Filme").delete().eq("id", movie_id).execute()
        return bool(response.data)
    except Exception as e:
        raise Exception(f"Database Error: {str(e)}")

async def list_movies_from_db(request: Request, page: int = 1, limit: int = 10) -> dict:
    """
    List movies from the database with pagination.

    Args:
        request (Request): FastAPI request object to access the Supabase client.
        page (int): Page number.
        limit (int): Number of items per page.

    Returns:
        dict: List of movies and pagination info.
    """
    try:
        start = (page - 1) * limit
        response = request.app.state.supabase.table("Filme").select("*").range(start, start + limit - 1).execute()
        count_response = request.app.state.supabase.table("Filme").select("*", count="exact").execute()
        
        return {
            "data": response.data,
            "meta": {
                "total": len(count_response.data),
                "page": page,
                "limit": limit,
                "totalPages": (len(count_response.data) + limit - 1) // limit
            }
        }
    except Exception as e:
        raise Exception(f"Database Error: {str(e)}")