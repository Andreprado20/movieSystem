from fastapi import Depends, Request, Header, HTTPException
from app.v1.forum.schemas import *
from firebase_admin import auth
import logging
from typing import Optional, List, Dict, Any
import os
from datetime import datetime
from supabase import create_client, Client
from firebase_admin.auth import UserRecord

logger = logging.getLogger(__name__)
DEV_MODE = os.getenv("DEV_MODE", "false").lower() == "true"

async def get_current_user(
    request: Request, 
    authorization: Optional[str] = Header(None),
    dev_email: Optional[str] = Header(None, alias="X-Dev-Email")
):
    """
    Get the current authenticated user from Firebase token or dev email header.
    
    In development mode, allows using an email header instead of Firebase token.
    """
    # Development mode with email header
    if DEV_MODE and dev_email:
        try:
            # Find user by email
            user = auth.get_user_by_email(dev_email)
            return user
        except Exception as e:
            logger.error(f"Error authenticating with dev email: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid development authentication")
    
    # Normal token-based authentication
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        # Verify the Firebase ID token
        token = authorization.replace("Bearer ", "")
        user = auth.verify_id_token(token)
        return user
    except Exception as e:
        logger.error(f"Error authenticating user: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")


def get_or_create_forum(supabase, filme_id: int):
    """Get an existing forum for a movie or create one if it doesn't exist"""
    try:
        # Check if forum exists
        result = supabase.table("Forum").select("id").eq("filme_id", filme_id).execute()
        
        if result.data and len(result.data) > 0:
            # Return existing forum
            return result.data[0]
        else:
            # Create new forum - only specify filme_id, let database handle id
            result = supabase.table("Forum").insert({"filme_id": filme_id}).execute()
            return result.data[0]
    except Exception as e:
        logger.error(f"Error getting or creating forum: {str(e)}")
        raise Exception(f"Failed to get or create forum: {str(e)}")


async def create_comment(
    supabase, filme_id: int, comment: CommentCreate, user_data: Dict[str, Any], perfil_id: Optional[int] = None
):
    """
    Cria um novo comentário no fórum de um filme.
    
    Args:
        supabase: Cliente Supabase
        filme_id: ID do filme
        comment: Dados do comentário a ser criado
        user_data: Dados do usuário autenticado
        perfil_id: ID do perfil a ser usado (opcional)
        
    Returns:
        O comentário criado
        
    Raises:
        HTTPException: Se ocorrer algum erro durante o processo
    """
    try:
        logging.info(f"Creating comment for movie {filme_id} by user {user_data.get('email', user_data.get('uid', 'unknown'))}")
        
        # Verificar usuário no banco de dados usando email
        email = user_data.get("email")
        if not email:
            raise HTTPException(status_code=403, detail="Email de usuário não disponível")
            
        user_response = supabase.table("Usuario").select("*").eq("email", email).execute()
        
        if not user_response.data:
            logging.error(f"User with email {email} not found in database")
            raise HTTPException(status_code=403, detail="Usuário não encontrado no sistema")
        
        user_db = user_response.data[0]
        usuario_id = user_db["id"]
        
        # Se nenhum perfil_id for fornecido, usa qualquer perfil do usuário
        if perfil_id is None:
            perfil_response = supabase.table("Perfil").select("id").eq("usuario_id", usuario_id).limit(1).execute()
            
            if not perfil_response.data:
                logging.error(f"No profile found for user {usuario_id}")
                raise HTTPException(status_code=404, detail="Nenhum perfil encontrado para o usuário")
            
            perfil_id = perfil_response.data[0]["id"]
        else:
            # Verificar se o perfil pertence ao usuário
            perfil_response = supabase.table("Perfil").select("*").eq("id", perfil_id).eq("usuario_id", usuario_id).execute()
            
            if not perfil_response.data:
                logging.error(f"Profile {perfil_id} not found or does not belong to user {usuario_id}")
                raise HTTPException(status_code=403, detail="Perfil não encontrado ou não pertence ao usuário")
        
        # Obter ou criar o fórum
        forum = get_or_create_forum(supabase, filme_id)
        
        # Verificar se o ID de resposta é válido, se fornecido
        if comment.respondendo_id:
            comment_check = supabase.table("Comentario").select("*").eq("id", comment.respondendo_id).execute()
            if not comment_check.data:
                logging.error(f"Comment to reply to with ID {comment.respondendo_id} not found")
                raise HTTPException(status_code=404, detail="Comentário para responder não encontrado")
        
        # Criar o comentário
        comment_data = {
            "mensagem": comment.mensagem,
            "likes": 0,
            "usuario_id": usuario_id,
            "forum_id": forum["id"],
            "perfil_id": perfil_id,
            "respondendo_id": comment.respondendo_id
        }
        
        logging.info(f"Inserting comment data: {comment_data}")
        response = supabase.table("Comentario").insert(comment_data).execute()
        
        if not response.data:
            logging.error("Failed to create comment, no data returned from database")
            raise HTTPException(status_code=500, detail="Falha ao criar comentário")
        
        return response.data[0]
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating comment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao criar comentário: {str(e)}")


async def get_comments(supabase, filme_id: int):
    """Get all comments for a movie's forum"""
    try:
        # Get forum ID for the movie
        forum_query = supabase.table("Forum").select("id").eq("filme_id", filme_id).execute()
        
        if not forum_query.data or len(forum_query.data) == 0:
            # No forum exists yet, return empty list
            return []
        
        forum_id = forum_query.data[0]['id']
        
        # Get comments for the forum
        result = supabase.table("Comentario").select("*").eq("forum_id", forum_id).execute()
        return result.data
    except Exception as e:
        logger.error(f"Error getting comments: {str(e)}")
        raise Exception(f"Failed to get comments: {str(e)}")


async def like_comment(supabase, comment_id: int):
    """Increment the like counter for a comment"""
    try:
        # Get current likes count
        comment_query = supabase.table("Comentario").select("likes").eq("id", comment_id).execute()
        
        if not comment_query.data or len(comment_query.data) == 0:
            raise HTTPException(status_code=404, detail="Comment not found")
        
        current_likes = comment_query.data[0]['likes']
        
        # Update likes count
        result = supabase.table("Comentario").update({"likes": current_likes + 1}).eq("id", comment_id).execute()
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error liking comment: {str(e)}")
        raise Exception(f"Failed to like comment: {str(e)}")


async def update_comment(
    supabase: Client,
    comment_id: int,
    comment_data: CommentEdit,
    user_data: Dict[str, Any]
) -> CommentResponse:
    """Atualiza um comentário existente"""
    logging.info(f"Atualizando comentário {comment_id}")
    try:
        # Verifica se o comentário existe
        comment_response = supabase.table("Comentario").select("*").eq("id", comment_id).execute()
        if not comment_response.data:
            raise HTTPException(status_code=404, detail="Comentário não encontrado")
        
        comment = comment_response.data[0]
        
        # Verifica se o usuário é o dono do comentário
        profile_id = comment["perfil_id"]
        profile_response = supabase.table("Perfil").select("*").eq("id", profile_id).execute()
        
        if not profile_response.data:
            raise HTTPException(status_code=404, detail="Perfil não encontrado")
        
        profile = profile_response.data[0]
        user_id = profile["usuario_id"]
        
        # Busca o user_id do usuário atual usando o email
        email = user_data["email"]
        current_user_response = supabase.table("Usuario").select("*").eq("email", email).execute()
        
        if not current_user_response.data:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        current_user_id = current_user_response.data[0]["id"]
        
        # Verifica se o usuário é o dono do comentário
        if current_user_id != user_id:
            raise HTTPException(status_code=403, detail="Você não tem permissão para editar este comentário")
        
        # Atualiza o comentário
        update_data = {
            "mensagem": comment_data.mensagem,
            "updated_at": datetime.now().isoformat()
        }
        
        response = supabase.table("Comentario").update(update_data).eq("id", comment_id).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Falha ao atualizar comentário")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erro ao atualizar comentário: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar comentário: {str(e)}")


async def delete_comment(
    supabase: Client,
    comment_id: int,
    user_data: Dict[str, Any] = None
) -> dict:
    """Exclui um comentário"""
    logging.info(f"Excluindo comentário {comment_id}")
    try:
        # If we only have a user_id string, just check ownership directly
        if isinstance(user_data, str):
            # Check comment exists
            check = supabase.table("comments").select("*").eq("id", comment_id).eq("user_id", user_data).execute()
            if not check.data:
                return False
                
            # Delete the comment
            supabase.table("comments").delete().eq("id", comment_id).execute()
            return True
            
        # If we have a Dict with user data
        if user_data and "uid" in user_data:
            # Check the comment exists
            comment_response = supabase.table("Comentario").select("*").eq("id", comment_id).execute()
            if not comment_response.data:
                raise HTTPException(status_code=404, detail="Comentário não encontrado")
            
            comment = comment_response.data[0]
            
            # Check if user is the owner
            user_uid = user_data["uid"]
            email = user_data.get("email", None)
            
            # Attempt 1: Try with user_id in the comment
            if "user_id" in comment and comment["user_id"] == user_uid:
                response = supabase.table("Comentario").delete().eq("id", comment_id).execute()
                if not response.data:
                    raise HTTPException(status_code=500, detail="Falha ao excluir comentário")
                return {"message": "Comentário excluído com sucesso"}
            
            # Attempt 2: Check through profile and user tables if needed
            if "perfil_id" in comment and email:
                profile_id = comment["perfil_id"]
                profile_response = supabase.table("Perfil").select("*").eq("id", profile_id).execute()
                
                if profile_response.data:
                    profile = profile_response.data[0]
                    user_id = profile["usuario_id"]
                    
                    # Find user in database by email
                    current_user_response = supabase.table("Usuario").select("*").eq("email", email).execute()
                    
                    if current_user_response.data:
                        current_user_id = current_user_response.data[0]["id"]
                        
                        # Check if user is owner
                        if current_user_id == user_id:
                            response = supabase.table("Comentario").delete().eq("id", comment_id).execute()
                            if not response.data:
                                raise HTTPException(status_code=500, detail="Falha ao excluir comentário")
                            return {"message": "Comentário excluído com sucesso"}
            
            # If we got here, user doesn't have permission
            raise HTTPException(status_code=403, detail="Você não tem permissão para excluir este comentário")
        
        # Missing user data
        raise HTTPException(status_code=401, detail="Usuário não autenticado")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erro ao excluir comentário: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao excluir comentário: {str(e)}")

# Create a forum for a movie
async def create_forum(supabase, forum_data):
    try:
        response = await supabase.table("forums").insert(forum_data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating forum: {str(e)}")

# Get a forum by ID
async def get_forum(supabase, forum_id):
    try:
        response = await supabase.table("forums").select("*").eq("id", forum_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting forum: {str(e)}")

# Get all forums for a movie
async def get_forums_by_movie(supabase, filme_id):
    try:
        response = await supabase.table("forums").select("*").eq("filme_id", filme_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting forums by movie: {str(e)}")

# Add a comment to a forum
async def add_comment(supabase, comment):
    try:
        response = await supabase.table("comments").insert(comment).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding comment: {str(e)}")

# Get all comments for a forum
async def get_comments(supabase, forum_id):
    try:
        response = await supabase.table("comments").select("*").eq("forum_id", forum_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting comments: {str(e)}")

# Delete a comment
async def delete_comment(supabase, comment_id, user_id):
    try:
        # First check if the comment exists and belongs to the user
        check = await supabase.table("comments").select("*").eq("id", comment_id).eq("user_id", user_id).execute()
        if not check.data:
            return False
            
        # Then delete the comment
        await supabase.table("comments").delete().eq("id", comment_id).execute()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting comment: {str(e)}")

# Delete a forum
async def delete_forum(supabase, forum_id, user_id):
    try:
        # First check if the forum exists and belongs to the user
        check = await supabase.table("forums").select("*").eq("id", forum_id).eq("user_id", user_id).execute()
        if not check.data:
            return False
            
        # Then delete the forum
        await supabase.table("forums").delete().eq("id", forum_id).execute()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting forum: {str(e)}")

# Create a comment directly in a movie's forum
async def create_comment(supabase, filme_id, comment_data, current_user, perfil_id=None):
    try:
        # First, check if a forum exists for this movie
        forum_response = await supabase.table("forums").select("id").eq("filme_id", filme_id).execute()
        
        forum_id = None
        if forum_response.data and len(forum_response.data) > 0:
            # Use the existing forum
            forum_id = forum_response.data[0]["id"]
        else:
            # Create a new forum for this movie
            forum_data = {
                "titulo": f"Discussion for Movie {filme_id}",
                "descricao": "Automatic forum created for movie discussions",
                "filme_id": filme_id,
                "user_id": current_user.uid,
                "created_at": datetime.now().isoformat()
            }
            forum_response = await supabase.table("forums").insert(forum_data).execute()
            forum_id = forum_response.data[0]["id"] if forum_response.data else None
            
        if not forum_id:
            raise HTTPException(status_code=500, detail="Failed to get or create forum")
            
        # Now create the comment
        comment = {
            "mensagem": comment_data.mensagem,
            "forum_id": forum_id,
            "usuario_id": current_user.uid,
            "perfil_id": perfil_id or 1,  # Default to profile 1 if none provided
            "likes": 0,
            "created_at": datetime.now().isoformat(),
            "respondendo_id": comment_data.respondendo_id
        }
        
        comment_response = await supabase.table("comments").insert(comment).execute()
        
        if not comment_response.data:
            raise HTTPException(status_code=500, detail="Failed to create comment")
            
        return comment_response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating comment: {str(e)}")

# Like a comment
async def like_comment(supabase, comment_id):
    try:
        # Get the current comment
        comment_response = await supabase.table("comments").select("*").eq("id", comment_id).single().execute()
        
        if not comment_response.data:
            raise HTTPException(status_code=404, detail="Comment not found")
            
        # Increment the likes
        current_likes = comment_response.data.get("likes", 0)
        updated_data = {"likes": current_likes + 1}
        
        # Update the comment
        update_response = await supabase.table("comments").update(updated_data).eq("id", comment_id).execute()
        
        if not update_response.data:
            raise HTTPException(status_code=500, detail="Failed to update comment likes")
            
        return update_response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error liking comment: {str(e)}")

# Update a comment
async def update_comment(supabase, comment_id, comment_data, current_user):
    try:
        # Verify the comment exists and belongs to the user
        check_response = await supabase.table("comments").select("*").eq("id", comment_id).eq("usuario_id", current_user.uid).execute()
        
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Comment not found or you don't have permission to update it")
            
        # Update the comment
        update_data = {
            "mensagem": comment_data.mensagem,
            "updated_at": datetime.now().isoformat()
        }
        
        update_response = await supabase.table("comments").update(update_data).eq("id", comment_id).execute()
        
        if not update_response.data:
            raise HTTPException(status_code=500, detail="Failed to update comment")
            
        return update_response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating comment: {str(e)}") 