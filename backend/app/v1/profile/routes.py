from fastapi import APIRouter, Depends, HTTPException, Request, Body, Path, Query, UploadFile, File
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.auth.sync import get_current_user

# Router setup
profile_routes = APIRouter(
    prefix="/api/v1/profile",
    tags=["Profile"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None

class PasswordChange(BaseModel):
    currentPassword: str
    newPassword: str

class NotificationSettings(BaseModel):
    emailNotifications: bool
    pushNotifications: bool
    movieRecommendations: bool
    socialNotifications: bool

class PrivacySettings(BaseModel):
    profileVisibility: str  # public, friends, private
    showWatchedMovies: bool
    showFavorites: bool
    showWatchLater: bool

class AppPreferences(BaseModel):
    language: str
    theme: str
    timezone: str

class UserStats(BaseModel):
    moviesWatched: int
    reviewsWritten: int
    followers: int
    following: int
    listsCreated: int

# Profile routes
@profile_routes.get("/me", response_model=Dict[str, Any])
async def get_current_profile(
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get current user profile"""
    try:
        supabase = request.app.state.supabase
        
        # Get user from database
        user_query = supabase.table("Usuario").select("*").eq("id", current_user["id"]).execute()
        
        if not user_query.data or len(user_query.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user_query.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.put("/me", response_model=Dict[str, Any])
async def update_profile(
    request: Request,
    profile_data: ProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update user profile"""
    try:
        supabase = request.app.state.supabase
        
        # Prepare update data
        update_data = {}
        if profile_data.name is not None:
            update_data["nome"] = profile_data.name
        if profile_data.username is not None:
            update_data["username"] = profile_data.username
        if profile_data.bio is not None:
            update_data["bio"] = profile_data.bio
        if profile_data.email is not None:
            update_data["email"] = profile_data.email
        
        # Update user in database
        result = supabase.table("Usuario").update(update_data).eq("id", current_user["id"]).execute()
        
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.put("/me/password", response_model=Dict[str, Any])
async def change_password(
    request: Request,
    password_data: PasswordChange,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Change user password"""
    try:
        supabase = request.app.state.supabase
        
        # Get user from database
        user_query = supabase.table("Usuario").select("senha").eq("id", current_user["id"]).execute()
        
        if not user_query.data or len(user_query.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify current password
        from app.auth.sync import verify_password
        if not verify_password(password_data.currentPassword, user_query.data[0]["senha"]):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Hash new password
        from app.auth.sync import get_password_hash
        hashed_password = get_password_hash(password_data.newPassword)
        
        # Update password in database
        result = supabase.table("Usuario").update({"senha": hashed_password}).eq("id", current_user["id"]).execute()
        
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Password updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.delete("/me", response_model=Dict[str, Any])
async def delete_profile(
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Delete user account"""
    try:
        supabase = request.app.state.supabase
        
        # Delete user from database
        result = supabase.table("Usuario").delete().eq("id", current_user["id"]).execute()
        
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User account deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.put("/me/avatar", response_model=Dict[str, Any])
async def update_avatar(
    request: Request,
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update profile picture"""
    try:
        # In a real app, you would:
        # 1. Upload the file to a storage service
        # 2. Get the URL of the uploaded file
        # 3. Update the user's avatar URL in the database
        
        # For now, we'll just return a placeholder response
        return {"message": "Avatar updated successfully", "avatarUrl": "https://example.com/avatar.jpg"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.get("/{user_id}", response_model=Dict[str, Any])
async def get_user_profile(
    request: Request,
    user_id: int = Path(..., description="User ID")
):
    """Get user profile by ID"""
    try:
        supabase = request.app.state.supabase
        
        # Get user from database
        user_query = supabase.table("Usuario").select("*").eq("id", user_id).execute()
        
        if not user_query.data or len(user_query.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user_query.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.get("/username/{username}", response_model=Dict[str, Any])
async def get_user_by_username(
    request: Request,
    username: str = Path(..., description="Username")
):
    """Get user profile by username"""
    try:
        supabase = request.app.state.supabase
        
        # Get user from database
        user_query = supabase.table("Usuario").select("*").eq("username", username).execute()
        
        if not user_query.data or len(user_query.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user_query.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.get("/{user_id}/stats", response_model=UserStats)
async def get_user_stats(
    request: Request,
    user_id: int = Path(..., description="User ID")
):
    """Get user statistics"""
    try:
        supabase = request.app.state.supabase
        
        # Get user stats from database
        # This is a placeholder implementation
        return {
            "moviesWatched": 42,
            "reviewsWritten": 15,
            "followers": 120,
            "following": 45,
            "listsCreated": 8
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.put("/me/settings/notifications", response_model=NotificationSettings)
async def update_notification_settings(
    request: Request,
    settings: NotificationSettings,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update notification settings"""
    try:
        supabase = request.app.state.supabase
        
        # Update notification settings in database
        # This is a placeholder implementation
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.put("/me/settings/privacy", response_model=PrivacySettings)
async def update_privacy_settings(
    request: Request,
    settings: PrivacySettings,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update privacy settings"""
    try:
        supabase = request.app.state.supabase
        
        # Update privacy settings in database
        # This is a placeholder implementation
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@profile_routes.put("/me/settings/preferences", response_model=AppPreferences)
async def update_app_preferences(
    request: Request,
    preferences: AppPreferences,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update app preferences"""
    try:
        supabase = request.app.state.supabase
        
        # Update app preferences in database
        # This is a placeholder implementation
        return preferences
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 