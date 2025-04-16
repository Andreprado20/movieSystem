from fastapi import APIRouter, HTTPException, Depends, Request
from app.v1.user.schemas import UserCreate, UserUpdate, UserResponse
from app.v1.user.helper import *

user_routes = APIRouter(prefix="/v1/users", tags=["Users"])


@user_routes.post("/", response_model=UserResponse)
async def create_user_route(user: UserCreate, request: Request):
    """Rota para criar um novo usuário."""
    try:
        return create_user(user, request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@user_routes.get("/list_all", response_model=UserList)
async def list_users_route():
    """Rota para listar todos os usuários."""
    try:
        return list_users()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_routes.get("/{uid}", response_model=UserResponse)
async def get_user_route(uid: str):
    """Rota para obter informações de um usuário pelo UID."""
    try:
        return get_user(uid)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")


@user_routes.put("/{uid}", response_model=UserResponse)
async def update_user_route(uid: str, user: UserUpdate):
    """Rota para atualizar um usuário."""
    try:
        return update_user(uid, user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@user_routes.delete("/{uid}")
async def delete_user_route(uid: str):
    """Rota para deletar um usuário."""
    try:
        return delete_user(uid)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
