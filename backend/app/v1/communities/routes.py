from fastapi import APIRouter, Depends, HTTPException, Request, Body, Path, Query
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.auth.sync import get_current_user

# Router setup
communities_routes = APIRouter(
    prefix="/api/v1/communities",
    tags=["Communities"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
class CommunityCreate(BaseModel):
    name: str
    description: str
    isPrivate: bool = False

class CommunityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    isPrivate: Optional[bool] = None

class MemberRoleUpdate(BaseModel):
    role: str

class MovieAdd(BaseModel):
    movieId: int

class EventCreate(BaseModel):
    title: str
    date: str
    time: str
    description: Optional[str] = None

# Community Management routes
@communities_routes.get("/", response_model=List[Dict[str, Any]])
async def list_communities(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get list of communities"""
    try:
        supabase = request.app.state.supabase
        
        # Calculate offset
        offset = (page - 1) * limit
        
        # Get communities from database
        # This is a placeholder implementation
        # In a real app, you would query the communities table
        return [
            {
                "id": 1,
                "name": "Classic Movies",
                "description": "A community for classic movie enthusiasts",
                "isPrivate": False,
                "memberCount": 120
            },
            {
                "id": 2,
                "name": "Horror Fans",
                "description": "For horror movie fans",
                "isPrivate": True,
                "memberCount": 85
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.get("/{community_id}", response_model=Dict[str, Any])
async def get_community(
    request: Request,
    community_id: int = Path(..., description="Community ID")
):
    """Get community details"""
    try:
        supabase = request.app.state.supabase
        
        # Get community from database
        # This is a placeholder implementation
        # In a real app, you would query the communities table
        return {
            "id": community_id,
            "name": "Classic Movies",
            "description": "A community for classic movie enthusiasts",
            "isPrivate": False,
            "memberCount": 120,
            "createdAt": "2023-01-01T00:00:00Z",
            "createdBy": {
                "id": 1,
                "name": "John Doe",
                "username": "johndoe"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.post("/", response_model=Dict[str, Any])
async def create_community(
    request: Request,
    community: CommunityCreate = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create new community"""
    try:
        supabase = request.app.state.supabase
        
        # Create community in database
        # This is a placeholder implementation
        # In a real app, you would insert into the communities table
        return {
            "id": 1,
            "name": community.name,
            "description": community.description,
            "isPrivate": community.isPrivate,
            "createdAt": "2023-01-01T00:00:00Z",
            "createdBy": {
                "id": current_user["id"],
                "name": "John Doe",
                "username": "johndoe"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.put("/{community_id}", response_model=Dict[str, Any])
async def update_community(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    community: CommunityUpdate = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update community"""
    try:
        supabase = request.app.state.supabase
        
        # Check if user is admin of the community
        # This is a placeholder implementation
        
        # Update community in database
        # This is a placeholder implementation
        # In a real app, you would update the communities table
        return {
            "id": community_id,
            "name": community.name or "Classic Movies",
            "description": community.description or "A community for classic movie enthusiasts",
            "isPrivate": community.isPrivate if community.isPrivate is not None else False,
            "updatedAt": "2023-01-01T00:00:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.delete("/{community_id}", response_model=Dict[str, Any])
async def delete_community(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Delete community"""
    try:
        supabase = request.app.state.supabase
        
        # Check if user is admin of the community
        # This is a placeholder implementation
        
        # Delete community from database
        # This is a placeholder implementation
        # In a real app, you would delete from the communities table
        
        return {"message": "Community deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Community Membership routes
@communities_routes.get("/{community_id}/members", response_model=List[Dict[str, Any]])
async def get_community_members(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get community members"""
    try:
        supabase = request.app.state.supabase
        
        # Calculate offset
        offset = (page - 1) * limit
        
        # Get members from database
        # This is a placeholder implementation
        # In a real app, you would query the members table
        return [
            {
                "id": 1,
                "userId": 1,
                "name": "John Doe",
                "username": "johndoe",
                "role": "admin",
                "joinedAt": "2023-01-01T00:00:00Z"
            },
            {
                "id": 2,
                "userId": 2,
                "name": "Jane Smith",
                "username": "janesmith",
                "role": "member",
                "joinedAt": "2023-01-02T00:00:00Z"
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.post("/{community_id}/members", response_model=Dict[str, Any])
async def join_community(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Join community"""
    try:
        supabase = request.app.state.supabase
        
        # Check if already a member
        # This is a placeholder implementation
        
        # Add member to database
        # This is a placeholder implementation
        # In a real app, you would insert into the members table
        
        return {"message": "Successfully joined community", "memberId": 1}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.delete("/{community_id}/members/{user_id}", response_model=Dict[str, Any])
async def leave_community(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    user_id: int = Path(..., description="User ID"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Leave/remove from community"""
    try:
        supabase = request.app.state.supabase
        
        # Check if user is admin or the user being removed
        # This is a placeholder implementation
        
        # Remove member from database
        # This is a placeholder implementation
        # In a real app, you would delete from the members table
        
        return {"message": "Successfully left community"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.put("/{community_id}/members/{user_id}/role", response_model=Dict[str, Any])
async def update_member_role(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    user_id: int = Path(..., description="User ID"),
    role_data: MemberRoleUpdate = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update member role"""
    try:
        supabase = request.app.state.supabase
        
        # Check if user is admin of the community
        # This is a placeholder implementation
        
        # Update member role in database
        # This is a placeholder implementation
        # In a real app, you would update the members table
        
        return {"message": "Member role updated successfully", "role": role_data.role}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Community Content routes
@communities_routes.get("/{community_id}/movies", response_model=List[Dict[str, Any]])
async def get_community_movies(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get community movies"""
    try:
        supabase = request.app.state.supabase
        
        # Calculate offset
        offset = (page - 1) * limit
        
        # Get movies from database
        # This is a placeholder implementation
        # In a real app, you would query the community_movies table
        return [
            {
                "id": 1,
                "title": "The Godfather",
                "posterPath": "/path/to/poster.jpg",
                "addedAt": "2023-01-01T00:00:00Z",
                "addedBy": {
                    "id": 1,
                    "name": "John Doe",
                    "username": "johndoe"
                }
            },
            {
                "id": 2,
                "title": "Casablanca",
                "posterPath": "/path/to/poster.jpg",
                "addedAt": "2023-01-02T00:00:00Z",
                "addedBy": {
                    "id": 2,
                    "name": "Jane Smith",
                    "username": "janesmith"
                }
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.post("/{community_id}/movies", response_model=Dict[str, Any])
async def add_movie_to_community(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    movie: MovieAdd = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Add movie to community"""
    try:
        supabase = request.app.state.supabase
        
        # Check if user is a member of the community
        # This is a placeholder implementation
        
        # Add movie to database
        # This is a placeholder implementation
        # In a real app, you would insert into the community_movies table
        
        return {"message": "Movie added to community successfully", "movieId": movie.movieId}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.delete("/{community_id}/movies/{movie_id}", response_model=Dict[str, Any])
async def remove_movie_from_community(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    movie_id: int = Path(..., description="Movie ID"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Remove movie from community"""
    try:
        supabase = request.app.state.supabase
        
        # Check if user is admin or the one who added the movie
        # This is a placeholder implementation
        
        # Remove movie from database
        # This is a placeholder implementation
        # In a real app, you would delete from the community_movies table
        
        return {"message": "Movie removed from community successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.get("/{community_id}/events", response_model=List[Dict[str, Any]])
async def get_community_events(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get community events"""
    try:
        supabase = request.app.state.supabase
        
        # Calculate offset
        offset = (page - 1) * limit
        
        # Get events from database
        # This is a placeholder implementation
        # In a real app, you would query the events table
        return [
            {
                "id": 1,
                "title": "Movie Night: The Godfather",
                "date": "2023-02-01",
                "time": "19:00",
                "description": "Join us for a screening of The Godfather",
                "createdAt": "2023-01-01T00:00:00Z",
                "createdBy": {
                    "id": 1,
                    "name": "John Doe",
                    "username": "johndoe"
                }
            },
            {
                "id": 2,
                "title": "Discussion: Classic Movies",
                "date": "2023-02-15",
                "time": "20:00",
                "description": "Let's discuss our favorite classic movies",
                "createdAt": "2023-01-02T00:00:00Z",
                "createdBy": {
                    "id": 2,
                    "name": "Jane Smith",
                    "username": "janesmith"
                }
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@communities_routes.post("/{community_id}/events", response_model=Dict[str, Any])
async def create_community_event(
    request: Request,
    community_id: int = Path(..., description="Community ID"),
    event: EventCreate = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create community event"""
    try:
        supabase = request.app.state.supabase
        
        # Check if user is a member of the community
        # This is a placeholder implementation
        
        # Create event in database
        # This is a placeholder implementation
        # In a real app, you would insert into the events table
        
        return {
            "id": 1,
            "title": event.title,
            "date": event.date,
            "time": event.time,
            "description": event.description,
            "communityId": community_id,
            "createdAt": "2023-01-01T00:00:00Z",
            "createdBy": {
                "id": current_user["id"],
                "name": "John Doe",
                "username": "johndoe"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 