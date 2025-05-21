from fastapi import APIRouter, HTTPException, Depends, Request, Path, Query
from typing import Optional, List, Dict, Any
from app.v1.movielist.schemas import *
from app.v1.movielist.helper import *
from app.auth.email_auth import get_user_by_email

movielist_email_routes = APIRouter(prefix="/v1/email/movielist", tags=["Movie Lists Email Auth"])

@movielist_email_routes.get("/status/{filme_id}", response_model=MovieListsStatus)
async def get_movie_status_route(
    request: Request,
    filme_id: int = Path(..., description="ID do filme"),
    perfil_id: Optional[int] = Query(None, description="ID do perfil (opcional)"),
    current_user: dict = Depends(get_user_by_email)
):
    """Obtém o status de um filme nas listas (favoritos, assistidos, assistir depois) com autenticação por e-mail"""
    try:
        supabase = request.app.state.supabase
        
        # Get user ID from email
        usuario_id = current_user["id"]
        
        # If perfil_id is not provided, get the default profile
        if not perfil_id:
            perfil_id = get_default_profile(supabase, usuario_id)
        
        return get_movie_lists_status(supabase, filme_id, perfil_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@movielist_email_routes.post("/favorites", response_model=Dict[str, Any])
async def add_to_favorites_route(
    request: Request,
    movie_data: MovieListAction,
    current_user: dict = Depends(get_user_by_email)
):
    """Adiciona um filme aos favoritos com autenticação por e-mail"""
    try:
        supabase = request.app.state.supabase
        
        # Get user ID from email
        usuario_id = current_user["id"]
        
        # If perfil_id is not provided, get the default profile
        perfil_id = movie_data.perfil_id or get_default_profile(supabase, usuario_id)
        
        result = add_movie_to_favorites(supabase, movie_data.filme_id, perfil_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@movielist_email_routes.post("/watched", response_model=Dict[str, Any])
async def add_to_watched_route(
    request: Request,
    movie_data: MovieListAction,
    current_user: dict = Depends(get_user_by_email)
):
    """Adiciona um filme à lista de assistidos (e remove da lista de assistir depois, se presente) com autenticação por e-mail"""
    try:
        supabase = request.app.state.supabase
        
        # Get user ID from email
        usuario_id = current_user["id"]
        
        # If perfil_id is not provided, get the default profile
        perfil_id = movie_data.perfil_id or get_default_profile(supabase, usuario_id)
        
        result = add_movie_to_watched(supabase, movie_data.filme_id, perfil_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@movielist_email_routes.post("/watch-later", response_model=Dict[str, Any])
async def add_to_watch_later_route(
    request: Request,
    movie_data: MovieListAction,
    current_user: dict = Depends(get_user_by_email)
):
    """Adiciona um filme à lista de assistir depois (apenas se não estiver na lista de assistidos) com autenticação por e-mail"""
    try:
        supabase = request.app.state.supabase
        
        # Get user ID from email
        usuario_id = current_user["id"]
        
        # If perfil_id is not provided, get the default profile
        perfil_id = movie_data.perfil_id or get_default_profile(supabase, usuario_id)
        
        result = add_movie_to_watch_later(supabase, movie_data.filme_id, perfil_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@movielist_email_routes.delete("/{list_type}/{filme_id}", response_model=Dict[str, Any])
async def remove_from_list_route(
    request: Request,
    list_type: str = Path(..., description="Tipo de lista (favorites, watched, watch_later)"),
    filme_id: int = Path(..., description="ID do filme"),
    perfil_id: Optional[int] = Query(None, description="ID do perfil (opcional)"),
    current_user: dict = Depends(get_user_by_email)
):
    """Remove um filme de uma lista específica com autenticação por e-mail"""
    try:
        supabase = request.app.state.supabase
        
        # Check if list_type is valid
        valid_lists = ["favorites", "watched", "watch_later"]
        if list_type not in valid_lists:
            raise HTTPException(status_code=400, detail="Tipo de lista inválido")
        
        # Get user ID from email
        usuario_id = current_user["id"]
        
        # If perfil_id is not provided, get the default profile
        if not perfil_id:
            perfil_id = get_default_profile(supabase, usuario_id)
        
        return remove_movie_from_list(supabase, list_type, filme_id, perfil_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@movielist_email_routes.get("/{list_type}", response_model=List[Dict[str, Any]])
async def get_movies_in_list_route(
    request: Request,
    list_type: str = Path(..., description="Tipo de lista (favorites, watched, watch_later)"),
    perfil_id: Optional[int] = Query(None, description="ID do perfil (opcional)"),
    current_user: dict = Depends(get_user_by_email)
):
    """Obtém todos os filmes em uma lista específica com autenticação por e-mail"""
    try:
        supabase = request.app.state.supabase
        
        # Check if list_type is valid
        valid_lists = ["favorites", "watched", "watch_later"]
        if list_type not in valid_lists:
            raise HTTPException(status_code=400, detail="Tipo de lista inválido")
        
        # Get user ID from email
        usuario_id = current_user["id"]
        
        # If perfil_id is not provided, get the default profile
        if not perfil_id:
            perfil_id = get_default_profile(supabase, usuario_id)
        
        return get_movies_in_list(supabase, list_type, perfil_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@movielist_email_routes.post("/batch", response_model=BatchResponse)
async def batch_update_list_route(
    request: Request,
    list_type: MovieListType,
    batch_data: BatchMovieListOperation,
    current_user: dict = Depends(get_user_by_email)
):
    """Adiciona múltiplos filmes a uma lista em operação em lote com autenticação por e-mail"""
    try:
        supabase = request.app.state.supabase
        
        # Get user ID from email
        usuario_id = current_user["id"]
        
        # If perfil_id is not provided, get the default profile
        perfil_id = batch_data.perfil_id or get_default_profile(supabase, usuario_id)
        
        return batch_update_movie_list(
            supabase, list_type.list_type, batch_data.filme_ids, perfil_id
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 