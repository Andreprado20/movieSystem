import firebase_admin
from firebase_admin import auth
from app.v1.user.schemas import *
from fastapi import Depends, Request
import logging
import asyncio

logger = logging.getLogger(__name__)

async def get_user_synchronizer(request: Request):
    return request.app.state.user_synchronizer

def create_user(user_data: UserCreate, request: Request = None) -> UserResponse:
    """Cria um novo usuário no Firebase Authentication e sincroniza com Supabase."""
    try:
        # Create user in Firebase
        user = auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=user_data.display_name or user_data.email.split('@')[0],
        )
        
        # Set custom claims for Supabase integration
        auth.set_custom_user_claims(user.uid, {
            'role': 'authenticated',  # Required for Supabase RLS
        })
        
        # Synchronize with Supabase
        if request and hasattr(request.app.state, 'user_synchronizer'):
            try:
                # Run synchronization immediately but don't block the response
                loop = asyncio.get_running_loop()
                # Use a task to run this in the background
                task = loop.create_task(request.app.state.user_synchronizer.create_user_in_supabase(user))
                
                def handle_sync_result(future):
                    result = future.result()
                    if not result:
                        logger.error(f"Failed to synchronize user {user.uid} to Supabase")
                
                task.add_done_callback(handle_sync_result)
                #logger.info(f"Scheduled Firebase->Supabase synchronization for user {user.uid}")
            except Exception as e:
                logger.error(f"Error scheduling user synchronization: {str(e)}")
        
        return UserResponse(uid=user.uid, email=user.email, display_name=user.display_name or user.email.split('@')[0])
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise e


def get_user(uid: str) -> UserResponse:
    """Obtém um usuário pelo UID."""
    try:
        user = auth.get_user(uid)
        return UserResponse(uid=user.uid, email=user.email, display_name=user.display_name or user.email.split('@')[0])
    except Exception as e:
        logger.error(f"Error getting user {uid}: {str(e)}")
        raise e


def update_user(uid: str, user_data: UserUpdate, request: Request = None) -> UserResponse:
    """Atualiza as informações de um usuário e sincroniza com Supabase."""
    try:
        update_fields = {}

        if user_data.display_name:
            update_fields["display_name"] = user_data.display_name
        if user_data.password:
            update_fields["password"] = user_data.password

        # Update user in Firebase
        user = auth.update_user(uid, **update_fields)
        
        # Synchronize with Supabase
        if request and hasattr(request.app.state, 'user_synchronizer'):
            try:
                # Run synchronization in the background
                loop = asyncio.get_running_loop()
                task = loop.create_task(request.app.state.user_synchronizer.update_user_in_supabase(user))
                
                def handle_sync_result(future):
                    result = future.result()
                    if not result:
                        logger.error(f"Failed to update user {uid} in Supabase")
                
                task.add_done_callback(handle_sync_result)
                #logger.info(f"Scheduled Firebase->Supabase update synchronization for user {uid}")
            except Exception as e:
                logger.error(f"Error scheduling user update synchronization: {str(e)}")
        
        return UserResponse(uid=user.uid, email=user.email, display_name=user.display_name or user.email.split('@')[0])
    except Exception as e:
        logger.error(f"Error updating user {uid}: {str(e)}")
        raise e


def delete_user(uid: str, request: Request = None) -> dict:
    """Exclui um usuário e sincroniza a exclusão com Supabase."""
    try:
        # Synchronize deletion with Supabase before deleting from Firebase
        # This is important because we need the user info from Firebase for proper deletion
        if request and hasattr(request.app.state, 'user_synchronizer'):
            try:
                # Run synchronization first
                loop = asyncio.get_running_loop()
                task = loop.create_task(request.app.state.user_synchronizer.delete_user_from_supabase(uid))
                
                def handle_sync_result(future):
                    try:
                        result = future.result()
                        if not result:
                            logger.error(f"Failed to delete user {uid} from Supabase")
                    except Exception as e:
                        logger.error(f"Error in delete sync callback: {str(e)}")
                
                task.add_done_callback(handle_sync_result)
                #logger.info(f"Scheduled Supabase deletion for user {uid}")
            except Exception as e:
                logger.error(f"Error scheduling user deletion synchronization: {str(e)}")
        
        # Delete user from Firebase
        auth.delete_user(uid)
        return {"message": "Usuário deletado com sucesso"}
    except Exception as e:
        logger.error(f"Error deleting user {uid}: {str(e)}")
        raise e


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
                        display_name=user.display_name or user.email.split('@')[0]
                    )
                )
            page = page.get_next_page()
        return UserList(users=users)
    except Exception as e:
        logger.error(f"Failed to list users: {str(e)}")
        raise Exception(f"Failed to list users: {e}")
