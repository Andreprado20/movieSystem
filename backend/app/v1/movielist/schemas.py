from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime

class MovieListAction(BaseModel):
    """Base schema for adding or removing a movie from a list"""
    filme_id: int = Field(..., description="ID do filme a ser adicionado/removido")
    perfil_id: Optional[int] = Field(None, description="ID do perfil (opcional, usa o perfil padrão se não fornecido)")

class MovieListResponse(BaseModel):
    """Response schema for movie list operations"""
    id: int
    filme_id: int
    perfil_id: int
    created_at: Optional[datetime] = None

class MovieListsStatus(BaseModel):
    """Status of a movie in different lists"""
    filme_id: int
    is_favorite: bool
    is_watched: bool
    is_watch_later: bool

class MovieListType(BaseModel):
    """Type of movie list for batch operations"""
    list_type: Literal["favorite", "watched", "watch_later"] = Field(
        ..., description="Tipo de lista (favoritos, assistidos ou para assistir)"
    )

class BatchMovieListOperation(BaseModel):
    """Batch operation for multiple movies in a list"""
    filme_ids: List[int] = Field(..., description="Lista de IDs de filmes")
    perfil_id: Optional[int] = Field(None, description="ID do perfil (opcional)")
    
class BatchResponseItem(BaseModel):
    """Response item for batch operations"""
    filme_id: int
    success: bool
    message: Optional[str] = None
    
class BatchResponse(BaseModel):
    """Response for batch operations"""
    results: List[BatchResponseItem] 