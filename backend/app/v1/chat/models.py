from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_private: bool = False
    created_by: str  # user_id

class Group(GroupCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.now)
    members: List[str] = []  # list of user_ids

class MessageCreate(BaseModel):
    content: str
    group_id: str
    sender_id: str

class Message(MessageCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    is_edited: bool = False

class GroupMember(BaseModel):
    user_id: str
    group_id: str
    role: str = "member"  # Options: "admin", "member"
    joined_at: datetime = Field(default_factory=datetime.now) 