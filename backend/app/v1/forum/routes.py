from fastapi import APIRouter, HTTPException, Depends, Request, Path, Query, Header, Body
from typing import Optional, List, Dict, Any
from app.v1.forum.schemas import *
from app.v1.forum.helper import *
from app.auth.sync import get_current_user
from firebase_admin.auth import UserRecord
from pydantic import BaseModel, Field

forum_routes = APIRouter(prefix="/v1/forum", tags=["Forum"])


# Define a proper schema for forum creation
class ForumCreate(BaseModel):
    titulo: str = Field(..., description="Título do fórum")
    descricao: Optional[str] = Field(None, description="Descrição do fórum")
    filme_id: int = Field(..., description="ID do filme associado ao fórum")

# Define a proper schema for comment creation
class CommentRequest(BaseModel):
    conteudo: str = Field(..., description="Conteúdo do comentário", min_length=1)

@forum_routes.post("/", status_code=201, response_model=dict)
async def create_forum_route(
    request: Request,
    forum_data: ForumCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Cria um novo fórum para um filme"""
    try:
        supabase = request.app.state.supabase
        
        # Convert Pydantic model to dict and add user ID
        forum_dict = forum_data.dict()
        forum_dict["user_id"] = current_user["uid"]
        
        return await create_forum(supabase, forum_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.get("/{forum_id}", response_model=dict)
async def get_forum_route(
    request: Request,
    forum_id: int = Path(..., description="ID do fórum")
):
    """Obtém detalhes de um fórum pelo ID"""
    try:
        supabase = request.app.state.supabase
        forum = await get_forum(supabase, forum_id)
        if not forum:
            raise HTTPException(status_code=404, detail="Fórum não encontrado")
        return forum
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.get("/filme/{filme_id}", response_model=List[dict])
async def get_forums_by_movie_route(
    request: Request,
    filme_id: int = Path(..., description="ID do filme")
):
    """Obtém todos os fóruns de um filme"""
    try:
        supabase = request.app.state.supabase
        return await get_forums_by_movie(supabase, filme_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.post("/{forum_id}/comentario", status_code=201, response_model=dict)
async def add_comment_route(
    request: Request,
    forum_id: int = Path(..., description="ID do fórum"),
    comment: CommentRequest = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Adiciona um comentário ao fórum"""
    try:
        supabase = request.app.state.supabase
        
        # Convert Pydantic model to dict
        comment_dict = {
            "conteudo": comment.conteudo,
            "user_id": current_user["uid"],
            "forum_id": forum_id
        }
        
        return await add_comment(supabase, comment_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.get("/{forum_id}/comentarios", response_model=List[dict])
async def get_comments_route(
    request: Request,
    forum_id: int = Path(..., description="ID do fórum")
):
    """Obtém todos os comentários de um fórum"""
    try:
        supabase = request.app.state.supabase
        return await get_comments(supabase, forum_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.delete("/comentario/{comment_id}", response_model=dict)
async def delete_comment_route(
    request: Request,
    comment_id: int = Path(..., description="ID do comentário"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Exclui um comentário"""
    try:
        supabase = request.app.state.supabase
        success = await delete_comment(supabase, comment_id, current_user["uid"])
        if not success:
            raise HTTPException(status_code=404, detail="Comentário não encontrado")
        return {"detail": "Comentário excluído com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.delete("/{forum_id}", response_model=dict)
async def delete_forum_route(
    request: Request,
    forum_id: int = Path(..., description="ID do fórum"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Exclui um fórum"""
    try:
        supabase = request.app.state.supabase
        success = await delete_forum(supabase, forum_id, current_user["uid"])
        if not success:
            raise HTTPException(status_code=404, detail="Fórum não encontrado")
        return {"detail": "Fórum excluído com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.post("/filme/{filme_id}/comments", response_model=CommentResponse)
async def create_comment_route(
    request: Request,
    filme_id: int = Path(..., description="ID do filme"),
    comment: CommentCreate = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user),
    perfil_id: Optional[int] = Query(None, description="ID do perfil a ser usado (opcional)")
):
    """Cria um novo comentário no fórum de um filme"""
    try:
        supabase = request.app.state.supabase
        return await create_comment(supabase, filme_id, comment, current_user, perfil_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.get("/filme/{filme_id}/comments", response_model=List[CommentResponse])
async def get_comments_route(
    request: Request,
    filme_id: int = Path(..., description="ID do filme")
):
    """Obtém todos os comentários do fórum de um filme"""
    try:
        supabase = request.app.state.supabase
        return await get_comments(supabase, filme_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.post("/comments/{comment_id}/like", response_model=CommentResponse)
async def like_comment_route(
    request: Request,
    comment_id: int = Path(..., description="ID do comentário"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Adiciona um like a um comentário"""
    try:
        supabase = request.app.state.supabase
        return await like_comment(supabase, comment_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.put("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment_route(
    request: Request,
    comment_id: int = Path(..., description="ID do comentário"),
    comment_data: CommentEdit = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Atualiza um comentário existente"""
    try:
        supabase = request.app.state.supabase
        return await update_comment(supabase, comment_id, comment_data, current_user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@forum_routes.delete("/comments/{comment_id}")
async def delete_comment_route(
    request: Request,
    comment_id: int = Path(..., description="ID do comentário"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Exclui um comentário"""
    try:
        supabase = request.app.state.supabase
        return await delete_comment(supabase, comment_id, current_user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 