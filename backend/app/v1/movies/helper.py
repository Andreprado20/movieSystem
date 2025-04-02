from dotenv import load_dotenv
import os
from app.v1.movies import schemas
import requests

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