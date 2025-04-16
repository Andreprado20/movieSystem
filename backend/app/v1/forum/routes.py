from fastapi import APIRouter, HTTPException, Depends, Request, Path, Query, Header, Body
from typing import Optional, List
from app.v1.forum.schemas import *
from app.v1.forum.helper import *
from firebase_admin.auth import UserRecord

forum_routes = APIRouter(prefix="/v1/forum", tags=["Forum"])


@forum_routes.post("/filme/{filme_id}/comments", response_model=CommentResponse)
async def create_comment_route(
    request: Request,
    filme_id: int = Path(..., description="ID do filme"),
    comment: CommentCreate = Body(...),
    current_user: UserRecord = Depends(get_current_user),
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
    current_user: UserRecord = Depends(get_current_user)
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
    current_user: UserRecord = Depends(get_current_user)
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
    current_user: UserRecord = Depends(get_current_user)
):
    """Exclui um comentário"""
    try:
        supabase = request.app.state.supabase
        return await delete_comment(supabase, comment_id, current_user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 