from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from app.v1.user.schemas import UserCreate, UserUpdate, UserResponse
from app.v1.user.helper import *
from app.auth.email_auth import get_user_by_email
from firebase_admin import auth
import asyncio

user_email_routes = APIRouter(prefix="/v1/email/users", tags=["Users Email Auth"])


@user_email_routes.post("/", response_model=UserResponse)
async def create_user_route(user: UserCreate, request: Request):
    """Rota para criar um novo usuário com autenticação por e-mail."""
    try:
        return create_user(user, request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@user_email_routes.get("/list_all", response_model=UserList)
async def list_users_route():
    """Rota para listar todos os usuários com autenticação por e-mail."""
    try:
        return list_users()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_email_routes.get("/{uid}", response_model=UserResponse)
async def get_user_route(uid: str):
    """Rota para obter informações de um usuário pelo UID com autenticação por e-mail."""
    try:
        return get_user(uid)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")


@user_email_routes.put("/{uid}", response_model=UserResponse)
async def update_user_route(
    uid: str, 
    user: UserUpdate, 
    request: Request,
    current_user: dict = Depends(get_user_by_email)
):
    """Rota para atualizar um usuário com autenticação por e-mail."""
    try:
        return update_user(uid, user, request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@user_email_routes.delete("/{uid}")
async def delete_user_route(
    uid: str, 
    request: Request,
    current_user: dict = Depends(get_user_by_email)
):
    """Rota para deletar um usuário com autenticação por e-mail."""
    try:
        return delete_user(uid, request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@user_email_routes.post("/sync", status_code=202)
async def sync_users_route(
    background_tasks: BackgroundTasks, 
    request: Request,
    current_user: dict = Depends(get_user_by_email)
):
    """Rota para sincronizar usuários do Firebase com o Supabase manualmente com autenticação por e-mail."""
    try:
        if not hasattr(request.app.state, 'user_synchronizer'):
            raise HTTPException(status_code=500, detail="User synchronizer não inicializado")
        
        # Execute a synchronization in the background
        background_tasks.add_task(sync_all_firebase_users, request.app.state.user_synchronizer)
        
        return {"message": "Sincronização iniciada. O processo será executado em segundo plano."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_email_routes.post("/sync/{uid}")
async def sync_single_user_route(
    uid: str, 
    request: Request,
    current_user: dict = Depends(get_user_by_email)
):
    """Rota para sincronizar um usuário específico do Firebase com o Supabase com autenticação por e-mail."""
    try:
        if not hasattr(request.app.state, 'user_synchronizer'):
            raise HTTPException(status_code=500, detail="User synchronizer não inicializado")
        
        # Get the Firebase user
        try:
            firebase_user = auth.get_user(uid)
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Usuário Firebase não encontrado: {str(e)}")
        
        # Synchronize with Supabase
        result = await request.app.state.user_synchronizer.create_user_in_supabase(firebase_user)
        
        if not result:
            raise HTTPException(status_code=500, detail="Falha na sincronização com o Supabase")
        
        return {"message": f"Usuário {uid} sincronizado com sucesso", "user": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 