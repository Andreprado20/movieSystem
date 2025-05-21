import uvicorn
from uvicorn.config import LOGGING_CONFIG
from app.config import get_settings
import logging
import os

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    # Update logging format
    LOGGING_CONFIG["formatters"]["access"][
        "fmt"
    ] = "%(asctime)s %(levelprefix)s - %(message)s - took %(msecs)s ms"
    
    # Get settings
    settings = get_settings().fastapi
    
    # Define the directories to watch for changes
    watch_dirs = ["app"]
    
    uvicorn.run(
        app="run:app",
        host="0.0.0.0",  # Allow external connections
        port=8000,
        reload=True,  # Enable auto-reload
        reload_dirs=watch_dirs,  # Specify which directories to watch
        log_level="debug"  # More verbose logging for development
    )

if __name__ == "__main__":
    main() 