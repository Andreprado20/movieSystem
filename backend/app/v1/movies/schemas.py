from pydantic import BaseModel

class MovieBase(BaseModel):
    title: str
    description: str
    release_date: str
    genre: str