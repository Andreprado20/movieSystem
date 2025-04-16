import firebase_admin
from firebase_admin import auth
from app.v1.user.schemas import *
from fastapi import Depends, Request
import logging

logger = logging.getLogger(__name__)

async def get_user_synchronizer(request: Request):
    return request.app.state.user_synchronizer

def create_user(user_data: UserCreate, request: Request = None) -> UserResponse:
    """Cria um novo usuário no Firebase Authentication e sincroniza com Supabase."""
    # Create user in Firebase
    user = auth.create_user(
        email=user_data.email,
        password=user_data.password,
        display_name=user_data.display_name,
    )
    
    # Synchronize with Supabase if request is provided
    if request and hasattr(request.app.state, 'user_synchronizer'):
        import asyncio
        try:
            # Run synchronization asynchronously
            loop = asyncio.get_event_loop()
            loop.create_task(request.app.state.user_synchronizer.create_user_in_supabase(user))
        except Exception as e:
            logger.error(f"Error scheduling user synchronization: {str(e)}")
    
    return UserResponse(uid=user.uid, email=user.email, display_name=user.display_name)


def get_user(uid: str) -> UserResponse:
    """Obtém um usuário pelo UID."""
    user = auth.get_user(uid)
    return UserResponse(uid=user.uid, email=user.email, display_name=user.display_name)


def update_user(uid: str, user_data: UserUpdate) -> UserResponse:
    """Atualiza as informações de um usuário."""
    update_fields = {}

    if user_data.display_name:
        update_fields["display_name"] = user_data.display_name
    if user_data.password:
        update_fields["password"] = user_data.password

    auth.update_user(uid, **update_fields)
    return get_user(uid)


def delete_user(uid: str) -> dict:
    """Exclui um usuário."""
    auth.delete_user(uid)
    return {"message": "Usuário deletado com sucesso"}


def list_users() -> UserList:
    """Lists all users."""
    try:
        page = auth.list_users()
        users = []
        while page:
            for user in page.users:
                users.append(
                    UserResponse(
                        uid=user.uid,
                        email=user.email,
                        display_name=user.display_name or ""
                    )
                )
            page = page.get_next_page()
        return UserList(users=users)
    except Exception as e:
        raise Exception(f"Failed to list users: {e}")
