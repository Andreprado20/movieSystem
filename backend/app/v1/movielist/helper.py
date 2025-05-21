from fastapi import HTTPException
from app.v1.movielist.schemas import *
import logging
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)

async def get_default_profile(supabase, usuario_id: int) -> int:
    """Get the default profile for a user"""
    try:
        result = await supabase.table("Perfil").select("id").eq("usuario_id", usuario_id).limit(1).execute()
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="Perfil não encontrado para o usuário")
        return result.data[0]["id"]
    except Exception as e:
        logger.error(f"Error getting default profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Falha ao obter o perfil padrão: {str(e)}")

async def get_movie_lists_status(supabase, filme_id: int, perfil_id: int) -> MovieListsStatus:
    """Check if a movie is in favorite, watched, or watch later lists"""
    try:
        # Check favorites
        fav_result = await supabase.table("FilmesFavoritos").select("id").eq("filme_id", filme_id).eq("perfil_id", perfil_id).execute()
        is_favorite = len(fav_result.data) > 0
        
        # Check watched
        watched_result = await supabase.table("FilmesAssistidos").select("id").eq("filme_id", filme_id).eq("perfil_id", perfil_id).execute()
        is_watched = len(watched_result.data) > 0
        
        # Check watch later
        later_result = await supabase.table("FilmesWatchLater").select("id").eq("filme_id", filme_id).eq("perfil_id", perfil_id).execute()
        is_watch_later = len(later_result.data) > 0
        
        return MovieListsStatus(
            filme_id=filme_id,
            is_favorite=is_favorite,
            is_watched=is_watched,
            is_watch_later=is_watch_later
        )
    except Exception as e:
        logger.error(f"Error checking movie status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Falha ao verificar o status do filme: {str(e)}")

async def add_movie_to_favorites(supabase, filme_id: int, perfil_id: int) -> Dict[str, Any]:
    """Add a movie to favorites"""
    try:
        # Check if the movie exists
        movie_check = await supabase.table("Filme").select("id").eq("id", filme_id).execute()
        if not movie_check.data or len(movie_check.data) == 0:
            raise HTTPException(status_code=404, detail="Filme não encontrado")
        
        # Check if already in favorites
        existing = await supabase.table("FilmesFavoritos").select("id").eq("filme_id", filme_id).eq("perfil_id", perfil_id).execute()
        if existing.data and len(existing.data) > 0:
            return existing.data[0]  # Already in favorites
        
        # Add to favorites
        result = await supabase.table("FilmesFavoritos").insert({
            "filme_id": filme_id,
            "perfil_id": perfil_id
        }).execute()
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding movie to favorites: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Falha ao adicionar filme aos favoritos: {str(e)}")

async def add_movie_to_watched(supabase, filme_id: int, perfil_id: int) -> Dict[str, Any]:
    """Add a movie to watched list and remove from watch later if present"""
    try:
        # Check if the movie exists
        movie_check = await supabase.table("Filme").select("id").eq("id", filme_id).execute()
        if not movie_check.data or len(movie_check.data) == 0:
            raise HTTPException(status_code=404, detail="Filme não encontrado")
        
        # Check if already in watched list
        existing = await supabase.table("FilmesAssistidos").select("id").eq("filme_id", filme_id).eq("perfil_id", perfil_id).execute()
        if existing.data and len(existing.data) > 0:
            return existing.data[0]  # Already in watched list
        
        # Remove from watch later if present
        await supabase.table("FilmesWatchLater").delete().eq("filme_id", filme_id).eq("perfil_id", perfil_id).execute()
        
        # Add to watched list
        result = await supabase.table("FilmesAssistidos").insert({
            "filme_id": filme_id,
            "perfil_id": perfil_id
        }).execute()
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding movie to watched list: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Falha ao adicionar filme aos assistidos: {str(e)}")

async def add_movie_to_watch_later(supabase, filme_id: int, perfil_id: int) -> Dict[str, Any]:
    """Add a movie to watch later list if not already watched"""
    try:
        # Check if the movie exists
        movie_check = await supabase.table("Filme").select("id").eq("id", filme_id).execute()
        if not movie_check.data or len(movie_check.data) == 0:
            raise HTTPException(status_code=404, detail="Filme não encontrado")
        
        # Check if in watched list
        watched = await supabase.table("FilmesAssistidos").select("id").eq("filme_id", filme_id).eq("perfil_id", perfil_id).execute()
        if watched.data and len(watched.data) > 0:
            raise HTTPException(
                status_code=400, 
                detail="Filme já está marcado como assistido e não pode ser adicionado à lista de 'assistir mais tarde'"
            )
        
        # Check if already in watch later
        existing = await supabase.table("FilmesWatchLater").select("id").eq("filme_id", filme_id).eq("perfil_id", perfil_id).execute()
        if existing.data and len(existing.data) > 0:
            return existing.data[0]  # Already in watch later list
        
        # Add to watch later
        result = await supabase.table("FilmesWatchLater").insert({
            "filme_id": filme_id,
            "perfil_id": perfil_id
        }).execute()
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding movie to watch later list: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Falha ao adicionar filme à lista para assistir mais tarde: {str(e)}")

async def remove_movie_from_list(supabase, table_name: str, filme_id: int, perfil_id: int) -> Dict[str, Any]:
    """Remove a movie from a specific list"""
    try:
        # Valid table names to prevent SQL injection
        valid_tables = {
            "favorites": "FilmesFavoritos",
            "watched": "FilmesAssistidos",
            "watch_later": "FilmesWatchLater"
        }
        
        if table_name not in valid_tables:
            raise HTTPException(status_code=400, detail="Lista inválida")
        
        actual_table = valid_tables[table_name]
        
        # Delete the entry
        result = await supabase.table(actual_table).delete().eq("filme_id", filme_id).eq("perfil_id", perfil_id).execute()
        
        if not result.data or len(result.data) == 0:
            return {"message": "Filme não estava na lista"}
        
        return {"message": f"Filme removido da lista {table_name}"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing movie from {table_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Falha ao remover filme da lista: {str(e)}")

async def get_movies_in_list(supabase, table_name: str, perfil_id: int) -> List[Dict[str, Any]]:
    """Get all movies in a specific list"""
    try:
        # Valid table names to prevent SQL injection
        valid_tables = {
            "favorites": "FilmesFavoritos",
            "watched": "FilmesAssistidos",
            "watch_later": "FilmesWatchLater"
        }
        
        if table_name not in valid_tables:
            raise HTTPException(status_code=400, detail="Lista inválida")
        
        actual_table = valid_tables[table_name]
        
        # Get all movies in the list with their details from Filme table
        result = await supabase.rpc(
            'get_movies_in_list', 
            {'table_name': actual_table, 'profile_id': perfil_id}
        ).execute()
        
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting movies from {table_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Falha ao obter filmes da lista: {str(e)}")

async def batch_update_movie_list(
    supabase, list_type: str, filme_ids: List[int], perfil_id: int
) -> BatchResponse:
    """Batch update multiple movies in a list"""
    results = []
    
    for filme_id in filme_ids:
        try:
            if list_type == "favorite":
                await add_movie_to_favorites(supabase, filme_id, perfil_id)
            elif list_type == "watched":
                await add_movie_to_watched(supabase, filme_id, perfil_id)
            elif list_type == "watch_later":
                await add_movie_to_watch_later(supabase, filme_id, perfil_id)
            else:
                raise HTTPException(status_code=400, detail="Tipo de lista inválido")
                
            results.append(
                BatchResponseItem(filme_id=filme_id, success=True)
            )
        except HTTPException as e:
            results.append(
                BatchResponseItem(filme_id=filme_id, success=False, message=str(e.detail))
            )
        except Exception as e:
            results.append(
                BatchResponseItem(filme_id=filme_id, success=False, message=str(e))
            )
    
    return BatchResponse(results=results) 