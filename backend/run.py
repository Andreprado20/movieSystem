import uvicorn
from uvicorn.config import LOGGING_CONFIG
from app.config import get_settings
from app.factory import create_app

app = create_app()

if __name__ == "__main__":
    # Update logging format
    LOGGING_CONFIG["formatters"]["access"][
        "fmt"
    ] = "%(asctime)s %(levelprefix)s - %(message)s - took %(msecs)s ms"
    
    # Get settings and run with explicit parameters
    settings = get_settings().fastapi
    uvicorn.run(
        app="run:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level=settings.log_level.lower()
    )