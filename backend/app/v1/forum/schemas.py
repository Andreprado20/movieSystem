from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime


class CommentBase(BaseModel):
    """Base schema for comment data shared by multiple schemas"""
    mensagem: str = Field(..., description="Conteúdo do comentário")


class CommentCreate(CommentBase):
    """Schema for creating a new comment"""
    respondendo_id: Optional[int] = Field(None, description="ID do usuário que está sendo respondido")


class CommentEdit(BaseModel):
    """Schema for editing an existing comment"""
    mensagem: str = Field(..., description="Novo conteúdo do comentário")


class CommentResponse(CommentBase):
    """Schema for comment response"""
    id: int
    likes: int
    usuario_id: int
    forum_id: int
    perfil_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    respondendo_id: Optional[int] = None


class CommentList(BaseModel):
    """Schema for list of comments"""
    comments: List[CommentResponse]


class AuthUserIdentification(BaseModel):
    """Schema for identifying a user in development mode via email"""
    email: EmailStr = Field(..., description="Email do usuário para identificação em modo de desenvolvimento") 