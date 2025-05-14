from fastapi import Header, HTTPException, Request, Depends, status
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

async def get_user_by_email(
    request: Request,
    email: str = Header(..., description="User email for authentication")
) -> Dict[str, Any]:
    """
    Get the current user based on email header (for development purposes only).
    
    Args:
        request: The FastAPI request object
        email: The email header containing the user's email
        
    Returns:
        Dict containing user information including uid and email
        
    Raises:
        HTTPException: If authentication fails
    """
    if not email:
        logger.error("Email header missing")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Email header missing"
        )
    
    logger.info(f"Attempting to authenticate with email: {email}")
    
    # Get the user from Supabase using email
    try:
        if request and hasattr(request.app.state, "supabase"):
            supabase = request.app.state.supabase
            user_result = supabase.table("Usuario").select("*").eq("email", email).execute()
            
            if not user_result.data or len(user_result.data) == 0:
                raise HTTPException(status_code=404, detail=f"User with email {email} not found")
                
            user_data = user_result.data[0]
            
            # Return in a format similar to Firebase user for compatibility
            return {
                "uid": user_data.get("firebase_uid") or str(user_data["id"]),
                "id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["nome"],
                "auth_time": 0,
                "user_id": str(user_data["id"])
            }
        else:
            # If no database connection, raise an error
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection not available"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication: {str(e)}"
        ) 