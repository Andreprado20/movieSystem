from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException, status, Request
from typing import List, Dict, Any, Optional
from fastapi.responses import JSONResponse

from app.v1.chat.models import GroupCreate, Group, MessageCreate, Message
from app.v1.chat.service import ChatService
from app.auth.sync import get_current_user

# Websocket connections manager
class ConnectionManager:
    def __init__(self):
        # Structure: {group_id: {user_id: websocket}}
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, group_id: str, user_id: str):
        await websocket.accept()
        if group_id not in self.active_connections:
            self.active_connections[group_id] = {}
        self.active_connections[group_id][user_id] = websocket

    def disconnect(self, group_id: str, user_id: str):
        if group_id in self.active_connections:
            if user_id in self.active_connections[group_id]:
                del self.active_connections[group_id][user_id]
            if not self.active_connections[group_id]:
                del self.active_connections[group_id]

    async def send_message(self, message: Dict[str, Any], group_id: str):
        if group_id in self.active_connections:
            for user_id, connection in self.active_connections[group_id].items():
                await connection.send_json(message)

manager = ConnectionManager()

# Router setup
chat_routes = APIRouter(
    prefix="/api/v1/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

# Helper to get the chat service
def get_chat_service(request: Request = None):
    """
    Dependency that returns a ChatService instance
    """
    # Handle case when request is None for testing
    if request is None:
        return ChatService(None)
    return ChatService(request.app.state.supabase)

# REST API routes
@chat_routes.post("/groups", response_model=Group)
async def create_group(
    group_data: GroupCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service)
):
    # Set the created_by field with the current user's ID
    group_data.created_by = current_user["uid"]
    return await service.create_group(group_data)

@chat_routes.get("/groups/{group_id}", response_model=Group)
async def get_group(
    group_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service)
):
    return await service.get_group(group_id)

@chat_routes.get("/groups", response_model=List[Group])
async def list_user_groups(
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service)
):
    return await service.list_user_groups(current_user["uid"])

@chat_routes.post("/groups/{group_id}/members/{user_id}")
async def add_user_to_group(
    group_id: str,
    user_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service)
):
    # To do: Add permission check - only admins can add users
    return await service.add_user_to_group(group_id, user_id)

@chat_routes.get("/groups/{group_id}/messages", response_model=List[Message])
async def get_group_messages(
    group_id: str,
    limit: int = 50,
    offset: int = 0,
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service)
):
    # To do: Check if user is in group
    return await service.get_group_messages(group_id, limit, offset)

# WebSocket endpoint for real-time chat
@chat_routes.websocket("/ws/{group_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    group_id: str,
    service: ChatService = Depends(get_chat_service)
):
    # Verify token from query param
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Validate token and get user
    try:
        # First try Firebase token validation
        try:
            from firebase_admin import auth
            decoded_token = auth.verify_id_token(token)
            user_id = decoded_token["uid"]
        except Exception as firebase_error:
            # If Firebase validation fails, try JWT token
            import jwt
            SECRET_KEY = "your-secret-key"  # Should match the key in auth.sync
            ALGORITHM = "HS256"
            
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_id = str(payload.get("sub"))
                if not user_id:
                    raise Exception("Invalid token: missing user ID")
            except Exception as jwt_error:
                # Both validations failed
                raise Exception(f"Failed to validate token: Firebase error: {str(firebase_error)}. JWT error: {str(jwt_error)}")
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"WebSocket auth error: {str(e)}")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Connect to the WebSocket
    await manager.connect(websocket, group_id, user_id)
    
    try:
        # Listen for messages
        while True:
            data = await websocket.receive_json()
            
            # Create message in database
            message_data = MessageCreate(
                content=data["content"],
                group_id=group_id,
                sender_id=user_id
            )
            
            # Save to database
            message = await service.create_message(message_data)
            
            # Broadcast to all connected clients in the group
            await manager.send_message(message.dict(), group_id)
            
    except WebSocketDisconnect:
        manager.disconnect(group_id, user_id) 