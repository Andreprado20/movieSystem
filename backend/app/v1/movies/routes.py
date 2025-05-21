from fastapi import APIRouter, Depends, Request, Body, Query, HTTPException, status, Path
from typing import Optional, List
from datetime import datetime
import logging

from app.v1.movies import schemas, helper

# Configurar logging
logger = logging.getLogger(__name__)

movies_routes = APIRouter(
    prefix="/v1/movies",
    tags=["Movies"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Bad Request"},
        500: {"description": "Internal Server Error"}
    },
)

@movies_routes.get("/find", 
    response_model=dict,
    summary="Buscar filme por ID no TMDB",
    description="Retorna os detalhes de um filme buscando pelo ID no TMDB (The Movie Database)",
    responses={
        400: {"description": "ID do filme inválido"},
        404: {"description": "Filme não encontrado"}
    })
async def get_movie(movie_id: int = Query(..., description="ID do filme no TMDB", example=550)):
    """
    Get movie details by movie ID from TMDB.
    """
    try:
        movie_data = await helper.fetch_movie_data(movie_id)
        return movie_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@movies_routes.get("/{movie_id}",
    response_model=dict,
    summary="Buscar filme por ID no banco de dados",
    description="Retorna os detalhes de um filme armazenado no nosso banco de dados",
    responses={
        404: {"description": "Filme não encontrado"},
        400: {"description": "Erro na requisição"}
    })
async def get_movie_from_db(
    movie_id: int = Path(..., description="ID do filme no banco de dados", example=1),
    request: Request = None
):
    """
    Get movie details from our database by ID.
    """
    try:
        movie = await helper.get_movie_from_db(movie_id, request)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        return movie
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"404: {str(e)}")

@movies_routes.post("/",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Criar novo filme",
    description="Cria um novo filme no banco de dados",
    responses={
        201: {"description": "Filme criado com sucesso"},
        400: {"description": "Dados inválidos"}
    })
async def create_movie(
    movie_data: schemas.MovieCreate = Body(..., description="Dados do filme a ser criado"),
    request: Request = None
):
    """
    Create a new movie in our database.
    """
    try:
        # Convert the schema field names to match what the database expects
        data_dict = {
            "title": movie_data.titulo,
            "description": movie_data.sinopse,
            "release_date": movie_data.data_lancamento.isoformat() if movie_data.data_lancamento else None,
            "genre": movie_data.genero,
            "rating": movie_data.avaliacao,
            "director": movie_data.diretor,
            "cast": movie_data.elenco
        }
        movie = await helper.create_movie_in_db(data_dict, request)
        return movie
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@movies_routes.put("/{movie_id}",
    response_model=dict,
    summary="Atualizar filme",
    description="Atualiza os dados de um filme existente",
    responses={
        200: {"description": "Filme atualizado com sucesso"},
        404: {"description": "Filme não encontrado"},
        400: {"description": "Dados inválidos"}
    })
async def update_movie(
    movie_id: int = Path(..., description="ID do filme a ser atualizado", example=1),
    movie_data: schemas.MovieUpdate = Body(..., description="Novos dados do filme"),
    request: Request = None
):
    """
    Update a movie in our database.
    """
    try:
        # Convert the schema field names to match what the database expects
        data_dict = {}
        if hasattr(movie_data, 'titulo') and movie_data.titulo is not None:
            data_dict["title"] = movie_data.titulo
        if hasattr(movie_data, 'sinopse') and movie_data.sinopse is not None:
            data_dict["description"] = movie_data.sinopse
        if hasattr(movie_data, 'data_lancamento') and movie_data.data_lancamento is not None:
            data_dict["release_date"] = movie_data.data_lancamento.isoformat()
        if hasattr(movie_data, 'genero') and movie_data.genero is not None:
            data_dict["genre"] = movie_data.genero
        if hasattr(movie_data, 'avaliacao') and movie_data.avaliacao is not None:
            data_dict["rating"] = movie_data.avaliacao
        if hasattr(movie_data, 'diretor') and movie_data.diretor is not None:
            data_dict["director"] = movie_data.diretor
        if hasattr(movie_data, 'elenco') and movie_data.elenco is not None:
            data_dict["cast"] = movie_data.elenco
            
        movie = await helper.update_movie_in_db(movie_id, data_dict, request)
        return movie
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@movies_routes.delete("/{movie_id}",
    response_model=dict,
    summary="Deletar filme",
    description="Remove um filme do banco de dados",
    responses={
        200: {"description": "Filme deletado com sucesso"},
        404: {"description": "Filme não encontrado"},
        400: {"description": "Erro na requisição"}
    })
async def delete_movie(
    movie_id: int = Path(..., description="ID do filme a ser deletado", example=1),
    request: Request = None
):
    """
    Delete a movie from our database.
    """
    try:
        success = await helper.delete_movie_from_db(movie_id, request)
        if not success:
            raise HTTPException(status_code=404, detail="Movie not found")
        return {"detail": "Movie deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@movies_routes.get("/",
    response_model=dict,
    summary="Listar filmes",
    description="Retorna uma lista paginada de filmes do banco de dados",
    responses={
        200: {"description": "Lista de filmes retornada com sucesso"},
        400: {"description": "Erro na requisição"}
    })
async def list_movies(
    request: Request = None,
    page: int = Query(1, ge=1, description="Número da página", example=1),
    limit: int = Query(10, ge=1, le=100, description="Quantidade de itens por página", example=10)
):
    """
    List movies from our database with pagination.
    """
    try:
        result = await helper.list_movies_from_db(request, page, limit)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
