from fastapi import HTTPException, Depends
from supabase import Client
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.v1.chat.models import Group, GroupCreate, Message, MessageCreate, GroupMember

class ChatService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        
    async def create_group(self, group_data: GroupCreate) -> Group:
        """Create a new chat group"""
        group = Group(**group_data.dict())
        
        # Add to Supabase
        result = self.supabase.table("chat_groups").insert(group.dict()).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create group")
        
        # Add creator as member and admin
        member = GroupMember(
            user_id=group.created_by,
            group_id=group.id,
            role="admin"
        )
        self.supabase.table("group_members").insert(member.dict()).execute()
        
        return group
    
    async def get_group(self, group_id: str) -> Group:
        """Get group by ID"""
        result = self.supabase.table("chat_groups").select("*").eq("id", group_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Group not found")
        
        return Group(**result.data[0])
    
    async def list_user_groups(self, user_id: str) -> List[Group]:
        """List all groups a user belongs to"""
        result = self.supabase.table("group_members")\
            .select("group_id")\
            .eq("user_id", user_id)\
            .execute()
        
        if not result.data:
            return []
        
        group_ids = [item["group_id"] for item in result.data]
        
        groups_result = self.supabase.table("chat_groups")\
            .select("*")\
            .in_("id", group_ids)\
            .execute()
        
        return [Group(**group) for group in groups_result.data]
    
    async def add_user_to_group(self, group_id: str, user_id: str, role: str = "member") -> GroupMember:
        """Add a user to a group"""
        # Check if user is already in group
        result = self.supabase.table("group_members")\
            .select("*")\
            .eq("group_id", group_id)\
            .eq("user_id", user_id)\
            .execute()
        
        if result.data:
            raise HTTPException(status_code=400, detail="User already in group")
        
        # Add user to group
        member = GroupMember(
            user_id=user_id,
            group_id=group_id,
            role=role
        )
        
        self.supabase.table("group_members").insert(member.dict()).execute()
        
        return member
    
    async def create_message(self, message_data: MessageCreate) -> Message:
        """Create a new message in a group"""
        # Verify user is in group
        result = self.supabase.table("group_members")\
            .select("*")\
            .eq("group_id", message_data.group_id)\
            .eq("user_id", message_data.sender_id)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=403, detail="User not in group")
        
        # Create message
        message = Message(**message_data.dict())
        
        message_result = self.supabase.table("messages").insert(message.dict()).execute()
        
        if not message_result.data:
            raise HTTPException(status_code=500, detail="Failed to create message")
        
        return message
    
    async def get_group_messages(self, group_id: str, limit: int = 50, offset: int = 0) -> List[Message]:
        """Get recent messages for a group"""
        result = self.supabase.table("messages")\
            .select("*")\
            .eq("group_id", group_id)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .offset(offset)\
            .execute()
        
        return [Message(**message) for message in result.data] 