from fastapi import APIRouter, Depends, Request, Body
from typing import Optional
from datetime import datetime

from app.v1.movies import schemas, helper

movies_routes = APIRouter(
    prefix="/v1/movies",
    tags=["Movies"],
    responses={404: {"description": "Not found"}},
)

@movies_routes.get("/find", responses={400: {"content": {"application/json": 
    {"example": {"detail": "Invalid movie ID"}}}}})
async def get_movie(movie_id: int):
    """
    Get movie details by movie ID.
    """
    try:
        movie_data = await helper.fetch_movie_data(movie_id)
        return movie_data
    except Exception as e:
        return {"detail": str(e)}, 400
        
