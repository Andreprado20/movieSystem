from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str] = None
    
class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    password: Optional[str] = None
    
class UserResponse(BaseModel):
    uid: str
    email: EmailStr
    display_name: str

class UserList(BaseModel):
    users: list[UserResponse]