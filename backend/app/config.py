from pydantic_settings import BaseSettings
from pydantic import Field

class FastAPISettings(BaseSettings):
    host: str = "127.0.0.1"
    port: int = 8000
    log_level: str = "info"
    reload: bool = True

class Settings(BaseSettings):
    fastapi: FastAPISettings = Field(default_factory=FastAPISettings)
    
    class Config:
        env_nested_delimiter = "__"

def get_settings() -> Settings:
    return Settings()