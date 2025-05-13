from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class MovieBase(BaseModel):
    title: str = Field(..., description="Título do filme", example="The Matrix")
    description: str = Field(..., description="Descrição ou sinopse do filme", example="Um programador descobre que o mundo em que vive é uma simulação")
    release_date: date = Field(..., description="Data de lançamento do filme", example="1999-03-31")
    genre: List[str] = Field(..., description="Lista de gêneros do filme", example=["Action", "Sci-Fi"])
    rating: Optional[float] = Field(None, description="Avaliação do filme (0-10)", ge=0, le=10)
    director: Optional[str] = Field(None, description="Nome do diretor", example="Lana Wachowski")
    cast: Optional[List[str]] = Field(None, description="Lista de atores principais", example=["Keanu Reeves", "Laurence Fishburne"])

    class Config:
        schema_extra = {
            "example": {
                "title": "The Matrix",
                "description": "Um programador descobre que o mundo em que vive é uma simulação",
                "release_date": "1999-03-31",
                "genre": ["Action", "Sci-Fi"],
                "rating": 8.7,
                "director": "Lana Wachowski",
                "cast": ["Keanu Reeves", "Laurence Fishburne"]
            }
        }