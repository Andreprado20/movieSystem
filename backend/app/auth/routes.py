from fastapi import APIRouter, Depends, HTTPException, Request, Body, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import jwt
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth

from app.auth.sync import get_current_user, create_access_token, verify_password, get_password_hash

# Router setup
auth_routes = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models for request/response
class UserRegister(BaseModel):
    name: str
    username: str
    email: str
    password: str
    birthDate: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str
    expires_in: int

class PasswordResetRequest(BaseModel):
    email: str

class PasswordReset(BaseModel):
    token: str
    newPassword: str

class GoogleAuthRequest(BaseModel):
    id_token: str

# Authentication routes
@auth_routes.post("/register", response_model=Dict[str, Any])
async def register_user(user_data: UserRegister, request: Request):
    """Register a new user"""
    try:
        # Check if user already exists
        supabase = request.app.state.supabase
        existing_user = supabase.table("Usuario").select("id").eq("email", user_data.email).execute()
        
        if existing_user.data and len(existing_user.data) > 0:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user in database
        new_user = {
            "nome": user_data.name,
            "email": user_data.email,
            "senha": hashed_password,
            "username": user_data.username,
            "birth_date": user_data.birthDate
        }
        
        result = supabase.table("Usuario").insert(new_user).execute()
        
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        user_id = result.data[0]["id"]
        
        # Create access token
        access_token = create_access_token(data={"sub": user_id})
        
        return {
            "id": user_id,
            "name": user_data.name,
            "email": user_data.email,
            "username": user_data.username,
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@auth_routes.post("/login", response_model=TokenResponse)
async def login_user(form_data: UserLogin, request: Request):
    """Login user and return tokens"""
    try:
        supabase = request.app.state.supabase
        
        # Get user by email
        user_query = supabase.table("Usuario").select("*").eq("email", form_data.email).execute()
        
        if not user_query.data or len(user_query.data) == 0:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user = user_query.data[0]
        
        # Check if this is a Firebase user
        is_firebase_user = user.get("auth_provider") == "firebase" or user.get("firebase_uid") is not None
        
        if is_firebase_user:
            # For Firebase users, we should redirect to Firebase authentication
            # We don't authenticate Firebase users with password here
            raise HTTPException(
                status_code=400, 
                detail="This account uses Firebase authentication. Please use the Firebase login method."
            )
        else:
            # Legacy password authentication
            if not verify_password(form_data.password, user["senha"]):
                raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create access token
        access_token = create_access_token(data={"sub": user["id"]})
        
        # Create refresh token
        refresh_token = create_access_token(
            data={"sub": user["id"], "type": "refresh"},
            expires_delta=timedelta(days=30)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": refresh_token,
            "expires_in": 3600  # 1 hour
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@auth_routes.post("/logout")
async def logout_user(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Logout user (client-side should clear tokens)"""
    return {"message": "Successfully logged out"}

@auth_routes.post("/refresh-token", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token
        payload = jwt.decode(refresh_token, "your-secret-key", algorithms=["HS256"])
        
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=400, detail="Invalid refresh token")
        
        user_id = payload.get("sub")
        
        # Create new access token
        access_token = create_access_token(data={"sub": user_id})
        
        # Create new refresh token
        new_refresh_token = create_access_token(
            data={"sub": user_id, "type": "refresh"},
            expires_delta=timedelta(days=30)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": new_refresh_token,
            "expires_in": 3600  # 1 hour
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@auth_routes.post("/forgot-password")
async def forgot_password(reset_request: PasswordResetRequest, request: Request):
    """Request password reset"""
    try:
        supabase = request.app.state.supabase
        
        # Check if user exists
        user_query = supabase.table("Usuario").select("id").eq("email", reset_request.email).execute()
        
        if not user_query.data or len(user_query.data) == 0:
            # Return success even if user doesn't exist (security best practice)
            return {"message": "If your email is registered, you will receive a password reset link"}
        
        # In a real app, you would:
        # 1. Generate a reset token
        # 2. Store it in the database with an expiration
        # 3. Send an email with the reset link
        
        return {"message": "If your email is registered, you will receive a password reset link"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@auth_routes.post("/reset-password")
async def reset_password(reset_data: PasswordReset, request: Request):
    """Reset password with token"""
    try:
        # In a real app, you would:
        # 1. Verify the token
        # 2. Check if it's expired
        # 3. Get the user ID from the token
        # 4. Update the password
        
        # For now, we'll just return a success message
        return {"message": "Password has been reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@auth_routes.post("/google")
async def google_auth(google_data: GoogleAuthRequest, request: Request):
    """Google OAuth login/register"""
    try:
        # In a real app, you would:
        # 1. Verify the Google ID token
        # 2. Extract user information
        # 3. Check if user exists in your database
        # 4. Create user if not exists
        # 5. Generate access token
        
        # For now, we'll just return a placeholder response
        return {
            "message": "Google authentication successful",
            "access_token": "google_access_token",
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@auth_routes.get("/verify-token")
async def verify_token(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Test endpoint to verify a token is valid"""
    return {"message": "Token is valid", "user": current_user}

@auth_routes.post("/firebase-login", response_model=Dict[str, Any])
async def firebase_login(id_token: str = Body(..., embed=True), request: Request = None):
    """Verify Firebase ID token and return user info"""
    try:
        # Verify the token
        from firebase_admin import auth
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token["uid"]
        
        # Check if user exists in our database
        supabase = request.app.state.supabase if request else None
        
        if supabase:
            # Get user from database
            user_query = supabase.table("Usuario").select("*").eq("firebase_uid", user_id).execute()
            
            if not user_query.data or len(user_query.data) == 0:
                # If user doesn't exist in our DB but exists in Firebase,
                # we should sync them to our DB
                firebase_user = auth.get_user(user_id)
                
                if hasattr(request.app.state, "user_synchronizer"):
                    await request.app.state.user_synchronizer.create_user_in_supabase(firebase_user)
                    
                    # Get the newly created user
                    user_query = supabase.table("Usuario").select("*").eq("firebase_uid", user_id).execute()
            
            if user_query.data and len(user_query.data) > 0:
                user_data = user_query.data[0]
                return {
                    "user": {
                        "id": user_data["id"],
                        "firebase_uid": user_id,
                        "name": user_data["nome"],
                        "email": user_data["email"]
                    },
                    "id_token": id_token,
                    "token_type": "bearer"
                }
        
        # If we can't find or create a user record, just return the Firebase token info
        return {
            "user": {
                "firebase_uid": user_id,
                "email": decoded_token.get("email", ""),
                "name": decoded_token.get("name", "")
            },
            "id_token": id_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid Firebase token: {str(e)}"
        ) 