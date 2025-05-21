from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from app.v1.user.schemas import UserCreate, UserUpdate, UserResponse
from app.v1.user.helper import *
from firebase_admin import auth
import asyncio

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
async def update_user_route(uid: str, user: UserUpdate, request: Request):
    """Rota para atualizar um usuário."""
    try:
        return update_user(uid, user, request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@user_routes.delete("/{uid}")
async def delete_user_route(uid: str, request: Request):
    """Rota para deletar um usuário."""
    try:
        return delete_user(uid, request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@user_routes.post("/sync", status_code=202)
async def sync_users_route(background_tasks: BackgroundTasks, request: Request):
    """Rota para sincronizar usuários do Firebase com o Supabase manualmente."""
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


@user_routes.post("/sync/{uid}")
async def sync_single_user_route(uid: str, request: Request):
    """Rota para sincronizar um usuário específico do Firebase com o Supabase."""
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


async def sync_all_firebase_users(synchronizer):
    """Sincroniza todos os usuários do Firebase com o Supabase."""
    try:
        page = auth.list_users()
        count = 0
        sync_count = 0
        
        while page:
            for user in page.users:
                count += 1
                try:
                    # Check if user has authenticated role
                    if not user.custom_claims or 'role' not in user.custom_claims:
                        auth.set_custom_user_claims(user.uid, {'role': 'authenticated'})
                    
                    # Sync with Supabase
                    result = await synchronizer.create_user_in_supabase(user)
                    if result:
                        sync_count += 1
                except Exception as e:
                    logger.error(f"Error synchronizing user {user.uid}: {str(e)}")
            
            page = page.get_next_page()
        
        #logger.info(f"Synchronized {sync_count} out of {count} users")
    except Exception as e:
        logger.error(f"Error during synchronization: {str(e)}")
